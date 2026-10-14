#!/usr/bin/env tsx
/* AI Deck resource agents: one agent per learning level and per site feature.
   Usage: npm run agents -- <command> [--agent <id|all>] [options]
   Run `npm run agents -- help` for the full list. */
import fs from "node:fs";
import path from "node:path";
import { ROOT, REPO, loadAgents, pickAgents, sharedEnv } from "./core/env";
import { knownUrls, note, now, readLedger, readRegistry, record, uidFor, writeRegistry } from "./core/registry";
import { ownerOf, siteItems } from "./core/extract";
import { checkEntries } from "./core/check";
import { askClaude, buildPrompt, parseCandidates, screen, type Candidate } from "./core/research";
import type { AgentConfig, Entry } from "./core/types";
import { LEVELS } from "../lib/plain";
import { TOPICS } from "../lib/data";
import { TOOL_GROUPS } from "../lib/extra";
import { TRACKS } from "../lib/careers";
import { nameOf } from "../lib/paths";

const args = process.argv.slice(2);
const cmd = args[0] ?? "help";
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : "true") : undefined;
};
const flag = (name: string) => args.includes(`--${name}`);

const levelOf = (id: string) => LEVELS.find((l) => l.topics.includes(id))?.n;
const label = (id: string) =>
  TOPICS.find((t) => t.id === id) ? nameOf(TOPICS.find((t) => t.id === id)!) :
  TOOL_GROUPS.find((g) => g.id === id)?.key ?? TRACKS.find((t) => t.id === id)?.role ?? id;

/* ---------------- init: create agent folders + agent.env (never overwrites) ---------------- */
const SLUG = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const LEVEL_DOMAINS: Record<number, string> = {
  1: "elementsofai.com,kaggle.com,developers.google.com,khanacademy.org,3blue1brown.com,cs50.harvard.edu,fast.ai,huggingface.co,youtube.com",
  2: "huggingface.co,anthropic.skilljar.com,academy.openai.com,deeplearning.ai,docs.claude.com,platform.openai.com,promptingguide.ai,youtube.com",
  3: "docs.llamaindex.ai,langchain-ai.github.io,modelcontextprotocol.io,huggingface.co,deeplearning.ai,learn.microsoft.com,github.com,youtube.com",
  4: "huggingface.co,deeplearning.ai,github.com,docs.ragas.io,promptfoo.dev,learn.microsoft.com,skillbuilder.aws,youtube.com",
  5: "huggingface.co,pytorch.org,opencv.org,kaggle.com,developers.google.com,github.com,youtube.com",
  6: "oecd.ai,nist.gov,artificialintelligenceact.eu,coursera.org,edx.org,iapp.org,ibm.com,youtube.com",
  7: "coursera.org,edx.org,microsoft.com,learn.microsoft.com,skillbuilder.aws,nvidia.com,who.int,youtube.com",
  8: "madewithml.com,github.com,huggingface.co,pytorch.org,cs.stanford.edu,arxiv.org,learn.microsoft.com,youtube.com",
  9: "huggingface.co,spinningup.openai.com,docs.vllm.ai,arxiv.org,github.com,docs.claude.com,youtube.com",
};
const FEATURES = [
  { id: "tools", name: "AI Tools agent", targets: () => TOOL_GROUPS.map((g) => g.id), kinds: "tool",
    domains: "github.com,huggingface.co,producthunt.com,theresanaiforthat.com", focus: "New and notable AI tools, frameworks and apps (2025–2026) for each tool category. Mark open-source vs free vs freemium vs paid accurately, with current prices." },
  { id: "certificates", name: "Certificates agent", targets: () => ["*"], kinds: "badge",
    domains: "skillbuilder.aws,aws.amazon.com,learn.microsoft.com,academy.openai.com,anthropic.skilljar.com,huggingface.co,cloudskillsboost.google,skills.google,nvidia.com,kaggle.com,ibm.com",
    focus: "Free certificates and badges from AWS, Microsoft Learn, OpenAI, Anthropic, Google, Hugging Face, NVIDIA, IBM and Kaggle, attached to the most relevant topic id. Flag paid exams with paid=true. Skip retired exams." },
  { id: "careers", name: "Careers agent", targets: () => TRACKS.map((t) => t.id), kinds: "step",
    domains: "coursera.org,edx.org,deeplearning.ai,learn.microsoft.com,skillbuilder.aws,huggingface.co,madewithml.com,datatalks.club",
    focus: "Courses that move a learner along a specific AI job track. Free first, then the single best paid credential." },
  { id: "projects", name: "Projects agent", targets: () => ["projects"], kinds: "project",
    domains: "github.com,producthunt.com,indiehackers.com,chromewebstore.google.com",
    focus: "Real-world AI business project ideas (extensions, plugins, SaaS, automation, content, finance, devices) with problem, build steps, customer, revenue model, tools and launch links." },
  { id: "glossary", name: "Glossary agent", targets: () => ["glossary"], kinds: "glossary",
    domains: "developers.google.com,ibm.com,huggingface.co,nist.gov",
    focus: "AI terms that a non-technical learner meets on AI Deck but that the glossary does not yet explain. One plain sentence each, no jargon." },
];

