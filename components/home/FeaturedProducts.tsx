"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getFeaturedProducts } from "@/content/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="py-16 md:py-20" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="featured-heading" className="text-3xl font-bold text-foreground md:text-4xl">
            Featured Products
          </h2>
          <Button asChild variant="outline">
            <Link href="/products">View all products</Link>
          </Button>
        </motion.div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground md:text-left">
          Popular items from our catalog — request a quote for pricing and availability
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
