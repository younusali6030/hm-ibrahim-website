"use client";

import { motion } from "framer-motion";

const placeholderBrands = ["Brand A", "Brand B", "Brand C", "Brand D"];

export function BrandsSection() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="brands-heading">
      <div className="page-container section-padding">
        <motion.h2
          id="brands-heading"
          className="text-center text-2xl font-semibold text-foreground"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Brands we stock
        </motion.h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          We carry trusted brands for steel, wire, and hardware. Contact us for specific brand availability.
        </p>
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {placeholderBrands.map((brand) => (
            <span
              key={brand}
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-muted-foreground"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
