import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeJournal } from "@/components/home/HomeJournal";
import { getAllPosts } from "@/content/blog/posts";
import { StockReel } from "@/components/home/StockReel";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { ProofStrip } from "@/components/home/ProofStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReelsSection } from "@/components/home/ReelsSection";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { BrandsBand } from "@/components/home/BrandsBand";
import { faqs } from "@/content/faqs";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { buildPageMeta } from "@/lib/seo";
import { LocationPreview } from "@/components/home/LocationPreview";

const homeFaqs = faqs.slice(0, 4);
const homeFaqSchema = homeFaqs.length > 0
  ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }
  : null;

const FAQAccordion = dynamic(() => import("@/components/FAQAccordion").then((m) => ({ default: m.FAQAccordion })), { ssr: true });
const CTASection = dynamic(() => import("@/components/CTASection").then((m) => ({ default: m.CTASection })), { ssr: true });

export const metadata: Metadata = buildPageMeta({
  title: "Iron, Wire and Mesh in Indore since 1939",
  description:
    "Iron, wire and mesh from Siyaganj Main Road, Indore, since 1939. Wire mesh, jali, barbed wire, TMT bars, perforated sheets. Retail and wholesale. Ask for the rate.",
  path: "",
});

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);
  return (
    <>
      {homeFaqSchema && <SeoJsonLd data={homeFaqSchema} />}
      <HomeHero />
      <div className="home-dark">
        <RevealOnScroll />
        <ProofStrip />
        <StockReel />
        <CategoryShowcase />
        <ReelsSection />
        <BrandsBand />
        <GoogleReviews />
        <HomeJournal posts={posts} />
        <LocationPreview />
        <FAQAccordion faqs={homeFaqs} description="Straight answers before you call." />
        <CTASection
          title="Send us your list."
          description="We check stock, then call you back with rates. Or ring us now and talk to the counter."
          quoteLabel="Get a quote"
        />
      </div>
    </>
  );
}
