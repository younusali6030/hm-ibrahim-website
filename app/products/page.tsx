import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { categories, allProducts, getProductImages } from "@/content/products";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ProductsIndex, type IndexCategory } from "./ProductsIndex";
import { sizeTag, tataFlag } from "@/components/catalog/ledger";
import { T } from "@/lib/i18n";

export const metadata: Metadata = buildPageMeta({
  title: "Products: Iron, Steel, Wire and Mesh",
  description:
    "The full range at H M Ibrahim & Co, Siyaganj, Indore: TMT bars, MS angles, wire mesh, welded mesh, barbed wire, chain link, perforated sheets, wire rope and tools. Ask for the rate.",
  path: "products",
});

function itemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Iron & hardware products",
    numberOfItems: allProducts.length,
    itemListElement: allProducts.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/products/${p.slug}`,
      name: p.name,
    })),
  };
}

export default function ProductsPage() {
  const data: IndexCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: getProductImages(c.products[0] ?? ({} as never), c)[0] ?? c.image ?? "",
    products: c.products.map((p) => ({
      slug: p.slug,
      name: p.name,
      shortDesc: p.shortDesc,
      image: getProductImages(p, c)[0] ?? "",
      imageAlt: p.imageAlt,
      categorySlug: c.slug,
      tag: sizeTag(p),
      // "wiron" only where the catalog holds a Tata Wiron brand variant (GI wire, barbed wire, chain link).
      // Other Tata-flagged items (structural steel, binding wire) are only "available on request".
      tata: tataFlag(p),
    })),
  }));

  return (
    <>
      <SeoJsonLd data={itemListSchema()} />
      <PageHero
        eyebrow={<T en="The range" hi="पूरा माल" />}
        title={<T en="Every wire, mesh and bar. One counter." hi="हर तार, जाली और सरिया। एक काउंटर।" />}
        lede={
          <T
            en={`${categories.length} categories and ${allProducts.length} products, stocked at our Siyaganj shop. Find what you need, then ask for a rate.`}
            hi={`${categories.length} श्रेणी, ${allProducts.length} आइटम, सियागंज की दुकान पर। जो चाहिए ढूँढिए, फिर रेट पूछिए।`}
          />
        }
      />
      <ProductsIndex categories={data} />
    </>
  );
}
