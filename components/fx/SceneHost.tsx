"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useT } from "@/lib/i18n";
import { motionAllowed } from "./gl";
import { whenEngaged } from "./whenEngaged";
import type { SceneController, SceneFactory } from "./three/stage";

type Props = {
  /** Dynamic import of the scene module. Keep it a module-level function so the effect runs once. */
  load: () => Promise<{ default: SceneFactory } | { createScene: SceneFactory }>;
  /** Base path of the poster set: `${poster}.avif` and `${poster}.jpg`, both the same aspect as the artwork box. */
  poster: string;
  /** Poster for narrow layouts (below 1024px), when the artwork box has a different aspect ratio. */
  posterNarrow?: string;
  posterWidth?: number;
  posterHeight?: number;
  posterPosition?: string;
  /** Named part of the scene to emphasise. */
  focus?: string | null;
  /**
   * Per-focus posters (`${base}.avif|jpg`), shown instead of the live canvas when it is not running (reduced
   * motion, Save-Data, no WebGL), so the choice still changes the picture.
   */
  focusPosters?: Record<string, string>;
  /** The scene moves on its own: show the pause control and honour it. */
  continuous?: boolean;
  /** Fires when the live canvas is on screen (true) or the poster is what is showing (false). */
  onLive?: (live: boolean) => void;
  className?: string;
  /** Extra layers drawn above the canvas (shading, captions). */
  children?: React.ReactNode;
};

/**
 * The shared stage for every 3D hero: a poster that is the loading, reduced-motion and no-WebGL picture, and a
 * canvas that fades in over it once three.js has loaded (started on the first input, or after 12 s). The scene pauses off-screen and
 * in a hidden tab, and is disposed (GL context released) when the page unmounts.
 */
export function SceneHost({
  load,
  poster,
  posterNarrow,
  posterWidth = 1500,
  posterHeight = 1200,
  posterPosition = "50% 50%",
  focus = null,
  focusPosters,
  continuous = false,
  onLive,
  className = "",
  children,
}: Props) {
  const t = useT();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctl = useRef<SceneController | null>(null);
  const focusRef = useRef<string | null>(focus);
  const pausedRef = useRef(false);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const onLiveRef = useRef(onLive);
  onLiveRef.current = onLive;

  useEffect(() => {
    focusRef.current = focus;
    ctl.current?.setFocus?.(focus);
  }, [focus]);

  useEffect(() => {
    onLiveRef.current?.(live);
  }, [live]);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv || !motionAllowed()) return;
    let disposed = false;
    let scene: SceneController | null = null;
    let io: IntersectionObserver | null = null;
    let visible = true;
    let tabVisible = !document.hidden;
    let idle = 0;
    let timer = 0;

    const sync = () => {
      if (!scene) return;
      if (visible && tabVisible && !pausedRef.current) scene.start();
      else scene.stop();
    };
    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };
    const onPauseRequest = () => sync();
    host.addEventListener("scene-pause", onPauseRequest);

    const boot = async () => {
      if (disposed) return;
      try {
        const mod = await load();
        if (disposed) return;
        const factory = "default" in mod ? mod.default : mod.createScene;
        scene = factory({ canvas: cv, host });
        ctl.current = scene;
        scene.setFocus?.(focusRef.current);
        scene.onFirstFrame(() => !disposed && setLive(true));
        if (process.env.NODE_ENV !== "production" && location.search.includes("scene-debug")) {
          (window as unknown as { __scene?: unknown }).__scene = scene;
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
        ctl.current = null;
        if (!disposed) setFailed(true);
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
      host.removeEventListener("scene-pause", onPauseRequest);
      window.clearTimeout(timer);
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      io?.disconnect();
      scene?.dispose();
      scene = null;
      ctl.current = null;
    };
    // `load` is a module-level function by contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    ctl.current?.setPaused?.(next);
    wrap.current?.dispatchEvent(new Event("scene-pause"));
  };

  return (
    <div ref={wrap} className={`absolute inset-0 overflow-hidden ${className}`} data-scene-live={live ? "1" : "0"}>
      <picture>
        {posterNarrow && <source media="(max-width: 1023px)" type="image/avif" srcSet={`${posterNarrow}.avif`} />}
        {posterNarrow && <source media="(max-width: 1023px)" srcSet={`${posterNarrow}.jpg`} />}
        <source type="image/avif" srcSet={`${poster}.avif`} />
        <img
          src={`${poster}.jpg`}
          alt=""
          width={posterWidth}
          height={posterHeight}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: posterPosition }}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {focusPosters && focus && focusPosters[focus] && !live && (
        <picture key={focus}>
          <source type="image/avif" srcSet={`${focusPosters[focus]}.avif`} />
          <img
            src={`${focusPosters[focus]}.jpg`}
            alt=""
            width={posterWidth}
            height={posterHeight}
            className="absolute inset-0 h-full w-full animate-[scene-fade_0.35s_ease-out] object-cover"
            style={{ objectPosition: posterPosition }}
          />
        </picture>
      )}
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ease-out"
        style={{ opacity: live && !failed ? 1 : 0 }}
        tabIndex={-1}
      />
      {children}
      {continuous && live && (
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          className="absolute bottom-3 right-3 z-10 inline-flex h-9 items-center gap-2 rounded-full border border-white/20 bg-nav/80 px-3 font-mono-brand text-[11px] uppercase tracking-[0.12em] text-white/80 backdrop-blur hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
          <span>{paused ? t("Play motion", "गति चलाएँ") : t("Pause motion", "गति रोकें")}</span>
        </button>
      )}
    </div>
  );
}
