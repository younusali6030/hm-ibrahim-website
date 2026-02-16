import type { Metadata } from "next";
import { site } from "@/content/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${site.name} website.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-bold text-foreground">Terms of Use</h1>
      <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="prose prose-invert mt-8 max-w-3xl">
        <p>
          By using the website of <strong>{site.name}</strong>, you agree to these terms of use.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Use of website</h2>
        <p>
          This website is for informational and enquiry purposes. You may use it to learn about our
          products and services, request quotes, and contact us. You must not use the site for any
          unlawful purpose or to transmit harmful or misleading content.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Quotes and orders</h2>
        <p>
          Quote requests and communications through the website do not constitute a binding contract.
          All orders and transactions are subject to our confirmation, terms of sale, and prevailing
          prices and availability.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Accuracy</h2>
        <p>
          We strive to keep product and contact information accurate but do not warrant that all
          content is error-free or up to date. Please confirm details with us directly when placing
          orders.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Contact</h2>
        <p>
          For questions about these terms, contact us at {site.email} or {site.phone}.
        </p>

        <p className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
