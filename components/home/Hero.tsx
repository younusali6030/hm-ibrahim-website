"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { inHouseBrands } from "@/content/brands";
import { getWhatsAppLink } from "@/lib/utils";
import { Award, BadgeCheck, Store, Package } from "lucide-react";

const SEO_SUBLINE =
  "Wire mesh, barbed wire, chain link, perforated sheets, Tata wire & more in Indore.";

const TRUST_ITEMS = [
  { icon: Award, label: "80+ Years Legacy" },
  { icon: BadgeCheck, label: "Authorized Tata Dealer" },
  { icon: Store, label: "Retail + Wholesale" },
  { icon: Package, label: "Bulk Orders Available" },
];

export function Hero() {
  const showBrandStrip =
    site.authorizedDealer.enabled || (site.inHouseBrandsEnabled && inHouseBrands.length >= 2);
  // For the hero strip, we want to avoid showing Tata twice.
  // Tata Wiron already appears via the authorizedDealer badge, so we only show CM and Border here.
  const heroBrands = inHouseBrands.filter((brand) => brand.id !== "tata");

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-industrial-900 to-background px-4 py-16 md:py-28"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto text-center min-w-0 max-w-6xl">
        <motion.h1
          id="hero-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary">HM Ibrahim & Co</span>
          <br />
          Trusted Iron & Hardware Since 1939
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {site.tagline}
        </motion.p>
        <motion.p
          className="mx-auto mt-2 max-w-lg text-xs text-muted-foreground/90 md:text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {SEO_SUBLINE}
        </motion.p>

        {site.googleReview && (
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <a
              href={site.googleReview.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
            >
              <span className="text-primary">★</span>
              <span>{site.googleReview.rating} on Google</span>
              <span>({site.googleReview.reviewCount}+ reviews)</span>
            </a>
          </motion.div>
        )}

        {showBrandStrip && (
          <motion.div
            className="mt-5 flex justify-center min-w-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 max-w-full">
              {site.authorizedDealer.enabled && (
                <Link
                  href="/products?tata=1"
                  className="flex items-center rounded-lg border border-border/50 bg-transparent px-3 py-2 transition hover:border-primary/30"
                  aria-label="Tata Wiron products"
                >
                  <Image
                    src="/brands/tata-wiron.png"
                    alt="Tata Wiron"
                    width={80}
                    height={32}
                    className="h-7 w-auto object-contain"
                    priority
                    sizes="(max-width: 768px) 80px, 80px"
                  />
                </Link>
              )}
              {heroBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="flex items-center rounded-lg border border-border/50 bg-transparent px-3 py-2 transition hover:border-primary/30"
                  aria-label={`${brand.name} — ${brand.tagline}`}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={brand.id === "cm" ? 48 : 64}
                    height={24}
                    className="h-6 w-auto object-contain"
                    priority
                    sizes="(max-width: 768px) 64px, 64px"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button asChild size="lg" className="w-full max-w-sm sm:min-w-[160px]">
            <Link href="/quote">Request a Quote</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full max-w-sm sm:min-w-[160px]">
            <a
              href={getWhatsAppLink(
                site.whatsapp,
                "Hi, I'm interested in your iron and hardware products. Please share price/availability."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </Button>
        </motion.div>

        <motion.div
          className="mt-6 grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center gap-1.5 md:justify-center"
            >
              <item.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="text-[11px] text-muted-foreground md:text-xs">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
