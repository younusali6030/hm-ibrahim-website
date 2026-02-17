"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { inHouseBrands } from "@/content/brands";
import { site } from "@/content/site";

export function InHouseBrandsSection() {
  if (!site.inHouseBrandsEnabled || inHouseBrands.length === 0) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-16 md:py-20" aria-labelledby="inhouse-brands-heading">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl min-w-0">
        <motion.h2
          id="inhouse-brands-heading"
          className="text-center text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Signature Brands
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Barbed Wire & Chain Link Fencing (Jali) in trusted brands
        </motion.p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {inHouseBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={`/brands/${brand.id}`}
                className="block rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span className="relative mx-auto flex h-20 w-40 items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={160}
                    height={80}
                    className="object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </span>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  Barbed Wire • Chain Link Fencing
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
