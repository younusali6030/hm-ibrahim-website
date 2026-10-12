"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

type Reel = { id: string; title: string; note: string; href?: string; cta?: string };

/** Full-quality reels, re-encoded from the original footage. Files live in /public/reels. */
const REELS: Reel[] = [
  { id: "shop-par-bharosa", title: "Shop par bharosa", note: "Walk in. See the stock. Decide." },
  { id: "check-the-strength", title: "Check the strength", note: "Wire and mesh, tested in front of you." },
  { id: "machhar-full-stop", title: "Machhar ka full stop", note: "Mosquito net, cut at the counter.", href: "/products/mosquito-net", cta: "Mosquito net" },
  { id: "perforated-sheet-customer", title: "Perforated sheet", note: "A customer on why he buys it here.", href: "/categories/perforated-sheets", cta: "Perforated sheets" },
  { id: "nail-reel", title: "Nails, by weight", note: "Every length in the bins.", href: "/categories/nails", cta: "Nails" },
  { id: "kala-taar-wholesale", title: "Kala taar, wholesale", note: "Binding wire by the coil.", href: "/products/binding-wire", cta: "Binding wire" },
  { id: "frp-bars", title: "FRP bars", note: "Light, rust-proof, cut to length.", href: "/products/frp-bars", cta: "FRP bars" },
  { id: "weldmesh-jali", title: "Weldmesh jali", note: "Rolls and panels, any gauge.", href: "/categories/welded-mesh", cta: "Welded mesh" },
  { id: "kabootar-jali", title: "Kabootar jali", note: "Pigeon net for balconies and shafts.", href: "/products/pigeon-nets", cta: "Pigeon nets" },
  { id: "pvc-hexa-mesh", title: "PVC hexa mesh", note: "Garden and poultry fencing.", href: "/products/plastic-hexagonal-poultry-mesh", cta: "Hexa mesh" },
  { id: "tata-wire-rate", title: "Tata wire, solid rate", note: "Tata Wiron, straight from the shelf.", href: "/products/gi-wire", cta: "GI wire" },
  { id: "rat-jaali-customer", title: "A customer, on camera", note: "Rat jaali, from our customer." },
];

function ReelCard({ reel }: { reel: Reel }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      document.querySelectorAll<HTMLVideoElement>("video[data-reel]").forEach((o) => o !== v && o.pause());
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className="w-[62vw] max-w-[280px] shrink-0 snap-start sm:w-[260px]">
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} reel: ${reel.title}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-sm bg-[#0b121a]"
      >
        <video
          ref={ref}
          data-reel
          className="h-full w-full object-cover"
          poster={`/reels/${reel.id}.jpg`}
          preload="none"
          playsInline
          loop
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <source src={`/reels/${reel.id}.mp4`} type="video/mp4" />
        </video>
        <span
          className={
            "absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity " +
            (playing ? "opacity-0 group-hover:opacity-100" : "opacity-100")
          }
          aria-hidden="true"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="ml-1 h-7 w-7" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3">
        <span className="block font-display text-2xl font-extrabold uppercase leading-none text-foreground">{reel.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{reel.note}</span>
        {reel.href && (
          <Link href={reel.href} className="mt-1 inline-block text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary">
            {reel.cta}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

export function ReelsSection() {
  return (
    <section className="border-y border-border py-14 md:py-20" aria-labelledby="reels-heading">
      <div className="page-container">
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          From the shop floor
        </p>
        <h2 id="reels-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          See it before you buy it
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Real stock, real customers, filmed at our Siyaganj counter in full resolution. Tap a reel to play with sound, and scroll sideways for more.
        </p>
      </div>
      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} aria-label="Reels, scroll sideways">
        <div className="page-container">
          <div className="flex snap-x snap-mandatory gap-4 sm:gap-6">
            {REELS.map((r) => (
              <ReelCard key={r.id} reel={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
