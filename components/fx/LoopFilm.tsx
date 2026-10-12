"use client";

import { useEffect, useRef } from "react";
import { motionAllowed } from "./gl";

/**
 * A seamless 8-second barbed-wire coil, rendered offline (three.js, one revolution, first frame = last frame).
 * The poster is the whole effect when motion is off; the film is never fetched until it is on screen.
 */
export function LoopFilm({
  src = "/fx/coil-loop.mp4",
  poster = "/fx/coil-poster.jpg",
  className = "",
}: {
  src?: string;
  poster?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const v = video.current;
    if (!el || !v || !motionAllowed()) return;
    let go = false;
    let visible = false;
    let loaded = false;
    const sync = () => {
      if (!go) return;
      if (visible) {
        if (!loaded) {
          loaded = true;
          v.src = src;
          v.load();
        }
        v.play().catch(() => {});
      } else if (loaded) v.pause();
    };
    // Poster first: the film waits for the first touch, scroll or key, or ten idle seconds after load,
    // so its first frame never competes for LCP.
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    let timer = 0;
    const start = () => {
      if (go) return;
      go = true;
      window.clearTimeout(timer);
      events.forEach((t) => window.removeEventListener(t, start));
      sync();
    };
    events.forEach((t) => window.addEventListener(t, start, { passive: true }));
    const arm = () => {
      timer = window.setTimeout(start, 10000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
      events.forEach((t) => window.removeEventListener(t, start));
    };
  }, [src]);

  return (
    <div ref={wrap} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Above the fold on its page: eager, high priority, AVIF first. */}
      <picture>
        <source type="image/avif" srcSet={poster.replace(/\.jpg$/, ".avif")} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" decoding="async" />
      </picture>
      <video ref={video} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline preload="none" tabIndex={-1} />
    </div>
  );
}
