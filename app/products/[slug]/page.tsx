import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getCategoryBySlug, allProducts, getProductImages, getProductMedia, getRelatedProducts } from "@/content/products";
import { baseUrl, site } from "@/lib/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { productFaqs } from "@/content/faqs";

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
  
  // Enhanced description with location and keywords
  const locationKeywords = "in Indore, Siyaganj, Madhya Pradesh";
  const description = `${product.name} - ${product.shortDesc} Available from HM Ibrahim & Co, Siyaganj, Indore. ${product.sizes?.slice(0, 3).join(", ") || ""} ${product.materials?.join(", ") || ""}. Retail and wholesale.`;
  
  // Build keywords array
  const keywords = [
    `${product.name} Indore`,
    `${product.name} Siyaganj`,
    `${product.name} MP`,
    ...(category ? [`${category.name} Indore`, `${category.name} Siyaganj`] : []),
    ...(product.materials || []).map(m => `${m} Indore`),
    "iron and hardware Indore",
    "construction materials Indore",
    "HM Ibrahim & Co",
  ];

  return {
    title: `${product.name} ${locationKeywords} | ${site.name}`,
    description: description.substring(0, 160), // Keep under 160 chars
    keywords: keywords.join(", "),
    alternates: { canonical: `${baseUrl}/products/${product.slug}` },
    openGraph: {
      title: `${product.name} ${locationKeywords}`,
      description: description.substring(0, 200),
      url: `${baseUrl}/products/${product.slug}`,
      siteName: site.name,
      images: firstImage ? [{ url: firstImage, alt: product.imageAlt || product.name }] : [],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} ${locationKeywords}`,
      description: description.substring(0, 200),
      images: firstImage ? [firstImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const media = getProductMedia(product, category);
  const hasBrandVariants = product.brandVariants && product.brandVariants.length > 0;
  const relatedProducts = getRelatedProducts(slug, 4);
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
    ...(site.googleReview
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

  const productFaqSchema = productFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.slice(0, 4).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  const sizeInfo = product.sizes && product.sizes.length > 0
    ? ` Size: ${product.sizes.slice(0, 3).join(", ")}`
    : "";
  const whatsAppMessage = `Hi, I'm interested in ${product.name}.${sizeInfo} Please share price/availability.`;

  const meshWireCategorySlugs = ["wiremesh", "wires", "welded-mesh", "perforated-sheets", "fibermesh", "chicken-mesh", "plastic-hexa"];

  return (
    <article className="page-container section-padding">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={productSchema} />
      {productFaqSchema && <SeoJsonLd data={productFaqSchema} />}
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      {hasBrandVariants ? (
        <ProductDetailClient
          product={product}
          category={category ?? null}
          defaultImages={images}
        />
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-2">
            <ProductImageGallery
              key={product.slug}
              media={media}
              alt={product.imageAlt || product.name}
              productName={product.name}
              productSlug={product.slug}
            />
            <div>
              <div data-speakable>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
                {category && (
                  <p className="mt-2 text-muted-foreground">{category.name}</p>
                )}
                <p className="mt-4 text-muted-foreground leading-relaxed">{product.shortDesc}</p>
              </div>

              {(product.specs && product.specs.length > 0) || product.tataOfficial || product.tataAvailable || (category?.slug && meshWireCategorySlugs.includes(category.slug)) ? (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Specifications</h2>
                  <dl className="mt-2 space-y-2">
                    {product.tataOfficial && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                        <dd className="flex items-center gap-2 text-foreground">
                          <span className="relative h-[18px] w-9 shrink-0">
                            <Image src="/brands/tata.svg" alt="" width={36} height={18} className="object-contain" />
                          </span>
                          <span>Tata products available on request (Authorized Dealer).</span>
                        </dd>
                      </div>
                    )}
                    {product.tataAvailable && !product.tataOfficial && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                        <dd className="text-foreground">Tata product available on request.</dd>
                      </div>
                    )}
                    {category?.slug && meshWireCategorySlugs.includes(category.slug) && !product.tataOfficial && !product.tataAvailable && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                        <dd className="text-foreground">Available in multiple trusted brands.</dd>
                      </div>
                    )}
                    {category?.slug && meshWireCategorySlugs.includes(category.slug) && (product.tataOfficial || product.tataAvailable) && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brands:</dt>
                        <dd className="text-foreground">Available in multiple trusted brands.</dd>
                      </div>
                    )}
                    {product.specs?.map((spec) => (
                      <div key={spec.label} className="flex gap-2">
                        <dt className="text-muted-foreground">{spec.label}:</dt>
                        <dd className="text-foreground">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Sizes & Thickness</h2>
                  <ul className="mt-2 list-inside list-disc text-muted-foreground">
                    {product.sizes.map((size) => (
                      <li key={size}>{size}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.materials && product.materials.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Materials / Finish</h2>
                  <ul className="mt-2 list-inside list-disc text-muted-foreground">
                    {product.materials.map((material) => (
                      <li key={material}>{material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Variants</h2>
                  <ul className="mt-2 list-inside list-disc text-muted-foreground">
                    {product.variants.map((variant) => (
                      <li key={variant}>{variant}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.useCases && product.useCases.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-foreground">Common Uses</h2>
                  <ul className="mt-2 list-inside list-disc text-muted-foreground">
                    {product.useCases.map((use) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.notes && (
                <div className="mt-6 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">{product.notes}</p>
                </div>
              )}

              <div className="mt-6 rounded-lg border border-border/60 bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Available in different sizes, weights and finishes. Stock varies.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild>
                  <Link href={`/quote?product=${product.slug}&category=${product.categorySlug}`}>
                    Request a Quote
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={getWhatsAppLink(site.whatsapp, whatsAppMessage)} target="_blank" rel="noopener noreferrer">
                    WhatsApp for price
                  </a>
                </Button>
              </div>

              <LookingForMoreSection variant="product" className="mt-8" />
            </div>
          </div>
        </>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-semibold text-foreground">Related products</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {relatedProducts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
