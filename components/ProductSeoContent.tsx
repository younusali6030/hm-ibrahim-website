import Link from "next/link";
import type { ProductSeoContent as ProductSeoContentType } from "@/content/productSeoContent";
import type { ProductWithCategory } from "@/content/products";
import type { Category } from "@/content/products";
import { getCategoryBySlug } from "@/content/products";
import { site } from "@/lib/site";

type Props = {
  content: ProductSeoContentType;
  product: ProductWithCategory;
  category: Category | null;
  relatedProducts: ProductWithCategory[];
  relatedBlogPosts: { slug: string; title: string }[];
};

export function ProductSeoContent({
  content,
  product,
  category,
  relatedProducts,
  relatedBlogPosts,
}: Props) {
  const specs = product.specs ?? [];
  const sizes = product.sizes ?? [];
  const materials = product.materials ?? [];
  const variants = product.variants ?? [];
  const hasSpecs = specs.length > 0 || sizes.length > 0 || materials.length > 0 || variants.length > 0;

  return (
    <div className="mt-12 space-y-3 border-t-2 border-border pt-8">
      <details className="group border-b border-border py-4" open>
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Overview</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.overview}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Uses in Indore</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.usesInIndore}</div>
        </div>
      </details>

      {hasSpecs && (
        <section>
          <h2 className="mb-3 font-display text-2xl font-extrabold uppercase leading-none text-foreground">Specifications / Variants</h2>
          <ul className="border-t border-border text-muted-foreground [&>li]:border-b [&>li]:border-border [&>li]:py-2">
            {specs.map((s) => (
              <li key={s.label}>
                <span className="text-foreground font-medium">{s.label}:</span> {s.value}
              </li>
            ))}
            {sizes.length > 0 && (
              <li>
                <span className="text-foreground font-medium">Sizes:</span> {sizes.slice(0, 10).join(", ")}
                {sizes.length > 10 ? " and more" : ""}
              </li>
            )}
            {materials.length > 0 && (
              <li>
                <span className="text-foreground font-medium">Materials:</span> {materials.join(", ")}
              </li>
            )}
            {variants.length > 0 && (
              <li>
                <span className="text-foreground font-medium">Variants:</span> {variants.join(", ")}
              </li>
            )}
          </ul>
        </section>
      )}

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Buying guide</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.buyingGuide}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Pricing factors</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.pricingFactors}</div>
        </div>
      </details>

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Why buy from H.M. Ibrahim & Co.</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <div className="text-[0.97rem] text-muted-foreground leading-relaxed whitespace-pre-line">{content.whyUs}</div>
        </div>
      </details>

      {content.faqs.length > 0 && (
        <section aria-labelledby="product-faq-heading">
          <h2 id="product-faq-heading" className="mb-3 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
            FAQs
          </h2>
          <ul className="border-t border-border [&>li]:border-b [&>li]:border-border [&>li]:py-4">
            {content.faqs.map((faq, i) => (
              <li key={i}>
                <h3 className="font-medium text-foreground">{faq.question}</h3>
                <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="group border-b border-border py-4">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">Service area</h2>
          <span aria-hidden="true" className="text-2xl text-primary transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4">
        <p className="text-muted-foreground leading-relaxed">{content.serviceArea}</p>
        </div>
      </details>

      {(relatedProducts.length > 0 || relatedBlogPosts.length > 0) && (
        <section className="border-t border-border pt-8">
          <h2 className="mb-3 font-display text-2xl font-extrabold uppercase leading-none text-foreground">Related products & reading</h2>
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
              <Link
                key={b.slug}
                href={`/blog/${b.slug}`}
                className="inline-flex min-h-[44px] items-center border-b border-border py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {b.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        Request a quote in Indore or Siyaganj:{" "}
        <Link href="/contact" className="inline-flex min-h-[44px] items-center text-primary underline underline-offset-4">
          Request a Quote
        </Link>
        {" · "}
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-primary underline underline-offset-4"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
}
