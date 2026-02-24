import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PostPurchaseForm } from "./PostPurchaseForm";

const postPurchasePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Post-Purchase Details — Iron & Hardware",
  description: `Share what you bought and your details so we can support you better. ${site.name} — Siyaganj, Indore.`,
  url: `${baseUrl}/post-purchase`,
};

export const metadata: Metadata = {
  title: "Post-Purchase Details",
  description: `Share your purchase details (what you bought, quantity, and contact info) so we can support you better. ${site.name} — Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/post-purchase` },
};

export default function PostPurchasePage() {
  return (
    <div className="page-container section-padding">
      <SeoJsonLd data={postPurchasePageSchema} />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-5xl">
        Post-Purchase Details
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground text-sm md:text-base">
        Fill this form after your purchase to share what you bought and how we can help you next.
        It helps us understand demand, support you on future orders, and keep your details handy.
      </p>
      <PostPurchaseForm />
    </div>
  );
}

