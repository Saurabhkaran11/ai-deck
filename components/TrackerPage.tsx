"use client";
import { CSSProperties, useMemo, useState } from "react";
import stats from "@/lib/agent-stats.json";
import { host } from "./Bits";

type Row = (typeof stats.agents)[number];
const KIND_LABEL: Record<string, string> = {
  course: "Free course", paid: "Paid option", video: "Video", repo: "Open-source project", badge: "Certificate",
  tool: "AI tool", glossary: "AI word", step: "Career step", project: "Project idea", link: "Reference link",
};
const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");
const color = (id: string) => (id.startsWith("level") ? "var(--blue)" : { tools: "var(--orange)", certificates: "var(--teal)", careers: "var(--violet)", projects: "var(--pink)", glossary: "var(--green)" }[id] ?? "var(--blue)");

function Health({ r }: { r: Row }) {
  const total = r.ok + r.blocked + r.broken || 1;
  return (
    <div className="health" aria-label={`${r.ok} links OK, ${r.blocked} protected, ${r.broken} broken`}>
      <span className="h-ok" style={{ width: `${(r.ok / total) * 100}%` }} />
      <span className="h-blocked" style={{ width: `${(r.blocked / total) * 100}%` }} />
      <span className="h-broken" style={{ width: `${(r.broken / total) * 100}%` }} />
    </div>
  );
}

export default function TrackerPage() {
  const t = stats.totals;
  const [agent, setAgent] = useState("all");
  const recent = useMemo(() => stats.recent.filter((x) => agent === "all" || x.agent === agent), [agent]);
  const withAdds = stats.agents.filter((a) => a.added > 0);

  return (
    <div className="tracker">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--teal)" } as CSSProperties} />Resource agents</span>
        <h1>Resource tracker</h1>
        <p className="lede">
          {stats.agents.length} agents look after AI Deck: one per learning level and one per feature. Each keeps its own list of resources,
          checks that the links still work and researches new ones. Here is what they have fetched, researched and added.
        </p>
        <p className="tiny">Last updated {fmt(stats.generatedAt)}</p>
      </header>

      <section className="stats tracker-stats" aria-label="Totals">
        <div><b>{t.resources.toLocaleString()}</b><span>resources tracked</span></div>
        <div><b>{t.fetched.toLocaleString()}</b><span>links fetched and checked</span></div>
        <div><b>{t.researched}</b><span>new resources researched</span></div>
        <div><b>{t.added}</b><span>added to the site by agents</span></div>
        <div><b>{t.updated}</b><span>link updates recorded</span></div>
        <div><b>{t.broken}</b><span>broken links right now</span></div>
      </section>

      <section className="block">
        <h2>The agents</h2>
        <div className="agent-grid">
          {stats.agents.map((r, i) => (
            <article key={r.id} className="agent-card pane" style={{ "--c": color(r.id), "--i": i } as CSSProperties}>
              <span className="fp-cat">{r.scope === "level" ? "Level agent" : "Feature agent"} · {r.targets} {r.targets === "all topics" ? "" : "areas"}</span>
              <b>{r.name.replace(/ agent$/, "")}</b>
              <dl>
                <div><dt>Resources</dt><dd>{r.total}</dd></div>
                <div><dt>Added</dt><dd>{r.added}</dd></div>
                <div><dt>Fetched</dt><dd>{r.fetched}</dd></div>
                <div><dt>Pending</dt><dd>{r.pending}</dd></div>
              </dl>
              <Health r={r} />
              <small>{r.ok} OK · {r.blocked} protected · {r.broken} broken · last run {fmt(r.lastRun)}</small>
            </article>
          ))}
        </div>
        <p className="tiny" style={{ marginTop: 12 }}>
          “Protected” means the site blocks automated checks (common on LinkedIn, Coursera and Google), not that the page is down.
        </p>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Recently added by agents</h2>
          <label className="agent-filter">
            <span>Agent</span>
            <select value={agent} onChange={(e) => setAgent(e.target.value)}>
              <option value="all">All agents ({stats.recent.length})</option>
              {withAdds.map((a) => <option key={a.id} value={a.id}>{a.name.replace(/ agent$/, "")} ({a.added})</option>)}
            </select>
          </label>
        </div>
        <div className="pane table-wrap">
          <table className="cert-table">
            <thead><tr><th>Resource</th><th>Type</th><th>Where it appears</th><th>Added</th></tr></thead>
            <tbody>
              {recent.map((x) => (
                <tr key={x.agent + x.kind + x.target + x.title}>
                  <td>
                    {x.url ? <a href={x.url} target="_blank" rel="noopener noreferrer">{x.title}</a> : <b>{x.title}</b>}
                    <div className="tiny">{x.url ? host(x.url) : x.note}</div>
                  </td>
                  <td>{KIND_LABEL[x.kind] ?? x.kind}</td>
                  <td>{x.targetName}</td>
                  <td className="mono">{fmt(x.addedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block">
        <h2>Activity log</h2>
        <div className="pane table-wrap">
          <table className="cert-table small">
            <thead><tr><th>When</th><th>Agent</th><th>Step</th><th>Result</th></tr></thead>
            <tbody>
              {stats.runs.map((r, i) => (
                <tr key={i}>
                  <td className="mono">{fmt(r.at)}</td>
                  <td>{r.agent}</td>
                  <td>{r.command}</td>
                  <td>{Object.entries(r.counts).filter(([, v]) => v).map(([k, v]) => `${v} ${k}`).join(", ")}{"detail" in r && r.detail ? ` · ${r.detail}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block">
        <h2>How the agents work</h2>
        <ol className="how">
          <li><b>Own list</b><span>Each agent has its own settings file and a list of every resource it looks after, so nothing already on the site is searched for again.</span></li>
          <li><b>Check</b><span>It visits every link and records whether it still works.</span></li>
          <li><b>Research</b><span>It searches the web for new free courses, videos, tools and certificates it does not have yet.</span></li>
          <li><b>Review and add</b><span>New finds wait for approval, then are added to the site. Nothing is ever deleted.</span></li>
        </ol>
      </section>
    </div>
  );
}
