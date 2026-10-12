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

const FAQAccordion = dynamic(() => import("@/components/FAQAccordion").then((m) => ({ default: m.FAQAccordion })), { ssr: true });
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
        <FAQAccordion faqs={faqs.slice(0, 4)} description="Straight answers before you call." />
        <CTASection
          title="Send us your list."
          description="We check stock, then call you back with rates. Or ring us now and talk to the counter."
          quoteLabel="Get a quote"
        />
      </div>
    </>
  );
}
