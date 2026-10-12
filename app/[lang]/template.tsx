"use client";

import { useEffect } from "react";

/** Set once the first page has been hydrated; every later mount of this template is a client-side navigation. */
let hydrated = false;

/**
 * Re-mounts on every navigation, so each page eases in the same way.
 * The very first load is NOT animated: the fade starts at opacity 0, which held the hero image (the LCP element)
 * back by the length of the animation. Server HTML and the hydration render both have no class, so they match.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hydrated;
  useEffect(() => {
    hydrated = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
