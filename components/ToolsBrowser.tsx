"use client";
import { CSSProperties, useMemo, useState } from "react";
import { LAST_VERIFIED, TOOL_GROUPS, Tool } from "@/lib/extra";
import { Icon, ToolCard } from "./Bits";

const PRICE = [
  { id: "any", label: "Any price" },
  { id: "free", label: "Free" },
  { id: "freemium", label: "Free to start" },
  { id: "paid", label: "Paid" },
] as const;
type PriceId = (typeof PRICE)[number]["id"];

/* Who each category is for, in plain words. */
const FOR: Record<string, string> = {
  "t-chat": "Everyone: ask questions, write, summarise and brainstorm.",
  "t-productivity": "Everyone: notes, research, slides and meetings.",
  "t-media": "Creators: make images, videos, voiceovers and music.",
  "t-automation": "Business owners: connect your apps and automate tasks without code.",
  "t-browser": "Everyone: AI that clicks and browses websites for you.",
  "t-coding": "Builders: write and fix software with AI help.",
  "t-models": "Builders: AI models you can download and run yourself.",
  "t-frameworks": "Developers: code libraries for building AI agents.",
  "t-protocols": "Developers: standards that connect AI to apps and other agents.",
  "t-vector": "Developers: databases that search by meaning.",
  "t-evals": "Developers: test and monitor AI apps.",
  "t-finetune": "Developers: train models on your own examples.",
  "t-inference": "Developers: run models fast or on your own computer.",
  "t-cloud": "Companies: AI platforms from Amazon, Microsoft, Google and others.",
};
/* Everyday categories first, developer categories after. */
const ORDER = ["t-chat", "t-productivity", "t-media", "t-automation", "t-browser", "t-coding", "t-models", "t-frameworks", "t-protocols", "t-vector", "t-evals", "t-finetune", "t-inference", "t-cloud"];
const GROUPS = ORDER.map((id) => TOOL_GROUPS.find((g) => g.id === id)!).filter(Boolean);
const label = (g: (typeof GROUPS)[number]) => `${g.key} ${g.post}`.replace(/^AI /, "AI ");

export default function ToolsBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [price, setPrice] = useState<PriceId>("any");
  const [onlyNew, setOnlyNew] = useState(false);

  const match = (tool: Tool) => {
    const [name, , , kind, isNew, desc] = tool;
    if (onlyNew && !isNew) return false;
    if (price === "free" && !(kind === "free" || kind === "oss")) return false;
    if (price === "freemium" && kind !== "freemium") return false;
    if (price === "paid" && kind !== "paid") return false;
    const s = q.trim().toLowerCase();
    return !s || `${name} ${desc}`.toLowerCase().includes(s);
  };

  const sections = useMemo(
    () => GROUPS.filter((g) => cat === "all" || g.id === cat).map((g) => ({ g, tools: g.tools.filter(match) })).filter((x) => x.tools.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, cat, price, onlyNew],
  );
  const total = sections.reduce((n, s) => n + s.tools.length, 0);
  const filtered = q || price !== "any" || onlyNew || cat !== "all";

  return (
    <div className="toolsbrowser">
      <header className="page-head">
        <span className="eyebrow"><i style={{ "--c": "var(--orange)" } as CSSProperties} />AI tools directory</span>
        <h1>Find the right AI tool</h1>
        <p className="lede">Search {GROUPS.reduce((n, g) => n + g.tools.length, 0)} tools in {GROUPS.length} categories. Everyday tools are listed first; developer tools come after.</p>
      </header>

      <div className="filters pane">
        <label className="search big">
          {Icon.search}
          <input id="tool-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools, e.g. “video”, “notes”, “Claude”" aria-label="Search tools" />
        </label>
        <div className="filter-row">
          <div className="seg" role="group" aria-label="Price">
            {PRICE.map((p) => <button key={p.id} type="button" className={price === p.id ? "on" : ""} aria-pressed={price === p.id} onClick={() => setPrice(p.id)}>{p.label}</button>)}
          </div>
          <button type="button" className={`toggle${onlyNew ? " on" : ""}`} aria-pressed={onlyNew} onClick={() => setOnlyNew((v) => !v)}>New in 2025–26</button>
          <label className="select">
            <span className="sr">Category</span>
            <select id="tool-cat" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">All categories</option>
              {GROUPS.map((g) => <option key={g.id} value={g.id}>{label(g)}</option>)}
            </select>
          </label>
        </div>
        <div className="catchips" role="group" aria-label="Category shortcuts">
          <button type="button" className={cat === "all" ? "on" : ""} onClick={() => setCat("all")}>All</button>
          {GROUPS.slice(0, 6).map((g) => <button key={g.id} type="button" className={cat === g.id ? "on" : ""} onClick={() => setCat(g.id)}>{label(g)}</button>)}
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {total} {total === 1 ? "tool" : "tools"}{filtered ? " match" : ""}
        {filtered && <button type="button" className="textlink" onClick={() => { setQ(""); setCat("all"); setPrice("any"); setOnlyNew(false); }}>Clear filters</button>}
      </p>

      {sections.map(({ g, tools }) => (
        <section key={g.id} className="tool-section">
          <div className="tool-section-head">
            <h2>{label(g)}</h2>
            <p>{FOR[g.id]}</p>
          </div>
          <div className="tool-grid">{tools.map((tool, i) => <ToolCard key={tool[0] + tool[1]} tool={tool} i={i} />)}</div>
        </section>
      ))}
      {!total && <p className="empty">No tools match. Try a different word or clear the filters.</p>}
      <p className="verified">Prices are US list prices, last checked {LAST_VERIFIED}. Always check the tool's own website before paying.</p>
    </div>
  );
}
