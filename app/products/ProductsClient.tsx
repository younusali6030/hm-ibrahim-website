"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, allProducts, type ProductWithCategory } from "@/content/products";
import { ProductCard } from "@/components/ProductCard";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { productFaqs } from "@/content/faqs";
import { Input } from "@/components/ui/input";
import { TataBadge } from "@/components/TataBadge";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { SpecificBrandBlock } from "@/components/SpecificBrandBlock";
import Link from "next/link";
export function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const tataOnly = searchParams.get("tata") === "1";
  const [search, setSearch] = useState("");

  const activeCategory = categoryParam
    ? categories.find((c) => c.slug === categoryParam) ?? null
    : null;

  const filteredProducts = useMemo(() => {
    let list = activeCategory ? activeCategory.products : allProducts;
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
  }, [activeCategory, search, tataOnly]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 max-w-7xl min-w-0">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">Products</h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground">
          Browse our categories and products. Use search and filters to find what you need, then
          request a quote for pricing and availability.
        </p>

        <div className="mt-6">
          <TataBadge />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
          <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scrollbar-thin min-w-0 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
            <Link
              href={tataOnly ? (activeCategory ? `/products?category=${activeCategory.slug}` : "/products") : (activeCategory ? `/products?category=${activeCategory.slug}&tata=1` : "/products?tata=1")}
              className={`shrink-0 snap-start rounded-md border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                tataOnly
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              Tata Available
            </Link>
            <Link
              href="/products"
              className={`shrink-0 snap-start rounded-md border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                !activeCategory && !tataOnly
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}${tataOnly ? "&tata=1" : ""}`}
                className={`shrink-0 snap-start rounded-md border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                  activeCategory?.slug === cat.slug
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
        <div className="mt-6">
          <LookingForMoreSection variant="page" />
        </div>

        {activeCategory && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">{activeCategory.name}</h2>
            <p className="mt-2 text-muted-foreground">{activeCategory.description}</p>
            <Link
              href={`/quote?category=${activeCategory.slug}`}
              className="mt-4 inline-block text-primary hover:underline"
            >
              Request quote for this category →
            </Link>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            {activeCategory ? activeCategory.name : "All products"}
          </h2>
          {filteredProducts.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No products match your search.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.slug}
                  product={{
                    ...product,
                    categoryName: activeCategory?.name ?? ("categoryName" in product ? (product as ProductWithCategory).categoryName : ""),
                  }}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
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
