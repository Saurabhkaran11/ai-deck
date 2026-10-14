/* Reads every resource currently on the website (from /lib) and assigns it to an agent target.
   This is the "env of resources" each agent starts from, so nothing has to be searched for again. */
import { TOPICS, YT } from "../../lib/data";
import { BADGES, REPOS, TOOL_GROUPS } from "../../lib/extra";
import { GLOSSARY } from "../../lib/plain";
import { CERT_BOARD, TRACKS } from "../../lib/careers";
import { PROJECTS } from "../../lib/projects";
import type { Entry, Kind } from "./types";

export type SiteItem = Omit<Entry, "uid" | "origin" | "status" | "firstSeen">;

export function siteItems(): SiteItem[] {
  const out: SiteItem[] = [];
  const push = (kind: Kind, target: string, title: string, url?: string, note?: string, extra?: Record<string, unknown>) =>
    out.push({ kind, target, title, url, note, extra });

  for (const t of TOPICS) {
    for (const [n, u, note] of t.free) push("course", t.id, n, u, note);
    for (const [n, u, note] of t.paid) push("paid", t.id, n, u, note);
    for (const [n, u, note] of t.yt) push("video", t.id, n, /^https?:/.test(u) ? u : YT(u), note, /^https?:/.test(u) ? undefined : { search: u });
    for (const [n, u, note] of t.certs) push("badge", t.id, n, u, note);
    for (const tool of t.tools ?? []) push("tool", t.id, tool[0], tool[1], tool[5], { price: tool[2], toolKind: tool[3], isNew: tool[4] });
  }
  for (const [id, list] of Object.entries(BADGES)) for (const [iss, n, u, note, paid] of list) push("badge", id, n, u, note, { issuer: iss, paid: !!paid });
  for (const [id, list] of Object.entries(REPOS)) for (const [n, u, note] of list) push("repo", id, n, u, note);
  // Tools are also reachable via TOOL_GROUPS (same ids as the t-* topics); dedupe happens by uid.
  for (const g of TOOL_GROUPS) for (const tool of g.tools) push("tool", g.id, tool[0], tool[1], tool[5], { price: tool[2], toolKind: tool[3], isNew: tool[4] });
  for (const [term, def] of GLOSSARY) push("glossary", "glossary", term, undefined, def, { definition: def });
  for (const tr of TRACKS) for (const [course, provider, url, cost, cert] of tr.steps) push("step", tr.id, course, url, `${provider} · ${cost}`, { provider, cost, cert });
  for (const [name, code, status, price, url, note] of CERT_BOARD) push("link", "cert-board", `${name}${code !== "—" ? ` (${code})` : ""}`, url, `${status} · ${price} · ${note}`, { status });
  for (const p of PROJECTS) {
    push("project", "projects", p.title, undefined, p.cat, { id: p.id });
    for (const [n, u] of [...p.tools, ...p.launch]) push("link", `project:${p.id}`, n, u);
  }
  return out;
}

/** Which agent owns a site item. Level agents own topic content; feature agents own the rest. */
export function ownerOf(item: SiteItem, levelOf: (topicId: string) => number | undefined): string {
  if (item.kind === "badge" || item.target === "cert-board" || item.target === "certs") return "certificates";
  if (item.kind === "tool" || item.target.startsWith("t-")) return "tools";
  if (item.kind === "glossary") return "glossary";
  if (item.kind === "step") return "careers";
  if (item.kind === "project" || item.target.startsWith("project:")) return "projects";
  const n = levelOf(item.target);
  return n ? `level-${n}` : "certificates";
}
