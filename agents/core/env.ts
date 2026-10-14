/* Tiny .env parser (no dependency) and agent discovery. */
import fs from "node:fs";
import path from "node:path";
import type { AgentConfig, Kind } from "./types";

export const ROOT = path.resolve(__dirname, "..");          // /agents
export const REPO = path.resolve(ROOT, "..");               // repo root

export function parseEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    out[m[1]] = v;
  }
  return out;
}

/** Shared secrets: agents/.env (git-ignored), then process env wins. */
export function sharedEnv(): Record<string, string> {
  const f = path.join(ROOT, ".env");
  const fromFile = fs.existsSync(f) ? parseEnv(fs.readFileSync(f, "utf8")) : {};
  return { ...fromFile, ...Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined)) as Record<string, string> };
}

const list = (v?: string) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export function loadAgents(): AgentConfig[] {
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, "agent.env")))
    .map((d) => d.name);
  return dirs.map((d) => {
    const raw = parseEnv(fs.readFileSync(path.join(ROOT, d, "agent.env"), "utf8"));
    return {
      id: raw.AGENT_ID || d,
      name: raw.AGENT_NAME || d,
      scope: (raw.AGENT_SCOPE as AgentConfig["scope"]) || "feature",
      dir: path.join(ROOT, d),
      targets: list(raw.TARGETS),
      kinds: list(raw.RESOURCE_KINDS) as Kind[],
      trustedDomains: list(raw.TRUSTED_DOMAINS),
      focus: raw.RESEARCH_FOCUS || "",
      maxNew: Number(raw.MAX_NEW_PER_RUN || 10),
      autoApprove: /^true$/i.test(raw.AUTO_APPROVE || ""),
      raw,
    };
  }).sort((a, b) => order(a.id) - order(b.id));
}

const order = (id: string) => {
  const m = id.match(/^level-(\d+)/);
  return m ? Number(m[1]) : 100 + ["tools", "certificates", "careers", "projects", "glossary"].indexOf(id);
};

export function pickAgents(all: AgentConfig[], sel?: string): AgentConfig[] {
  if (!sel || sel === "all") return all;
  const want = list(sel);
  const out = all.filter((a) => want.includes(a.id) || want.some((w) => a.id.startsWith(w)));
  if (!out.length) throw new Error(`No agent matches "${sel}". Run: npm run agents -- list`);
  return out;
}
