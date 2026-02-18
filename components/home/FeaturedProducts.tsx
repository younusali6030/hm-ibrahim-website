"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedProducts } from "@/content/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="py-12 sm:py-16 md:py-20" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl min-w-0">
        <motion.div
          className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="featured-heading" className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl text-center md:text-left">
            Featured Products
          </h2>
          <Button asChild variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <Link href="/products">View all products</Link>
          </Button>
        </motion.div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm sm:text-base text-muted-foreground md:text-left">
          Popular items from our catalog — request a quote for pricing and availability
        </p>
        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
