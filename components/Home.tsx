"use client";
import Link from "next/link";
import { CSSProperties } from "react";
import { TOPICS } from "@/lib/data";
import { GLOSSARY, LEVELS } from "@/lib/plain";
import { PATH_IDS, nameOf } from "@/lib/paths";
import { useStore } from "@/lib/store";
import { Icon } from "./Bits";
import { PROJECTS } from "@/lib/projects";
import { TRACKS } from "@/lib/careers";

type Props = { toolCount: number; freeCertCount: number };

export default function Home({ toolCount, freeCertCount }: Props) {
  const { done, ready } = useStore();
  const doneCount = PATH_IDS.filter((id) => done[id]).length;
  const nextId = PATH_IDS.find((id) => !done[id]);
  const next = nextId ? TOPICS.find((t) => t.id === nextId) : undefined;
  const started = ready && doneCount > 0;

  return (
    <div className="home">
      <section className="hero-home">
        <div className="hero-copy">
          <span className="eyebrow"><i style={{ "--c": "var(--green)" } as CSSProperties} />Free · plain English · no coding needed to start</span>
          <h1>Learn AI <em>step by step</em>, one stop at a time.</h1>
          <p className="lede">
            A guided path from “what is AI?” to building your own AI tools. Every topic explains things in simple words,
            then points you to the best free courses, videos and certificates.
          </p>
          <div className="cta-row">
            {started && next ? (
              <Link href={`/learn/${next.id}`} className="btn solid lg">Continue: {nameOf(next)} {Icon.arrow}</Link>
            ) : (
              <Link href="/learn/ai-intro" className="btn solid lg">Start with lesson 1 {Icon.arrow}</Link>
            )}
            <Link href="/learn" className="btn lg">See the full path</Link>
          </div>
          {started && (
            <div className="mini-progress" aria-label={`${doneCount} of ${PATH_IDS.length} topics complete`}>
              <div className="bar"><span style={{ width: `${(doneCount / PATH_IDS.length) * 100}%` }} /></div>
              <small>{doneCount} of {PATH_IDS.length} topics complete</small>
            </div>
          )}
        </div>

        <div className="hero-map pane" aria-label="The four levels of the learning path">
          {LEVELS.map((l, li) => (
            <Link key={l.n} href={`/learn#level-${l.n}`} className="map-line" style={{ "--c": l.color, "--li": li } as CSSProperties}>
              <span className="map-label"><b>Level {l.n}</b>{l.name}</span>
              <span className="map-track">
                {l.topics.map((id, i) => (
                  <span key={id} className={`map-dot${ready && done[id] ? " done" : ""}`} style={{ "--i": i } as CSSProperties} />
                ))}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="stats" aria-label="What's inside">
        <div><b>{PATH_IDS.length}</b><span>topics in {LEVELS.length} levels</span></div>
        <div><b>{freeCertCount}+</b><span>free certificates</span></div>
        <div><b>{toolCount}+</b><span>AI tools compared</span></div>
        <div><b>$0</b><span>to get started</span></div>
      </section>

      <section className="block">
        <h2>Where would you like to start?</h2>
        <div className="paths">
          <Link href="/learn#level-1" className="path-card" style={{ "--c": "var(--green)" } as CSSProperties}>
            <span className="path-kicker">I'm new to AI</span>
            <b>Start from zero</b>
            <p>What AI is and how it learns, explained simply, then how chatbots work and how to ask them well.</p>
            <span className="go">Go to Level 1 {Icon.arrow}</span>
          </Link>
          <Link href="/tools" className="path-card" style={{ "--c": "var(--orange)" } as CSSProperties}>
            <span className="path-kicker">I want AI to help my work</span>
            <b>Find the right AI tool</b>
            <p>Compare {toolCount}+ tools for writing, images, coding and automation, with free options first.</p>
            <span className="go">Browse AI tools {Icon.arrow}</span>
          </Link>
          <Link href="/learn#level-4" className="path-card" style={{ "--c": "var(--blue)" } as CSSProperties}>
            <span className="path-kicker">I want to build with AI</span>
            <b>Make your own AI apps</b>
            <p>Agents, document search, testing and custom models, with hands-on courses and code.</p>
            <span className="go">Go to Level 4 {Icon.arrow}</span>
          </Link>
          <Link href="/learn#level-6" className="path-card" style={{ "--c": "var(--violet)" } as CSSProperties}>
            <span className="path-kicker">I lead a team or business</span>
            <b>Use AI safely and profitably</b>
            <p>Responsible AI, security, the law, and how to find AI projects that pay off.</p>
            <span className="go">Go to Level 6 {Icon.arrow}</span>
          </Link>
        </div>
      </section>

      <section className="block">
        <h2>How AI Deck works</h2>
        <ol className="how">
          <li><b>Pick a topic</b><span>Follow the levels in order, or jump to whatever interests you.</span></li>
          <li><b>Read it in simple words</b><span>Every topic starts with a short, jargon-free explanation and why it matters.</span></li>
          <li><b>Learn from the best free resources</b><span>Step-by-step plan, free courses and videos, all in one place.</span></li>
          <li><b>Earn a certificate and track progress</b><span>Mark topics complete and save notes as you go. Everything stays on your device.</span></li>
        </ol>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Aim for a specific AI job</h2>
          <Link href="/careers" className="textlink">See all {TRACKS.length} job tracks {Icon.arrow}</Link>
        </div>
        <div className="featured-proj">
          {["ai-engineer", "mlops-engineer", "ai-literacy"].map((id, i) => {
            const t = TRACKS.find((x) => x.id === id)!;
            return (
              <Link key={id} href={`/careers#${id}`} className="fp" style={{ "--i": i } as CSSProperties}>
                <span className="fp-cat">{t.group}</span>
                <b>{t.role}</b>
                <span className="fp-rev">{t.steps.length} steps · {t.steps.filter((x) => /^free/i.test(x[3])).length} free</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Turn what you learn into income</h2>
          <Link href="/projects" className="textlink">See all {PROJECTS.length} project ideas {Icon.arrow}</Link>
        </div>
        <div className="featured-proj">
          {["speed-to-lead", "summariser-ext", "repurposer"].map((id, i) => {
            const p = PROJECTS.find((x) => x.id === id)!;
            return (
              <Link key={id} href={`/projects#${id}`} className="fp" style={{ "--i": i } as CSSProperties}>
                <span className="fp-cat">{p.cat}</span>
                <b>{p.title}</b>
                <span className="fp-rev">{p.revenue.split(";")[0]}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>AI words, explained</h2>
          <Link href="/glossary" className="textlink">See all {GLOSSARY.length} terms {Icon.arrow}</Link>
        </div>
        <dl className="gloss-grid">
          {GLOSSARY.slice(0, 6).map(([term, def], i) => (
            <div key={term} style={{ "--i": i } as CSSProperties}><dt>{term}</dt><dd>{def}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
