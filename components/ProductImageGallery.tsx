"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
  alt: string;
  productName: string;
  productSlug?: string;
};

export function ProductImageGallery({ images, alt, productName, productSlug }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first image when product or images change (e.g. navigating between products)
  useEffect(() => {
    setActiveIndex(0);
  }, [productSlug, images?.length]);

  if (!images || images.length === 0) {
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

  const currentImage = images[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main image - key forces remount when image changes so Next/Image shows correct src */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <ImageWithFallback
          key={currentImage}
          src={currentImage}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                activeIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <ImageWithFallback
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
