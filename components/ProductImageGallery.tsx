"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { ProductMediaItem } from "@/content/products";
import { useLang } from "@/lib/i18n";
import { blurFor, creditFor, isIllustration } from "@/lib/media";

type Props = {
  /** When provided, gallery shows both images and videos (images first). */
  media?: ProductMediaItem[];
  /** Legacy: when media is not provided, use images only. */
  images?: string[];
  alt: string;
  productName: string;
  productSlug?: string;
  /** Rendered under the thumbnails. When present the column scrolls with the page instead of sticking. */
  footer?: ReactNode;
};

function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src);
}

/** Swipeable on phones (scroll-snap, native momentum), arrows and thumbnails on larger screens. Only the visible video plays. */
export function ProductImageGallery({ media: mediaProp, images: imagesProp, alt, productName, productSlug, footer }: Props) {
  const { lang } = useLang();
  const hi = lang === "hi";
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
    <div className={"min-w-0 " + (footer ? "" : "lg:sticky lg:top-28 lg:self-start")}>
      <div className="relative">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[14px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-roledescription="carousel"
          aria-label={hi ? `${productName} की फ़ोटो और वीडियो` : `${productName} photos and videos`}
          // A scroll region must be reachable by keyboard; arrow keys move between slides.
          tabIndex={media.length > 1 ? 0 : undefined}
          onKeyDown={(e) => {
            if (media.length < 2 || e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(Math.min(active + 1, media.length - 1));
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(Math.max(active - 1, 0));
            }
          }}
        >
          {media.map((item, i) => (
            <div key={`${item.src}-${i}`} className="relative aspect-[4/3] w-full shrink-0 snap-center snap-always">
              {item.type === "video" ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={item.src}
                  // Posters are 150 to 190 KB each: only the slide on screen fetches one, so they do not
                  // compete with the first photo (the LCP element) on a phone connection.
                  poster={i === active ? item.src.replace(/\.mp4$/, ".jpg") : undefined}
                  controls
                  muted
                  loop
                  playsInline
                  preload={i === active ? "auto" : "none"}
                  className="h-full w-full bg-black object-contain"
                  aria-label={hi ? `${alt || productName} वीडियो` : `${alt || productName} video`}
                />
              ) : (
                <div
                  className="group/zoom absolute inset-0 overflow-hidden motion-safe:lg:cursor-zoom-in"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
                    e.currentTarget.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
                  }}
                >
                  <ImageWithFallback
                    src={item.src}
                    alt={i === 0 ? alt || productName : hi ? `${alt || productName}, दृश्य ${i + 1}` : `${alt || productName}, view ${i + 1}`}
                    fill
                    className={`${isIllustration(item.src) ? "object-contain p-6" : "object-cover"} [transform-origin:var(--zx,50%)_var(--zy,50%)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:lg:group-hover/zoom:scale-[1.9]`}
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    {...(blurFor(item.src) ? { placeholder: "blur" as const, blurDataURL: blurFor(item.src) } : {})}
                  />
                </div>
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
              aria-label={hi ? "पिछला" : "Previous"}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo((active + 1) % media.length)}
              className="border border-white/20 bg-background/80 absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex"
              aria-label={hi ? "अगला" : "Next"}
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

      {(() => {
        const cur = media[active];
        const credit = cur && cur.type === "image" ? creditFor(cur.src) : undefined;
        const drawing = cur && cur.type === "image" && isIllustration(cur.src);
        if (!credit && !drawing) return null;
        return (
          <p className="mt-2 font-mono-brand text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {drawing ? (hi ? "चित्र: सेक्शन प्रोफ़ाइल (फ़ोटो नहीं)" : "Drawing: section profile, not a photograph") : `${hi ? "फ़ोटो" : "Photo"}: ${credit}`}
          </p>
        );
      })()}

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
              aria-label={hi ? (item.type === "video" ? `वीडियो ${idx + 1} दिखाएँ` : `फ़ोटो ${idx + 1} दिखाएँ`) : item.type === "video" ? `Show video ${idx + 1}` : `Show image ${idx + 1}`}
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
      {footer}
    </div>
  );
}
