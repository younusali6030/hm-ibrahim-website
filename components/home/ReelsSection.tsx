"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { homeReels } from "@/content/reels";
import { tracksFor } from "@/content/captions";

type Reel = { id: string; title: string; note: string; href?: string; cta?: string };

/** Titles, notes and order come from content/reels.ts, which also feeds the /videos watch pages. Files live in /public/reels. */
const CTA: Record<string, { href: string; en: string; hi: string }> = {
  "machhar-full-stop": { href: "/products/mosquito-net", en: "Mosquito net", hi: "मच्छरदानी जाली" },
  "perforated-sheet-customer": { href: "/categories/perforated-sheets", en: "Perforated sheets", hi: "परफोरेटेड शीट" },
  "nail-reel": { href: "/categories/nails", en: "Nails", hi: "कीलें" },
  "kala-taar-wholesale": { href: "/products/binding-wire", en: "Binding wire", hi: "बाइंडिंग तार" },
  "frp-bars": { href: "/products/frp-bars", en: "FRP bars", hi: "एफआरपी बार" },
  "weldmesh-jali": { href: "/categories/welded-mesh", en: "Welded mesh", hi: "वेल्डेड मेश" },
  "kabootar-jali": { href: "/products/pigeon-nets", en: "Pigeon nets", hi: "कबूतर जाली" },
  "pvc-hexa-mesh": { href: "/products/plastic-hexagonal-poultry-mesh", en: "Hexa mesh", hi: "हेक्सा मेश" },
  "tata-wire-rate": { href: "/products/gi-wire", en: "GI wire", hi: "जीआई तार" },
};

function reelFor(id: string, lang: "en" | "hi"): Reel {
  const r = homeReels.find((x) => x.id === id)!;
  const text = lang === "hi" ? r.hi : r.en;
  const cta = CTA[id];
  return { id, title: text.short, note: text.note, href: cta?.href, cta: cta ? (lang === "hi" ? cta.hi : cta.en) : undefined };
}

function ReelCard({ id }: { id: string }) {
  const { lang } = useLang();
  const reel = reelFor(id, lang);
  // The poster is fetched only when the card is near the viewport, not for all twelve at page load.
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Warm the first bytes of a reel just before it scrolls into view, so a tap starts instantly.
  useEffect(() => {
    const v = ref.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.poster = `/reels/${reel.id}.jpg`;
          v.preload = "metadata";
          io.disconnect();
        }
      },
      { rootMargin: "0px 400px 0px 400px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reel.id]);

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
        aria-label={lang === "hi" ? `रील ${playing ? "रोकें" : "चलाएँ"}: ${reel.title}` : `${playing ? "Pause" : "Play"} reel: ${reel.title}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-[#0b121a] ring-1 ring-white/10"
      >
        <video
          ref={ref}
          data-reel
          className="h-full w-full object-cover"
          preload="none"
          playsInline
          loop
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <source src={`/reels/${reel.id}.mp4`} type="video/mp4" />
          {tracksFor(reel.id).map((c) => (
            <track key={c.src} kind="captions" srcLang={c.lang} label={c.label} src={c.src} default={c.lang === lang} />
          ))}
        </video>
        <span
          className={
            "absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity " +
            (playing ? "opacity-0 group-hover:opacity-100" : "opacity-100")
          }
          aria-hidden="true"
        >
          <span className="glass flex h-16 w-16 items-center justify-center rounded-full">
            <Play className="ml-1 h-7 w-7" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3">
        <span className="block font-display text-2xl font-extrabold uppercase leading-none text-foreground">{reel.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{reel.note}</span>
        <span className="flex flex-wrap gap-x-4">
          {reel.href && (
            <Link href={reel.href} className="inline-flex min-h-[44px] items-center text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              {reel.cta}
            </Link>
          )}
          <Link href={`/videos/${reel.id}`} className="inline-flex min-h-[44px] items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {lang === "hi" ? "वीडियो पेज" : "Video page"}
          </Link>
        </span>
      </figcaption>
    </figure>
  );
}

export function ReelsSection() {
  const { lang } = useLang();
  const hi = lang === "hi";
  return (
    <section className="border-y border-border py-9 md:py-20" aria-labelledby="reels-heading">
      <div className="page-container">
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {hi ? "दुकान के फ़र्श से" : "From the shop floor"}
        </p>
        <h2 id="reels-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          {hi ? "खरीदने से पहले देख लीजिए" : "See it before you buy it"}
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {hi
            ? "असली स्टॉक, असली ग्राहक, हमारे सियागंज काउंटर पर पूरी क्वालिटी में फ़िल्माए गए। आवाज़ के साथ चलाने के लिए रील पर टैप कीजिए, और ज़्यादा देखने के लिए बगल में स्क्रोल कीजिए।"
            : "Real stock, real customers, filmed at our Siyaganj counter in full resolution. Tap a reel to play with sound, and scroll sideways for more."}
        </p>
        <Link href="/videos" className="mt-3 inline-flex min-h-[44px] items-center font-bold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {hi ? "सभी वीडियो देखें" : "All videos"}
        </Link>
      </div>
      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} aria-label={hi ? "रील, बगल में स्क्रोल करें" : "Reels, scroll sideways"}>
        <div className="page-container">
          <div className="flex snap-x snap-mandatory gap-4 sm:gap-6">
            {homeReels.map((r) => (
              <ReelCard key={r.id} id={r.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
