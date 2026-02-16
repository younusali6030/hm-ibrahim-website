"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product, ProductWithCategory } from "@/content/products";
import { getCategoryBySlug, getProductImages } from "@/content/products";
import { getBrandsForProduct } from "@/content/brands";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type Props = {
  product: Product | ProductWithCategory;
  index?: number;
};

export function ProductCard({ product, index = 0 }: Props) {
  const categoryName = "categoryName" in product ? product.categoryName : undefined;
  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const imgSrc = images[0];
  const imgAlt =
    product.imageAlt ||
    category?.imageAlt ||
    `${product.name} product image for ${categoryName || product.categorySlug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/50">
        <Link href={`/products/${product.slug}`} className="block h-full">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <ImageWithFallback
              src={imgSrc}
              alt={imgAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {categoryName && (
              <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground">
                {categoryName}
              </span>
            )}
            {getBrandsForProduct(product.slug).length > 0 && (
              <div className="absolute right-2 top-2 flex gap-1.5">
                {getBrandsForProduct(product.slug).map((brand) => (
                  <span
                    key={brand.id}
                    className="flex items-center gap-1 rounded-md border border-border/80 bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    <span className="relative h-3.5 w-7 shrink-0">
                      <Image src={brand.logo} alt="" width={28} height={14} className="object-contain" />
                    </span>
                    {brand.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.shortDesc}
            </p>
            {product.specs && product.specs.length > 0 && (
              <div className="mt-2 space-y-1">
                {product.specs.slice(0, 2).map((spec) => (
                  <div key={spec.label} className="text-xs text-muted-foreground">
                    <span className="font-medium">{spec.label}:</span> {spec.value}
                  </div>
                ))}
              </div>
            )}
            {(product.tataOfficial || product.tataAvailable) && (
              <p className="mt-2 text-xs text-muted-foreground">
                Tata product available on request
              </p>
            )}
          </CardContent>
        </Link>
        <div className="border-t border-border px-4 pb-4 pt-0">
          <Button asChild variant="outline" size="sm" className="w-full mt-2">
            <Link href={`/products/${product.slug}`}>View details & quote</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
