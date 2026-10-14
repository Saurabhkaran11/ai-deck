import { TOPICS } from "./data";
import { BADGES, Issuer, TOOL_GROUPS } from "./extra";
import { PATH_IDS } from "./paths";

export type CertItem = { issuer: Issuer; name: string; url: string; note: string; paid: boolean; credential: boolean; topics: string[] };

/** One deduplicated list of every certificate, badge and course-with-certificate in the deck. */
export function allCertificates(): CertItem[] {
  const map = new Map<string, CertItem>();
  const add = (c: Omit<CertItem, "topics" | "credential">, topic: string) => {
    const key = c.name.toLowerCase() + "|" + c.url;
    const hit = map.get(key);
    if (hit) { if (!hit.topics.includes(topic)) hit.topics.push(topic); return; }
    map.set(key, { ...c, credential: c.paid || /certificate|badge|credential|exam/i.test(c.note), topics: [topic] });
  };
  for (const id of PATH_IDS) {
    for (const [iss, name, url, note, paid] of BADGES[id] ?? []) add({ issuer: iss, name, url, note, paid: !!paid }, id);
    const t = TOPICS.find((x) => x.id === id);
    for (const [name, url, note] of t?.certs ?? []) add({ issuer: guessIssuer(url), name, url, note: note ?? "", paid: false }, id);
  }
  return [...map.values()];
}

export function guessIssuer(url: string): Issuer {
  if (url.includes("huggingface")) return "hf";
  if (url.includes("anthropic")) return "anthropic";
  if (url.includes("google")) return "google";
  if (url.includes("openai")) return "openai";
  if (url.includes("microsoft")) return "ms";
  if (url.includes("aws") || url.includes("amazon")) return "aws";
  return "other";
}

export const TOOL_COUNT = TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);
