"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { TOPICS, YT } from "@/lib/data";
import { BADGES, Badge, NOTICES, REPOS } from "@/lib/extra";
import { guessIssuer } from "@/lib/catalog";
import { PLAIN } from "@/lib/plain";
import { PATH_IDS, levelOf, nameOf, techName } from "@/lib/paths";
import { useStore } from "@/lib/store";
import { BadgeList, ConfirmButton, Icon, LinkList, NoteCard } from "./Bits";

type Tab = { id: string; label: string; count?: number; body: ReactNode };

export default function TopicPage({ id }: { id: string }) {
  const store = useStore();
  const router = useRouter();
  const t = store.getTopic(id);
  const [tab, setTab] = useState("steps");
  useEffect(() => { setTab(t?.custom ? "notes" : "steps"); window.scrollTo({ top: 0 }); }, [id, t?.custom]);

  if (!t) {
    return (
      <div className="notfound pane">
        <h1>{store.ready ? "We couldn't find that topic" : "Loading…"}</h1>
        {store.ready && <p>It may have been deleted. <Link href="/learn" className="textlink">Back to the learning path</Link></p>}
      </div>
    );
  }

  const level = levelOf(t.id);
  const plain = PLAIN[t.id];
  const pos = PATH_IDS.indexOf(t.id);
  const prev = pos > 0 ? TOPICS.find((x) => x.id === PATH_IDS[pos - 1]) : undefined;
  const next = pos >= 0 && pos < PATH_IDS.length - 1 ? TOPICS.find((x) => x.id === PATH_IDS[pos + 1]) : undefined;
  const isDone = store.ready && !!store.done[t.id];
  const color = level?.color ?? "#8a93a6";
  const notes = store.cards[t.id] ?? [];
  const badges: Badge[] = [...(BADGES[t.id] ?? []), ...t.certs.map(([n, u, note]): Badge => [guessIssuer(u), n, u, note ?? "Free certificate"])]
    .filter((b, i, a) => a.findIndex((x) => x[2] === b[2] && x[1] === b[1]) === i);

  const notesBody = (
    <div>
      <div className="notes-actions">
        <button type="button" className="btn solid" onClick={() => store.openCard("note", t.id)}>+ Write a note</button>
        <button type="button" className="btn" onClick={() => store.openCard("link", t.id)}>+ Save a link</button>
      </div>
      <div className="mycards">
        {store.ready && notes.length ? notes.map((c, i) => (
          <NoteCard key={c.id} c={c} i={i} fresh={c.id === store.freshId} onDelete={() => store.deleteCard(t.id, c.id)} />
        )) : <p className="empty">Nothing saved yet. Notes and links you save here stay private on this device.</p>}
      </div>
    </div>
  );

  const tabs: Tab[] = t.custom ? [{ id: "notes", label: "My notes", count: notes.length, body: notesBody }] : [
    { id: "steps", label: "Step-by-step plan", body: (
      <ol className="steps">{t.path.map((p, i) => <li key={p} style={{ "--i": i } as CSSProperties}><span>{p}</span></li>)}</ol>
    ) },
    { id: "courses", label: "Free courses", count: t.free.length, body: (
      <>
        <LinkList items={t.free} />
        {t.paid.length > 0 && (
          <div className="subsection">
            <h3>Want to go further? <span className="price paid">Paid</span></h3>
            <LinkList items={t.paid} />
          </div>
        )}
      </>
    ) },
    { id: "certs", label: "Certificates", count: badges.length, body: (
      <>
        <p className="tab-intro">Free certificates and badges come first. Paid exams are optional and best taken after the free courses.</p>
        <BadgeList items={badges} />
      </>
    ) },
    { id: "videos", label: "Videos", count: t.yt.length, body: (
      <>
        <LinkList items={t.yt} yt />
        <p className="tab-intro">Tip: watch one short explainer first, then come back to the step-by-step plan.</p>
      </>
    ) },
    ...((REPOS[t.id]?.length ?? 0) > 0 ? [{ id: "projects", label: "Free projects", count: REPOS[t.id].length, body: (
      <>
        <p className="tab-intro">Free, open-source projects on GitHub. Great to explore once you're comfortable with the basics.</p>
        <LinkList items={REPOS[t.id]} />
      </>
    ) }] : []),
    { id: "money", label: "Earn with it", body: (
      <div className="money">
        <p>{t.biz[0]}</p>
        <div className="row">
          <a className="btn" href={t.biz[1]} target="_blank" rel="noopener noreferrer">{t.biz[2]} ↗</a>
          <a className="btn ghost" href={YT(`${t.key} make money`)} target="_blank" rel="noopener noreferrer">Ideas on YouTube ↗</a>
        </div>
      </div>
    ) },
    { id: "notes", label: "My notes", count: store.ready ? notes.length : 0, body: notesBody },
  ];
  const active = tabs.find((x) => x.id === tab) ?? tabs[0];

  return (
    <article className="topic" style={{ "--c": color } as CSSProperties}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/learn">{Icon.back} Learning path</Link>
        {level && <span>Level {level.n}: {level.name}</span>}
      </nav>

      <header className="topic-head">
        <div className="topic-title">
          <span className="eyebrow"><i />{level ? `Level ${level.n} · ${level.tag.split(" ")[0]}` : "Your topic"}{plain ? <> · {Icon.clock} {plain.time}</> : null}</span>
          <h1>{nameOf(t)}</h1>
          {plain && <p className="techname">Also called: <b>{techName(t)}</b></p>}
        </div>
        <button type="button" className={`done-btn${isDone ? " on" : ""}`} aria-pressed={isDone} onClick={() => store.toggleDone(t.id)}>
          <span className="tick">{Icon.check}</span>{isDone ? "Completed" : "Mark as complete"}
        </button>
      </header>

      {plain ? (
        <section className="explain">
          <div className="explain-card simple"><h2>In simple words</h2><p>{plain.simple}</p></div>
          <div className="explain-card why"><h2>Why it matters</h2><p>{plain.why}</p></div>
        </section>
      ) : t.summary || t.url ? (
        <section className="explain">
          <div className="explain-card simple"><h2>About this topic</h2><p>{t.summary || "No description yet."}</p>
            {t.url && <p><a className="textlink" href={t.url} target="_blank" rel="noopener noreferrer">Open main link ↗</a></p>}</div>
        </section>
      ) : null}

      {NOTICES[t.id] && <div className="notice" role="note"><b>Good to know</b>{NOTICES[t.id]}</div>}

      {!t.custom && t.concepts.length > 0 && (
        <details className="concepts">
          <summary>Key terms in this topic ({t.concepts.length})</summary>
          <div className="chips">{t.concepts.map((c, i) => <span key={c} className="chip" style={{ "--i": i } as CSSProperties}>{c}</span>)}</div>
        </details>
      )}

      <div className="tabs pane">
        <div className="tablist" role="tablist" aria-label="Topic sections">
          {tabs.map((x) => (
            <button key={x.id} id={`tab-${x.id}`} type="button" role="tab" aria-selected={active.id === x.id} aria-controls={`panel-${x.id}`}
              className={active.id === x.id ? "on" : ""} onClick={() => setTab(x.id)}>
              {x.label}{x.count ? <span className="count">{x.count}</span> : null}
            </button>
          ))}
        </div>
        <div className="tabpanel" role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`} key={active.id}>
          {active.body}
        </div>
      </div>

      {t.custom ? (
        <div className="topic-foot">
          <ConfirmButton className="btn danger" label="Delete this topic" confirm="Press again to delete" onConfirm={() => { store.deleteLearning(t.id); router.push("/notes"); }} />
        </div>
      ) : (
        <nav className="pager" aria-label="Previous and next topic">
          {prev ? <Link href={`/learn/${prev.id}`} className="pager-link prev"><small>{Icon.back} Previous</small><b>{nameOf(prev)}</b></Link> : <span />}
          {next ? <Link href={`/learn/${next.id}`} className="pager-link next"><small>Next {Icon.arrow}</small><b>{nameOf(next)}</b></Link> : <Link href="/certificates" className="pager-link next"><small>You finished the path {Icon.arrow}</small><b>Collect your certificates</b></Link>}
        </nav>
      )}
    </article>
  );
}
