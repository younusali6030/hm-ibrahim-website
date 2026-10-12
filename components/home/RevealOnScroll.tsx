"use client";

import { useEffect } from "react";

/**
 * Adds .in to every [data-reveal] element once it reaches the lower part of the screen.
 * Position based (not observer based), so a fast flick or a jump link never leaves a blank patch behind.
 */
export function RevealOnScroll() {
  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach((e) => e.classList.add("in"));
      return;
    }
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.94;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("in");
          return false;
        }
        return true;
      });
      if (pending.length === 0) detach();
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const detach = () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    on();
    // Late-mounting content (client components) is picked up on the next pass.
    const t = window.setTimeout(() => {
      pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
      on();
    }, 600);
    return () => {
      detach();
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
