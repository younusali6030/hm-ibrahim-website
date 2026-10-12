"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { trackWhatsAppClick } from "@/lib/analytics";
import "./scroll-hero.css";

// Phones get one portrait film. Wider screens get three real films side by side, full bleed, scrubbed together.
const SOURCES = {
  narrow: { url: "/hero/hero-scrub.mp4?v=3", bytes: 7079923 },
  wide: { url: "/hero/hero-wide.mp4?v=3", bytes: 12032409 },
} as const;
const WIDE_QUERY = "(min-width: 821px)";

type Band = { a: number; b: number; side: "l" | "r"; kicker: string; text: string };

// Band ranges are scroll-progress starting points; validated by the flick test.
const BANDS: Band[] = [
  { a: 0.0, b: 0.2, side: "l", kicker: "Siyaganj, Indore", text: "Every morning since 1939." },
  { a: 0.24, b: 0.44, side: "r", kicker: "On the shelves", text: "Rolls come down. Cut to your size." },
  { a: 0.48, b: 0.68, side: "l", kicker: "At the counter", text: "Weighed in front of you." },
];
const SETTLE = { a: 0.74, b: 1 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export function ScrollHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const stage = stageRef.current!;
    const video = videoRef.current!;
    const ring = ringRef.current!;
    const bandEls = Array.from(root.querySelectorAll<HTMLElement>("[data-band]"));
    const gate = matchMedia("(prefers-reduced-motion: reduce)");
    const wideMq = matchMedia(WIDE_QUERY);

    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let heroOnScreen = true;
    let seekBusy = false;
    let pendingTime: number | null = null;
    let armed = false;
    let loadedUrl = "";
    let loadToken = 0;
    const cache = bandEls.map(() => ({ op: -1, k: -1 }));

    const heroProgress = () => {
      const r = root.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      return range > 0 ? clamp(-r.top / range, 0, 1) : 0;
    };

    const requestSeek = (t: number) => {
      if (!video.duration || !isFinite(video.duration)) return;
      if (seekBusy) {
        pendingTime = t;
        return;
      }
      seekBusy = true;
      video.currentTime = t;
    };
    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    };
    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onVideoError);

    let settled = false;
    const updateBands = (p: number) => {
      const nowSettled = p > SETTLE.a - 0.03;
      if (nowSettled !== settled) {
        settled = nowSettled;
        stage.classList.toggle("is-settled", settled);
      }
      bandEls.forEach((el, i) => {
        const a = Number(el.dataset.a);
        const b = Number(el.dataset.b);
        const first = i === 0;
        const last = el.dataset.band === "settle";
        const f = Math.min(0.02, (b - a) / 3);
        const inn = first ? 1 : smoothstep(p, a, a + f);
        const out = last ? 1 : 1 - smoothstep(p, b - f, b);
        const op = Math.round(inn * out * 100) / 100;
        const k = Math.round(clamp((p - a) / Math.min(0.025, (b - a) * 0.35), 0, 1) * 125) / 125;
        const c = cache[i];
        if (c.op !== op) {
          c.op = op;
          el.style.opacity = String(op);
          el.style.visibility = op === 0 ? "hidden" : "visible";
        }
        if (c.k !== k) {
          c.k = k;
          el.style.setProperty("--k", String(first ? 1 : k));
        }
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      requestSeek(shown * video.duration);
      updateBands(shown);
    };

    const onScroll = () => {
      target = heroProgress();
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        heroOnScreen = entries[0].isIntersecting;
        if (heroOnScreen) onScroll();
      },
      { rootMargin: "100px" }
    );
    io.observe(root);

    async function loadBlob(src: { url: string; bytes: number }) {
      const token = ++loadToken;
      loadedUrl = src.url;
      stage.classList.remove("video-ready");
      ring.style.setProperty("--ld", "126");
      const ctrl = new AbortController();
      let watchdog = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(src.url, { signal: ctrl.signal });
      const total = Number(res.headers.get("Content-Length")) || src.bytes;
      const reader = res.body!.getReader();
      const chunks: Uint8Array[] = [];
      let got = 0;
      let lastRing = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        clearTimeout(watchdog);
        watchdog = setTimeout(() => ctrl.abort(), 20000);
        if (token !== loadToken) {
          ctrl.abort();
          return;
        }
        chunks.push(value);
        got += value.length;
        const frac = Math.min(1, got / total);
        const now = performance.now();
        if (now - lastRing > 100 || frac === 1) {
          lastRing = now;
          ring.style.setProperty("--ld", String(Math.round(126 * (1 - frac))));
        }
      }
      clearTimeout(watchdog);
      if (token !== loadToken) return;
      ring.style.setProperty("--ld", "0");
      if (video.src.startsWith("blob:")) URL.revokeObjectURL(video.src);
      video.src = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          requestSeek(heroProgress() * video.duration);
          stage.classList.remove("video-failed");
          stage.classList.add("video-ready");
        },
        { once: true }
      );
    }

    function ensureSource() {
      const src = wideMq.matches ? SOURCES.wide : SOURCES.narrow;
      if (src.url === loadedUrl) return;
      stage.classList.remove("video-failed");
      loadBlob(src).catch((err) => {
        // A superseded load aborts on purpose; only a real failure should show the fallback.
        if (err && (err as Error).name === "AbortError") return;
        failVideo();
      });
    }

    function failVideo() {
      stage.classList.add("video-failed");
    }

    function arm() {
      if (armed) return;
      armed = true;
      cache.forEach((c) => {
        c.op = -1;
        c.k = -1;
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      ensureSource();
      shown = target = heroProgress();
      updateBands(shown);
      onScroll();
    }

    function disarm() {
      if (!armed) return;
      armed = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      bandEls.forEach((el) => {
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.removeProperty("--k");
      });
    }

    function applyMode() {
      if (gate.matches) {
        root.classList.add("sh-static");
        disarm();
      } else {
        root.classList.remove("sh-static");
        arm();
      }
    }

    const onWideChange = () => {
      if (armed) ensureSource();
    };
    gate.addEventListener("change", applyMode);
    wideMq.addEventListener("change", onWideChange);
    applyMode();

    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Entrance of band one: time-based load ramp so the opening beat is settled.
    const first = bandEls[0];
    if (first) {
      first.style.setProperty("--k", "1");
    }

    return () => {
      gate.removeEventListener("change", applyMode);
      wideMq.removeEventListener("change", onWideChange);
      document.removeEventListener("visibilitychange", onVis);
      disarm();
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onVideoError);
    };
  }, []);

  const rating = site.googleReview;

  return (
    <section ref={rootRef} className="sh" aria-label="H M Ibrahim & Co, Siyaganj, Indore, since 1939">
      <div ref={stageRef} className="sh-stage">
        <div className="sh-bg" aria-hidden="true" />
        <div className="sh-bg-dim" aria-hidden="true" />

        <div className="sh-frame" aria-hidden="true">
          <div className="sh-poster" />
          <video ref={videoRef} className="sh-video" preload="none" muted playsInline tabIndex={-1} />
          <div className="sh-vignette" />
          <svg className="sh-ring" viewBox="0 0 48 48">
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="126"
              style={{ strokeDashoffset: "var(--ld,126)" }}
            />
          </svg>
        </div>

        <div className="sh-scrim" aria-hidden="true" />
        <div className="sh-foot" aria-hidden="true" />

        <aside className="sh-brands" aria-label="Our own brands">
          <span className="sh-brands-label">Our brands</span>
          <Link href="/brands/cm" className="sh-brand" aria-label="CM brand barbed wire and chain link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brands/cm-logo-clear.png" alt="CM" width={562} height={313} />
          </Link>
          <Link href="/brands/boarder" className="sh-brand" aria-label="Border brand barbed wire and chain link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brands/border-logo-clear.png" alt="Border" width={633} height={292} />
          </Link>
        </aside>

        <div className="sh-year" aria-hidden="true">
          <span>Since</span>
          <strong>1939</strong>
          <em>Siyaganj</em>
        </div>

        <h1 className="sr-only">
          H M Ibrahim &amp; Co. Iron and hardware in Siyaganj, Indore. Since 1939.
        </h1>

        {BANDS.map((b, i) => (
          <div key={i} className={`sh-band sh-${b.side}`} data-band="cap" data-a={b.a} data-b={b.b}>
            <p className="sh-kicker">{b.kicker}</p>
            <p className="sh-line">{b.text}</p>
          </div>
        ))}

        <div className="sh-band sh-settle" data-band="settle" data-a={SETTLE.a} data-b={SETTLE.b}>
          <div className="sh-settle-l">
            <p className="sh-kicker">H M Ibrahim &amp; Co</p>
            <p className="sh-line sh-line-big">Iron &amp; hardware. Siyaganj, Indore. Since 1939.</p>
            <p className="sh-sub">Wire mesh, barbed wire, chain link, perforated sheets and Tata wire. Retail and wholesale.</p>
          </div>
          <div className="sh-settle-r">
            <Link href="/contact" className="sh-btn sh-btn-main">
              Request a quote
            </Link>
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your iron and hardware products. Please share price/availability.")}
              onClick={() => trackWhatsAppClick("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="sh-btn"
            >
              WhatsApp us
            </a>
            <Link href="/products" className="sh-btn">
              Browse products
            </Link>
            {rating.verified && (
              <a href={rating.profileUrl} target="_blank" rel="noopener noreferrer" className="sh-chip">
                <span aria-hidden="true">★</span> {rating.rating} on Google · {rating.reviewCount} reviews
              </a>
            )}
          </div>
        </div>

        <div className="sh-cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
