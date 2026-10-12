import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug, type Category } from "@/content/products";
import { baseUrl, site, localSeo } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { productCopy } from "@/content/productCopy";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
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

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  // Titles and descriptions for the nine ranges live in content/seoOverrides.ts and win over these defaults.
  return buildPageMeta({
    title: `${category.name} in Indore, ${localSeo.state}`,
    description: `${category.description} At our Siyaganj counter in Indore, retail and wholesale. Ask for the rate.`,
    path: `categories/${category.slug}`,
  });
}

function buildCategoryFaqs(category: Category): FAQ[] {
  // One real answer per product, written in content/productCopy.ts. Nothing here promises stock.
  const productFaqs: FAQ[] = category.products.flatMap((product) => {
    const pair = productCopy[product.slug]?.faqs?.[0];
    if (!pair) return [];
    return [{ id: `${category.slug}-${product.slug}-faq`, question: pair[0], answer: pair[1], category: "products" } as FAQ];
  });

  const categoryLevelFaqs: FAQ[] = [
    {
      id: `${category.slug}-delivery`,
      question: `Do you deliver ${category.name} around Indore?`,
      answer:
        `Yes. We can arrange delivery of ${category.name.toLowerCase()} within Indore city and nearby industrial areas like Dewas, Pithampur, and Mhow for suitable order quantities. For small loads you can also pick up directly from our Siyaganj godown. Mention your site location when you request a quote so we can suggest the best option.`,
      category: "products",
    },
    {
      id: `${category.slug}-bulk-orders`,
      question: `Can you handle bulk and repeat orders for ${category.name}?`,
      answer:
        `We regularly serve builders, contractors, and dealers who buy ${category.name.toLowerCase()} in bulk or on a repeat basis. Share your approximate monthly requirement and preferred brands/sizes and we’ll plan stock and pricing accordingly.`,
      category: "products",
    },
  ];

  return [...productFaqs, ...categoryLevelFaqs];
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

function getCategoryItemListSchema(category: { name: string; slug: string; description: string; products: { slug: string; name: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} — Iron & Hardware`,
    description: `${category.description} Available from ${site.name} in Siyaganj, Indore. Retail and wholesale.`,
    numberOfItems: category.products.length,
    itemListElement: category.products.map((p, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: `${baseUrl}/products/${p.slug}`,
      name: p.name,
    })),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: category.name, url: `/categories/${category.slug}` },
  ];

  const categoryFaqs = buildCategoryFaqs(category);
  const faqSchema = getCategoryFaqSchema(categoryFaqs.slice(0, 8));
  const itemListSchema = getCategoryItemListSchema(category);

  const heroImg = category.products[0]?.images?.[0] ?? category.image;

  return (
    <>
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={[itemListSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <PageHero
        eyebrow={
          <>
            <Link href="/products" className="hover:text-white"><T en="Products" hi="प्रोडक्ट" /></Link> / {category.name}
          </>
        }
        title={<T en={`${category.name} in Indore`} hi={`${category.name}, इंदौर`} />}
        lede={
          <T
            en={`${category.description} Stocked at our Siyaganj shop for retail and wholesale buyers across Indore, Dewas, Ujjain, Mhow and Pithampur.`}
            hi={`${category.description} सियागंज की दुकान पर, इंदौर, देवास, उज्जैन, महू और पीथमपुर के रिटेल और थोक खरीदारों के लिए।`}
          />
        }
        compact
        image={heroImg ? { src: heroImg, alt: `${category.name} at H M Ibrahim & Co, Siyaganj, Indore` } : undefined}
      >
        <Link href={`/contact?category=${category.slug}`} className={btnMain}><T en={`Ask for rate: ${category.name}`} hi={`रेट पूछें: ${category.name}`} /></Link>
        <a
          href={getWhatsAppLink(site.whatsapp, `Hi, I'm interested in ${category.name}. Please share price and availability.`)}
          target="_blank"
          rel="noopener noreferrer"
          className={btnGhostDark}
        >
          <T en="WhatsApp us" hi="WhatsApp करें" />
        </a>
      </PageHero>

      <section className="pb-14 pt-10 md:pb-20 md:pt-14" aria-labelledby="products-heading">
        <div className="page-container lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          {/* Jump list: desktop only. On a phone the ledger itself is short enough to scroll. */}
          <nav aria-label={`${category.name} index`} className="hidden lg:block">
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
            <GaugeRule tone="primary" label={`${category.products.length}`} className="mt-6" />
            <h2 id="products-heading" className="mt-3 text-foreground">
              <T
                en={`${category.products.length} products in ${category.name}`}
                hi={`${category.name} में ${category.products.length} आइटम`}
              />
            </h2>
            <ul className="mt-4 border-t border-border">
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
                    imageAlt: product.imageAlt || product.name,
                    categorySlug: category.slug,
                    tag: sizeTag(product),
                    tata: tataFlag(product),
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="page-container pb-14 md:pb-20">
        <ReviewsList max={3} categorySlug={category.slug} title={`What buyers say about our ${category.name.toLowerCase()}`} />
      </div>

      <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="faq-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground"><T en="Questions" hi="सवाल" /></p>
            <h2 id="faq-heading" className="mt-2 text-foreground"><T en="Before you order" hi="ऑर्डर से पहले" /></h2>
          </div>
          <Accordion type="single" collapsible>
            {categoryFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-nav pb-28 pt-14 text-white md:py-16">
        <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-white"><T en={`Need ${category.name.toLowerCase()}?`} hi={`${category.name} चाहिए?`} /></h2>
          <Link href={`/contact?category=${category.slug}`} className={btnMain}><T en="Ask for rate" hi="रेट पूछें" /></Link>
        </div>
      </section>
    </>
  );
}
