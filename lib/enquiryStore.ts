"use client";

import { useSyncExternalStore } from "react";
import { enquiryText, enquiryTextHi, quoteHrefFor, type EnquiryContext } from "./enquiry";

/* A tiny external store: the product page publishes the current selection, the global mobile bar reads it. */
let current: EnquiryContext | null = null;
const listeners = new Set<() => void>();

export function setEnquiryContext(c: EnquiryContext | null): void {
  current = c;
  listeners.forEach((l) => l());
}
export function subscribeEnquiry(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getEnquiryContext(): EnquiryContext | null {
  return current;
}

/** Client hook: the quote link and WhatsApp text for the current page (generic when no product is open). */
export function useEnquiryLinks(lang: "en" | "hi", fallbackWa: string): { quoteHref: string; waText: string; hasContext: boolean } {
  const ctx = useSyncExternalStore(subscribeEnquiry, getEnquiryContext, () => null);
  if (!ctx) return { quoteHref: "/contact", waText: fallbackWa, hasContext: false };
  return {
    quoteHref: quoteHrefFor(ctx),
    waText: lang === "hi" ? `नमस्ते, ${enquiryTextHi(ctx)}। कृपया भाव और उपलब्धता बताइए।` : `Hi, ${enquiryText(ctx)}. Please share the price and availability.`,
    hasContext: true,
  };
}
