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
import { videoObject } from "@/lib/schema";
import { homeReels } from "@/content/reels";
import { pageUrl } from "@/lib/seo";
import { buildPageMeta } from "@/lib/seo";
import { LocationPreview } from "@/components/home/LocationPreview";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";

const FAQAccordion = dynamic(() => import("@/components/FAQAccordion").then((m) => ({ default: m.FAQAccordion })), { ssr: true });
const CTASection = dynamic(() => import("@/components/CTASection").then((m) => ({ default: m.CTASection })), { ssr: true });

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Iron, Wire and Mesh in Indore since 1939",
    description:
      "Iron, wire and mesh from Siyaganj Main Road, Indore, since 1939. Wire mesh, jali, barbed wire, TMT bars, perforated sheets. Retail and wholesale. Ask for the rate.",
    path: "",
  });
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  const posts = (await getAllPosts(lang)).slice(0, 3);
  const homeFaqs = localize(faqs.slice(0, 4), lang);
  const homeFaqSchema =
    homeFaqs.length > 0
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
  return (
    <>
      {homeFaqSchema && <SeoJsonLd data={homeFaqSchema} lang={lang} />}
      <SeoJsonLd
        data={homeReels.map((v) =>
          videoObject({ name: v.title, description: v.description, thumbnail: `${v.src}.jpg`, contentUrl: `${v.src}.mp4`, uploadDate: v.uploadDate, pageUrl: pageUrl("", lang) })
        )}
        lang={lang}
      />
      <HomeHero />
      <div className="home-dark">
        <RevealOnScroll />
        <ProofStrip />
        <StockReel />
        <CategoryShowcase lang={lang} />
        <ReelsSection />
        <BrandsBand lang={lang} />
        <GoogleReviews lang={lang} />
        <HomeJournal posts={posts} />
        <LocationPreview />
        <FAQAccordion faqs={homeFaqs} description={t("Straight answers before you call.", "कॉल करने से पहले सीधे जवाब।")} />
        <CTASection
          title={t("Send us your list.", "अपनी सूची भेजिए।")}
          description={t(
            "We check stock, then call you back with rates. Or ring us now and talk to the counter.",
            "हम स्टॉक देखकर रेट के साथ वापस कॉल करते हैं। या अभी फ़ोन कीजिए और सीधे काउंटर से बात कीजिए।"
          )}
          quoteLabel={t("Get a quote", "कोटेशन पाएँ")}
          whatsAppMessage={t("Hi, I'm interested in your products. Please share prices and availability.", "नमस्ते, मुझे आपके उत्पादों में रुचि है। कृपया भाव और उपलब्धता बताइए।")}
        />
      </div>
    </>
  );
}
