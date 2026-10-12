"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import { site } from "@/content/site";
import "./home-hero.css";

const WIDE = "(min-width: 821px)";
const SRC = { wide: "/hero/hero-wide.mp4?v=5", narrow: "/hero/hero-scrub.mp4?v=5" } as const;

/** One film, one statement, two ways in. Everything else on the page earns its own section below. */
export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const video = videoRef.current!;
    const body = bodyRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const lite = reduced || !!conn?.saveData;
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
    load();

    return () => {
      io.disconnect();
      video.removeEventListener("playing", onPlaying);
      root.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", load);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const rating = site.googleReview;

  return (
    <section ref={rootRef} className="hh" aria-label="H M Ibrahim & Co, Siyaganj, Indore, since 1939">
      <div className="hh-media" aria-hidden="true">
        <div className="hh-poster" />
        <video ref={videoRef} className="hh-video" muted loop playsInline preload="auto" tabIndex={-1} />
      </div>
      <div className="hh-shade" aria-hidden="true" />

      <div ref={bodyRef} className="hh-body page-container">
        <p className="hh-eyebrow">Siyaganj, Indore · Since 1939</p>
        <h1 className="hh-title">
          Iron, wire &amp; mesh<span className="hh-title-sub">from Siyaganj.</span>
        </h1>
        <p className="hh-sub">Retail and wholesale. Every roll cut to your size while you wait.</p>

        <div className="hh-row">
          <div className="hh-cta">
            <Link href="/contact" className="glass-btn glass-btn-main">
              Get a quote
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link href="/products" className="glass-btn">
              Browse products
            </Link>
          </div>
          {rating.verified && (
            <a href={rating.profileUrl} target="_blank" rel="noopener noreferrer" className="hh-rating">
              <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
              <strong>{rating.rating}</strong>
              <span>{rating.reviewCount} Google reviews</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
