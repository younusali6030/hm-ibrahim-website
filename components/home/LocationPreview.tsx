"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

export function LocationPreview() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;

  return (
    <section className="py-16 md:py-20" aria-labelledby="location-heading">
      <div className="container mx-auto px-4">
        <motion.h2
          id="location-heading"
          className="text-center text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Visit Us
        </motion.h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-8 md:grid-cols-2 md:gap-10">
          <motion.div
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Image
              src="/about-storefront.png"
              alt="HM Ibrahim & Co storefront at Siyaganj, Indore"
              width={600}
              height={400}
              className="h-56 w-full object-cover md:h-64"
            />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center text-center md:text-left"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-muted-foreground">{site.fullAddress}</p>
            <p className="mt-1 text-sm text-muted-foreground">{site.landmark}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild variant="outline" size="lg">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4" aria-hidden />
                  Get Directions
                </a>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">Contact & map</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
