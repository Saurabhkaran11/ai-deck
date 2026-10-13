"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { LINES, Res, Topic, YT } from "@/lib/data";
import { UserCard, safeUrl } from "@/lib/storage";
import { BADGES, ISSUERS, LAST_VERIFIED, NOTICES, REPOS, Tool, ToolKind } from "@/lib/extra";

const host = (u: string) => {
  try { return new URL(u).hostname.replace("www.", ""); } catch { return u; }
};

function ResList({ items, yt = false }: { items: Res[]; yt?: boolean }) {
  return (
    <ul className="res">
      {items.map(([name, u, note]) => {
        const isSearch = yt && !/^https?:/.test(u);
        const href = isSearch ? YT(u) : u;
        return (
          <li key={name + u}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <b>{name}</b>
              <span>{note || (isSearch ? `YouTube search · ${u}` : host(href))}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ConfirmButton({ label, confirm, className, onConfirm }: { label: string; confirm: string; className: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button type="button" className={`${className}${armed ? " armed" : ""}`} onClick={() => (armed ? onConfirm() : setArmed(true))}>
      {armed ? confirm : label}
    </button>
  );
}

function CardView({ c, i, fresh, onDelete }: { c: UserCard; i: number; fresh: boolean; onDelete: () => void }) {
  const u = c.url ? safeUrl(c.url) : null;
  const [leaving, setLeaving] = useState(false);
  const remove = () => {
    setLeaving(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onDelete, reduce ? 0 : 240);
  };
  return (
    <article className={`ucard ${c.type}${fresh ? " fresh" : ""}${leaving ? " leaving" : ""}`} style={{ "--i": i } as CSSProperties}>
      <span className="type">{c.type === "note" ? "Note" : "Web link"}</span>
      <h4>{c.title || (u ? host(u) : "Untitled")}</h4>
      {c.body && <p>{c.body}</p>}
      {u && <a href={u} target="_blank" rel="noopener noreferrer">{u} ↗</a>}
      <div className="meta">
        <span>{new Date(c.at).toLocaleDateString()}</span>
        <ConfirmButton className="x" label="Delete" confirm="Confirm" onConfirm={remove} />
      </div>
    </article>
  );
}

function BadgeList({ id }: { id: string }) {
  const items = BADGES[id] ?? [];
  const sorted = [...items].sort((a, b) => Number(!!a[4]) - Number(!!b[4]));
  return (
    <ul className="res badges">
      {sorted.map(([iss, name, url, note, paid]) => (
        <li key={name + url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <span className={`iss iss-${iss}`}>{ISSUERS[iss]}</span>
            <b>{name}</b>
            <span><em className={paid ? "pp paid" : "pp free"}>{paid ? "Paid" : "Free"}</em> {note}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const KIND_LABEL: Record<ToolKind, string> = { oss: "Open-source", free: "Free", freemium: "Freemium", paid: "Paid" };
const FILTERS: { id: "all" | "free" | "freemium" | "paid"; label: string }[] = [
  { id: "all", label: "All" }, { id: "free", label: "Free & open-source" }, { id: "freemium", label: "Freemium" }, { id: "paid", label: "Paid" },
];

function ToolsView({ tools }: { tools: Tool[] }) {
  const [f, setF] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const shown = tools.filter(([, , , k, isNew]) =>
    (f === "all" || (f === "free" ? k === "oss" || k === "free" : k === f)) && (!onlyNew || isNew));
  return (
    <div className="card tools-card" style={{ "--i": 0 } as CSSProperties}>
      <div className="tool-bar">
        <h3>{shown.length} of {tools.length} tools</h3>
        <div className="seg" role="group" aria-label="Filter by price">
          {FILTERS.map((x) => (
            <button key={x.id} type="button" className={f === x.id ? "on" : ""} aria-pressed={f === x.id} onClick={() => setF(x.id)}>{x.label}</button>
          ))}
          <button type="button" className={onlyNew ? "on new" : "new"} aria-pressed={onlyNew} onClick={() => setOnlyNew((v) => !v)}>New in 2025–26</button>
        </div>
      </div>
      <div className="tool-grid">
        {shown.map(([name, url, price, kind, isNew, desc], i) => (
          <a key={name + url} className="tool" href={url} target="_blank" rel="noopener noreferrer" style={{ "--i": i } as CSSProperties}>
            <span className="tool-top"><b>{name}</b>{isNew && <span className="newpill">New</span>}</span>
            <span className="tool-desc">{desc}</span>
            <span className="tool-price"><em className={`pp ${kind}`}>{KIND_LABEL[kind]}</em>{price.toLowerCase() === KIND_LABEL[kind].toLowerCase() ? "" : price}</span>
          </a>
        ))}
        {!shown.length && <div className="empty" style={{ gridColumn: "1/-1" }}>No tools match this filter.</div>}
      </div>
      <p className="verified">Prices are USD list prices, last checked {LAST_VERIFIED}. Check the vendor page before buying.</p>
    </div>
  );
}

type Props = {
  topic: Topic;
  cards: UserCard[];
  freshId: string | null;
  onNewCard: (type: "note" | "link") => void;
  onDeleteCard: (id: string) => void;
  onDeleteLearning: () => void;
};

export default function Detail({ topic: t, cards, freshId, onNewCard, onDeleteCard, onDeleteLearning }: Props) {
  const [menu, setMenu] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => { setSettled(false); const id = setTimeout(() => setSettled(true), 1400); return () => clearTimeout(id); }, [t.id]);
  const wrap = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLElement>(null);
  const L = LINES.find((l) => l.id === t.line) ?? LINES[LINES.length - 1];

  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); setMenu(false); }, [t.id]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setMenu(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [menu]);

  const pick = (type: "note" | "link") => { setMenu(false); onNewCard(type); };

  return (
    <main ref={scroller} id="detail" className="pane detail" aria-live="polite" style={{ "--c": L.c } as CSSProperties}>
      <div className={`detail-inner${settled ? " settled" : ""}`} key={t.id}>
        <button className="btn ghost mobile-back" type="button" onClick={() => document.querySelector(".nav")?.scrollIntoView({ behavior: "smooth" })}>↑ All lines</button>

        <div className="hero">
          <span className="eyebrow"><i />{L.name}{t.upcoming ? " · next stop" : ""}</span>
          <h2>{t.pre} <em>{t.key}</em> {t.post}</h2>
          {t.summary && <p>{t.summary}</p>}
          {t.concepts.length > 0 && (
            <div className="chips">{t.concepts.map((c, i) => <span key={c} className="chip" style={{ "--i": i } as CSSProperties}>{c}</span>)}</div>
          )}
        </div>

        {t.custom ? (
          <div className="biz" style={{ marginTop: 20 }}>
            <h3>Your learning</h3>
            <p>
              {t.url ? <>Main link: <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--link)" }}>{t.url}</a></> : "Add note and link cards below to build this out."}
            </p>
            <div className="row">
              <ConfirmButton className="btn danger" label="Delete this learning" confirm="Press again to delete" onConfirm={onDeleteLearning} />
            </div>
          </div>
        ) : t.tools ? (
          <div className="grid"><ToolsView tools={t.tools} /></div>
        ) : (
          <>
            {NOTICES[t.id] && <div className="notice" role="note"><b>Heads up</b>{NOTICES[t.id]}</div>}
            <div className="grid">
              <div className="card" style={{ "--i": 0 } as CSSProperties}><h3>Learning path</h3><ol className="path">{t.path.map((p, i) => <li key={p} style={{ "--i": i } as CSSProperties}>{p}</li>)}</ol></div>
              <div className="card" style={{ "--i": 1 } as CSSProperties}><h3>Free resources<span className="k free">Free</span></h3><ResList items={t.free} /></div>
              <div className="card" style={{ "--i": 2 } as CSSProperties}><h3>Best paid pick<span className="k paid">Paid</span></h3><ResList items={t.paid} /></div>
              {t.certs.length > 0 && <div className="card" style={{ "--i": 3 } as CSSProperties}><h3>Certificates<span className="k cert">Free</span></h3><ResList items={t.certs} /></div>}
              {(BADGES[t.id]?.length ?? 0) > 0 && <div className="card" style={{ "--i": 4 } as CSSProperties}><h3>Badges &amp; certificates<span className="k cert">AWS · Microsoft · OpenAI</span></h3><BadgeList id={t.id} /><p className="verified">Free first, then paid. Last checked {LAST_VERIFIED}.</p></div>}
              {(REPOS[t.id]?.length ?? 0) > 0 && <div className="card" style={{ "--i": 5 } as CSSProperties}><h3>Open-source projects<span className="k oss">GitHub</span></h3><ResList items={REPOS[t.id]} /></div>}
              <div className="card" style={{ "--i": 6 } as CSSProperties}><h3>YouTube<span className="k yt">Watch</span></h3><ResList items={t.yt} yt /></div>
            </div>
            <div className="biz">
              <h3>Business idea</h3>
              <p>{t.biz[0]}</p>
              <div className="row">
                <a className="btn" href={t.biz[1]} target="_blank" rel="noopener noreferrer">{t.biz[2]} ↗</a>
                <a className="btn ghost" href={YT(`${t.key} make money tutorial`)} target="_blank" rel="noopener noreferrer">Revenue ideas on YouTube ↗</a>
              </div>
            </div>
          </>
        )}

        <div className="section-h">
          <h3>My cards</h3>
          <span className="count">{cards.length} saved</span>
          <div className="addwrap" ref={wrap}>
            <button className="btn solid fab" type="button" aria-haspopup="true" aria-expanded={menu} aria-label="Add a card" onClick={() => setMenu((m) => !m)}><span>+</span></button>
            {menu && (
              <div className="menu pane" role="menu">
                <button role="menuitem" type="button" autoFocus onClick={() => pick("note")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16v12l-4 4H4z" /><path d="M16 20v-4h4" /><path d="M8 9h8M8 13h5" /></svg>
                  Note card
                </button>
                <button role="menuitem" type="button" onClick={() => pick("link")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
                  Web link card
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mycards">
          {cards.length ? cards.map((c, i) => <CardView key={c.id} c={c} i={i} fresh={c.id === freshId} onDelete={() => onDeleteCard(c.id)} />) : (
            <div className="empty" style={{ gridColumn: "1/-1" }}>No cards yet. Press + to add a note or attach a web link for {t.key}.</div>
          )}
        </div>
      </div>
    </main>
  );
}
