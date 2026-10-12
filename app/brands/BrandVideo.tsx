"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function BrandVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  }

  return (
    <figure className="mx-auto w-full max-w-xs">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video: chain link fencing walkthrough"}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-sm bg-[#0b121a] ring-1 ring-border"
      >
        <video
          ref={ref}
          className="h-full w-full object-cover"
          poster="/reels/chainlink-walkthrough.jpg"
          preload="none"
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/reels/chainlink-walkthrough.mp4" type="video/mp4" />
        </video>
        <span
          className={"absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity " + (playing ? "opacity-0 group-hover:opacity-100" : "")}
          aria-hidden="true"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="ml-1 h-7 w-7" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3 text-sm text-muted-foreground">Chain link fencing, walked through at our shop. Tap to play with sound.</figcaption>
    </figure>
  );
}