function envFile(o: { id: string; name: string; scope: string; targets: string[]; kinds: string; domains: string; focus: string; extra?: string }) {
  return `# ${o.name}
# Own config for this agent. Safe to commit: no secrets here (the API key lives in agents/.env).
AGENT_ID=${o.id}
AGENT_NAME="${o.name}"
AGENT_SCOPE=${o.scope}
${o.extra ?? ""}# Site ids this agent owns (topic ids, tool group ids, track ids, or * for all topics)
TARGETS=${o.targets.join(",")}
# What it may add: course, paid, video, repo, badge, tool, glossary, step, project
RESOURCE_KINDS=${o.kinds}
# Preferred sources when researching
TRUSTED_DOMAINS=${o.domains}
RESEARCH_FOCUS="${o.focus}"
# Max new candidates per research run
MAX_NEW_PER_RUN=8
# true = approve candidates automatically when their link checks out (default: manual review)
AUTO_APPROVE=false
# Where this agent keeps its resources (append-only)
REGISTRY_FILE=resources.json
`;
}

function init() {
  let made = 0;
  const write = (dir: string, body: string) => {
    const d = path.join(ROOT, dir);
    fs.mkdirSync(d, { recursive: true });
    const f = path.join(d, "agent.env");
    if (fs.existsSync(f)) return;
    fs.writeFileSync(f, body);
    made++;
    console.log("  created", path.relative(REPO, f));
  };
  for (const l of LEVELS) {
    write(`level-${l.n}-${SLUG(l.name)}`, envFile({
      id: `level-${l.n}`, name: `Level ${l.n} · ${l.name} agent`, scope: "level", targets: l.topics, kinds: "course,paid,video,repo",
      domains: LEVEL_DOMAINS[l.n] ?? "youtube.com,github.com,huggingface.co",
      focus: `Free courses, YouTube videos, open-source repos and one best paid option for Level ${l.n} (${l.name}: ${l.desc.replace(/\.$/, "")}). Beginner-friendly, current in 2026.`,
      extra: `LEVEL=${l.n}\n`,
    }));
  }
  for (const f of FEATURES) write(f.id, envFile({ id: f.id, name: f.name, scope: "feature", targets: f.targets(), kinds: f.kinds, domains: f.domains, focus: f.focus }));
  console.log(made ? `init: created ${made} agent config(s)` : "init: all agents already configured (nothing overwritten)");
}

