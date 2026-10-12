"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { tracksFor } from "@/content/captions";

const REELS = [
  { id: "shop-par-bharosa", title: "Shop par bharosa", note: "Walk in. See the stock. Decide." },
  { id: "check-the-strength", title: "Check the strength", note: "Wire and mesh, tested in front of you." },
  { id: "weldmesh-jali", title: "Weldmesh jali", note: "Rolls and panels, any gauge." },
];

const REELS_HI: Record<string, { title: string; note: string }> = {
  "shop-par-bharosa": { title: "दुकान पर भरोसा", note: "आइए। माल देखिए। फिर तय कीजिए।" },
  "check-the-strength": { title: "मज़बूती परखिए", note: "तार और जाली, आपके सामने जाँची गई।" },
  "weldmesh-jali": { title: "वेल्डमेश जाली", note: "रोल और पैनल, हर गेज।" },
};

function Reel({ id, title: titleEn, note: noteEn }: (typeof REELS)[number]) {
  const { lang } = useLang();
  const hi = lang === "hi";
  const title = hi ? REELS_HI[id]?.title ?? titleEn : titleEn;
  const note = hi ? REELS_HI[id]?.note ?? noteEn : noteEn;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      document.querySelectorAll<HTMLVideoElement>("video[data-reel]").forEach((o) => o !== v && o.pause());
      v.play().catch(() => setPlaying(false));
    } else {
      v.pause();
    }
  }

  return (
    <figure className="w-[58vw] max-w-[250px] shrink-0 snap-start sm:w-[220px]">
      <button
        type="button"
        onClick={toggle}
        aria-label={hi ? `रील ${playing ? "रोकें" : "चलाएँ"}: ${title}` : `${playing ? "Pause" : "Play"} reel: ${title}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-[#0b121a] ring-1 ring-white/10"
      >
        <video
          ref={ref}
          data-reel
          className="h-full w-full object-cover"
          preload="none"
          poster={`/reels/${id}.jpg`}
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={`/reels/${id}.mp4`} type="video/mp4" />
          {tracksFor(id).map((c) => (
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
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/30">
            <Play className="ml-0.5 h-6 w-6 text-white" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3">
        <span className="block font-display text-xl font-extrabold uppercase leading-none text-foreground">{title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{note}</span>
      </figcaption>
    </figure>
  );
}

/** Three reels from the Siyaganj counter. Posters only until someone taps; nothing autoplays. */
export function IndoreReels() {
  const { lang } = useLang();
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:mx-0 sm:px-0" tabIndex={0} aria-label={lang === "hi" ? "काउंटर की रील, बगल में स्क्रोल करें" : "Reels from the counter, scroll sideways"}>
      <div className="flex snap-x snap-mandatory gap-4">
        {REELS.map((r) => (
          <Reel key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}
