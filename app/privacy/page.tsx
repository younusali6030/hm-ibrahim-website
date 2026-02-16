import type { Metadata } from "next";
import { site } from "@/content/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name} website.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN")}</p>

      <div className="prose prose-invert mt-8 max-w-3xl">
        <p>
          This privacy policy applies to the website of <strong>{site.name}</strong> and describes
          how we collect, use, and protect your information when you use our site or contact us.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Information we collect</h2>
        <p>
          When you submit a quote request or contact form, we collect the information you provide,
          such as name, phone number, email address, and message content. We use this only to
          respond to your enquiry and conduct our business.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">How we use your information</h2>
        <p>
          We use the information you provide to respond to quote requests, contact enquiries, and
          for internal business purposes. We do not sell your personal information to third parties.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Cookies and analytics</h2>
        <p>
          Our website may use cookies or similar technologies for basic functionality. If we use
          analytics (e.g. Google Analytics), we may collect anonymised usage data to improve the
          site.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-foreground">Contact</h2>
        <p>
          For any questions about this privacy policy or your data, contact us at {site.email} or
          {site.phone}.
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
