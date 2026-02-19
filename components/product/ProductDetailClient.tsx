"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductImages, getProductMedia, getBrandVariant } from "@/content/products";
import { getBrandById } from "@/content/brands";
import type { Product } from "@/content/products";
import type { Category } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductBrandPicker } from "@/components/product/ProductBrandPicker";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import type { BrandId } from "@/content/brands";
import { trackProductView } from "@/lib/analytics";

type Props = {
  product: Product;
  category: Category | null;
  defaultImages: string[];
};

export function ProductDetailClient({ product, category, defaultImages }: Props) {
  useEffect(() => {
    trackProductView(product.slug, product.name, category?.name);
  }, [product.slug, product.name, category?.name]);

  const hasBrandVariants = product.brandVariants && product.brandVariants.length > 0;
  const firstBrandId = hasBrandVariants ? (product.brandVariants![0].brandId as BrandId) : null;
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId | null>(firstBrandId);

  const images = useMemo(
    () => getProductImages(product, category, selectedBrandId ?? undefined),
    [product, category, selectedBrandId]
  );
  const media = useMemo(
    () => getProductMedia(product, category, selectedBrandId ?? undefined),
    [product, category, selectedBrandId]
  );

  const variant = selectedBrandId ? getBrandVariant(product, selectedBrandId) : null;
  const displaySpecs = variant?.specs ?? product.specs;
  const displaySizes = variant?.sizes ?? product.sizes;
  const displayMaterials = variant?.materials ?? product.materials;
  const displayUseCases = variant?.useCases ?? product.useCases;
  const displayNotes = variant?.notes ?? product.notes;

  const sizeInfo = displaySizes?.length
    ? ` Size: ${displaySizes.slice(0, 3).join(", ")}`
    : "";
  const brandName = selectedBrandId ? getBrandById(selectedBrandId)?.name : "";
  const whatsAppMessage = `Hi, I'm interested in ${product.name}${brandName ? ` (${brandName} brand)` : ""}.${sizeInfo} Please share price/availability.`;

  const quoteHref = selectedBrandId
    ? `/quote?product=${product.slug}&category=${product.categorySlug}&brand=${selectedBrandId}`
    : `/quote?product=${product.slug}&category=${product.categorySlug}`;

  const hasSpecs = (displaySpecs?.length ?? 0) > 0 || product.tataOfficial || product.tataAvailable || category?.slug === "wire-mesh";
  const accordionDefaults = ["specs", "sizes", "materials", "uses", "variants"].filter((key) => {
    if (key === "specs") return hasSpecs;
    if (key === "sizes") return displaySizes && displaySizes.length > 0;
    if (key === "materials") return displayMaterials && displayMaterials.length > 0;
    if (key === "uses") return displayUseCases && displayUseCases.length > 0;
    if (key === "variants") return product.variants && product.variants.length > 0;
    return false;
  });

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 min-w-0">
      <ProductImageGallery
        key={`${product.slug}-${selectedBrandId ?? "default"}`}
        media={media}
        alt={product.imageAlt || product.name}
        productName={product.name}
        productSlug={product.slug}
      />

      <div className="min-w-0">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">{product.name}</h1>
          {category && (
            <p className="mt-2 text-muted-foreground">{category.name}</p>
          )}
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed">{product.shortDesc}</p>

        {hasBrandVariants && (
          <ProductBrandPicker
            productSlug={product.slug}
            selectedBrandId={selectedBrandId}
            onSelect={setSelectedBrandId}
            className="mt-6"
          />
        )}

        <Accordion type="multiple" defaultValue={accordionDefaults} className="mt-6 w-full">
          {hasSpecs && (
            <AccordionItem value="specs" className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 min-h-[52px] flex items-center hover:no-underline">
                Specifications
              </AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2 pb-2">
                  {product.tataOfficial && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                      <dd className="flex items-center gap-2 text-foreground">
                        <span className="relative h-[18px] w-9 shrink-0">
                          <Image src="/brands/tata.svg" alt="" width={36} height={18} className="object-contain" />
                        </span>
                        <span>Tata products available on request (Authorized Dealer).</span>
                      </dd>
                    </div>
                  )}
                  {product.tataAvailable && !product.tataOfficial && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                      <dd className="text-foreground">Tata product available on request.</dd>
                    </div>
                  )}
                  {category?.slug === "wire-mesh" && !product.tataOfficial && !product.tataAvailable && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                      <dd className="text-foreground">Available in multiple brands (trusted national + quality local options).</dd>
                    </div>
                  )}
                  {category?.slug === "wire-mesh" && (product.tataOfficial || product.tataAvailable) && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="shrink-0 text-muted-foreground">Brands:</dt>
                      <dd className="text-foreground">Available in multiple brands (trusted national + quality local options).</dd>
                    </div>
                  )}
                  {displaySpecs?.map((spec) => (
                    <div key={spec.label} className="flex flex-wrap gap-2">
                      <dt className="text-muted-foreground">{spec.label}:</dt>
                      <dd className="text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          )}
          {displaySizes && displaySizes.length > 0 && (
            <AccordionItem value="sizes" className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 min-h-[52px] flex items-center hover:no-underline">
                Sizes & Thickness
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc text-muted-foreground pb-2">
                  {displaySizes.map((size) => (
                    <li key={size}>{size}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {displayMaterials && displayMaterials.length > 0 && (
            <AccordionItem value="materials" className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 min-h-[52px] flex items-center hover:no-underline">
                Materials / Finish
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc text-muted-foreground pb-2">
                  {displayMaterials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {product.variants && product.variants.length > 0 && (
            <AccordionItem value="variants" className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 min-h-[52px] flex items-center hover:no-underline">
                Variants
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc text-muted-foreground pb-2">
                  {product.variants.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {displayUseCases && displayUseCases.length > 0 && (
            <AccordionItem value="uses" className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 min-h-[52px] flex items-center hover:no-underline">
                Common Uses
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc text-muted-foreground pb-2">
                  {displayUseCases.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {displayNotes && (
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{displayNotes}</p>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-border/60 bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Available in different sizes, weights and finishes. Stock varies.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Button asChild className="w-full sm:w-auto min-h-[44px]">
            <Link href={quoteHref}>Request a Quote</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <a
              href={getWhatsAppLink(site.whatsapp, whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp for price
            </a>
          </Button>
        </div>

        <LookingForMoreSection variant="product" className="mt-8" />
      </div>
    </div>
  );
}
