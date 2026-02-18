import type { Metadata } from "next";
import Link from "next/link";
import { indorePageSlugs, getIndorePage, type IndorePage } from "@/content/indorePages";
import { baseUrl, site, localSeo } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Iron & Hardware in Indore, ${localSeo.state} | ${site.name}`,
  description: `Buy iron, steel, wire mesh, barbed wire, chain link, and construction hardware in Indore. We are in Siyaganj — retail and wholesale. Best price in Indore. Delivery in Indore and nearby areas.`,
  keywords: [
    "iron and hardware Indore",
    "wire mesh Indore",
    "TMT bars Indore",
    "construction materials Indore",
    "wholesale Indore",
    "Siyaganj Indore",
    site.name,
  ].join(", "),
  alternates: { canonical: `${baseUrl}/indore` },
  openGraph: {
    title: `Iron & Hardware in Indore | ${site.name}`,
    description: "Iron, steel, wire mesh, and hardware in Siyaganj, Indore. Retail and wholesale. Request a quote.",
    url: `${baseUrl}/indore`,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function IndoreIndexPage() {
  const pages = indorePageSlugs.map((slug) => getIndorePage(slug)).filter((p): p is IndorePage => p != null);

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-4xl min-w-0">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">
        Iron & Hardware in Indore, {localSeo.state}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {site.name} is based in <strong className="text-foreground">Siyaganj, Indore</strong> — one of Indore&apos;s main markets for iron and hardware. We supply retail and wholesale: MS angles, TMT bars, wire mesh, barbed wire, chain link fencing, GI pipes, and construction hardware. Get the best price in Indore; we also deliver to Dewas, Ujjain, Mhow, Pithampur, and nearby areas.
      </p>

      <section className="mt-12" aria-labelledby="products-indore-heading">
        <h2 id="products-indore-heading" className="text-2xl font-semibold text-foreground">
          Products we supply in Indore
        </h2>
        <ul className="mt-4 space-y-3">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/indore/${page.slug}`}
                className="text-primary font-medium hover:underline"
              >
                {page.h1}
              </Link>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                {page.intro}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card p-6" aria-labelledby="visit-heading">
        <h2 id="visit-heading" className="text-xl font-semibold text-foreground">
          Visit our shop in Indore
        </h2>
        <p className="mt-2 text-muted-foreground">
          {site.fullAddress}. {site.landmark}. We are open Monday–Saturday, 9 AM–8 PM. Call or WhatsApp for a quote.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quote">Request a quote</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact & directions</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
