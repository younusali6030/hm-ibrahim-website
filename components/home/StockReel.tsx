"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Chapter = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  facts: string[];
  href: string;
  cta: string;
};

/** Filmed at our own counter and godown. Clips live in /public/stock. */
const CHAPTERS: Chapter[] = [
  {
    id: "concertina",
    kicker: "Fencing",
    title: "Razor and concertina coils",
    body: "Galvanised coils stacked in the godown, cut and dispatched by the metre or the full roll.",
    facts: ["Single and double coil", "Barbed and razor", "Retail and wholesale"],
    href: "/categories/fencing-material",
    cta: "See fencing material",
  },
  {
    id: "binding-wire",
    kicker: "Construction wire",
    title: "Binding wire, coil on coil",
    body: "Black annealed binding wire for rebar and shuttering. Tata Wiron coils stand beside it on the shelf.",
    facts: ["Black annealed", "Tata Wiron stocked", "By the coil or the kilo"],
    href: "/products/binding-wire",
    cta: "Binding wire rates",
  },
  {
    id: "perforated",
    kicker: "Sheets",
    title: "Perforated sheet, cut to size",
    body: "MS and GI sheets in round, square and slotted holes. Cut outside the shop while you wait.",
    facts: ["MS and GI", "Many hole patterns", "Cut to size"],
    href: "/categories/perforated-sheets",
    cta: "See perforated sheets",
  },
  {
    id: "weldmesh",
    kicker: "Mesh",
    title: "Welded mesh for slabs and fences",
    body: "GI, MS and PVC coated weld mesh in rolls and panels. Tell us the gauge and the hole size.",
    facts: ["GI, MS, PVC coated", "Rolls and panels", "Many gauges"],
    href: "/categories/welded-mesh",
    cta: "See welded mesh",
  },
  {
    id: "expanded",
    kicker: "Mesh",
    title: "Expanded metal, one piece, no welds",
    body: "Diamond mesh stretched from a single sheet. For gates, grills, guards and plaster.",
    facts: ["Plain and galvanised", "Rolls and sheets", "Rigid and light"],
    href: "/products/expanded-metal-mesh",
    cta: "Expanded metal mesh",
  },
  {
    id: "nails",
    kicker: "Fasteners",
    title: "Nails, weighed out of the bin",
    body: "Wire nails and roofing nails in every length, picked by hand and sold by weight.",
    facts: ["1 inch to 6 inch", "Wire and roofing", "By the kilo"],
    href: "/categories/nails",
    cta: "See nails",
  },
];

