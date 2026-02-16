import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { InHouseBrandsSection } from "@/components/home/InHouseBrandsSection";
import { BrandsWeStockSection } from "@/components/home/BrandsWeStockSection";
import { WhyUs } from "@/components/home/WhyUs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LocationPreview } from "@/components/home/LocationPreview";
import { faqs } from "@/content/faqs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <InHouseBrandsSection />
      <BrandsWeStockSection />
      <WhyUs />
      <FeaturedProducts />
      <TestimonialCarousel />
      <FAQAccordion faqs={faqs.slice(0, 6)} description="Quick answers about our business and services." />
      <LocationPreview />
      <CTASection />
    </>
  );
}
