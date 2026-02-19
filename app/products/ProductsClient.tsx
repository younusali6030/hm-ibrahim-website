"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, allProducts, getCategoryThumbnails, type ProductWithCategory } from "@/content/products";
import { ProductCard } from "@/components/ProductCard";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { productFaqs } from "@/content/faqs";
import { Input } from "@/components/ui/input";
import { TataBadge } from "@/components/TataBadge";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { SpecificBrandBlock } from "@/components/SpecificBrandBlock";
import { getIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const viewAll = searchParams.get("view") === "all";
  const tataOnly = searchParams.get("tata") === "1";
  const [search, setSearch] = useState("");

  const activeCategory = categoryParam
    ? categories.find((c) => c.slug === categoryParam) ?? null
    : null;

  const listForFiltering = viewAll ? allProducts : (activeCategory ? activeCategory.products : allProducts);
  const filteredProducts = useMemo(() => {
    let list = listForFiltering;
    if (tataOnly) list = list.filter((p) => p.tataOfficial === true || p.tataAvailable === true);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => {
        const catName = "categoryName" in p ? (p as ProductWithCategory).categoryName : "";
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          catName.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [listForFiltering, search, tataOnly]);

  const allProductsFilteredBySearch = useMemo(() => {
    let list = allProducts;
    if (tataOnly) list = list.filter((p) => p.tataOfficial === true || p.tataAvailable === true);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => {
        const catName = "categoryName" in p ? (p as ProductWithCategory).categoryName : "";
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          catName.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [search, tataOnly]);

  const showCategoryGrid = !activeCategory && !viewAll;
  const showProductList = !!activeCategory || viewAll;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 max-w-7xl min-w-0">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">Products</h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground">
          {showCategoryGrid
            ? "Choose a category below to browse products in that section. Then request a quote for pricing and availability."
            : "Browse products in this category. Use search to filter, or request a quote for pricing and availability."}
        </p>

        {showCategoryGrid ? (
          <>
            <div className="mt-6">
              <Button asChild className="w-full sm:w-auto min-h-[44px]">
                <Link href="/products?view=all">See all products</Link>
              </Button>
            </div>
            <div className="mt-4">
              <TataBadge />
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1 w-full min-w-0">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 min-h-[44px] text-base"
                  aria-label="Search products"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
                  🔍
                </span>
              </div>
            </div>

            {search.trim() && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-foreground">Search results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {allProductsFilteredBySearch.length === 0
                    ? "No products match your search."
                    : `${allProductsFilteredBySearch.length} product${allProductsFilteredBySearch.length === 1 ? "" : "s"} found.`}
                </p>
                {allProductsFilteredBySearch.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {allProductsFilteredBySearch.map((product, i) => (
                      <ProductCard
                        key={product.slug}
                        product={{
                          ...product,
                          categoryName: "categoryName" in product ? (product as ProductWithCategory).categoryName : "",
                        }}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">Browse by category</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Click a category to see all products in that section.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((cat) => {
                const Icon = getIcon(cat.icon);
                const thumbnails = getCategoryThumbnails(cat, 6);
                return (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="block h-full group"
                  >
                    <Card className="h-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-md transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        {thumbnails.length > 0 ? (
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {thumbnails.map((t, j) => (
                              <div
                                key={j}
                                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                              >
                                <ImageWithFallback
                                  src={t.src}
                                  alt={t.alt}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="56px"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        ) : cat.image ? (
                          <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                            <ImageWithFallback
                              src={cat.image}
                              alt={cat.imageAlt || `${cat.name} category`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                          </div>
                        ) : null}
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{cat.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                        <span className="mt-3 inline-block text-sm text-primary font-medium">
                          View products →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8">
              <SpecificBrandBlock />
            </div>
            <div className="mt-6">
              <LookingForMoreSection variant="page" />
            </div>
          </>
        ) : (
          <>
            <div className="mt-6">
              <TataBadge />
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative w-full max-w-md">
                <Input
                  type="search"
                  placeholder={viewAll ? "Search all products..." : "Search in this category..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 min-h-[44px] text-base"
                  aria-label="Search products"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden>
                  🔍
                </span>
              </div>
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scrollbar-thin min-w-0 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
                <Link
                  href="/products"
                  className="shrink-0 snap-start rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent min-h-[44px] flex items-center justify-center"
                >
                  All categories
                </Link>
                <Link
                  href={viewAll ? (tataOnly ? "/products?view=all" : "/products?view=all&tata=1") : (tataOnly ? `/products?category=${activeCategory!.slug}` : `/products?category=${activeCategory!.slug}&tata=1`)}
                  className={`shrink-0 snap-start rounded-md border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                    tataOnly ? "border-primary bg-primary/20 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Tata Available
                </Link>
                {viewAll && (
                  <span className="shrink-0 snap-start rounded-md border border-primary bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary min-h-[44px] flex items-center justify-center">
                    All products
                  </span>
                )}
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={viewAll ? `/products?category=${cat.slug}${tataOnly ? "&tata=1" : ""}` : `/products?category=${cat.slug}${tataOnly ? "&tata=1" : ""}`}
                    className={`shrink-0 snap-start rounded-md border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                      !viewAll && activeCategory?.slug === cat.slug
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SpecificBrandBlock />
            </div>

            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground">{viewAll ? "All products" : activeCategory!.name}</h2>
              <p className="mt-2 text-muted-foreground">{viewAll ? "Browse our full range. Use search or category filters above." : activeCategory!.description}</p>
              {!viewAll && (
                <Link
                  href={`/quote?category=${activeCategory!.slug}`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Request quote for this category →
                </Link>
              )}
              {viewAll && (
                <Link href="/quote" className="mt-4 inline-block text-primary hover:underline">
                  Request a quote →
                </Link>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-foreground">{viewAll ? "All products" : activeCategory!.name}</h2>
              {filteredProducts.length === 0 ? (
                <p className="mt-4 text-muted-foreground">No products match your search.</p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, i) => (
                    <ProductCard
                      key={product.slug}
                      product={{
                        ...product,
                        categoryName: viewAll ? ("categoryName" in product ? (product as ProductWithCategory).categoryName : "") : activeCategory!.name,
                      }}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CTASection
        title="Need a quote?"
        description="Tell us the product and quantity — we'll respond with pricing and availability."
        quoteLabel="Request a Quote"
      />
      <FAQAccordion faqs={productFaqs} title="Product FAQs" />
    </>
  );
}
