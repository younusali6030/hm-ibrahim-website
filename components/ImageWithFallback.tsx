"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt: string;
  fallbackSrc?: string;
};

/**
 * Wrapper around next/image that falls back to a local placeholder
 * when the remote image fails to load.
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder-product.svg",
  ...props
}: Props) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || fallbackSrc);

  if (!currentSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

