"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

const REELS = [
  { id: "shop-par-bharosa", title: "Shop par bharosa", note: "Walk in. See the stock. Decide." },
  { id: "check-the-strength", title: "Check the strength", note: "Wire and mesh, tested in front of you." },
  { id: "weldmesh-jali", title: "Weldmesh jali", note: "Rolls and panels, any gauge." },
];

function Reel({ id, title, note }: (typeof REELS)[number]) {
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
        aria-label={`${playing ? "Pause" : "Play"} reel: ${title}`}
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
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:mx-0 sm:px-0" tabIndex={0} aria-label="Reels from the counter, scroll sideways">
      <div className="flex snap-x snap-mandatory gap-4">
        {REELS.map((r) => (
          <Reel key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}
