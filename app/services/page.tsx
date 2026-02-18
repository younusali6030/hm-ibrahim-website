import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { ServicesGrid } from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "Services",
  description: `Retail, wholesale, bulk orders, warehouse, and delivery — how ${site.name} serves builders, contractors, and customers in Indore.`,
  alternates: { canonical: `${baseUrl}/services` },
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">Our Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        We serve retail customers, wholesalers, contractors, and industrial buyers with supply and
        support tailored to your needs.
      </p>
      <ServicesGrid />
    </div>
  );
}
