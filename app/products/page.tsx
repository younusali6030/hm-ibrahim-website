import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Iron & steel, pipes, wire & mesh, hardware & tools. Browse categories and request a quote. HM Ibrahim & Co — Siyaganj, Indore.",
  alternates: { canonical: `${baseUrl}/products` },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
