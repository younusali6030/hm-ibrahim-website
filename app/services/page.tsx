import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { ServicesGrid } from "@/components/ServicesGrid";
import { SeoJsonLd } from "@/components/SeoJsonLd";

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Services — ${site.name}`,
  description: `Retail, wholesale, bulk orders, warehouse, and delivery. How ${site.name} serves builders, contractors, and customers in Indore.`,
  url: `${baseUrl}/services`,
};

export const metadata: Metadata = {
  title: "Services",
  description: `Retail, wholesale, bulk orders, warehouse, and delivery — how ${site.name} serves builders, contractors, and customers in Indore.`,
  alternates: { canonical: `${baseUrl}/services` },
};

export default function ServicesPage() {
  return (
    <div className="page-container section-padding">
      <SeoJsonLd data={servicesPageSchema} />
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">Our Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        We serve retail customers, wholesalers, contractors, and industrial buyers with supply and
        support tailored to your needs.
      </p>
      <ServicesGrid />
    </div>
  );
}
