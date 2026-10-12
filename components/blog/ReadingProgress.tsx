"use client";

import { useEffect, useRef } from "react";

/** A thin bar under the navbar that fills as the article is read. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);
  return (
    <span aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/5 print:hidden">
      <span ref={bar} className="block h-full origin-left scale-x-0 bg-primary" />
    </span>
  );
}
