import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocaleLink";
import { getProductBySlug, getCategoryBySlug, allProducts, getProductImages, getRelatedProducts, type ProductWithCategory } from "@/content/products";
import { getProductSeoContent, getRelatedBlogSlugsForProduct } from "@/content/productSeoContent";
import { getPostBySlug } from "@/content/blog/posts";
import { baseUrl } from "@/lib/site";
import { buildProductMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { localize, collectStrings } from "@/lib/localize";
import { inHouseBrands, getBrandById } from "@/content/brands";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductSeoContent } from "@/components/ProductSeoContent";
import { ProductReference } from "@/components/product/ProductReference";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { ProductReviewsRail } from "@/components/trust/ProductReviewsRail";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { ids, productJsonLd } from "@/lib/schema";
import { manufacturedProductSlugs, localPageForProductSlug, getIndorePage } from "@/content/indorePages";
import { indorePagesHi } from "@/content/hi/indore";
import { GaugeRule } from "@/components/motif/Motif";

type Props = { params: { lang: string; slug: string } };

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const lang = params.lang as Lang;
  const found = getProductBySlug(slug);
  if (!found) return { title: "Product" };
  const product = localize(found, lang);
  const category = getCategoryBySlug(product.categorySlug);
  const images = getProductImages(product, category);
  const firstImage = images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0] || ""}`;
  return buildProductMeta({
    lang,
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
  const { slug } = params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const productEn = getProductBySlug(slug);
  if (!productEn) notFound();
  const product = localize(productEn, lang);

  const categoryEn = getCategoryBySlug(productEn.categorySlug);
  const category = localize(categoryEn, lang);
  const images = getProductImages(product, category);
  const seoContent = getProductSeoContent(slug, product, lang);
  const relatedProductSlugs = seoContent?.relatedProductSlugs;
  const relatedProducts: ProductWithCategory[] = (relatedProductSlugs?.length
    ? relatedProductSlugs
        .map((s) => getProductBySlug(s))
        .filter((p): p is ProductWithCategory => p != null)
    : getRelatedProducts(slug, 6)
  ).map((p) => localize(p, lang));
  // Strings of this product, its category and the brand cards, for the client-side spec sheet.
  const tx = collectStrings([productEn, categoryEn, inHouseBrands], lang);
  const blogSlugs = getRelatedBlogSlugsForProduct(slug);
  const relatedBlogPosts = await Promise.all(blogSlugs.map((s) => getPostBySlug(s, lang))).then((posts) =>
    posts.filter((p): p is NonNullable<typeof p> => p != null).map((p) => ({ slug: p.slug, title: p.title, lang: p.lang }))
  );
  const firstImage = images[0]?.startsWith("http") ? images[0] : `${baseUrl}${images[0] || ""}`;

  const breadcrumbItems = [
    { name: t("Home", "होम"), url: "/" },
    { name: t("Products", "उत्पाद"), url: "/products" },
    ...(category ? [{ name: category.name, url: `/categories/${category.slug}` }] : []),
    { name: product.name, url: `/products/${product.slug}` },
  ];

  // Product schema. No price, offer or rating: prices are "ask for rate" and ratings are the shop's own
  // (see the rules at the top of lib/schema.ts). Brand is set only for makes the shop really stocks for this item.
  const allImages = images.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`));
  const productUrl = pageUrl(`products/${product.slug}`, lang);
  const brandNames = (productEn.brandVariants ?? [])
    .map((v) => getBrandById(v.brandId)?.name)
    .filter((n): n is string => !!n);

  const productSchema = {
    ...productJsonLd({
      slug: product.slug,
      name: product.name,
      description: product.shortDesc,
      images: allImages,
      category: category?.name || product.categorySlug,
      materials: product.materials,
      specs: product.specs,
      brands: brandNames,
    }),
    "@id": `${productUrl}#product`,
    url: productUrl,
    // Only the product families the owner confirmed the shop makes (12 Oct 2026). Everything else is stocked.
    ...((manufacturedProductSlugs as readonly string[]).includes(product.slug) ? { manufacturer: { "@id": ids.organization } } : {}),
    isRelatedTo: relatedProducts.slice(0, 4).map((r) => ({ "@id": `${pageUrl(`products/${r.slug}`, lang)}#product` })),
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

  // The Indore page that owns "<product> Indore". This page keeps the specification; that one the local buying.
  const localBase = getIndorePage(localPageForProductSlug[product.slug] ?? "");
  const localPage = localBase ? (hi ? { ...localBase, ...indorePagesHi[localBase.slug] } : localBase) : null;
  const localNote = localPage ? (
    <p className="mt-2 text-sm text-muted-foreground">
      {hi ? "इंदौर में खरीदने की जानकारी, पिकअप और डिलीवरी: " : "Buying in Indore, with pickup and delivery: "}
      <Link
        href={`/indore/${localPage.slug}`}
        className="font-semibold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {localPage.h1}
      </Link>
    </p>
  ) : null;

  return (
    <article className="page-container pb-28 pt-4 md:pb-16 md:pt-6">
      <JsonLdBreadcrumb items={breadcrumbItems} lang={lang} />
      <SeoJsonLd data={productSchema} lang={lang} />
      {productFaqSchema && <SeoJsonLd data={productFaqSchema} lang={lang} />}
      <Breadcrumbs items={breadcrumbItems} className="mb-6" lang={lang} />

      <ProductDetailClient
        product={productEn}
        category={categoryEn ?? null}
        defaultImages={getProductImages(productEn, categoryEn)}
        tx={tx}
        localNote={localNote}
        afterSpecs={<ProductReference slug={product.slug} lang={lang} />}
        reviews={<ProductReviewsRail lang={lang} productSlug={product.slug} productName={product.name} />}
      />

      {relatedProducts.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <GaugeRule label={`${relatedProducts.length}`} />
          <h2 id="related-heading" className="mt-3 text-foreground">{t("Related products", "संबंधित उत्पाद")}</h2>
          <ul className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
            {relatedProducts.map((p) => (
              <li key={p.slug} className="border-b border-border">
                <Link
                  href={`/products/${p.slug}`}
                  className="flex min-h-[48px] items-center justify-between gap-3 py-3 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="font-display text-xl font-extrabold uppercase leading-none">{p.name}</span>
                  <span className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{p.categoryName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14" aria-label={t("Shop facts and reviews", "दुकान के तथ्य और रिव्यू")}>
        <TrustBadges lang={lang} />
      </section>

      {seoContent && (
        <ProductSeoContent
          content={seoContent}
          product={product}
          category={category ?? null}
          relatedProducts={relatedProducts}
          relatedBlogPosts={relatedBlogPosts}
          lang={lang}
        />
      )}
    </article>
  );
}
