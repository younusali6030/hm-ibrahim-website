import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { InHouseBrandsSection } from "@/components/home/InHouseBrandsSection";
import { BrandsWeStockSection } from "@/components/home/BrandsWeStockSection";
import { WhyUs } from "@/components/home/WhyUs";
import { IndoreIntentSection } from "@/components/home/IndoreIntentSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LocationPreview } from "@/components/home/LocationPreview";
import { faqs } from "@/content/faqs";
import { baseUrl, site, localSeo } from "@/lib/site";

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
