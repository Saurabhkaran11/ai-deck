"use client";
import { CSSProperties, useEffect, useState } from "react";
import { LINES, Topic } from "@/lib/data";

export const titleOf = (t: Topic) => [t.pre, t.key, t.post].filter(Boolean).join(" ");

type Props = {
  topics: Topic[];
  current: string;
  query: string;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

export default function Sidebar({ topics, current, query, onQuery, onSelect, onAdd }: Props) {
  const q = query.trim().toLowerCase();
  const match = (t: Topic) =>
    !q || `${titleOf(t)} ${t.summary} ${t.concepts.join(" ")} ${(t.tools ?? []).map((x) => x[0] + " " + x[5]).join(" ")}`.toLowerCase().includes(q);
  let shown = 0;
  const [intro, setIntro] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIntro(false), 1600); return () => clearTimeout(t); }, []);

  return (
    <aside className="pane nav" aria-label="AI learning lines">
      <div className="brand">
        <div>
          <h1>AI <span>Deck</span></h1>
          <small>Engineering metro map</small>
        </div>
      </div>
      <div className="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input id="q" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search stations, tools, certificates" aria-label="Search" />
      </div>
      <nav className={`lines${intro ? " intro" : ""}`}>
        {LINES.map((L, li) => {
          const items = topics.filter((t) => t.line === L.id && match(t));
          shown += items.length;
          if (!items.length && !(L.id === "mine" && !q)) return null;
          return (
            <section key={L.id} className="line" style={{ "--c": L.c, "--li": li } as CSSProperties}>
              <div className="line-h"><i />{L.name}</div>
              <ul className="stops">
                {items.length ? items.map((t, i) => (
                  <li key={t.id}>
                    <button type="button" className={`stop${t.id === current ? " on" : ""}`} style={{ "--i": i } as CSSProperties} onClick={() => onSelect(t.id)}>
                      <span className="dot" />
                      <span>{t.pre} <b>{t.key}</b> {t.post}</span>
                      {t.upcoming && <span className="tag">next</span>}
                      {t.custom && <span className="tag">mine</span>}
                    </button>
                  </li>
                )) : (
                  <li className="empty" style={{ margin: "4px 8px", padding: 12, fontSize: 13 }}>Add your own learnings with the button below.</li>
                )}
              </ul>
            </section>
          );
        })}
        {q && shown === 0 && <p className="empty" style={{ margin: 8 }}>No stations match “{query}”.</p>}
      </nav>
      <div className="nav-foot">
        <button className="btn solid wide" type="button" onClick={onAdd}>+ Add a learning</button>
      </div>
    </aside>
  );
}
