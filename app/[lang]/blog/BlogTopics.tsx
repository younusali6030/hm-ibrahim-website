"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * The topic the reader is looking at, shared by the hero desk, the topic chips and the guide library.
 * `selected` filters the library; `preview` is a hover or focus hint that only moves the artwork.
 */
type Ctx = {
  selected: string | null;
  setSelected: (t: string | null) => void;
  preview: string | null;
  setPreview: (t: string | null) => void;
  active: string | null;
};

const TopicContext = createContext<Ctx>({ selected: null, setSelected: () => {}, preview: null, setPreview: () => {}, active: null });

export function BlogTopicProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const value = useMemo(() => ({ selected, setSelected, preview, setPreview, active: preview ?? selected }), [selected, preview]);
  return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>;
}

export const useBlogTopic = () => useContext(TopicContext);

/** Which part of the inspection desk a topic belongs to, in English or Hindi. Other topics use article artwork. */
export function deskKey(topic: string | null): "wire" | "mesh" | "steel" | "sheet" | null {
  if (!topic) return null;
  const t = topic.toLowerCase();
  if (t.includes("mesh") || t.includes("जाली") || t.includes("मेश")) return "mesh";
  if (t.includes("structural") || t.includes("स्ट्रक्चरल") || t.includes("steel") || t.includes("स्टील")) return "steel";
  if (t.includes("sheet") || t.includes("शीट")) return "sheet";
  if (t === "wire" || t.includes("तार")) return "wire";
  return null;
}
