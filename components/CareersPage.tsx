"use client";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import { CAREER_GUIDE, CERT_BOARD, TRACKS, Track } from "@/lib/careers";
import { PLAIN } from "@/lib/plain";
import { Icon } from "./Bits";

const GROUPS = ["All", "Build", "Data & ML", "Platform & cloud", "Product & business", "Research", "Trust & safety"] as const;
const GROUP_COLOR: Record<string, string> = {
  Build: "var(--blue)", "Data & ML": "var(--green)", "Platform & cloud": "var(--teal)",
  "Product & business": "var(--orange)", Research: "var(--violet)", "Trust & safety": "var(--pink)",
};
const isFree = (c: string) => /^free/i.test(c);

function TrackCard({ t, open, onToggle, i }: { t: Track; open: boolean; onToggle: () => void; i: number }) {
  const freeSteps = t.steps.filter((s) => isFree(s[3])).length;
  return (
    <article id={t.id} className={`proj track${open ? " open" : ""}`} style={{ "--c": GROUP_COLOR[t.group], "--i": i } as CSSProperties}>
      <button type="button" className="proj-head" aria-expanded={open} aria-controls={`track-${t.id}`} onClick={onToggle}>
        <span className="proj-tags"><span className="proj-cat">{t.group}</span><span className="proj-level">{t.steps.length} steps · {freeSteps} free</span></span>
        <span className="proj-title">{t.role}</span>
        <span className="proj-problem">{t.summary}</span>
        <span className="proj-meta"><span>Salary: {t.salary}</span></span>
        <span className="chev" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>
      </button>
      <div className="proj-body" id={`track-${t.id}`} role="region" aria-label={`${t.role} track`}>
        <div className="proj-inner">
          <div className="proj-grid">
            <div className="proj-col">
              {t.note && <section className="watch"><h4>Good to know</h4><p>{t.note}</p></section>}
              <section><h4>A typical day</h4><ul className="bullets">{t.day.map((d) => <li key={d}>{d}</li>)}</ul></section>
              <section><h4>Core skills</h4><div className="chips">{t.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div></section>
              <section className="money-box"><h4>Certifications to aim for</h4><p><span className="price free">Free</span> {t.certFree}</p><p style={{ marginTop: 6 }}><span className="price paid">Paid</span> {t.certPaid}</p></section>
              <section><h4>Portfolio projects</h4><ul className="bullets">{t.projects.map((p) => <li key={p}>{p}</li>)}</ul></section>
              <section><h4>Related AI Deck topics</h4><div className="linkchips topicchips">{t.topics.map((id) => <Link key={id} href={`/learn/${id}`}>{PLAIN[id]?.title ?? id}</Link>)}</div></section>
            </div>
            <div className="proj-col">
              <section>
                <h4>Your course track, in order</h4>
                <ol className="track-steps">
                  {t.steps.map(([name, prov, url, cost, cert], k) => (
                    <li key={name + k}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <b>{name} ↗</b>
                        <span className="ts-prov">{prov}</span>
                        <span className="ts-tags"><span className={`price ${isFree(cost) ? "free" : "paid"}`}>{cost}</span>{cert !== "—" && <span className="ts-cert">{Icon.cert} {cert}</span>}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CareersPage() {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All");
  const [open, setOpen] = useState<Set<string>>(new Set());
  useEffect(() => {
    const id = window.location.hash.split("#").pop() ?? "";
    if (TRACKS.some((x) => x.id === id)) {
      setOpen(new Set([id]));
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
    }
  }, []);
  const list = TRACKS.filter((t) => group === "All" || t.group === group);
  const allOpen = list.length > 0 && list.every((t) => open.has(t.id));
  const toggle = (id: string) => setOpen((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="careers">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--violet)" } as CSSProperties} />AI careers</span>
        <h1>{TRACKS.length} job tracks, step by step</h1>
        <p className="lede">Pick the role you want. Each track lists the courses to take in order (free first), the certificates worth getting, typical salaries and portfolio projects that get interviews.</p>
        <nav className="jump" aria-label="On this page">
          <a href="#tracks">Job tracks</a><a href="#cert-board">Certification status</a><a href="#guide">Portfolio, interviews &amp; salaries</a>
        </nav>
      </header>

      <section id="tracks" className="block" style={{ marginTop: 8 }}>
        <div className="filters pane">
          <div className="catchips" role="group" aria-label="Role family">
            {GROUPS.map((g) => (
              <button key={g} type="button" className={group === g ? "on" : ""} aria-pressed={group === g} onClick={() => setGroup(g)}>
                {g} <span className="count">{g === "All" ? TRACKS.length : TRACKS.filter((t) => t.group === g).length}</span>
              </button>
            ))}
            <button type="button" className="btn sm expand-all" onClick={() => setOpen(allOpen ? new Set() : new Set(list.map((t) => t.id)))}>{allOpen ? "Collapse all" : "Expand all"}</button>
          </div>
        </div>
        <div className="proj-list" style={{ marginTop: 14 }}>
          {list.map((t, i) => <TrackCard key={t.id} t={t} i={i} open={open.has(t.id)} onToggle={() => toggle(t.id)} />)}
        </div>
      </section>

      <section id="cert-board" className="block">
        <div className="block-head"><h2>Certification status board</h2><span className="verified" style={{ margin: 0 }}>Last checked Oct 2026</span></div>
        <p className="tab-intro">Several AI exams were retired or replaced in 2026. Check this before you book.</p>
        <div className="table-wrap pane">
          <table className="cert-table">
            <thead><tr><th>Certification</th><th>Code</th><th>Status</th><th>Price (US)</th><th>Notes</th></tr></thead>
            <tbody>
              {CERT_BOARD.map(([name, code, status, price, url, note]) => (
                <tr key={name + code}>
                  <td><a href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a></td>
                  <td className="mono">{code}</td>
                  <td><span className={`status st-${status.toLowerCase()}`}>{status}</span></td>
                  <td className="mono">{price}</td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="verified">Some prices come from third-party trackers (marked “verify” or “~”). Confirm on the vendor's site before paying.</p>
      </section>

      <section id="guide" className="block">
        <h2>Get hired</h2>
        <div className="guide-grid">
          <div className="pane guide-card">
            <h3>Build a portfolio that gets interviews</h3>
            <ul className="bullets">{CAREER_GUIDE.portfolio.map((p) => <li key={p}>{p}</li>)}</ul>
            <p style={{ marginTop: 12 }}><Link href="/projects" className="textlink">Pick a project from Build &amp; earn {Icon.arrow}</Link></p>
          </div>
          <div className="pane guide-card">
            <h3>Prepare for interviews</h3>
            <p><b>ML system design:</b> {CAREER_GUIDE.mlDesign}</p>
            <p><b>LLM system design:</b> {CAREER_GUIDE.llmDesign}</p>
            <p><b>Coding:</b> data-structure questions, plus “implement attention or k-means from scratch”.</p>
            <ul className="links compact-links">{CAREER_GUIDE.interviewLinks.map(([n, u, c]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer"><b>{n}</b><span>{c}</span></a></li>)}</ul>
          </div>
          <div className="pane guide-card">
            <h3>Where AI jobs are posted</h3>
            <div className="linkchips">{CAREER_GUIDE.boards.map(([n, u]) => <a key={u} href={u} target="_blank" rel="noopener noreferrer">{n} ↗</a>)}</div>
          </div>
          <div className="pane guide-card">
            <h3>What AI jobs pay (US)</h3>
            <div className="table-wrap">
              <table className="cert-table small">
                <thead><tr><th>Role</th><th>Figure</th><th>Source</th></tr></thead>
                <tbody>{CAREER_GUIDE.salaries.map(([r, f, s, u]) => <tr key={r}><td>{r}</td><td>{f}</td><td><a href={u} target="_blank" rel="noopener noreferrer">{s} ↗</a></td></tr>)}</tbody>
              </table>
            </div>
            <p className="verified">Levels.fyi shows total pay at mostly large tech firms; BLS shows base pay across all employers. Don't compare them directly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
