import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { QuoteFormWrapper } from "./QuoteFormWrapper";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: `Request a quote for iron, steel, pipes, wire, mesh, and hardware. ${site.name} — Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/quote` },
};

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-7xl min-w-0">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-5xl">Request a Quote</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground text-sm md:text-base">
        Fill in your details and product requirements. We&apos;ll get back with pricing and
        availability.
      </p>
      <QuoteFormWrapper />
    </div>
  );
}
