import type { Metadata } from "next";
import Link from "next/link";
import { CSSProperties } from "react";
import { GLOSSARY } from "@/lib/plain";

export const metadata: Metadata = { title: "AI glossary" };

export default function Page() {
  const terms = [...GLOSSARY].sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div className="glossary">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--violet)" } as CSSProperties} />Jargon buster</span>
        <h1>AI words, in plain English</h1>
        <p className="lede">The {terms.length} terms you'll see most often while learning AI. Come back here whenever a word trips you up.</p>
      </header>
      <dl className="gloss-grid full">
        {terms.map(([term, def], i) => (
          <div key={term} id={term.toLowerCase().replace(/\s+/g, "-")} style={{ "--i": i } as CSSProperties}>
            <dt>{term}</dt>
            <dd>{def}</dd>
          </div>
        ))}
      </dl>
      <p className="center-link"><Link href="/learn" className="btn solid">Back to the learning path</Link></p>
    </div>
  );
}
