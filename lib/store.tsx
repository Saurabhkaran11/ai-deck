"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { TOPICS, Topic } from "./data";
import { PATH_IDS, nameOf } from "./paths";
import { UserCard, safeUrl, usePersisted } from "./storage";

type ModalState = null | { kind: "note" | "link"; topicId: string | null } | { kind: "learning" };

type Store = {
  ready: boolean;
  custom: Topic[];
  cards: Record<string, UserCard[]>;
  done: Record<string, boolean>;
  freshId: string | null;
  toggleDone: (id: string) => void;
  deleteCard: (topicId: string, id: string) => void;
  deleteLearning: (id: string) => void;
  openCard: (kind: "note" | "link", topicId: string | null) => void;
  openLearning: () => void;
  toast: (msg: string) => void;
  getTopic: (id: string) => Topic | undefined;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
};


const withHttps = (u: string) => (u && !/^https?:\/\//i.test(u) ? "https://" + u : u);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = usePersisted<Topic[]>("aideck.custom", []);
  const [cards, setCards] = usePersisted<Record<string, UserCard[]>>("aideck.cards", {});
  const [done, setDone] = usePersisted<Record<string, boolean>>("aideck.done", {});
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [freshId, setFreshId] = useState<string | null>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2400);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const getTopic = useCallback((id: string) => TOPICS.find((t) => t.id === id) ?? custom.find((t) => t.id === id), [custom]);
  const closeModal = useCallback(() => setModal(null), []);

  const allTopics = useMemo(() => [...PATH_IDS.map((id) => TOPICS.find((t) => t.id === id)!).filter(Boolean), ...custom], [custom]);

  const saveCard = (type: "note" | "link", fixedTopic: string | null) => (fd: FormData) => {
    const topicId = fixedTopic ?? String(fd.get("topic") ?? "");
    if (!topicId) return "Pick the topic this belongs to.";
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();
    let url = withHttps(String(fd.get("url") ?? "").trim());
    if (type === "note" && !title && !body) return "Write a title or some text for your note.";
    if (type === "link") {
      const ok = safeUrl(url);
      if (!ok) return "Paste a full web address, like https://example.com.";
      url = ok;
    }
    const card: UserCard = { id: Date.now().toString(36), type, title, body, url: type === "link" ? url : "", at: Date.now() };
    setFreshId(card.id);
    setCards((c) => ({ ...c, [topicId]: [card, ...(c[topicId] ?? [])] }));
    setToastMsg(type === "note" ? "Note saved" : "Link saved");
  };

  const saveLearning = (fd: FormData) => {
    const title = String(fd.get("title") ?? "").trim();
    if (!title) return "Give your topic a name.";
    const raw = withHttps(String(fd.get("url") ?? "").trim());
    const url = raw ? safeUrl(raw) : "";
    if (raw && !url) return "That link isn't a valid web address.";
    const t: Topic = {
      id: "c-" + Date.now().toString(36), custom: true, line: "mine", pre: "", key: title, post: "",
      summary: String(fd.get("summary") ?? "").trim(), concepts: [], url: url || "",
      path: [], free: [], paid: [], certs: [], yt: [], biz: ["", "", ""],
    };
    setCustom((c) => [...c, t]);
    setToastMsg("Topic added to My Notes");
  };

  const store: Store = {
    ready, custom, cards, done, freshId, getTopic,
    toggleDone: (id) => {
      const next = !done[id];
      setDone((d) => ({ ...d, [id]: next }));
      setToastMsg(next ? "Marked as complete" : "Marked as not complete");
    },
    deleteCard: (topicId, id) => {
      setCards((c) => ({ ...c, [topicId]: (c[topicId] ?? []).filter((x) => x.id !== id) }));
      setToastMsg("Deleted");
    },
    deleteLearning: (id) => {
      setCustom((c) => c.filter((x) => x.id !== id));
      setCards((c) => { const n = { ...c }; delete n[id]; return n; });
      setToastMsg("Topic deleted");
    },
    openCard: (kind, topicId) => setModal({ kind, topicId }),
    openLearning: () => setModal({ kind: "learning" }),
    toast: setToastMsg,
  };

  const topicName = (id: string | null) => { const t = id ? getTopic(id) : undefined; return t ? nameOf(t) : ""; };
  const topicPicker = (
    <div className="field">
      <label htmlFor="m-topic">Topic</label>
      <select id="m-topic" name="topic" defaultValue="">
        <option value="" disabled>Choose a topic…</option>
        {allTopics.map((t) => <option key={t.id} value={t.id}>{nameOf(t)}</option>)}
      </select>
    </div>
  );

  return (
    <Ctx.Provider value={store}>
      {children}
      {modal?.kind === "note" && (
        <Modal onClose={closeModal} onSubmit={saveCard("note", modal.topicId)}>
          <h3>Write a note</h3>
          <p className="hint">{modal.topicId ? `Saved under “${topicName(modal.topicId)}”. Only you can see it, on this device.` : "Only you can see it, on this device."}</p>
          {!modal.topicId && topicPicker}
          <div className="field"><label htmlFor="n-title">Title</label><input id="n-title" name="title" maxLength={120} placeholder="e.g. Key idea from the video" /></div>
          <div className="field"><label htmlFor="n-body">Note</label><textarea id="n-body" name="body" maxLength={4000} placeholder="What did you learn?" /></div>
        </Modal>
      )}
      {modal?.kind === "link" && (
        <Modal onClose={closeModal} onSubmit={saveCard("link", modal.topicId)}>
          <h3>Save a useful link</h3>
          <p className="hint">{modal.topicId ? `Saved under “${topicName(modal.topicId)}”.` : "Keep articles, videos or courses you want to come back to."}</p>
          {!modal.topicId && topicPicker}
          <div className="field"><label htmlFor="l-url">Web address</label><input id="l-url" name="url" type="url" placeholder="https://…" /></div>
          <div className="field"><label htmlFor="l-title">Title</label><input id="l-title" name="title" maxLength={120} placeholder="Optional" /></div>
          <div className="field"><label htmlFor="l-body">Why it's useful</label><textarea id="l-body" name="body" maxLength={1000} style={{ minHeight: 70 }} placeholder="Optional" /></div>
        </Modal>
      )}
      {modal?.kind === "learning" && (
        <Modal onClose={closeModal} onSubmit={saveLearning}>
          <h3>Add your own topic</h3>
          <p className="hint">Track something you're learning that isn't on the path yet.</p>
          <div className="field"><label htmlFor="a-title">Topic name</label><input id="a-title" name="title" maxLength={80} placeholder="e.g. AI for email marketing" /></div>
          <div className="field"><label htmlFor="a-sum">What is it about?</label><textarea id="a-sum" name="summary" maxLength={1500} style={{ minHeight: 80 }} placeholder="A sentence or two, in your own words" /></div>
          <div className="field"><label htmlFor="a-url">Main link</label><input id="a-url" name="url" type="url" placeholder="https://… (optional)" /></div>
        </Modal>
      )}
      {toastMsg && <div key={toastMsg} className="toast" role="status">{toastMsg}</div>}
    </Ctx.Provider>
  );
}
