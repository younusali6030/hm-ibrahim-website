import type { Metadata } from "next";
import { site } from "@/content/site";
import { baseUrl } from "@/lib/site";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name} website.`,
  alternates: { canonical: `${baseUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lede={<>Last updated: {new Date().toLocaleDateString("en-IN")}</>} compact />
      <div className="page-container py-12 md:py-16">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none [&_h2]:text-foreground [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline">
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
    </>
  );
}