const N = CHAPTERS.length;
const INTRO = 0.16;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function StockReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const vidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current!;
    let raf = 0;
    let onScreen = false;
    let lastActive = -1;
    let playing = new Set<number>();

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const wide = window.innerWidth >= 900;
      const rect = section.getBoundingClientRect();
      const span = rect.height - vh;
      const p = clamp(span > 0 ? -rect.top / span : 0);

      // Intro: the picture opens from a thin line into its window.
      const e = ease(clamp((p - 0.07) / (INTRO - 0.07)));
      const win = windowRef.current!;
      if (wide) {
        const inset = (1 - e) * 50;
        win.style.clipPath = `inset(${inset}% ${(1 - e) * 22}% ${inset}% ${(1 - e) * 22}% round ${Math.round(18 - 18 * e)}px)`;
      } else {
        const inset = (1 - e) * 50;
        win.style.clipPath = `inset(${inset}% ${(1 - e) * 12}% ${inset}% ${(1 - e) * 12}% round ${Math.round(18 - 18 * e)}px)`;
      }
      const intro = introRef.current!;
      const io = 1 - clamp((p - 0.01) / 0.05);
      intro.style.opacity = String(io);
      intro.style.transform = `translateY(${(1 - io) * -40}px)`;
      const panel = panelRef.current!;
      const po = clamp((p - 0.1) / 0.06);
      panel.style.opacity = String(po);
      panel.style.transform = `translateX(${(1 - po) * -28}px)`;

      // Chapters.
      const P = clamp((p - INTRO) / (1 - INTRO)) * N;
      const idx = Math.min(N - 1, Math.floor(P));
      CHAPTERS.forEach((_, i) => {
        const el = vidRefs.current[i];
        if (!el) return;
        const w = i === 0 ? 1 : ease(clamp((P - (i - 0.35)) / 0.35));
        el.style.clipPath = `inset(${(1 - w) * 100}% 0 0 0)`;
        const local = clamp(P - i, 0, 1);
        const zoom = i === idx ? 1.14 - 0.1 * local : 1.14;
        const v = mediaRefs.current[i];
        if (v) v.style.transform = `scale(${zoom})`;
        const fill = fillRefs.current[i];
        if (fill) fill.style.transform = `scaleX(${clamp(P - i)})`;
      });

      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      // Only the active clip and the next one play.
      const want = new Set([idx, Math.min(N - 1, idx + 1)]);
      mediaRefs.current.forEach((v, i) => {
        if (!v) return;
        if (want.has(i) && onScreen) {
          if (!playing.has(i)) {
            v.play().catch(() => {});
            playing.add(i);
          }
        } else if (playing.has(i)) {
          v.pause();
          playing.delete(i);
        }
      });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      (en) => {
        onScreen = en[0].isIntersecting;
        request();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(section);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="border-t border-border py-14 md:py-20" aria-labelledby="stock-heading">
        <div className="page-container">
          <h2 id="stock-heading" className="text-foreground">Everything a build needs</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/stock/${c.id}.jpg`} alt={c.title} className="aspect-[4/5] w-full rounded-sm object-cover" loading="lazy" />
                <h3 className="mt-3 font-display text-2xl font-extrabold uppercase text-foreground">{c.title}</h3>
                <p className="mt-1 text-muted-foreground">{c.body}</p>
                <Link href={c.href} className="mt-2 inline-block text-sm font-bold text-foreground underline underline-offset-4">{c.cta}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="stock-reel relative border-t border-border"
      style={{ height: `${100 + N * 95}vh` }}
      aria-labelledby="stock-heading"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Intro headline */}
        <div ref={introRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">From the godown</p>
          <h2 id="stock-heading" className="stock-intro-title mt-4 max-w-4xl text-foreground">
            Everything a build needs
          </h2>
          <p className="mt-5 text-sm text-muted-foreground">Keep scrolling</p>
        </div>

        {/* Picture window */}
        <div ref={windowRef} className="stock-window absolute z-0 overflow-hidden bg-[#0b121a]">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                vidRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: i, clipPath: i === 0 ? undefined : "inset(100% 0 0 0)" }}
            >
              <video
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="h-full w-full object-cover will-change-transform"
                style={{ transform: "scale(1.14)" }}
                poster={`/stock/${c.id}.jpg`}
                muted
                loop
                playsInline
                preload={i < 2 ? "auto" : "none"}
                aria-hidden="true"
              >
                <source src={`/stock/${c.id}.mp4`} type="video/mp4" />
              </video>
            </div>
          ))}
          <span className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
        </div>

        {/* Text panel: always on solid ground, never over the picture */}
        <div ref={panelRef} className="stock-panel absolute z-10 flex flex-col justify-between bg-[#070d14] p-6 pb-24 sm:p-8 sm:pb-24 lg:p-12" style={{ opacity: 0 }}>
          <div className="flex items-start justify-between">
            <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
            <Link href="/products" className="text-xs font-bold uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-primary">
              All products
            </Link>
          </div>

          <div className="relative min-h-[11rem] flex-1">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.id}
                className="stock-copy absolute inset-x-0 bottom-0 top-0 flex flex-col justify-center"
                data-on={i === active ? "1" : "0"}
                aria-hidden={i !== active}
              >
                <p className="stock-line font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-primary" style={{ ["--d" as string]: "0ms" }}>
                  {c.kicker}
                </p>
                <h3 className="stock-line mt-2 font-display text-3xl font-extrabold uppercase leading-[1.02] text-foreground sm:text-4xl lg:text-5xl" style={{ ["--d" as string]: "70ms" }}>
                  {c.title}
                </h3>
                <p className="stock-line mt-3 max-w-md text-sm text-muted-foreground sm:text-base" style={{ ["--d" as string]: "140ms" }}>
                  {c.body}
                </p>
                <ul className="stock-line mt-4 hidden flex-wrap gap-2 sm:flex" style={{ ["--d" as string]: "210ms" }}>
                  {c.facts.map((f) => (
                    <li key={f} className="rounded-sm border border-border px-2.5 py-1 text-sm text-foreground">{f}</li>
                  ))}
                </ul>
                <Link
                  href={c.href}
                  tabIndex={i === active ? 0 : -1}
                  className="stock-line mt-4 inline-block text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary"
                  style={{ ["--d" as string]: "280ms" }}
                >
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5" aria-hidden="true">
            {CHAPTERS.map((c, i) => (
              <span key={c.id} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                <span
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left bg-primary"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
