"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LINES, TOPICS, Topic } from "@/lib/data";
import { UserCard, safeUrl, usePersisted } from "@/lib/storage";
import Sidebar from "./Sidebar";
import Detail from "./Detail";
import Modal from "./Modal";

type ModalState = null | { kind: "note" | "link" } | { kind: "learning" };

const withHttps = (u: string) => (u && !/^https?:\/\//i.test(u) ? "https://" + u : u);

export default function AIDeck() {
  const [custom, setCustom] = usePersisted<Topic[]>("aideck.custom", []);
  const [cards, setCards] = usePersisted<Record<string, UserCard[]>>("aideck.cards", {});
  const [current, setCurrent] = usePersisted<string>("aideck.current", "mcp");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const [freshId, setFreshId] = useState<string | null>(null);

  const topics = useMemo(() => TOPICS.concat(custom), [custom]);
  const topic = topics.find((t) => t.id === current) ?? TOPICS[0];
  const myCards = cards[topic.id] ?? [];

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const select = (id: string) => {
    setFreshId(null);
    setCurrent(id);
    if (window.matchMedia("(max-width:820px)").matches) {
      document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const closeModal = useCallback(() => setModal(null), []);

  const saveCard = (type: "note" | "link") => (fd: FormData) => {
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();
    let url = withHttps(String(fd.get("url") ?? "").trim());
    if (type === "note" && !title && !body) return "Add a title or some note text.";
    if (type === "link") {
      const ok = safeUrl(url);
      if (!ok) return "Enter a full web address, like https://example.com.";
      url = ok;
    }
    const card: UserCard = { id: Date.now().toString(36), type, title, body, url: type === "link" ? url : "", at: Date.now() };
    setFreshId(card.id);
    setCards((c) => ({ ...c, [topic.id]: [card, ...(c[topic.id] ?? [])] }));
    setToast(type === "note" ? "Note added" : "Link attached");
  };

  const saveLearning = (fd: FormData) => {
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return "Give the learning a topic name.";
    const raw = withHttps(String(fd.get("url") ?? "").trim());
    const url = raw ? safeUrl(raw) : "";
    if (raw && !url) return "That link isn't a valid web address.";
    const id = "c-" + Date.now().toString(36);
    const t: Topic = {
      id, custom: true, line: String(fd.get("line") || "mine"), pre: "", key: title, post: "",
      summary: String(fd.get("summary") ?? "").trim(),
      concepts: String(fd.get("tags") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      url: url || "", path: [], free: [], paid: [], certs: [], yt: [], biz: ["", "", ""],
    };
    setCustom((c) => [...c, t]);
    setToast("Learning added");
    select(id);
  };

  const deleteLearning = () => {
    setCustom((c) => c.filter((x) => x.id !== topic.id));
    setCards((c) => { const n = { ...c }; delete n[topic.id]; return n; });
    setCurrent("mcp");
    setToast("Learning deleted");
  };

  return (
    <>
      <div className="mesh" aria-hidden="true" />
      <div className="app">
        <Sidebar topics={topics} current={topic.id} query={query} onQuery={setQuery} onSelect={select} onAdd={() => setModal({ kind: "learning" })} />
        <Detail
          topic={topic}
          cards={myCards}
          freshId={freshId}
          onNewCard={(kind) => setModal({ kind })}
          onDeleteCard={(id) => { setCards((c) => ({ ...c, [topic.id]: (c[topic.id] ?? []).filter((x) => x.id !== id) })); setToast("Card deleted"); }}
          onDeleteLearning={deleteLearning}
        />
      </div>

      {modal?.kind === "note" && (
        <Modal onClose={closeModal} onSubmit={saveCard("note")}>
          <h3>New note card</h3><p className="hint">Saved under {topic.key}.</p>
          <div className="field"><label htmlFor="n-title">Title</label><input id="n-title" name="title" maxLength={120} placeholder="e.g. Key idea from the lecture" /></div>
          <div className="field"><label htmlFor="n-body">Note</label><textarea id="n-body" name="body" maxLength={4000} placeholder="What did you learn?" /></div>
        </Modal>
      )}
      {modal?.kind === "link" && (
        <Modal onClose={closeModal} onSubmit={saveCard("link")}>
          <h3>Attach a web link</h3><p className="hint">Saved under {topic.key}.</p>
          <div className="field"><label htmlFor="l-url">URL</label><input id="l-url" name="url" type="url" placeholder="https://…" /></div>
          <div className="field"><label htmlFor="l-title">Title</label><input id="l-title" name="title" maxLength={120} placeholder="Optional" /></div>
          <div className="field"><label htmlFor="l-body">Why it matters</label><textarea id="l-body" name="body" maxLength={1000} style={{ minHeight: 70 }} placeholder="Optional" /></div>
        </Modal>
      )}
      {modal?.kind === "learning" && (
        <Modal onClose={closeModal} onSubmit={saveLearning}>
          <h3>Add a learning</h3><p className="hint">It appears under My Learnings, or on the line you pick.</p>
          <div className="field"><label htmlFor="a-title">Topic</label><input id="a-title" name="title" maxLength={80} placeholder="e.g. Prompt caching" /></div>
          <div className="field"><label htmlFor="a-line">Line</label>
            <select id="a-line" name="line" defaultValue="mine">{LINES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
          </div>
          <div className="field"><label htmlFor="a-sum">Summary</label><textarea id="a-sum" name="summary" maxLength={1500} style={{ minHeight: 80 }} placeholder="What is it and why does it matter?" /></div>
          <div className="field"><label htmlFor="a-tags">Key concepts</label><input id="a-tags" name="tags" placeholder="Comma separated" /></div>
          <div className="field"><label htmlFor="a-url">Main link</label><input id="a-url" name="url" type="url" placeholder="https://… (optional)" /></div>
        </Modal>
      )}
      {toast && <div key={toast} className="toast" role="status">{toast}</div>}
    </>
  );
}
