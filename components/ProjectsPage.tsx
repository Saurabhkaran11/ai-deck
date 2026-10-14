"use client";
import Link from "next/link";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { CATEGORIES, PROJECTS, Project } from "@/lib/projects";
import { PLAIN } from "@/lib/plain";
import { Icon } from "./Bits";

const LEVELS = ["Any level", "Beginner", "Intermediate", "Advanced"] as const;
const CAT_COLOR: Record<string, string> = {
  "Browser extensions": "var(--blue)", "Plugins & add-ons": "var(--violet)", "Tools & SaaS": "var(--teal)",
  Marketing: "var(--pink)", "Quant & finance": "var(--green)", Automation: "var(--orange)", "Content creation": "var(--red)",
  "Personal devices": "var(--yellow)", "E-commerce & local business": "#2f8f8a", "Education & services": "#5b6478",
};

function ProjectCard({ p, open, onToggle, i }: { p: Project; open: boolean; onToggle: () => void; i: number }) {
  const bodyId = `proj-body-${p.id}`;
  return (
    <article id={p.id} className={`proj${open ? " open" : ""}`} style={{ "--c": CAT_COLOR[p.cat] ?? "var(--blue)", "--i": i } as CSSProperties}>
      <button type="button" className="proj-head" aria-expanded={open} aria-controls={bodyId} onClick={onToggle}>
        <span className="proj-tags">
          <span className="proj-cat">{p.cat}</span>
          <span className={`proj-level lv-${p.level.toLowerCase()}`}>{p.level}</span>
        </span>
        <span className="proj-title">{p.title}</span>
        <span className="proj-problem">{p.problem}</span>
        <span className="proj-meta">
          <span>{Icon.clock} First version: {p.mvp}</span>
          <span>Start-up cost: {p.cost}</span>
        </span>
        <span className="chev" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></span>
      </button>
      <div className="proj-body" id={bodyId} role="region" aria-label={`${p.title} details`}>
        <div className="proj-inner">
          <div className="proj-grid">
            <div className="proj-col">
              <section><h4>The solution</h4><p>{p.solution}</p></section>
              <section><h4>Who pays</h4><p>{p.customer}</p></section>
              <section className="money-box"><h4>How it makes money</h4><p>{p.revenue}</p></section>
              {p.watch && <section className="watch"><h4>Watch out for</h4><p>{p.watch}</p></section>}
            </div>
            <div className="proj-col">
              <section>
                <h4>Build it in {p.steps.length} steps</h4>
                <ol className="steps compact">{p.steps.map((s, k) => <li key={s} style={{ "--i": k } as CSSProperties}><span>{s}</span></li>)}</ol>
              </section>
              <section>
                <h4>Tools to use</h4>
                <div className="linkchips">{p.tools.map(([n, u]) => <a key={u + n} href={u} target="_blank" rel="noopener noreferrer">{n} ↗</a>)}</div>
              </section>
              <section>
                <h4>Learn first on AI Deck</h4>
                <div className="linkchips topicchips">{p.topics.map((id) => <Link key={id} href={`/learn/${id}`}>{PLAIN[id]?.title ?? id}</Link>)}</div>
              </section>
              <section>
                <h4>Where to launch and sell</h4>
                <div className="linkchips">{p.launch.map(([n, u]) => <a key={u + n} href={u} target="_blank" rel="noopener noreferrer">{n} ↗</a>)}</div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [cat, setCat] = useState<string>("All");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Any level");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Open and scroll to a project linked from a topic page (#project-id).
  useEffect(() => {
    const id = window.location.hash.split("#").pop() ?? "";
    if (PROJECTS.some((p) => p.id === id)) {
      setOpen(new Set([id]));
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PROJECTS.filter((p) => (cat === "All" || p.cat === cat) && (level === "Any level" || p.level === level) &&
      (!s || `${p.title} ${p.problem} ${p.solution} ${p.cat} ${p.customer}`.toLowerCase().includes(s)));
  }, [cat, level, q]);

  const allOpen = list.length > 0 && list.every((p) => open.has(p.id));
  const toggle = (id: string) => setOpen((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(list.map((p) => p.id)));
  const count = (c: string) => PROJECTS.filter((p) => p.cat === c).length;

  return (
    <div className="projects">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--orange)" } as CSSProperties} />Build &amp; earn</span>
        <h1>{PROJECTS.length} AI projects you can turn into a business</h1>
        <p className="lede">Each idea solves a real problem someone will pay for. Open a card to see who pays, how it makes money, the build steps, the tools, and which AI Deck topics to learn first.</p>
      </header>

      <div className="filters pane">
        <label className="search big">
          {Icon.search}
          <input id="proj-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ideas, e.g. “restaurant”, “extension”, “YouTube”" aria-label="Search project ideas" />
        </label>
        <div className="catchips" role="group" aria-label="Category">
          <button type="button" className={cat === "All" ? "on" : ""} aria-pressed={cat === "All"} onClick={() => setCat("All")}>All <span className="count">{PROJECTS.length}</span></button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={cat === c ? "on" : ""} aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <span className="count">{count(c)}</span></button>
          ))}
        </div>
        <div className="filter-row">
          <div className="seg" role="group" aria-label="Difficulty">
            {LEVELS.map((l) => <button key={l} type="button" className={level === l ? "on" : ""} aria-pressed={level === l} onClick={() => setLevel(l)}>{l}</button>)}
          </div>
          <button type="button" className="btn sm expand-all" onClick={toggleAll} disabled={!list.length}>{allOpen ? "Collapse all" : "Expand all"}</button>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {list.length} {list.length === 1 ? "idea" : "ideas"}
        {(cat !== "All" || level !== "Any level" || q) && <button type="button" className="textlink" onClick={() => { setCat("All"); setLevel("Any level"); setQ(""); }}>Clear filters</button>}
      </p>

      <div className="proj-list">
        {list.map((p, i) => <ProjectCard key={p.id} p={p} i={i} open={open.has(p.id)} onToggle={() => toggle(p.id)} />)}
        {!list.length && <p className="empty">No ideas match. Try another word or clear the filters.</p>}
      </div>

      <p className="verified">Prices and costs are rough starting points from October 2026. Check each platform's current pricing and rules before you build. Finance ideas are educational, not investment advice.</p>
    </div>
  );
}
