"use client";

import { useEffect } from "react";

/**
 * Turns on scroll reveals for every `[data-reveal]` element on the page. Content is fully visible without this
 * (no JS, reduced motion): the hidden starting state only applies once `ab-reveal` is set on the root.
 */
export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    // Anything already on screen stays as it is; only what is still below the fold animates in.
    for (const el of els) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
      else io.observe(el);
    }
    root.classList.add("ab-reveal");
    return () => {
      io.disconnect();
      root.classList.remove("ab-reveal");
    };
  }, []);
  return null;
}
