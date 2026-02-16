"use client";

import { motion } from "framer-motion";
import { Calendar, Store, MapPin, Zap } from "lucide-react";

const items = [
  { icon: Calendar, text: "Est. 1939" },
  { icon: Store, text: "Retail + Wholesale" },
  { icon: MapPin, text: "Siyaganj, Indore" },
  { icon: Zap, text: "Fast Fulfillment" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-card/50 py-6" aria-label="Trust highlights">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {items.map((item, i) => (
            <motion.li
              key={item.text}
              className="flex items-center gap-3 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <item.icon className="h-5 w-5 text-primary" aria-hidden />
              <span className="font-medium text-foreground">{item.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
