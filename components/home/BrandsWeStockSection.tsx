"use client";

import { motion } from "framer-motion";
import { stockedBrands } from "@/content/stockedBrands";
export function BrandsWeStockSection() {
  if (stockedBrands.length === 0) return null;

  return (
    <section
      className="border-y border-border bg-card/30 py-16 md:py-20"
      aria-labelledby="brands-we-stock-heading"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          id="brands-we-stock-heading"
          className="text-center text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Brands We Stock
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          We stock trusted national brands and high-quality local products. Call or WhatsApp for
          availability.
        </motion.p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stockedBrands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{brand.name}</h3>
                {brand.isAuthorized && (
                  <span className="shrink-0 rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                    Authorized Dealer
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{brand.specialty}</p>
              {brand.note && (
                <p className="mt-2 text-xs text-muted-foreground">{brand.note}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
