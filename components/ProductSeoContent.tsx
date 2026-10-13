import type { ReactNode } from "react";
import Link from "@/components/LocaleLink";
import NextLink from "next/link";
import { ContextQuoteLinks } from "@/components/product/ContextQuoteLinks";
import { sheetKind } from "@/components/product/specSheet";
import { enquiryFields } from "@/lib/enquiry";
import type { ProductSeoContent as ProductSeoContentType } from "@/content/productSeoContent";
import type { ProductWithCategory } from "@/content/products";
import type { Category } from "@/content/products";
import { getCategoryBySlug } from "@/content/products";
import { tt, type Lang } from "@/lib/locale";

type Props = {
  content: ProductSeoContentType;
  product: ProductWithCategory;
  category: Category | null;
  relatedProducts: ProductWithCategory[];
  relatedBlogPosts: { slug: string; title: string; lang?: Lang }[];
  /** Two or three shop reviews, placed after the FAQs and before the related links. */
  reviews?: ReactNode;
  lang?: Lang;
};

export function ProductSeoContent({
  content,
  product,
  category,
  relatedProducts,
  relatedBlogPosts,
  reviews,
  lang = "en",
}: Props) {
  const t = tt(lang);

  return (
    <div className="mt-12 space-y-3 border-t-2 border-border pt-8">
      <details className="group border-b border-border py-4" open>
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Overview", "संक्षिप्त परिचय")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.overview}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Uses in Indore", "इंदौर में उपयोग")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.usesInIndore}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Buying guide", "खरीदने की गाइड")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.buyingGuide}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Pricing factors", "रेट किन बातों पर निर्भर करता है")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.pricingFactors}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Why buy from HM Ibrahim & Co", "एच एम इब्राहिम एंड कंपनी से क्यों खरीदें")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.whyUs}</div>
        </div>
      </details>

      {content.faqs.length > 0 && (
        <section aria-labelledby="product-faq-heading" className="mx-auto max-w-3xl py-10 text-center">
          <h2 id="product-faq-heading" className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">
            {t("FAQs", "अक्सर पूछे जाने वाले सवाल")}
          </h2>
          <div className="mt-6 space-y-1">
            {content.faqs.map((faq, i) => (
              <details key={i} className="group" open={i === 0}>
                <summary className="relative flex min-h-[52px] cursor-pointer list-none items-center justify-center px-10 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                  <span aria-hidden="true" className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mx-auto max-w-2xl px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Service area", "सेवा क्षेत्र")}</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <p className="text-muted-foreground leading-relaxed">{content.serviceArea}</p>
        </div>
      </details>

      {reviews}

      {(relatedProducts.length > 0 || relatedBlogPosts.length > 0) && (
        <section className="border-t border-border pt-8">
          <h2 className="mb-3 font-display text-2xl font-extrabold uppercase leading-none text-foreground">{t("Related products and reading", "संबंधित उत्पाद और पढ़ने की सामग्री")}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex min-h-[44px] items-center border-b border-border py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {category.name}
              </Link>
            )}
            {relatedProducts.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="inline-flex min-h-[44px] items-center border-b border-border py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {p.name}
              </Link>
            ))}
            {relatedBlogPosts.map((b) => (
              b.lang && b.lang !== lang ? (
                // No Hindi edition: link the English guide directly and say so, instead of a Hindi URL with English text.
                <NextLink
                  key={b.slug}
                  href={`/blog/${b.slug}`}
                  hrefLang="en"
                  lang="en"
                  className="inline-flex min-h-[44px] items-center border-b border-border py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {b.title}
                  <span lang="hi" className="ml-2 text-xs text-muted-foreground">(अंग्रेज़ी में उपलब्ध)</span>
                </NextLink>
              ) : (
                <Link
                  key={b.slug}
                  href={`/blog/${b.slug}`}
                  className="inline-flex min-h-[44px] items-center border-b border-border py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {b.title}
                </Link>
              )
            ))}
          </div>
        </section>
      )}

      <ContextQuoteLinks
        productSlug={product.slug}
        productName={product.name}
        categorySlug={product.categorySlug}
        fields={enquiryFields(sheetKind(product))}
        lang={lang}
      />
    </div>
  );
}
