"use client";

import { useEffect } from "react";
import { trackCallClick, trackDirectionsClick, trackWhatsAppClick } from "@/lib/analytics";

/** Which kind of contact link is this href, if any? Plain WhatsApp share links (no shop number) are not leads. */
function classify(href: string): "call" | "whatsapp" | "directions" | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "call";
  try {
    const u = new URL(h, "https://x.invalid");
    if (u.hostname === "wa.me") return /^\/\d{8,}/.test(u.pathname) ? "whatsapp" : null;
    if (u.hostname.endsWith("whatsapp.com")) return u.searchParams.get("phone") ? "whatsapp" : null;
    if ((u.hostname.endsWith("google.com") || u.hostname === "maps.app.goo.gl") && /\/maps|goo\.gl/.test(h)) return "directions";
  } catch {
    /* not a URL we understand */
  }
  return null;
}

/**
 * One delegated listener for the whole site: any anchor that dials, opens WhatsApp or opens the map is
 * reported to GA4, whichever component rendered it. Source is the nearest data-track attribute, else the path.
 * Links that already report themselves are not double counted (see DEDUPE_MS in lib/analytics).
 * Mounted from the Footer so it needs no layout change.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!el) return;
      const kind = classify(el.getAttribute("href") ?? "");
      if (!kind) return;
      const source = el.closest("[data-track]")?.getAttribute("data-track") || window.location.pathname;
      if (kind === "call") trackCallClick(source);
      else if (kind === "whatsapp") trackWhatsAppClick(source);
      else trackDirectionsClick(source);
    };
    document.addEventListener("click", onClick, { capture: false });
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
