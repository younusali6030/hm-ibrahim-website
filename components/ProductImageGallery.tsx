"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { ProductMediaItem } from "@/content/products";

type Props = {
  /** When provided, gallery shows both images and videos (images first). */
  media?: ProductMediaItem[];
  /** Legacy: when media is not provided, use images only. */
  images?: string[];
  alt: string;
  productName: string;
  productSlug?: string;
};

function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src);
}

/** Swipeable on phones (scroll-snap, native momentum), arrows and thumbnails on larger screens. Only the visible video plays. */
export function ProductImageGallery({ media: mediaProp, images: imagesProp, alt, productName, productSlug }: Props) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const media: ProductMediaItem[] =
    mediaProp ??
    (imagesProp?.length ? imagesProp.map((src) => (isVideoSrc(src) ? { type: "video" as const, src } : { type: "image" as const, src })) : []);

  const goTo = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setActive(0);
    scroller.current?.scrollTo({ left: 0 });
  }, [productSlug, media.length]);

  // Only the slide on screen plays.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  if (media.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[hsl(210_30%_10%)]">
        <ImageWithFallback src="/placeholder-product.svg" alt={alt || productName} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    );
  }

  return (
    <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
      <div className="relative">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[14px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label={`${productName} photos and videos`}
        >
          {media.map((item, i) => (
            <div key={`${item.src}-${i}`} className="relative aspect-[4/3] w-full shrink-0 snap-center snap-always">
              {item.type === "video" ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={item.src}
                  poster={item.src.replace(/\.mp4$/, ".jpg")}
                  controls
                  muted
                  loop
                  playsInline
                  preload={i === active ? "auto" : "none"}
                  className="h-full w-full bg-black object-contain"
                  aria-label={`${alt || productName} video`}
                />
              ) : (
                <ImageWithFallback
                  src={item.src}
                  alt={i === 0 ? alt || productName : `${alt || productName}, view ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo((active - 1 + media.length) % media.length)}
              className="border border-white/20 bg-background/80 absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo((active + 1) % media.length)}
              className="border border-white/20 bg-background/80 absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex rounded-full bg-background/70 -translate-x-1/2 items-center gap-1.5 px-3 py-2" aria-hidden="true">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-primary" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 hidden gap-2 sm:grid sm:grid-cols-5 [&>button]:aspect-[4/3]">
          {media.slice(0, 10).map((item, idx) => (
            <button
              key={`${item.src}-${idx}`}
              type="button"
              onClick={() => goTo(idx)}
              className={`relative overflow-hidden rounded-[6px] border-2 bg-[hsl(210_30%_10%)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={item.type === "video" ? `Show video ${idx + 1}` : `Show image ${idx + 1}`}
            >
              {item.type === "video" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src.replace(/\.mp4$/, ".jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <Play className="h-6 w-6 text-white" fill="currentColor" />
                  </span>
                </>
              ) : (
                <ImageWithFallback src={item.src} alt="" fill className="object-cover" sizes="96px" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