/* ---------------- sync: index what is on the site into each agent's registry ---------------- */
function sync(agents: AgentConfig[]) {
  const all = loadAgents();
  const byId = new Map(all.map((a) => [a.id, a]));
  const regs = new Map(all.map((a) => [a.id, readRegistry(a)]));
  const fresh = new Map<string, number>();
  for (const item of siteItems()) {
    const owner = ownerOf(item, levelOf);
    if (!byId.has(owner) || !agents.some((a) => a.id === owner)) continue;
    const reg = regs.get(owner)!;
    const uid = uidFor(item);
    const hit = reg.find((e) => e.uid === uid);
    if (hit) {
      if (hit.status === "approved" || hit.status === "pending") { hit.status = "added"; hit.addedAt ??= now(); note(hit, "seen on site"); }
      continue;
    }
    reg.push({ ...item, uid, origin: "site", status: "site", firstSeen: now(), linkState: "unchecked" });
    fresh.set(owner, (fresh.get(owner) ?? 0) + 1);
  }
  for (const a of agents) {
    writeRegistry(a, regs.get(a.id)!);
    const n = fresh.get(a.id) ?? 0;
    if (n) record(a.id, "sync", { indexed: n });
    console.log(`  ${a.id.padEnd(13)} ${String(regs.get(a.id)!.length).padStart(4)} resources  (+${n} newly indexed)`);
  }
}

/* ---------------- check: fetch URLs and record link health ---------------- */
async function check(agents: AgentConfig[]) {
  const staleDays = Number(opt("stale-days") ?? 0);
  const only = opt("only"); // pending | site | added
  for (const a of agents) {
    const reg = readRegistry(a);
    const subset = flag("broken") ? reg.filter((e) => e.linkState === "broken") : only ? reg.filter((e) => e.status === only) : reg;
    process.stdout.write(`  ${a.id.padEnd(13)} `);
    const { fetched, updated } = await checkEntries(subset, { concurrency: Number(opt("concurrency") ?? 8), onlyStale: staleDays ? staleDays * 864e5 : undefined });
    writeRegistry(a, reg);
    if (fetched) record(a.id, "check", { fetched, updated });
    const broken = reg.filter((e) => e.linkState === "broken");
    console.log(`  ${" ".repeat(13)} fetched ${fetched}, changed ${updated}, broken now ${broken.length}`);
    for (const e of broken.slice(0, 10)) console.log(`      x HTTP ${e.http}  ${e.title}  ${e.url}`);
  }
}

/* ---------------- research / import: add NEW candidates as "pending" ---------------- */
function addCandidates(a: AgentConfig, list: Candidate[], origin: Entry["origin"], source: string) {
  const all = loadAgents();
  const known = knownUrls(all);
  const reg = readRegistry(a);
  const { ok, skipped } = screen(a, list, known, reg);
  for (const c of ok) {
    reg.push({ uid: uidFor({ ...c, title: c.title }), kind: c.kind, target: c.target, title: c.title, url: c.url, note: c.note, extra: c.extra,
      origin, status: "pending", firstSeen: now(), linkState: "unchecked", history: [{ at: now(), change: `found via ${source}` }] });
  }
  writeRegistry(a, reg);
  record(a.id, origin === "research" ? "research" : "import", { researched: ok.length }, `${source}: ${ok.length} new, ${skipped.length} skipped`);
  console.log(`  ${a.id.padEnd(13)} +${ok.length} pending, ${skipped.length} skipped`);
  for (const s of skipped.slice(0, 8)) console.log(`      - ${s}`);
  return ok.length;
}

async function research(agents: AgentConfig[]) {
  const env = sharedEnv();
  for (const a of agents) {
    const known = knownUrls(loadAgents());
    const targets = a.targets.includes("*") ? TOPICS.filter((t) => !t.id.startsWith("t-")).map((t) => t.id) : a.targets;
    const help = targets.map((id) => `- ${id}: ${label(id)}`).join("\n");
    console.log(`  ${a.id}: asking Claude (web search) for up to ${a.maxNew} new resources…`);
    const text = await askClaude(buildPrompt(a, known, help), env);
    fs.writeFileSync(path.join(a.dir, "last-research.md"), `# ${a.name}: last research output\n\n${now()}\n\n${text}\n`);
    addCandidates(a, parseCandidates(text), "research", "Claude web research");
  }
}

