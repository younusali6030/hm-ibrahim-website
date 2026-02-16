"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  quoteLabel?: string;
  whatsAppMessage?: string;
};

export function CTASection({
  title = "Ready to order?",
  description = "Request a quote or reach us on WhatsApp for quick pricing and availability.",
  quoteLabel = "Request a Quote",
  whatsAppMessage = "Hi, I'm interested in your products. Please share price/availability.",
}: Props) {
  return (
    <section className="bg-primary/10 border-y border-border py-16 md:py-20" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          id="cta-heading"
          className="text-2xl font-bold text-foreground md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mx-auto mt-3 max-w-xl text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Button asChild size="lg">
            <Link href="/quote">{quoteLabel}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href={getWhatsAppLink(site.whatsapp, whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
