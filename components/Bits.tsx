"use client";
import { CSSProperties, useEffect, useState } from "react";
import { Res, YT } from "@/lib/data";
import { Badge, ISSUERS, Tool } from "@/lib/extra";
import { KIND_PLAIN } from "@/lib/plain";
import { UserCard, safeUrl } from "@/lib/storage";

export const host = (u: string) => {
  try { return new URL(u).hostname.replace("www.", ""); } catch { return u; }
};

export function LinkList({ items, yt = false }: { items: Res[]; yt?: boolean }) {
  return (
    <ul className="links">
      {items.map(([name, u, note], i) => {
        const isSearch = yt && !/^https?:/.test(u);
        const href = isSearch ? YT(u) : u;
        return (
          <li key={name + u} style={{ "--i": i } as CSSProperties}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <b>{name}</b>
              <span>{note || (isSearch ? `Search YouTube for “${u}”` : host(href))}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function BadgeList({ items }: { items: Badge[] }) {
  const sorted = [...items].sort((a, b) => Number(!!a[4]) - Number(!!b[4]));
  return (
    <ul className="links">
      {sorted.map(([iss, name, url, note, paid], i) => (
        <li key={name + url} style={{ "--i": i } as CSSProperties}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <span className="tagrow"><span className={`iss iss-${iss}`}>{ISSUERS[iss]}</span><span className={`price ${paid ? "paid" : "free"}`}>{paid ? "Paid" : "Free"}</span></span>
            <b>{name}</b>
            <span>{note}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ToolCard({ tool, i }: { tool: Tool; i: number }) {
  const [name, url, price, kind, isNew, desc] = tool;
  const label = KIND_PLAIN[kind];
  return (
    <a className="tool" href={url} target="_blank" rel="noopener noreferrer" style={{ "--i": i } as CSSProperties}>
      <span className="tool-top"><b>{name}</b>{isNew && <span className="newpill">New</span>}</span>
      <span className="tool-desc">{desc}</span>
      <span className="tool-price"><span className={`price ${kind}`}>{label}</span>{price.toLowerCase() === label.toLowerCase() || /^(open-source|free|freemium|paid)$/i.test(price) ? "" : price}</span>
    </a>
  );
}

export function ConfirmButton({ label, confirm, className, onConfirm }: { label: string; confirm: string; className: string; onConfirm: () => void }) {
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

export function NoteCard({ c, i, fresh, topicName, onDelete }: { c: UserCard; i: number; fresh: boolean; topicName?: string; onDelete: () => void }) {
  const u = c.url ? safeUrl(c.url) : null;
  const [leaving, setLeaving] = useState(false);
  const remove = () => {
    setLeaving(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onDelete, reduce ? 0 : 240);
  };
  return (
    <article className={`ucard ${c.type}${fresh ? " fresh" : ""}${leaving ? " leaving" : ""}`} style={{ "--i": i } as CSSProperties}>
      <span className="type">{c.type === "note" ? "Note" : "Link"}{topicName ? ` · ${topicName}` : ""}</span>
      <h4>{c.title || (u ? host(u) : "Untitled")}</h4>
      {c.body && <p>{c.body}</p>}
      {u && <a href={u} target="_blank" rel="noopener noreferrer">{host(u)} ↗</a>}
      <div className="meta">
        <span>{new Date(c.at).toLocaleDateString()}</span>
        <ConfirmButton className="x" label="Delete" confirm="Confirm delete" onConfirm={remove} />
      </div>
    </article>
  );
}

/* Small line icons, drawn with currentColor. */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const Icon = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></svg>,
  learn: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><circle cx="5" cy="18" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M6.5 16.5 10.6 7.6M13.4 7.6l4.1 8.9" /></svg>,
  tools: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  cert: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="m9 13-2 8 5-3 5 3-2-8" /></svg>,
  notes: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M5 3h10l4 4v14H5z" /><path d="M9 11h6M9 15h4" /></svg>,
  projects: <svg width="20" height="20" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" {...P} strokeWidth={3} aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>,
  clock: <svg width="15" height="15" viewBox="0 0 24 24" {...P} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  back: <svg width="16" height="16" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" {...P} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  book: <svg width="16" height="16" viewBox="0 0 24 24" {...P} aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></svg>,
};
