"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/content/products";
import { getIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 md:py-20" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl min-w-0">
        <motion.h2
          id="categories-heading"
          className="text-center text-2xl font-bold text-foreground sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Product Categories
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-2xl text-center text-sm sm:text-base text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Iron, steel, pipes, wire, mesh, and hardware for construction and fabrication
        </motion.p>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.icon);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/products?category=${cat.slug}`} className="block h-full">
                  <Card className="h-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-md transition-transform duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      {cat.image ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                          <ImageWithFallback
                            src={cat.image}
                            alt={cat.imageAlt || `${cat.name} category image`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="lazy"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        </div>
                      ) : null}
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {cat.description}
                      </p>
                      <span className="mt-2 inline-block text-sm text-primary">
                        View products →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
