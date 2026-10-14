"use client";
import Link from "next/link";
import { CSSProperties } from "react";
import { TOPICS } from "@/lib/data";
import { LEVELS, PLAIN } from "@/lib/plain";
import { PATH_IDS, techName } from "@/lib/paths";
import { useStore } from "@/lib/store";
import { Icon } from "./Bits";

export default function LearnPath() {
  const { done, ready, custom, openLearning } = useStore();
  const doneCount = ready ? PATH_IDS.filter((id) => done[id]).length : 0;
  const pct = Math.round((doneCount / PATH_IDS.length) * 100);
  let n = 0;

  return (
    <div className="learn">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--blue)" } as CSSProperties} />Your learning path</span>
        <h1>{LEVELS.length} levels, {PATH_IDS.length} topics</h1>
        <p className="lede">New to AI? Start at Level 1 and work down. Already comfortable? Jump straight to what you need. Most topics take a few hours.</p>
        <div className="progress-card pane">
          <div className="progress-top">
            <b>{doneCount === 0 ? "Not started yet" : doneCount === PATH_IDS.length ? "Path complete. Well done!" : `${doneCount} of ${PATH_IDS.length} topics complete`}</b>
            <span>{pct}%</span>
          </div>
          <div className="bar"><span style={{ width: `${pct}%` }} /></div>
        </div>
      </header>

      {LEVELS.map((l, li) => {
        const lvDone = ready ? l.topics.filter((id) => done[id]).length : 0;
        return (
          <section key={l.n} id={`level-${l.n}`} className="level" style={{ "--c": l.color, "--li": li } as CSSProperties}>
            <div className="level-head">
              <span className="level-badge">Level {l.n}</span>
              <div>
                <h2>{l.name}</h2>
                <p>{l.desc}</p>
              </div>
              <span className="level-meta">{l.tag} · {lvDone}/{l.topics.length} done</span>
            </div>
            <ol className="stations">
              {l.topics.map((id, i) => {
                const t = TOPICS.find((x) => x.id === id)!;
                const p = PLAIN[id];
                n += 1;
                const isDone = ready && !!done[id];
                return (
                  <li key={id} style={{ "--i": i } as CSSProperties}>
                    <Link href={`/learn/${id}`} className={`station${isDone ? " done" : ""}`}>
                      <span className="st-dot" aria-hidden="true">{isDone ? Icon.check : n}</span>
                      <span className="st-body">
                        <b>{p.title}</b>
                        <small>{techName(t)}</small>
                        <span className="st-meta">{Icon.clock}{p.time}{t.upcoming ? " · coming soon" : ""}{isDone ? " · Complete" : ""}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <section className="level own" style={{ "--c": "#8a93a6" } as CSSProperties}>
        <div className="level-head">
          <span className="level-badge">Yours</span>
          <div>
            <h2>Your own topics</h2>
            <p>Add anything else you're learning and keep notes on it.</p>
          </div>
          <button type="button" className="btn solid sm" onClick={openLearning}>+ Add a topic</button>
        </div>
        {ready && custom.length > 0 ? (
          <ol className="stations">
            {custom.map((t, i) => (
              <li key={t.id} style={{ "--i": i } as CSSProperties}>
                <Link href={`/learn/${t.id}`} className={`station${done[t.id] ? " done" : ""}`}>
                  <span className="st-dot" aria-hidden="true">{done[t.id] ? Icon.check : "+"}</span>
                  <span className="st-body"><b>{t.key}</b>{t.summary && <small>{t.summary.slice(0, 70)}</small>}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">No topics of your own yet. Use “Add a topic” to create one.</p>
        )}
      </section>

      <p className="center-link"><Link href="/glossary" className="textlink">{Icon.book} Stuck on a word? Open the AI glossary</Link></p>
    </div>
  );
}
