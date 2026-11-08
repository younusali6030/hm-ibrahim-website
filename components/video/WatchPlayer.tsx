"use client";

import { useLang } from "@/lib/i18n";
import { tracksFor } from "@/content/captions";

/**
 * The main video on a /videos/<id> watch page. Native controls give play, pause, seek, volume and
 * full screen with keyboard support; nothing autoplays. The poster loads up front because the video
 * is the page's main content (Google reads the poster as the thumbnail).
 */
export function WatchPlayer({ id, title }: { id: string; title: string }) {
  const { lang } = useLang();
  return (
    <video
      className="aspect-[9/16] w-full rounded-[18px] bg-[#0b121a] object-cover ring-1 ring-white/15"
      poster={`/reels/${id}.jpg`}
      controls
      playsInline
      preload="metadata"
      aria-label={title}
      width={720}
      height={1280}
    >
      <source src={`/reels/${id}.mp4`} type="video/mp4" />
      {tracksFor(id).map((c) => (
        <track key={c.src} kind="captions" srcLang={c.lang} label={c.label} src={c.src} default={c.lang === lang} />
      ))}
    </video>
  );
}
