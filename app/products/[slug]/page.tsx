import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getCategoryBySlug, allProducts, getProductImages, getRelatedProducts, type ProductWithCategory } from "@/content/products";
import { getProductSeoContent, getRelatedBlogSlugsForProduct } from "@/content/productSeoContent";
import { getPostBySlug } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildProductMeta } from "@/lib/seo";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductSeoContent } from "@/components/ProductSeoContent";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SeoJsonLd } from "@/components/SeoJsonLd";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const firstImage = images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0] || ""}`;
  return buildProductMeta({
    productName: product.name,
    shortDesc: product.shortDesc,
    slug: product.slug,
    categoryName: category?.name,
    imageUrl: firstImage,
    materials: product.materials,
    sizes: product.sizes,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const seoContent = getProductSeoContent(slug, product);
  const relatedProductSlugs = seoContent?.relatedProductSlugs;
  const relatedProducts: ProductWithCategory[] = relatedProductSlugs?.length
    ? relatedProductSlugs
        .map((s) => getProductBySlug(s))
        .filter((p): p is ProductWithCategory => p != null)
    : getRelatedProducts(slug, 6);
  const blogSlugs = getRelatedBlogSlugsForProduct(slug);
  const relatedBlogPosts = await Promise.all(blogSlugs.map((s) => getPostBySlug(s))).then((posts) =>
    posts.filter((p): p is NonNullable<typeof p> => p != null).map((p) => ({ slug: p.slug, title: p.title }))
  );
  const firstImage = images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0] || ""}`;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(category ? [{ name: category.name, url: `/categories/${category.slug}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  // Product schema — no price (contact for quote); eligibility for rich results & AI search
  const allImages = images.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`));
  const productUrl = `${baseUrl}/products/${product.slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.shortDesc,
    url: productUrl,
    sku: product.slug,
    mpn: product.slug,
    ...(allImages.length > 0 ? { image: allImages } : {}),
    brand: { "@type": "Brand", name: site.name, url: baseUrl },
    category: category?.name || product.categorySlug,
    ...(product.materials && product.materials.length > 0 ? { material: product.materials.join(", ") } : {}),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: { "@type": "LocalBusiness", name: site.name, url: baseUrl },
      areaServed: { "@type": "City", name: "Indore" },
    },
    ...(site.googleReview.verified
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.googleReview.rating.toString(),
            reviewCount: site.googleReview.reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(product.specs && product.specs.length > 0
      ? {
          additionalProperty: product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
        }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };

  const faqsForSchema = seoContent?.faqs?.length
    ? seoContent.faqs
    : [];
  const productFaqSchema = faqsForSchema.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqsForSchema.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <article className="page-container pb-10 pt-4 md:pb-16 md:pt-6">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={productSchema} />
      {productFaqSchema && <SeoJsonLd data={productFaqSchema} />}
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <ProductDetailClient
        product={product}
        category={category ?? null}
        defaultImages={images}
      />

      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-h3 font-heading font-semibold text-foreground">Related products</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {relatedProducts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="lift rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/50 hover:text-primary"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14 border-t border-border pt-10" aria-label="Trust">
        <TrustBadges className="mb-6" />
        <ReviewsList max={3} productSlug={product.slug} title={`What buyers say about ${product.name}`} className="mt-10" />
      </section>

      {seoContent && (
        <ProductSeoContent
          content={seoContent}
          product={product}
          category={category ?? null}
          relatedProducts={relatedProducts}
          relatedBlogPosts={relatedBlogPosts}
        />
      )}
    </article>
  );
}
