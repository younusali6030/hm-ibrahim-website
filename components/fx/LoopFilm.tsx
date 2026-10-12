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
    let loaded = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) {
            loaded = true;
            v.src = src;
            v.load();
          }
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div ref={wrap} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      <video ref={video} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline preload="none" tabIndex={-1} />
    </div>
  );
}
