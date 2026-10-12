"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLang } from "@/lib/i18n";

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
    body: "MS and GI sheets in round, square and slotted holes. Cut to size while you wait.",
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

const HI: Record<string, Pick<ChapterData, "kicker" | "title" | "body" | "facts" | "cta">> = {
  concertina: {
    kicker: "फेंसिंग",
    title: "रेज़र और कंसर्टिना कॉइल",
    body: "गोदाम में रखे गैल्वनाइज़्ड कॉइल, मीटर के हिसाब से कटकर या पूरे रोल में भेजे जाते हैं।",
    facts: ["सिंगल और डबल कॉइल", "कांटेदार और रेज़र", "रिटेल और थोक"],
    cta: "फेंसिंग सामग्री देखें",
  },
  "binding-wire": {
    kicker: "निर्माण का तार",
    title: "बाइंडिंग तार, कॉइल पर कॉइल",
    body: "सरिया और सेंट्रिंग के लिए काला एनील्ड बाइंडिंग तार। टाटा वायरॉन के कॉइल शेल्फ पर इसके बगल में रखे हैं।",
    facts: ["काला एनील्ड", "टाटा वायरॉन स्टॉक में", "कॉइल या किलो के हिसाब से"],
    cta: "बाइंडिंग तार के रेट",
  },
  perforated: {
    kicker: "शीट",
    title: "परफोरेटेड शीट, नाप से कटी",
    body: "गोल, चौकोर और स्लॉट छेदों वाली एमएस और जीआई शीट। दुकान के बाहर आपके सामने कटती है।",
    facts: ["एमएस और जीआई", "छेदों के कई पैटर्न", "नाप से कटाई"],
    cta: "परफोरेटेड शीट देखें",
  },
  weldmesh: {
    kicker: "जाली",
    title: "स्लैब और फेंस के लिए वेल्डेड मेश",
    body: "जीआई, एमएस और पीवीसी कोटेड वेल्ड मेश रोल और पैनल में। गेज और खाने का साइज़ बताइए।",
    facts: ["जीआई, एमएस, पीवीसी कोटेड", "रोल और पैनल", "कई गेज"],
    cta: "वेल्डेड मेश देखें",
  },
  expanded: {
    kicker: "जाली",
    title: "एक्सपैंडेड मेटल, एक पीस, बिना वेल्ड",
    body: "एक ही शीट से खींची डायमंड जाली। गेट, ग्रिल, गार्ड और प्लास्टर के लिए।",
    facts: ["सादी और गैल्वनाइज़्ड", "रोल और शीट", "कड़ी और हल्की"],
    cta: "एक्सपैंडेड मेटल मेश",
  },
  nails: {
    kicker: "फास्टनर",
    title: "कीलें, डिब्बे से तौलकर",
    body: "हर लंबाई की तार की कील और छत की कील, हाथ से छाँटकर और वज़न के हिसाब से।",
    facts: ["1 इंच से 6 इंच", "तार और छत की कील", "किलो के हिसाब से"],
    cta: "कीलें देखें",
  },
};

/** One clip per product family. Each plays only while it is on screen; nothing is pinned or scroll-jacked. */
function Chapter({ c: en, i, paused }: { c: ChapterData; i: number; paused: boolean }) {
  const { lang } = useLang();
  const c: ChapterData = lang === "hi" && HI[en.id] ? { ...en, ...HI[en.id] } : en;
  const box = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // The section's pause control stops every clip and keeps them stopped while scrolling.
  useEffect(() => {
    const v = video.current;
    const el = box.current;
    if (!v || !el) return;
    if (paused) {
      v.pause();
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Resuming: play only the clip that is actually on screen.
    const r = el.getBoundingClientRect();
    const overlapY = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    const overlapX = Math.min(r.right, innerWidth) - Math.max(r.left, 0);
    if (overlapY > r.height * 0.45 && overlapX > r.width * 0.45 && v.paused) v.play().catch(() => {});
  }, [paused]);

  useEffect(() => {
    const el = box.current;
    const v = video.current;
    if (!el || !v) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (reduced || pausedRef.current) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.45, rootMargin: "0px 0px 0px 0px" }
    );
    // Start fetching just before it arrives.
    const warm = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.poster = `/stock/${c.id}.jpg`;
          v.preload = "auto";
          warm.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );
    io.observe(el);
    warm.observe(el);
    return () => {
      io.disconnect();
      warm.disconnect();
    };
  }, [c.id]);

  const flip = i % 2 === 1;
  return (
    <article
      ref={box}
      data-reveal
      className="grid w-[82vw] max-w-[360px] shrink-0 snap-start content-start gap-4 md:w-auto md:max-w-none md:grid-cols-2 md:items-center md:gap-12 md:py-14"
    >
      <div className={"relative " + (flip ? "md:order-2" : "")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] md:aspect-[5/4] md:rounded-[28px] bg-[#0b121a] ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          <video
            ref={video}
            className="h-full w-full object-cover"
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
        <h3 className="mt-2 font-display text-2xl font-extrabold uppercase leading-[1] text-foreground md:mt-3 md:text-5xl lg:text-6xl">
          {c.title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-snug text-muted-foreground md:mt-4 md:text-lg">{c.body}</p>
        <ul className="mt-3 hidden flex-wrap gap-2 md:mt-5 md:flex">
          {c.facts.map((f) => (
            <li key={f} className="glass-pill px-3.5 py-1.5 text-sm font-semibold">
              {f}
            </li>
          ))}
        </ul>
        <Link href={c.href} className="glass-btn mt-3 md:mt-6">
          {c.cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function StockReel() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const [paused, setPaused] = useState(false);
  return (
    <section className="border-t border-border py-9 md:py-20" aria-labelledby="stock-heading">
      <div className="page-container">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{hi ? "गोदाम से" : "From the godown"}</p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            {paused ? (hi ? "वीडियो चलाएँ" : "Play clips") : hi ? "वीडियो रोकें" : "Pause clips"}
          </button>
        </div>
        <h2 id="stock-heading" data-reveal className="stock-intro-title mt-3 max-w-4xl text-foreground">
          {hi ? "निर्माण को जो कुछ चाहिए" : "Everything a build needs"}
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:mt-4 md:text-base">{hi ? "सियागंज में हमारे अपने काउंटर और गोदाम पर फ़िल्माया गया। असली स्टॉक, आपके साइज़ में कटा हुआ।" : "Filmed at our own counter and godown in Siyaganj. Real stock, cut to your size."}</p>
        <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 [scrollbar-width:none] md:mx-0 md:mt-6 md:block md:divide-y md:divide-border md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {CHAPTERS.map((c, i) => (
            <Chapter key={c.id} c={c} i={i} paused={paused} />
          ))}
        </div>
      </div>
    </section>
  );
}
