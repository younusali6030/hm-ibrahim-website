"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type ChapterData = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  facts: string[];
  href: string;
  cta: string;
};

/** Filmed at our own counter and godown. Clips live in /public/stock. */
const CHAPTERS: ChapterData[] = [
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

/** One clip per product family. Each plays only while it is on screen; nothing is pinned or scroll-jacked. */
function Chapter({ c, i }: { c: ChapterData; i: number }) {
  const box = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = box.current;
    const v = video.current;
    if (!el || !v) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (reduced) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.45, rootMargin: "0px 0px 0px 0px" }
    );
    // Start fetching just before it arrives.
    const warm = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          warm.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );
    io.observe(el);
    warm.observe(el);
    return () => {
      io.disconnect();
      warm.disconnect();
    };
  }, []);

  const flip = i % 2 === 1;
  return (
    <article
      ref={box}
      data-reveal
      className="grid items-center gap-6 py-8 md:grid-cols-2 md:gap-12 md:py-14"
    >
      <div className={"relative " + (flip ? "md:order-2" : "")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] md:aspect-[5/4] bg-[#0b121a] ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <video
            ref={video}
            className="h-full w-full object-cover"
            poster={`/stock/${c.id}.jpg`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src={`/stock/${c.id}.mp4`} type="video/mp4" />
          </video>
          <span className="glass-pill absolute left-4 top-4 px-3 py-1 font-mono-brand text-[11px] uppercase tracking-[0.14em]">
            {String(i + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className={flip ? "md:order-1" : ""}>
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-primary">{c.kicker}</p>
        <h3 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.98] text-foreground sm:text-5xl lg:text-6xl">
          {c.title}
        </h3>
        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">{c.body}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {c.facts.map((f) => (
            <li key={f} className="glass-pill px-3.5 py-1.5 text-sm font-semibold">
              {f}
            </li>
          ))}
        </ul>
        <Link href={c.href} className="glass-btn mt-6">
          {c.cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function StockReel() {
  return (
    <section className="border-t border-border py-14 md:py-20" aria-labelledby="stock-heading">
      <div className="page-container">
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">From the godown</p>
        <h2 id="stock-heading" data-reveal className="stock-intro-title mt-3 max-w-4xl text-foreground">
          Everything a build needs
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">Filmed at our own counter and godown in Siyaganj. Real stock, cut to your size.</p>
        <div className="mt-6 divide-y divide-border">
          {CHAPTERS.map((c, i) => (
            <Chapter key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
