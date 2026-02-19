import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { InHouseBrandsSection } from "@/components/home/InHouseBrandsSection";
import { BrandsWeStockSection } from "@/components/home/BrandsWeStockSection";
import { WhyUs } from "@/components/home/WhyUs";
import { IndoreIntentSection } from "@/components/home/IndoreIntentSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { faqs } from "@/content/faqs";
import { baseUrl, site, localSeo } from "@/lib/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";

const homeFaqSchema = faqs.length > 0
  ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.slice(0, 6).map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }
  : null;

const TestimonialCarousel = dynamic(() => import("@/components/TestimonialCarousel").then((m) => ({ default: m.TestimonialCarousel })), { ssr: true });
const FAQAccordion = dynamic(() => import("@/components/FAQAccordion").then((m) => ({ default: m.FAQAccordion })), { ssr: true });
const LocationPreview = dynamic(() => import("@/components/home/LocationPreview").then((m) => ({ default: m.LocationPreview })), { ssr: true });
const CTASection = dynamic(() => import("@/components/CTASection").then((m) => ({ default: m.CTASection })), { ssr: true });

export const metadata: Metadata = {
  title: `${site.name} | Iron & Hardware in Indore, ${localSeo.state} since 1939`,
  description:
    "Trusted iron and hardware in Siyaganj, Indore. MS angles, TMT bars, wire mesh, barbed wire, chain link, GI pipes, and construction hardware. Retail & wholesale. Best price in Indore. Request a quote.",
  keywords: [
    "iron and hardware Indore",
    "wire mesh Indore",
    "TMT bars Indore",
    "MS angles Siyaganj",
    "barbed wire Indore",
    "construction hardware Indore",
    "wholesale iron Indore",
    site.name,
  ].join(", "),
  alternates: { canonical: baseUrl },
  openGraph: {
    title: `${site.name} | Iron & Hardware in Indore since 1939`,
    description: "Trusted iron and hardware in Siyaganj, Indore. Retail and wholesale. Request a quote.",
    url: baseUrl,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Iron & Hardware in Indore`,
    description: "Trusted iron and hardware in Siyaganj, Indore. Retail and wholesale.",
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return (
    <>
      {homeFaqSchema && <SeoJsonLd data={homeFaqSchema} />}
      <Hero />
      <CategoryGrid />
      <InHouseBrandsSection />
      <BrandsWeStockSection />
      <WhyUs />
      <IndoreIntentSection />
      <FeaturedProducts />
      <TestimonialCarousel />
      <FAQAccordion faqs={faqs.slice(0, 6)} description="Quick answers about our business and services." />
      <LocationPreview />
      <CTASection />
    </>
  );
}
