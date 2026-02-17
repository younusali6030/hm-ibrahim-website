"use client";

import Image from "next/image";
import { getBrandsForProduct } from "@/content/brands";
import type { BrandId } from "@/content/brands";
import type { Product } from "@/content/products";

type Props = {
  productSlug: string;
  selectedBrandId: BrandId | null;
  onSelect: (brandId: BrandId) => void;
  className?: string;
};

export function ProductBrandPicker({ productSlug, selectedBrandId, onSelect, className = "" }: Props) {
  const brands = getBrandsForProduct(productSlug);
  if (brands.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-foreground">Choose Brand</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => onSelect(brand.id)}
            className={`flex items-center gap-3 rounded-xl border-2 bg-card p-4 transition-all hover:border-primary/50 ${
              selectedBrandId === brand.id ? "border-primary ring-2 ring-primary/20" : "border-border"
            }`}
          >
            <span className="relative h-12 w-24 shrink-0 overflow-hidden rounded-md bg-muted/50">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain object-center"
                sizes="96px"
              />
            </span>
            <span className="font-medium text-foreground">{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
