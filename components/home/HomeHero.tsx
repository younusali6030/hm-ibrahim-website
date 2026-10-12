"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import { site } from "@/content/site";
import { T, useT } from "@/lib/i18n";
import "./home-hero.css";

const WIDE = "(min-width: 821px)";
const SRC = { wide: "/hero/hero-wide.mp4?v=5", narrow: "/hero/hero-scrub.mp4?v=5" } as const;
/**
 * The poster owns the first paint. Chrome counts a video's first frame as an LCP candidate, so the film
 * waits for the first touch, scroll or key (which also freezes LCP), or ten quiet seconds after load.
 */
const FILM_IDLE_MS = 10000;

/** One film, one statement, two ways in. Everything else on the page earns its own section below. */
export function HomeHero() {
  const t = useT();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const video = videoRef.current!;
    const body = bodyRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const slow = !!conn && /(^|-)(2g|3g)$/.test((conn as { effectiveType?: string }).effectiveType ?? "");
    const lite = reduced || !!conn?.saveData || slow;
    let raf = 0;
    let loaded = "";

    const load = () => {
      if (lite) return;
      const want = matchMedia(WIDE).matches ? SRC.wide : SRC.narrow;
      if (want === loaded) return;
      loaded = want;
      video.src = want;
      video.load();
      video.play().catch(() => {});
    };
    const onPlaying = () => root.classList.add("hh-live");
    video.addEventListener("playing", onPlaying);

    const frame = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / window.innerHeight);
      body.style.transform = `translate3d(0, ${-p * 40}px, 0)`;
      body.style.opacity = String(1 - p * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (lite || !loaded) return;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(root);

    // Glass buttons catch the light where the pointer is.
    const onMove = (ev: PointerEvent) => {
      const t = (ev.target as Element).closest<HTMLElement>(".glass-btn, .glass-pill");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      t.style.setProperty("--my", `${ev.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const mq = matchMedia(WIDE);
    mq.addEventListener("change", load);

    // Poster first. The film starts on the first touch, scroll or key, or after a long idle.
    let started = false;
    let timer = 0;
    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => window.removeEventListener(t, start));
      load();
    };
    const onLoad = () => {
      timer = window.setTimeout(start, FILM_IDLE_MS);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => window.addEventListener(t, start, { once: true, passive: true }));
    window.addEventListener("scroll", start, { once: true, passive: true });

    return () => {
      io.disconnect();
      video.removeEventListener("playing", onPlaying);
      root.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", load);
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((t) => window.removeEventListener(t, start));
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const rating = site.googleReview;

  return (
    <section ref={rootRef} className="hh" aria-label={t("HM Ibrahim & Co, Siyaganj, Indore, since 1939", "एच एम इब्राहिम एंड कंपनी, सियागंज, इंदौर, 1939 से")}>
      <div className="hh-media" aria-hidden="true">
        <video ref={videoRef} className="hh-video" muted loop playsInline preload="none" tabIndex={-1} />
        {/* Real <img>, fetchpriority high: the browser finds it in the HTML and paints it first. Same box as the film, so the film never becomes the LCP element. */}
        <picture className="hh-poster">
          <source media="(min-width: 821px)" type="image/avif" srcSet="/hero/poster-wide.avif?v=5" />
          <source media="(min-width: 821px)" srcSet="/hero/poster-wide.jpg?v=5" />
          <source type="image/avif" srcSet="/hero/poster.avif?v=5" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/poster.jpg?v=5" alt="" fetchPriority="high" decoding="async" width={720} height={1280} />
        </picture>
      </div>
      <div className="hh-shade" aria-hidden="true" />

      <div ref={bodyRef} className="hh-body page-container">
        <p className="hh-eyebrow"><T en="Siyaganj, Indore · Since 1939" hi="सियागंज, इंदौर · 1939 से" /></p>
        <h1 className="hh-title">
          <T en="Iron, wire & mesh" hi="लोहा, तार और जाली" />
          <span className="hh-title-sub"><T en="from Siyaganj." hi="सियागंज से।" /></span>
        </h1>
        <p className="hh-sub"><T en="Retail and wholesale. Every roll cut to your size while you wait." hi="रिटेल और थोक। हर रोल आपकी नाप से, आपके सामने कटता है।" /></p>

        <div className="hh-row">
          <div className="hh-cta">
            <Link href="/contact" className="glass-btn glass-btn-main">
              <T en="Get a quote" hi="कोटेशन पाएँ" />
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link href="/products" className="glass-btn">
              <T en="Browse products" hi="प्रोडक्ट देखें" />
            </Link>
          </div>
          {rating.verified && (
            <a href={rating.profileUrl} target="_blank" rel="noopener noreferrer" className="hh-rating">
              <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
              <strong>{rating.rating}</strong>
              <span>{rating.reviewCount} <T en="Google reviews" hi="गूगल रिव्यू" /></span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
