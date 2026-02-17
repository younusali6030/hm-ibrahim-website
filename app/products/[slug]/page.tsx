import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getCategoryBySlug, allProducts, getProductImages, getRelatedProducts } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const description = `${product.shortDesc} Available from HM Ibrahim & Co, Siyaganj, Indore.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `${baseUrl}/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const hasBrandVariants = product.brandVariants && product.brandVariants.length > 0;
  const relatedProducts = getRelatedProducts(slug, 4);
  const firstImage = images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0] || ""}`;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(category ? [{ name: category.name, url: `/products?category=${category.slug}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    ...(firstImage ? { image: firstImage } : {}),
    brand: { "@type": "Brand", name: site.name },
    offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: `${baseUrl}/products/${product.slug}` },
  };

  const sizeInfo = product.sizes && product.sizes.length > 0
    ? ` Size: ${product.sizes.slice(0, 3).join(", ")}`
    : "";
  const whatsAppMessage = `Hi, I'm interested in ${product.name}.${sizeInfo} Please share price/availability.`;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-7xl min-w-0">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-primary">Products</Link>
        {category && (
          <>
            {" / "}
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-primary">
              {category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

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
              images={images}
              alt={product.imageAlt || product.name}
              productName={product.name}
              productSlug={product.slug}
            />
            <div>
              <div>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
                {category && (
                  <p className="mt-2 text-muted-foreground">{category.name}</p>
                )}
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{product.shortDesc}</p>

              {(product.specs && product.specs.length > 0) || product.tataOfficial || product.tataAvailable || category?.slug === "wire-mesh" ? (
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
                    {category?.slug === "wire-mesh" && !product.tataOfficial && !product.tataAvailable && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brand availability:</dt>
                        <dd className="text-foreground">Available in multiple brands (trusted national + quality local options).</dd>
                      </div>
                    )}
                    {category?.slug === "wire-mesh" && (product.tataOfficial || product.tataAvailable) && (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-muted-foreground">Brands:</dt>
                        <dd className="text-foreground">Available in multiple brands (trusted national + quality local options).</dd>
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
    </div>
  );
}
