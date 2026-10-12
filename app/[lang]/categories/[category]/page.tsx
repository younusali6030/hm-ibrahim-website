import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocaleLink";
import { categories, getCategoryBySlug, type Category } from "@/content/products";
import { baseUrl, site, localSeo } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { productCopy } from "@/content/productCopy";
import { productCopyHi } from "@/content/hi/productCopy";
import { categoryGuides } from "@/content/categoryGuides";
import { getRelatedBlogSlugsForProduct } from "@/content/productSeoContent";
import { getPostBySlug } from "@/content/blog/posts";
import { CategoryGuide } from "@/components/catalog/CategoryGuide";
import { localize, tr } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { pageUrl } from "@/lib/seo";

import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { ClosingBand } from "@/components/site/ClosingBand";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import type { FAQ } from "@/content/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getWhatsAppLink } from "@/lib/utils";
import { GaugeRule } from "@/components/motif/Motif";
import { LedgerRow } from "@/components/catalog/LedgerRow";
import { sizeTag, tataFlag } from "@/components/catalog/ledger";
import { T } from "@/lib/i18n";

type Props = { params: { lang: string; category: string } };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.category;
  const lang = params.lang as Lang;
  const found = getCategoryBySlug(slug);
  if (!found) return { title: "Category" };
  const category = localize(found, lang);
  // Titles and descriptions for the nine ranges live in content/seoOverrides.ts and win over these defaults.
  return buildPageMeta({
    lang,
    title: `${category.name} in Indore, ${localSeo.state}`,
    description:
      lang === "hi"
        ? `${category.description} इंदौर के हमारे सियागंज काउंटर पर, रिटेल और थोक। रेट पूछें।`
        : `${category.description} At our Siyaganj counter in Indore, retail and wholesale. Ask for the rate.`,
    path: `categories/${category.slug}`,
  });
}

function buildCategoryFaqs(category: Category, lang: Lang): FAQ[] {
  const hi = lang === "hi";
  // One real answer per product, written in content/productCopy.ts. Nothing here promises stock.
  const productFaqs: FAQ[] = category.products.flatMap((product) => {
    const pair = (hi ? productCopyHi[product.slug]?.faqs?.[0] : undefined) ?? productCopy[product.slug]?.faqs?.[0];
    if (!pair) return [];
    return [{ id: `${category.slug}-${product.slug}-faq`, question: pair[0], answer: pair[1], category: "products" } as FAQ];
  });

  const categoryLevelFaqs: FAQ[] = hi
    ? [
        {
          id: `${category.slug}-delivery`,
          question: `क्या आप इंदौर में ${category.name} की डिलीवरी करते हैं?`,
          answer: `जी हाँ। पूरे भारत से ऑर्डर स्वीकार किए जाते हैं; डिलीवरी की व्यवस्था हर कोटेशन के साथ तय की जाती है। इंदौर शहर और देवास, पीथमपुर व महू जैसे आसपास के औद्योगिक इलाके हम इंदौर से सँभालते हैं। छोटे लोड आप सीधे हमारे सियागंज गोदाम से उठा सकते हैं। कोटेशन माँगते समय अपनी साइट की जगह बताइए ताकि हम सबसे अच्छा विकल्प सुझा सकें।`,
          category: "products",
        },
        {
          id: `${category.slug}-bulk-orders`,
          question: `क्या आप ${category.name} के थोक और बार-बार के ऑर्डर सँभालते हैं?`,
          answer: `हम बिल्डर, ठेकेदार और डीलरों को नियमित रूप से ${category.name} थोक या बार-बार के आधार पर देते हैं। अपनी अनुमानित मासिक ज़रूरत और पसंद के ब्रांड या साइज़ बताइए, हम उसी के हिसाब से स्टॉक और भाव की योजना बना लेंगे।`,
          category: "products",
        },
      ]
    : [
    {
      id: `${category.slug}-delivery`,
      question: `Do you deliver ${category.name} around Indore?`,
      answer:
        `Yes. Orders accepted across India; delivery arrangements confirmed with each quotation. Indore city and nearby industrial areas such as Dewas, Pithampur and Mhow are served from our Siyaganj shop. For small loads you can also collect directly from our Siyaganj godown. Mention your site location when you ask for a quote and we will suggest the best option.`,
      category: "products",
    },
    {
      id: `${category.slug}-bulk-orders`,
      question: `Can you handle bulk and repeat orders for ${category.name}?`,
      answer:
        `We regularly serve builders, contractors, and dealers who buy ${category.name.toLowerCase()} in bulk or on a repeat basis. Share your approximate monthly requirement and your preferred brands and sizes, and we will plan stock and pricing around it.`,
      category: "products",
    },
  ];

  // The buying questions that decide the order lead; the shop's delivery and bulk answers follow; one real answer
  // per product (also on each product page) only fills what is left.
  const chooseFaqs: FAQ[] = (categoryGuides[category.slug]?.choose ?? []).map((c, i) => ({
    id: `${category.slug}-choose-${i}`,
    question: hi ? c.q.hi : c.q.en,
    answer: hi ? c.a.hi : c.a.en,
    category: "products",
  } as FAQ));

  return [...chooseFaqs, ...categoryLevelFaqs, ...productFaqs];
}

