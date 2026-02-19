"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Truck, BadgeDollarSign, Factory } from "lucide-react";
import { localSeo } from "@/lib/site";

const INTENT_BLOCKS = [
  {
    icon: BadgeDollarSign,
    title: "Best price in Indore",
    text: "We offer competitive rates on iron, steel, wire mesh, and hardware in Siyaganj. Get a quote for retail or bulk — we aim to give you the best value in Indore and Madhya Pradesh.",
    link: "/quote",
    linkLabel: "Request a quote",
  },
  {
    icon: Package,
    title: "Wholesale in Indore",
    text: "Contractors, fabricators, and dealers: we supply wholesale quantities across Indore, Dewas, Ujjain, Mhow, and nearby areas. Bulk orders welcome.",
    link: "/products",
    linkLabel: "View products",
  },
  {
    icon: Truck,
    title: "Delivery in Indore",
    text: "We can arrange delivery for local and outstation orders. Pickup from our warehouse at 60, Siyaganj is always available. Tell us your requirement when you enquire.",
    link: "/contact",
    linkLabel: "Contact us",
  },
  {
    icon: Factory,
    title: "Industrial suppliers in Indore",
    text: "From MS angles and TMT bars to wire mesh, barbed wire, and construction hardware — we stock what industries and construction sites need. Serving Indore since 1939.",
    link: "/categories/structural-items",
    linkLabel: "Iron & steel",
  },
];

export function IndoreIntentSection() {
  return (
    <section className="border-y border-border bg-muted/20 py-16 md:py-20" aria-labelledby="indore-intent-heading">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl min-w-0">
        <motion.h2
          id="indore-intent-heading"
          className="text-center text-2xl font-bold text-foreground md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why buy from us in {localSeo.city}, {localSeo.state}
        </motion.h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Retail and wholesale iron & hardware in Siyaganj, Indore. Competitive prices, reliable stock, and delivery options.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INTENT_BLOCKS.map((block, i) => (
            <motion.div
              key={block.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <block.icon className="h-8 w-8 text-primary mb-3" aria-hidden />
              <h3 className="font-semibold text-foreground">{block.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{block.text}</p>
              <Link
                href={block.link}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                {block.linkLabel} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
