"use client";

import { useEffect, useRef, useState } from "react";
import { motionAllowed } from "./gl";
import { whenEngaged } from "./whenEngaged";

/**
 * The barbed wire and chain link scene behind the Brands header, drawn live with three.js.
 *
 * The poster is a render of the same scene from the same starting camera, so it is the loading state,
 * the reduced-motion and Save-Data picture, and the no-WebGL picture. three.js is fetched only when motion
 * is allowed and the page has finished loading; the canvas fades in over the poster without moving anything.
 */
export function WireHero({
  poster = "/fx/wire",
  className = "",
}: {
  /** Base path of the poster set: `${poster}-wide.avif|jpg` and `${poster}-tall.avif|jpg`. */
  poster?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv || !motionAllowed()) return;
    let disposed = false;
    let scene: import("./wire/scene").WireScene | null = null;
    let io: IntersectionObserver | null = null;
    let visible = true;
    let tabVisible = !document.hidden;
    let idle = 0;
    let timer = 0;

    const sync = () => {
      if (!scene) return;
      if (visible && tabVisible) scene.start();
      else scene.stop();
    };
    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };

    const boot = async () => {
      if (disposed) return;
      try {
        const { createWireScene } = await import("./wire/scene");
        if (disposed) return;
        scene = createWireScene({ canvas: cv, host });
        scene.onFirstFrame(() => !disposed && setLive(true));
        if (process.env.NODE_ENV !== "production" && location.search.includes("wire-debug")) {
          (window as unknown as { __wire?: unknown }).__wire = scene;
        }
        io = new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
            sync();
          },
          { threshold: 0.02 }
        );
        io.observe(host);
        document.addEventListener("visibilitychange", onVisibility);
        sync();
      } catch {
        // No WebGL, or the context could not be created: the poster is the finished picture.
        scene?.dispose();
        scene = null;
      }
    };

    // Starts on the first input, or after 12 s (see whenEngaged): the poster is the finished picture until then.
    let cancelEngaged = () => {};
    const schedule = () => {
      cancelEngaged = whenEngaged(boot);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      cancelEngaged();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      io?.disconnect();
      scene?.dispose();
      scene = null;
    };
  }, []);

  return (
    <div ref={wrap} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <picture>
        <source media="(max-width: 699px)" type="image/avif" srcSet={`${poster}-tall.avif`} />
        <source media="(max-width: 699px)" srcSet={`${poster}-tall.jpg`} />
        <source type="image/avif" srcSet={`${poster}-wide.avif`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${poster}-wide.jpg`}
          alt=""
          width={2400}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "right center" }}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <canvas
        ref={canvas}
        className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ease-out"
        style={{ opacity: live ? 1 : 0 }}
        tabIndex={-1}
      />
    </div>
  );
}
