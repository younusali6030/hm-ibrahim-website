"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function ProductImageGallery({
  media: mediaProp,
  images: imagesProp,
  alt,
  productName,
  productSlug,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const media: ProductMediaItem[] =
    mediaProp ??
    (imagesProp?.length
      ? imagesProp.map((src) =>
          isVideoSrc(src) ? { type: "video", src } : { type: "image", src }
        )
      : []);

  useEffect(() => {
    setActiveIndex(0);
  }, [productSlug, media?.length]);

  if (!media || media.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <ImageWithFallback
          src="/placeholder-product.svg"
          alt={alt || productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  const current = media[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((i) => (i - 1 + media.length) % media.length);
  };

  const goToNext = () => {
    setActiveIndex((i) => (i + 1) % media.length);
  };

  return (
    <div className="space-y-4 min-w-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted shrink-0">
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            controls
            playsInline
            muted
            loop
            className="h-full w-full object-cover"
            aria-label={alt ? `${alt} video` : `${productName} video`}
          />
        ) : (
          <ImageWithFallback
            key={current.src}
            src={current.src}
            alt={alt || productName}
            fill
            className="object-cover"
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
          />
        )}
        {media.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background min-h-[44px] min-w-[44px] h-11 w-11 md:h-9 md:w-9 md:min-h-0 md:min-w-0"
              onClick={goToPrevious}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background min-h-[44px] min-w-[44px] h-11 w-11 md:h-9 md:w-9 md:min-h-0 md:min-w-0"
              onClick={goToNext}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              {activeIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto pb-1 md:pb-0 snap-x snap-mandatory md:snap-align-none scrollbar-thin min-w-0 -mx-4 px-4 md:mx-0 md:px-0">
          {media.map((item, idx) => (
            <button
              key={`${item.src}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square w-16 h-16 sm:w-20 sm:h-20 md:w-full shrink-0 overflow-hidden rounded-md border-2 transition-all snap-start min-w-[64px] sm:min-w-[80px] ${
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={
                item.type === "video"
                  ? `Play video ${idx + 1}`
                  : `View image ${idx + 1}`
              }
            >
              {item.type === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Play className="h-8 w-8 text-muted-foreground" fill="currentColor" />
                </div>
              ) : (
                <ImageWithFallback
                  src={item.src}
                    alt={alt ? `${alt} thumbnail` : `${productName} thumbnail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, (max-width: 1024px) 25vw, 12.5vw"
                  loading={idx < 4 ? undefined : "lazy"}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
