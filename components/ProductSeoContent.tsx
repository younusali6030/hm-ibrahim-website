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
    <div className="mt-12 border-t border-border pt-10 space-y-10">
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.overview}</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Uses in Indore</h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.usesInIndore}</div>
      </section>

      {hasSpecs && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Specifications / Variants</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
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

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Buying guide</h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.buyingGuide}</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Pricing factors</h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.pricingFactors}</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Why buy from H.M. Ibrahim & Co.</h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{content.whyUs}</div>
      </section>

      {content.faqs.length > 0 && (
        <section aria-labelledby="product-faq-heading">
          <h2 id="product-faq-heading" className="text-xl font-semibold text-foreground mb-3">
            FAQs
          </h2>
          <ul className="space-y-4">
            {content.faqs.map((faq, i) => (
              <li key={i}>
                <h3 className="font-medium text-foreground">{faq.question}</h3>
                <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Service area</h2>
        <p className="text-muted-foreground leading-relaxed">{content.serviceArea}</p>
      </section>

      {(relatedProducts.length > 0 || relatedBlogPosts.length > 0) && (
        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Related products & reading</h2>
          <div className="flex flex-wrap gap-3">
            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
              >
                {category.name}
              </Link>
            )}
            {relatedProducts.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
              >
                {p.name}
              </Link>
            ))}
            {relatedBlogPosts.map((b) => (
              <Link
                key={b.slug}
                href={`/blog/${b.slug}`}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
              >
                {b.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        Request a quote in Indore or Siyaganj:{" "}
        <Link href="/quote" className="text-primary hover:underline">
          Request a Quote
        </Link>
        {" · "}
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
}
