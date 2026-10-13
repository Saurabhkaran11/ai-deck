"use client";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  onClose: () => void;
  /** Return an error message to keep the modal open, or nothing to close it. */
  onSubmit: (data: FormData) => string | void;
};

export default function Modal({ children, onClose, onSubmit }: Props) {
  const [err, setErr] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>("input,textarea,select")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = onSubmit(new FormData(e.currentTarget));
    if (msg) setErr(msg);
    else onClose();
  };

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form ref={formRef} className="pane modal" noValidate onSubmit={submit}>
        {children}
        <p className="err" role="alert">{err}</p>
        <div className="actions">
          <button className="btn ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn solid" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