function importFile(agents: AgentConfig[]) {
  const file = args[1] && !args[1].startsWith("--") ? args[1] : opt("file");
  if (!file) throw new Error("Usage: npm run agents -- import <file.json>   (an object { agentId: Candidate[] } or an array with --agent)");
  const data = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
  const source = `import ${path.basename(file)}`;
  if (Array.isArray(data)) {
    if (agents.length !== 1) throw new Error("Array files need a single --agent <id>");
    addCandidates(agents[0], data, "manual", source);
  } else {
    for (const [id, list] of Object.entries(data as Record<string, Candidate[]>)) {
      const a = agents.find((x) => x.id === id);
      if (a) addCandidates(a, list, "research", source);
      else if (!id.startsWith("_")) console.log(`  (skipping "${id}": not selected or unknown agent)`);
    }
  }
}

/* ---------------- approve / reject ---------------- */
function review(agents: AgentConfig[], to: "approved" | "rejected") {
  const ids = (opt("ids") ?? "").split(",").filter(Boolean);
  const force = flag("force");
  for (const a of agents) {
    const reg = readRegistry(a);
    let n = 0, held = 0;
    for (const e of reg) {
      if (e.status !== "pending") continue;
      if (ids.length && !ids.includes(e.uid)) continue;
      if (to === "approved" && !force && e.url && e.linkState !== "ok" && e.linkState !== "blocked") { held++; continue; }
      e.status = to;
      note(e, to);
      n++;
    }
    writeRegistry(a, reg);
    if (n) record(a.id, to === "approved" ? "approve" : "reject", to === "approved" ? { approved: n } : { rejected: n });
    console.log(`  ${a.id.padEnd(13)} ${to} ${n}${held ? `, held ${held} (link not verified: run check, or use --force)` : ""}`);
  }
}

/* ---------------- apply: write approved entries into the website ---------------- */
function apply() {
  const agents = loadAgents();
  const out = { generatedAt: now(), count: 0, topics: {} as Record<string, Record<string, unknown[]>>, repos: {} as Record<string, unknown[]>,
    badges: {} as Record<string, unknown[]>, tools: {} as Record<string, unknown[]>, glossary: [] as unknown[], steps: {} as Record<string, unknown[]>, projects: [] as unknown[] };
  const push = (m: Record<string, unknown[]>, k: string, v: unknown) => (m[k] ??= []).push(v);
  for (const a of agents) {
    const reg = readRegistry(a);
    let added = 0;
    for (const e of reg) {
      if (e.status !== "approved" && e.status !== "added") continue;
      const x = (e.extra ?? {}) as Record<string, any>;
      switch (e.kind) {
        case "course": (out.topics[e.target] ??= {}); push(out.topics[e.target], "free", [e.title, e.url, e.note]); break;
        case "paid": (out.topics[e.target] ??= {}); push(out.topics[e.target], "paid", [e.title, e.url, e.note]); break;
        case "video": (out.topics[e.target] ??= {}); push(out.topics[e.target], "yt", [e.title, e.url, e.note]); break;
        case "repo": push(out.repos, e.target, [e.title, e.url, e.note ?? ""]); break;
        case "badge": push(out.badges, e.target, [x.issuer ?? "other", e.title, e.url, e.note ?? (x.paid ? "Paid exam" : "Free certificate"), !!x.paid]); break;
        case "tool": push(out.tools, e.target, [e.title, e.url, x.price ?? "", x.toolKind ?? "freemium", !!x.isNew, e.note ?? ""]); break;
        case "glossary": out.glossary.push([e.title, x.definition ?? e.note ?? ""]); break;
        case "step": push(out.steps, e.target, [e.title, x.provider ?? "", e.url, x.cost ?? "Free", x.cert ?? "—"]); break;
        case "project": if (x.project) out.projects.push(x.project); break;
        default: continue;
      }
      out.count++;
      if (e.status === "approved") { e.status = "added"; e.addedAt = now(); note(e, "applied to website"); added++; }
    }
    writeRegistry(a, reg);
    if (added) record(a.id, "apply", { added }, `${added} resource(s) published to the site`);
  }
  fs.writeFileSync(path.join(REPO, "lib", "agent-additions.json"), JSON.stringify(out, null, 1) + "\n");
  console.log(`apply: lib/agent-additions.json now holds ${out.count} agent resource(s). Rebuild the site to publish.`);
}

