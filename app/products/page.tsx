import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";
import { baseUrl, site } from "@/lib/site";
import { allProducts } from "@/content/products";
import { SeoJsonLd } from "@/components/SeoJsonLd";

export const metadata: Metadata = {
  title: "Products | Iron & Hardware in Indore, Siyaganj | HM Ibrahim & Co",
  description:
    "Browse our complete range of iron & steel, pipes, wire & mesh, hardware & tools in Indore, Siyaganj. TMT bars, MS angles, wire mesh, barbed wire, chain link fencing, GI pipes, and more. Retail and wholesale. Request a quote.",
  keywords: [
    "iron and steel Indore",
    "TMT bars Indore",
    "wire mesh Indore",
    "MS angles Indore",
    "barbed wire Indore",
    "chain link fencing Indore",
    "GI pipes Indore",
    "construction hardware Indore",
    "hardware tools Indore",
    "HM Ibrahim & Co",
    "Siyaganj Indore",
  ].join(", "),
  alternates: { canonical: `${baseUrl}/products` },
  openGraph: {
    title: "Products | Iron & Hardware in Indore | HM Ibrahim & Co",
    description: "Browse iron & steel, pipes, wire & mesh, hardware & tools. Retail and wholesale in Siyaganj, Indore.",
    url: `${baseUrl}/products`,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
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

function getProductsItemListSchema() {
  const items = allProducts.slice(0, 20).map((p, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    url: `${baseUrl}/products/${p.slug}`,
    name: p.name,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Iron & Hardware Products",
    description: `Browse ${site.name} products — MS angles, TMT bars, wire mesh, barbed wire, chain link, GI pipes, construction hardware. Retail and wholesale in Indore.`,
    numberOfItems: allProducts.length,
    itemListElement: items,
  };
}

export default function ProductsPage() {
  return (
    <>
      <SeoJsonLd data={getProductsItemListSchema()} />
      <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading...</div>}>
        <ProductsClient />
      </Suspense>
    </>
  );
}
