/* Research step: asks Claude (with live web search) for NEW resources this agent does not have yet.
   The prompt carries the agent's own config + the list of URLs already known, so it never re-finds them. */
import type { AgentConfig, Entry, Kind } from "./types";
import { normUrl, uidFor } from "./registry";

export type Candidate = { kind: Kind; target: string; title: string; url?: string; note?: string; extra?: Record<string, unknown> };

const KIND_HELP: Record<Kind, string> = {
  course: 'free course/tutorial/doc for a topic. note = provider + "Free" (+ "certificate" if one is offered)',
  paid: "the single best paid course/book for a topic. note = price/provider",
  video: "a specific free YouTube video, playlist or channel (https URL). note = channel + length",
  repo: 'open-source GitHub repo to practise with. title = "owner/name", note = what it is + approx stars',
  badge: 'free or paid certificate/badge. extra = { issuer: "aws"|"ms"|"openai"|"hf"|"anthropic"|"google"|"other", paid: boolean }',
  tool: 'AI tool. extra = { price: "Free · Pro $20", toolKind: "oss"|"free"|"freemium"|"paid", isNew: boolean }, note = one-line description',
  glossary: "plain-English AI term. title = term, extra = { definition: one sentence, no jargon }",
  step: "course for a job track. extra = { provider, cost: \"Free\" or price, cert: what you earn }",
  project: "AI business project idea. extra = full project object (see lib/projects.ts Project type)",
  link: "reference link (not applied to the site)",
};

export function buildPrompt(a: AgentConfig, known: Set<string>, targetsHelp: string) {
  const knownList = [...known].slice(0, 1500).join("\n");
  return `You are the "${a.name}" resource agent for AI Deck, a free plain-English AI learning website.
Today is ${new Date().toISOString().slice(0, 10)}. Find up to ${a.maxNew} NEW, high-quality, currently-live resources.

FOCUS: ${a.focus}
ALLOWED KINDS:
${a.kinds.map((k) => `- ${k}: ${KIND_HELP[k]}`).join("\n")}
TARGETS (use these exact ids in "target"):
${targetsHelp}
PREFER these sources when relevant: ${a.trustedDomains.join(", ") || "any reputable source"}

RULES
- Free resources first; at most one paid item per target.
- Only real pages you have just verified with web search. No invented URLs, no search-result URLs, no affiliate links.
- Do NOT return anything whose URL is in this KNOWN list (already on the site):
${knownList}

Return ONLY a JSON array in a \`\`\`json fenced block. Each item:
{"kind": "...", "target": "...", "title": "...", "url": "https://...", "note": "...", "extra": {...optional}}`;
}

export function parseCandidates(text: string): Candidate[] {
  const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);
  if (!m) return [];
  try {
    const v = JSON.parse(m[1]);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Keeps only candidates that fit the agent's config and are not already known. */
export function screen(a: AgentConfig, list: Candidate[], known: Set<string>, existing: Entry[]) {
  const titles = new Set(existing.map((e) => `${e.kind}|${e.target}|${e.title.toLowerCase()}`));
  const uids = new Set(existing.map((e) => e.uid));
  // Career steps and badges may legitimately reuse a course URL already used elsewhere on the site.
  const reusable = (k: Kind) => k === "step" || k === "badge";
  const ok: Candidate[] = [];
  const skipped: string[] = [];
  for (const c of list) {
    const why =
      !c || !c.title ? "missing title" :
      !a.kinds.includes(c.kind) ? `kind "${c.kind}" not allowed for ${a.id}` :
      !(a.targets.includes("*") || a.targets.includes(c.target)) ? `target "${c.target}" not owned by ${a.id}` :
      c.kind !== "glossary" && c.kind !== "project" && !/^https:\/\//.test(c.url ?? "") ? "needs an https URL" :
      uids.has(uidFor(c)) ? "already in this agent's registry" :
      c.url && !reusable(c.kind) && known.has(normUrl(c.url)) ? "already on the site" :
      titles.has(`${c.kind}|${c.target}|${c.title.toLowerCase()}`) ? "duplicate title" :
      similarTo(c, existing) ? `too similar to "${similarTo(c, existing)}"` : "";
    if (why) skipped.push(`${c?.title ?? "?"}: ${why}`);
    else {
      ok.push(c);
      if (c.url) known.add(normUrl(c.url));
      uids.add(uidFor(c));
      titles.add(`${c.kind}|${c.target}|${c.title.toLowerCase()}`);
    }
  }
  return { ok, skipped };
}

export async function askClaude(prompt: string, env: Record<string, string>): Promise<string> {
  const key = env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set. Copy agents/.env.example to agents/.env and add your key, or use `import` with a JSON file.");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: Number(env.RESEARCH_MAX_TOKENS || 8000),
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: Number(env.RESEARCH_MAX_SEARCHES || 8) }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Claude API ${r.status}: ${(await r.text()).slice(0, 400)}`);
  const data = (await r.json()) as { content: { type: string; text?: string }[] };
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

/* Near-duplicate guard: same kind + target and mostly the same title words
   (e.g. "ROS 2 tutorials" vs "ROS 2 docs and tutorials"). */
const STOP = new Set(["the", "and", "for", "with", "course", "courses", "guide", "intro", "introduction", "free", "docs", "tutorial", "tutorials", "learn", "a", "an", "of", "to", "in", "on"]);
const words = (t: string) => new Set(t.toLowerCase().replace(/[^a-z0-9+ ]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)));
export function similarTo(c: Candidate, existing: Entry[]): string | undefined {
  const a = words(c.title);
  if (a.size === 0) return undefined;
  for (const e of existing) {
    if (e.kind !== c.kind || e.target !== c.target || e.status === "rejected") continue;
    const b = words(e.title);
    if (!b.size) continue;
    const inter = [...a].filter((w) => b.has(w)).length;
    const jaccard = inter / (a.size + b.size - inter);
    const contained = inter === Math.min(a.size, b.size) && Math.min(a.size, b.size) >= 3;
    if (jaccard >= 0.75 || contained) return e.title;
  }
  return undefined;
}