function getCategoryFaqSchema(faqs: FAQ[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

function getCategoryItemListSchema(category: { name: string; slug: string; description: string; products: { slug: string; name: string }[] }, lang: Lang) {
  const hi = lang === "hi";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: hi ? `${category.name} — लोहा और हार्डवेयर` : `${category.name} — Iron & Hardware`,
    description: hi
      ? `${category.description} एचएम इब्राहिम एंड कंपनी, सियागंज, इंदौर से उपलब्ध। रिटेल और थोक।`
      : `${category.description} Available from ${site.name} in Siyaganj, Indore. Retail and wholesale.`,
    numberOfItems: category.products.length,
    itemListElement: category.products.map((p, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: pageUrl(`products/${p.slug}`, lang),
      name: p.name,
    })),
  };
}

export default async function CategoryPage({ params }: Props) {
  const slug = params.category;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const categoryEn = getCategoryBySlug(slug);
  if (!categoryEn) notFound();
  const category = localize(categoryEn, lang);

  const breadcrumbItems = [
    { name: t("Home", "होम"), url: "/" },
    { name: t("Products", "उत्पाद"), url: "/products" },
    { name: category.name, url: `/categories/${category.slug}` },
  ];

  const categoryFaqs = buildCategoryFaqs(category, lang);
  // What the page shows is what the schema lists.
  const shownFaqs = categoryFaqs.slice(0, 6);
  const faqSchema = getCategoryFaqSchema(shownFaqs);
  const itemListSchema = getCategoryItemListSchema(category, lang);

  const heroImg = category.products[0]?.images?.[0] ?? category.image;

  // Guides that the category's products already point to, most-shared first. Missing posts are skipped.
  const guideCount = new Map<string, number>();
  for (const p of categoryEn.products) {
    for (const s of getRelatedBlogSlugsForProduct(p.slug)) guideCount.set(s, (guideCount.get(s) ?? 0) + 1);
  }
  const guideSlugs = Array.from(guideCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([s]) => s);
  const guides = (await Promise.all(guideSlugs.map((s) => getPostBySlug(s, lang))))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({ slug: p.slug, title: p.title, lang: p.lang }));

  return (
    <>
      <JsonLdBreadcrumb items={breadcrumbItems} lang={lang} />
      <SeoJsonLd data={[itemListSchema, ...(faqSchema ? [faqSchema] : [])]} lang={lang} />

      <PageHero
        eyebrow={
          <>
            <Link href="/products" className="inline-flex min-h-[24px] items-center hover:text-white"><T en="Products" hi="उत्पाद" /></Link> / {category.name}
          </>
        }
        title={hi ? `${category.name}, इंदौर` : `${category.name} in Indore`}
        lede={
          hi
            ? `${category.description} सियागंज की दुकान पर, इंदौर, देवास, उज्जैन, महू और पीथमपुर के रिटेल और थोक खरीदारों के लिए।`
            : `${category.description} Stocked at our Siyaganj shop for retail and wholesale buyers across Indore, Dewas, Ujjain, Mhow and Pithampur.`
        }
        compact
        image={heroImg ? { src: heroImg, alt: hi ? `${category.name}, एच एम इब्राहिम एंड कंपनी, सियागंज, इंदौर` : `${category.name} at HM Ibrahim & Co, Siyaganj, Indore` } : undefined}
      >
        <Link href={`/contact?category=${category.slug}`} className={btnMain}><T en={`Ask for rate: ${category.name}`} hi={`रेट पूछें: ${category.name}`} /></Link>
        <a
          href={getWhatsAppLink(site.whatsapp, hi ? `नमस्ते, मुझे ${category.name} में रुचि है। कृपया भाव और उपलब्धता बताइए।` : `Hi, I'm interested in ${category.name}. Please share price and availability.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={btnGhostDark}
        >
          <T en="WhatsApp us" hi="व्हाट्सएप करें" />
        </a>
      </PageHero>

      <section className="pb-10 pt-6 md:pb-14 md:pt-10" aria-labelledby="products-heading">
        <div className="page-container lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          {/* Jump list: desktop only. On a phone the ledger itself is short enough to scroll. */}
          <nav aria-label={hi ? `${category.name} सूची` : `${category.name} index`} className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <T en="Jump to" hi="सीधे जाएँ" />
              </p>
              <ol className="mt-3 border-t border-border">
                {category.products.map((p, i) => (
                  <li key={p.slug} className="border-b border-border">
                    <a
                      href={`#p-${p.slug}`}
                      className="flex min-h-[44px] items-center gap-3 py-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="font-mono-brand text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      {p.name}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0">
            <GaugeRule tone="primary" label={`${category.products.length}`} />
            <h2 id="products-heading" className="mt-2 text-foreground">
              {hi ? `${category.name} में ${category.products.length} आइटम` : `${category.products.length} products in ${category.name}`}
            </h2>
            <ul className="mt-3 border-t border-border">
              {category.products.map((product, i) => (
                <LedgerRow
                  key={product.slug}
                  index={i}
                  anchor
                  item={{
                    slug: product.slug,
                    name: product.name,
                    shortDesc: product.shortDesc,
                    image: product.images?.[0] ?? product.image ?? category.image ?? "",
                    image2: product.images?.[1],
                    imageAlt: product.imageAlt || product.name,
                    categorySlug: category.slug,
                    // Spec labels are matched in English, so build the tag from the English record, then translate it.
                    tag: sizeTag(categoryEn.products.find((q) => q.slug === product.slug) ?? product, (s) => tr(s, lang)),
                    tata: tataFlag(product),
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CategoryGuide categoryEn={categoryEn} category={category} lang={lang} guides={guides} />

      <section className="border-t border-border bg-card py-10 md:py-14" aria-labelledby="faq-heading">
        <div className="page-container grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <GaugeRule tone="primary" label={hi ? "सवाल" : "Questions"} />
            <h2 id="faq-heading" className="mt-2 text-foreground"><T en="Before you order" hi="ऑर्डर से पहले" /></h2>
            <Accordion type="single" collapsible className="mt-3">
              {shownFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="min-w-0">
            <ReviewsList lang={lang} max={2} categorySlug={category.slug} title={hi ? "खरीदार क्या कहते हैं" : "What buyers say"} />
          </div>
        </div>
      </section>

      <ClosingBand
        heading={hi ? `${category.name} चाहिए?` : `Need ${category.name.toLowerCase()}?`}
        quoteHref={`/contact?category=${category.slug}`}
        quoteLabel={<T en="Ask for rate" hi="रेट पूछें" />}
      />
    </>
  );
}
