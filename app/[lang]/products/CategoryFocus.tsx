"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * One place for "which category is the visitor looking at", shared by the hero artwork and the catalog rail.
 * `selected` is the filter (it narrows the ledger and lives in the address bar); `preview` is a transient hover or
 * keyboard-focus hint. The artwork follows `preview ?? selected`. Search and the Tata toggle stay in the ledger.
 */
type Ctx = {
  selected: string | null;
  setSelected: (slug: string | null) => void;
  preview: string | null;
  setPreview: (slug: string | null) => void;
  active: string | null;
};

const FocusContext = createContext<Ctx>({
  selected: null,
  setSelected: () => {},
  preview: null,
  setPreview: () => {},
  active: null,
});

export function CategoryFocusProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const value = useMemo(() => ({ selected, setSelected, preview, setPreview, active: preview ?? selected }), [selected, preview]);
  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export const useCategoryFocus = () => useContext(FocusContext);
