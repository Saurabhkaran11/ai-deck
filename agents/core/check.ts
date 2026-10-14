/* Link checker: fetches each URL and records whether it is alive.
   310 (redirect loop), 400/401/403/429/503/999 usually mean "bot protection" on big sites (LinkedIn, Coursera, Udemy), not a dead page. */
import type { Entry } from "./types";
import { note, now } from "./registry";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

export async function probe(url: string, timeoutMs = 12000): Promise<{ status: number; finalUrl: string }> {
  for (const method of ["HEAD", "GET"] as const) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const r = await fetch(url, { method, redirect: "follow", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,*/*" } });
      if (method === "GET") r.body?.cancel().catch(() => {});
      // Many servers reject HEAD; retry those with GET.
      if (method === "HEAD" && (r.status >= 400 || r.status === 0)) continue;
      return { status: r.status, finalUrl: r.url || url };
    } catch (err) {
      // A redirect loop means the site wants browser cookies: the page exists, so report it as "blocked".
      const cause = (err as { cause?: { message?: string; code?: string } }).cause;
      const msg = String(cause?.message ?? (err as Error).message);
      if (/redirect/i.test(msg)) return { status: 310, finalUrl: url };
      // The server answered with very large headers (Node's 16 KB limit): it is up.
      if (cause?.code === "UND_ERR_HEADERS_OVERFLOW") return { status: 299, finalUrl: url };
      if (method === "GET") return { status: 0, finalUrl: url };
    } finally {
      clearTimeout(t);
    }
  }
  return { status: 0, finalUrl: url };
}

export const stateOf = (s: number): Entry["linkState"] =>
  [310, 400, 401, 403, 405, 429, 451, 503, 999].includes(s) ? "blocked" : s >= 200 && s < 400 ? "ok" : "broken";

/** Checks entries in place. Returns how many URLs were fetched and how many entries changed state. */
export async function checkEntries(entries: Entry[], opts: { concurrency?: number; timeoutMs?: number; onlyStale?: number } = {}) {
  const todo = entries.filter((e) => e.url && /^https?:/.test(e.url) && !e.extra?.search &&
    (!opts.onlyStale || !e.checkedAt || Date.now() - Date.parse(e.checkedAt) > opts.onlyStale));
  let fetched = 0, updated = 0, i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const e = todo[i++];
      let { status, finalUrl } = await probe(e.url!, opts.timeoutMs);
      // Network errors are often transient (timeouts under load): retry once, slower.
      if (status === 0) ({ status, finalUrl } = await probe(e.url!, (opts.timeoutMs ?? 12000) * 2));
      fetched++;
      const state = stateOf(status);
      if (e.linkState && e.linkState !== "unchecked" && e.linkState !== state) {
        note(e, `link ${e.linkState} → ${state} (HTTP ${status})`);
        updated++;
      }
      e.http = status;
      e.linkState = state;
      e.checkedAt = now();
      const moved = finalUrl && finalUrl.replace(/\/+$/, "") !== e.url!.replace(/\/+$/, "");
      if (moved) e.finalUrl = finalUrl; else delete e.finalUrl;
      process.stdout.write(state === "ok" ? "." : state === "blocked" ? "b" : "x");
    }
  };
  await Promise.all(Array.from({ length: opts.concurrency ?? 8 }, worker));
  if (todo.length) process.stdout.write("\n");
  return { fetched, updated };
}
