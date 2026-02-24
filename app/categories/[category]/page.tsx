import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categories, getCategoryBySlug, type Category } from "@/content/products";
import { baseUrl, site, localSeo } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import type { FAQ } from "@/content/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/utils";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category" };

  const title = `${category.name} in Indore, ${localSeo.state} | ${site.name}`;
  const description = `${category.description} Available in Siyaganj, Indore. Retail and wholesale. ${category.products.slice(0, 3).map((p) => p.name).join(", ")} and more. Request a quote.`;

  return {
    title,
    description: description.substring(0, 160),
    keywords: [
      `${category.name} Indore`,
      `${category.name} Siyaganj`,
      `${category.name} ${localSeo.region}`,
      "iron and hardware Indore",
      site.name,
    ].join(", "),
    alternates: { canonical: `${baseUrl}/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} in Indore | ${site.name}`,
      description: description.substring(0, 200),
      url: `${baseUrl}/categories/${category.slug}`,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} in Indore | ${site.name}`,
      description: description.substring(0, 200),
    },
    robots: { index: true, follow: true },
  };
}

function buildCategoryFaqs(category: Category): FAQ[] {
  const productFaqs: FAQ[] = category.products.map((product, index) => {
    const sizeSnippet =
      product.sizes && product.sizes.length > 0
        ? ` Common sizes we usually supply include ${product.sizes.slice(0, 6).join(", ")}.`
        : "";
    const materialSnippet =
      product.materials && product.materials.length > 0
        ? ` Materials / finishes can include ${product.materials.join(", ")}.`
        : "";

    return {
      id: `${category.slug}-${product.slug}-sizes`,
      question: `What sizes and specifications of ${product.name} do you stock in Indore?`,
      answer: `We keep multiple sizes and specifications of ${product.name} ready in Siyaganj, Indore for contractors, fabricators, and retailers.${sizeSnippet}${materialSnippet} Stock moves quickly, so share your exact size and quantity and we’ll confirm current availability and the best rate for your order.`,
      category: "products",
    };
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

  return (
    <div className="page-container section-padding">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={[itemListSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <article>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          {category.name} in Indore, {localSeo.state}
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {category.description} We are based in <strong className="text-foreground">Siyaganj, Indore</strong> and serve retail and wholesale customers across Indore, Dewas, Ujjain, Mhow, and nearby areas.
        </p>

        <section className="mt-10" aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-xl font-semibold text-foreground mb-6">
            Products in this category
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
                >
                  {product.images?.[0] && (
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.imageAlt || product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">{product.name}</span>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {product.shortDesc}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 pt-10 border-t border-border" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-semibold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-4 max-w-3xl">
            {categoryFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Button asChild className="w-full sm:w-auto min-h-[44px]">
            <Link href={`/quote?category=${category.slug}`}>Request a quote for {category.name}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto min-h-[44px]">
            <a
              href={getWhatsAppLink(site.whatsapp, `Hi, I'm interested in ${category.name}. Please share price and availability.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
          </Button>
          <Link
            href={`/products?category=${category.slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium text-foreground hover:bg-accent min-h-[44px] sm:min-h-0"
          >
            Browse {category.name} on Products →
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent min-h-[44px] sm:min-h-0"
          >
            All product categories
          </Link>
        </div>
      </article>
    </div>
  );
}
