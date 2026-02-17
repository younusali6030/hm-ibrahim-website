"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck, IndianRupee, Package, Handshake, Store } from "lucide-react";

const points = [
  {
    icon: Award,
    title: "Est. 1939",
    description: "Over eight decades of trusted iron and hardware trading in Siyaganj, Indore.",
  },
  {
    icon: Store,
    title: "Retail + Wholesale",
    description: "We serve individual buyers, contractors, and bulk orders with the same attention.",
  },
  {
    icon: IndianRupee,
    title: "Fair pricing",
    description: "Transparent, competitive rates for retail and wholesale. No hidden charges.",
  },
  {
    icon: Package,
    title: "Fast fulfilment",
    description: "Our warehouse in Siyaganj keeps key categories in stock for quick fulfillment.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted brands",
    description: "Our signature brands CM and Boarder for barbed wire and chain link; authorized Tata dealer for steel and wire.",
  },
  {
    icon: Handshake,
    title: "Long-term relationships",
    description: "Generations of trust with builders, fabricators, and dealers across Indore and nearby areas.",
  },
];

export function WhyUs() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="why-heading">
      <div className="container mx-auto px-4">
        <motion.h2
          id="why-heading"
          className="text-center text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why HM Ibrahim & Co
        </motion.h2>
        <motion.p
          className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          A legacy of reliability and service since 1939
        </motion.p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {points.map((item, i) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
