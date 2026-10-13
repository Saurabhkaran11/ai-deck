"use client";
import { useEffect, useState } from "react";

export type UserCard = { id: string; type: "note" | "link"; title: string; body: string; url: string; at: number };

export function load<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Persisted state that hydrates after mount so server and client HTML match. */
export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setValue(load(key, initial));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep in memory */
    }
  }, [key, value, ready]);
  return [value, setValue] as const;
}

export const safeUrl = (u: string): string | null => {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) ? x.href : null;
  } catch {
    return null;
  }
};
