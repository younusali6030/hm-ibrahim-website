import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PostPurchaseForm } from "./PostPurchaseForm";

const postPurchasePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Save Your Purchase — Get Special Rates on Your Next Order",
  description: `Save your purchase details so we can offer you better support and special rates on your next order. ${site.name} — Siyaganj, Indore.`,
  url: `${baseUrl}/post-purchase`,
};

export const metadata: Metadata = {
  title: "Save Your Purchase — Get Special Rates on Your Next Order",
  description: `Save your purchase details (what you bought, quantity, and contact info) so we can support you better and offer special rates on your next order. ${site.name} — Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/post-purchase` },
};

export default function PostPurchasePage() {
  return (
    <div className="page-container section-padding">
      <SeoJsonLd data={postPurchasePageSchema} />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-5xl">
        Save Your Purchase
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground text-sm md:text-base">
        Get special rates on your next order by saving your purchase details.
        Share what you bought, your quantity, and contact info so we can support you better and keep your details handy.
      </p>
      <PostPurchaseForm />
    </div>
  );
}

