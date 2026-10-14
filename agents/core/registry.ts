/* Per-agent resource registry (resources.json) and the shared ledger (ledger.json).
   Append-only by design: entries are never deleted, only their status/link state changes. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT } from "./env";
import type { AgentConfig, Counts, Entry } from "./types";
import { ZERO } from "./types";

export const now = () => new Date().toISOString();

export const normUrl = (u: string) => u.trim().replace(/^https?:\/\/(www\.)?/, "").replace(/[#?].*$/, "").replace(/\/+$/, "").toLowerCase();

export function uidFor(e: Pick<Entry, "kind" | "target" | "url" | "title">) {
  const key = `${e.kind}|${e.target}|${e.url ? normUrl(e.url) : e.title.toLowerCase()}`;
  return crypto.createHash("sha1").update(key).digest("hex").slice(0, 12);
}

const regFile = (a: AgentConfig) => path.join(a.dir, "resources.json");

export function readRegistry(a: AgentConfig): Entry[] {
  const f = regFile(a);
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")).resources as Entry[]) : [];
}

export function writeRegistry(a: AgentConfig, entries: Entry[]) {
  const byStatus = entries.reduce<Record<string, number>>((m, e) => ((m[e.status] = (m[e.status] ?? 0) + 1), m), {});
  const body = { agent: a.id, name: a.name, updatedAt: now(), total: entries.length, byStatus, resources: entries };
  fs.writeFileSync(regFile(a), JSON.stringify(body, null, 1) + "\n");
}

/** Every URL any agent already knows, so research never re-proposes an existing resource. */
export function knownUrls(agents: AgentConfig[]): Set<string> {
  const s = new Set<string>();
  for (const a of agents) for (const e of readRegistry(a)) if (e.url) s.add(normUrl(e.url));
  return s;
}

export function note(e: Entry, change: string) {
  (e.history ??= []).push({ at: now(), change });
  if (e.history.length > 20) e.history = e.history.slice(-20);
}

/* ---------------- Ledger ---------------- */
export type Run = { at: string; agent: string; command: string; counts: Partial<Counts>; detail?: string };
export type Ledger = { createdAt: string; updatedAt: string; totals: Counts; agents: Record<string, Counts & { lastRun?: string }>; runs: Run[] };

const ledgerFile = path.join(ROOT, "ledger.json");

export function readLedger(): Ledger {
  if (fs.existsSync(ledgerFile)) return JSON.parse(fs.readFileSync(ledgerFile, "utf8"));
  return { createdAt: now(), updatedAt: now(), totals: { ...ZERO }, agents: {}, runs: [] };
}

export function record(agent: string, command: string, counts: Partial<Counts>, detail?: string) {
  const l = readLedger();
  const a = (l.agents[agent] ??= { ...ZERO });
  for (const [k, v] of Object.entries(counts) as [keyof Counts, number][]) {
    if (!v) continue;
    a[k] += v;
    l.totals[k] += v;
  }
  a.lastRun = now();
  l.updatedAt = now();
  l.runs.push({ at: now(), agent, command, counts, detail });
  if (l.runs.length > 500) l.runs = l.runs.slice(-500);
  fs.writeFileSync(ledgerFile, JSON.stringify(l, null, 1) + "\n");
}
