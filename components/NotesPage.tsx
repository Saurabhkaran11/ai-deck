"use client";
import Link from "next/link";
import { CSSProperties } from "react";
import { PATH_IDS, nameOf } from "@/lib/paths";
import { useStore } from "@/lib/store";
import { NoteCard } from "./Bits";

export default function NotesPage() {
  const s = useStore();
  const ids = [...PATH_IDS, ...s.custom.map((t) => t.id)];
  const groups = ids.map((id) => ({ id, t: s.getTopic(id), cards: s.cards[id] ?? [] })).filter((g) => g.t && g.cards.length);
  const total = groups.reduce((n, g) => n + g.cards.length, 0);
  const doneCount = PATH_IDS.filter((id) => s.done[id]).length;

  return (
    <div className="notes">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--yellow)" } as CSSProperties} />My notes</span>
        <h1>Everything you've saved</h1>
        <p className="lede">Your notes, links and own topics in one place. They're stored privately in this browser, so they won't appear on other devices.</p>
        <div className="notes-actions">
          <button type="button" className="btn solid" onClick={() => s.openCard("note", null)}>+ Write a note</button>
          <button type="button" className="btn" onClick={() => s.openCard("link", null)}>+ Save a link</button>
          <button type="button" className="btn" onClick={s.openLearning}>+ Add your own topic</button>
        </div>
      </header>

      {s.ready && (
        <section className="stats small" aria-label="Your activity">
          <div><b>{total}</b><span>saved notes and links</span></div>
          <div><b>{doneCount}</b><span>topics completed</span></div>
          <div><b>{s.custom.length}</b><span>topics of your own</span></div>
        </section>
      )}

      {s.ready && s.custom.length > 0 && (
        <section className="block">
          <h2>Your own topics</h2>
          <div className="own-list">
            {s.custom.map((t) => (
              <Link key={t.id} href={`/learn/${t.id}`} className="own-item">
                <b>{t.key}</b>
                <span>{(s.cards[t.id] ?? []).length} saved{s.done[t.id] ? " · Complete" : ""}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!s.ready ? null : groups.length ? groups.map((g) => (
        <section key={g.id} className="block">
          <div className="block-head">
            <h2>{nameOf(g.t!)}</h2>
            <Link href={`/learn/${g.id}`} className="textlink">Open topic</Link>
          </div>
          <div className="mycards">
            {g.cards.map((c, i) => <NoteCard key={c.id} c={c} i={i} fresh={c.id === s.freshId} onDelete={() => s.deleteCard(g.id, c.id)} />)}
          </div>
        </section>
      )) : (
        <div className="empty big">
          <b>No notes yet</b>
          <p>Open any topic and use the “My notes” tab, or press “Write a note” above.</p>
          <Link href="/learn" className="btn">Go to the learning path</Link>
        </div>
      )}
    </div>
  );
}
