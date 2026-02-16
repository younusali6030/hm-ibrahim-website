import type { Metadata } from "next";
import { site } from "@/content/site";
import { QuoteFormWrapper } from "./QuoteFormWrapper";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: `Request a quote for iron, steel, pipes, wire, mesh, and hardware. ${site.name} — Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/quote` },
};

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">Request a Quote</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Fill in your details and product requirements. We&apos;ll get back with pricing and
        availability.
      </p>
      <QuoteFormWrapper />
    </div>
  );
}
