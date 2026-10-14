"use client";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import type { CertItem } from "@/lib/catalog";
import { TOPICS } from "@/lib/data";
import { ISSUERS, Issuer, LAST_VERIFIED, NOTICES } from "@/lib/extra";
import { PLAIN } from "@/lib/plain";

const PROVIDERS: (Issuer | "all")[] = ["all", "aws", "ms", "openai", "hf", "anthropic", "google"];

function CertCard({ c, i }: { c: CertItem; i: number }) {
  return (
    <div className="cert" style={{ "--i": i } as CSSProperties}>
      <span className="tagrow"><span className={`iss iss-${c.issuer}`}>{ISSUERS[c.issuer]}</span><span className={`price ${c.paid ? "paid" : "free"}`}>{c.paid ? "Paid" : "Free"}</span></span>
      <a href={c.url} target="_blank" rel="noopener noreferrer" className="cert-name">{c.name} ↗</a>
      <span className="cert-note">{c.note}</span>
      <span className="cert-topics">
        Helps with: {c.topics.slice(0, 3).map((id, k) => (
          <span key={id}>{k > 0 && ", "}<Link href={`/learn/${id}`}>{PLAIN[id]?.title ?? id}</Link></span>
        ))}{c.topics.length > 3 ? ` +${c.topics.length - 3} more` : ""}
      </span>
    </div>
  );
}

export default function CertBrowser({ items }: { items: CertItem[] }) {
  const [who, setWho] = useState<Issuer | "all">("all");
  const list = items.filter((c) => who === "all" || c.issuer === who);
  const free = list.filter((c) => !c.paid && c.credential);
  const paid = list.filter((c) => c.paid);
  const guides = list.filter((c) => !c.paid && !c.credential);
  const order = TOPICS.find((t) => t.id === "certs")?.path ?? [];

  return (
    <div className="certs">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--teal)" } as CSSProperties} />Certificates & badges</span>
        <h1>Prove what you've learned</h1>
        <p className="lede">{free.length} free certificates and badges from AWS, Microsoft, OpenAI, Hugging Face and more. Add them to your LinkedIn profile as you finish each one.</p>
      </header>

      <div className="cert-intro">
        <div className="pane order">
          <h2>Not sure where to start?</h2>
          <p>Do these free ones in this order:</p>
          <ol className="steps compact">{order.map((s, i) => <li key={s} style={{ "--i": i } as CSSProperties}><span>{s}</span></li>)}</ol>
        </div>
        {NOTICES.certs && <div className="notice" role="note"><b>Skip these</b>{NOTICES.certs}</div>}
      </div>

      <div className="catchips" role="group" aria-label="Filter by provider">
        {PROVIDERS.map((p) => (
          <button key={p} type="button" className={who === p ? "on" : ""} aria-pressed={who === p} onClick={() => setWho(p)}>
            {p === "all" ? "All providers" : ISSUERS[p]}
          </button>
        ))}
      </div>

      {[
        { title: "Free certificates and badges", sub: "Cost nothing. Start here.", rows: free },
        { title: "Paid exams (optional)", sub: "Industry-recognised certifications. Take them after the free courses.", rows: paid },
        { title: "Free official guides", sub: "Learning material from the providers. No certificate, but great preparation.", rows: guides },
      ].map((s) => s.rows.length > 0 && (
        <section key={s.title} className="cert-section">
          <div className="tool-section-head"><h2>{s.title} <span className="count">{s.rows.length}</span></h2><p>{s.sub}</p></div>
          <div className="cert-grid">{s.rows.map((c, i) => <CertCard key={c.name + c.url} c={c} i={i} />)}</div>
        </section>
      ))}
      <p className="verified">Prices and availability last checked {LAST_VERIFIED}. OpenAI Academy gives completion certificates, which are not formal OpenAI certifications.</p>
    </div>
  );
}