/* ---------------- report: counts for the terminal, REPORT.md and the /tracker page ---------------- */
function report(quiet = false) {
  const agents = loadAgents();
  const ledger = readLedger();
  const rows = agents.map((a) => {
    const reg = readRegistry(a);
    const c = (f: (e: Entry) => boolean) => reg.filter(f).length;
    const l = ledger.agents[a.id] ?? { indexed: 0, fetched: 0, researched: 0, approved: 0, rejected: 0, added: 0, updated: 0 };
    return {
      id: a.id, name: a.name, scope: a.scope, targets: a.targets.includes("*") ? "all topics" : `${a.targets.length}`,
      kinds: a.kinds, total: reg.length, onSite: c((e) => e.status === "site" || e.status === "added"),
      pending: c((e) => e.status === "pending"), approved: c((e) => e.status === "approved"), added: c((e) => e.status === "added"),
      rejected: c((e) => e.status === "rejected"), ok: c((e) => e.linkState === "ok"), blocked: c((e) => e.linkState === "blocked"),
      broken: c((e) => e.linkState === "broken" && e.status !== "rejected"), unchecked: c((e) => !!e.url && (!e.linkState || e.linkState === "unchecked") && !e.extra?.search),
      fetched: l.fetched, researched: l.researched, updated: l.updated, lastRun: (l as { lastRun?: string }).lastRun ?? null,
    };
  });
  const sum = (k: keyof (typeof rows)[number]) => rows.reduce((n, r) => n + (r[k] as number), 0);
  const recent = agents.flatMap((a) => readRegistry(a).filter((e) => e.status === "added").map((e) => ({
    agent: a.id, kind: e.kind, target: e.target, targetName: label(e.target), title: e.title, url: e.url ?? null, note: e.note ?? null, addedAt: e.addedAt ?? null })))
    .sort((x, y) => String(y.addedAt).localeCompare(String(x.addedAt)));
  const stats = {
    generatedAt: now(),
    totals: { resources: sum("total"), onSite: sum("onSite"), fetched: ledger.totals.fetched, researched: ledger.totals.researched,
      approved: ledger.totals.approved, rejected: ledger.totals.rejected, added: ledger.totals.added, updated: ledger.totals.updated,
      pending: sum("pending"), ok: sum("ok"), blocked: sum("blocked"), broken: sum("broken"), unchecked: sum("unchecked") },
    agents: rows,
    recent: recent.slice(0, 200),
    runs: ledger.runs.slice(-25).reverse(),
  };
  fs.writeFileSync(path.join(REPO, "lib", "agent-stats.json"), JSON.stringify(stats, null, 1) + "\n");
  const t = stats.totals;
  const md = [
    "# AI Deck resource agents: report", "", `Generated ${stats.generatedAt}`, "",
    `| Resources tracked | On the site | URLs fetched | Researched | Added by agents | Updated | Pending review | Broken links |`,
    `|---|---|---|---|---|---|---|---|`,
    `| ${t.resources} | ${t.onSite} | ${t.fetched} | ${t.researched} | ${t.added} | ${t.updated} | ${t.pending} | ${t.broken} |`, "",
    "| Agent | Targets | Resources | On site | Added | Pending | Fetched | Researched | Updated | OK / blocked / broken |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.name} | ${r.targets} | ${r.total} | ${r.onSite} | ${r.added} | ${r.pending} | ${r.fetched} | ${r.researched} | ${r.updated} | ${r.ok} / ${r.blocked} / ${r.broken} |`),
    "", "Fetched = URLs requested by `check`. Researched = new candidates found by `research`/`import`. Added = applied to the website. Updated = existing resources whose link state changed.", "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "REPORT.md"), md);
  if (!quiet) {
    console.table(rows.map((r) => ({ agent: r.id, resources: r.total, onSite: r.onSite, added: r.added, pending: r.pending, fetched: r.fetched, researched: r.researched, updated: r.updated, broken: r.broken })));
    console.log(`Totals → tracked ${t.resources} · on site ${t.onSite} · fetched ${t.fetched} · researched ${t.researched} · added ${t.added} · updated ${t.updated} · pending ${t.pending} · broken ${t.broken}`);
    console.log("Wrote agents/REPORT.md and lib/agent-stats.json (shown on /tracker).");
  }
}

function listPending(agents: AgentConfig[]) {
  for (const a of agents) {
    const p = readRegistry(a).filter((e) => e.status === "pending");
    if (!p.length) continue;
    console.log(`\n${a.name} (${p.length} pending)`);
    for (const e of p) console.log(`  ${e.uid}  [${e.kind} → ${e.target}] ${e.title}  ${e.url ?? ""}  (${e.linkState ?? "unchecked"}${e.http ? ` ${e.http}` : ""})`);
  }
}

const HELP = `AI Deck resource agents

  npm run agents -- init                 Create any missing agent folders + agent.env (never overwrites)
  npm run agents -- list                 Show agents, what they own, and resource counts
  npm run agents -- sync                 Index every resource on the site into each agent's registry
  npm run agents -- check [--only pending] [--broken] [--stale-days 7]   Fetch URLs, record link health
  npm run agents -- research --agent level-3                  Find NEW resources with Claude + web search
  npm run agents -- import <file.json>   Add candidates from a JSON file (no API key needed)
  npm run agents -- pending              List candidates waiting for review
  npm run agents -- approve [--ids a,b] [--force]             Approve pending (link must check out)
  npm run agents -- reject --ids a,b     Reject candidates (kept in the registry for the record)
  npm run agents -- apply                Publish approved resources to the website (lib/agent-additions.json)
  npm run agents -- report               Counts → terminal, agents/REPORT.md, /tracker page
  npm run agents -- run --agent level-2  sync → research → check → (auto-approve) → apply → report

  --agent accepts an id (level-4, tools, certificates, careers, projects, glossary), a prefix (level) or "all".`;

async function main() {
  const agents = () => pickAgents(loadAgents(), opt("agent"));
  switch (cmd) {
    case "init": init(); break;
    case "list": {
      for (const a of loadAgents()) {
        const reg = readRegistry(a);
        console.log(`${a.id.padEnd(13)} ${a.name.padEnd(42)} ${String(reg.length).padStart(4)} resources  kinds: ${a.kinds.join(",")}  targets: ${a.targets.includes("*") ? "all topics" : a.targets.length}`);
      }
      break;
    }
    case "sync": sync(agents()); report(true); break;
    case "check": await check(agents()); report(true); break;
    case "research": await research(agents()); report(true); break;
    case "import": importFile(agents()); report(true); break;
    case "pending": listPending(agents()); break;
    case "approve": review(agents(), "approved"); report(true); break;
    case "reject": review(agents(), "rejected"); report(true); break;
    case "apply": apply(); report(true); break;
    case "report": report(); break;
    case "run": {
      const list = agents();
      sync(list);
      if (sharedEnv().ANTHROPIC_API_KEY) await research(list); else console.log("  (no ANTHROPIC_API_KEY: skipping research; use `import` instead)");
      await check(list);
      const auto = list.filter((a) => a.autoApprove);
      if (auto.length) { review(auto, "approved"); apply(); }
      report();
      break;
    }
    default: console.log(HELP);
  }
}

main().catch((e) => { console.error("error:", e.message); process.exit(1); });
