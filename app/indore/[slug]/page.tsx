import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { indorePageSlugs, getIndorePage } from "@/content/indorePages";
import { getProductBySlug } from "@/content/products";
import { site } from "@/lib/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return indorePageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndorePage(slug);
  if (!page) return { title: "Products in Indore" };
  const { baseUrl } = await import("@/lib/site");
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${baseUrl}/indore/${page.slug}` },
  };
}

export default async function IndoreLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getIndorePage(slug);
  if (!page) notFound();

  const products = page.productSlugs
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  const whatsAppMessage = `Hi, I'm interested in ${page.h1.replace(/ in Indore$/, "")}. Please share price and availability.`;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: page.h1, url: `/indore/${page.slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        {" / "}
        <Link href="/products" className="hover:text-primary">Products</Link>
        {" / "}
        <span className="text-foreground">{page.h1}</span>
      </nav>

      <h1 className="text-4xl font-bold text-foreground md:text-5xl">{page.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-relaxed">
        {page.intro}
      </p>
      {page.intro2 && (
        <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
          {page.intro2}
        </p>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        We are located in <strong className="text-foreground">Siyaganj, Indore</strong>. We serve Indore, Dewas, Ujjain, Mhow, Pithampur, and nearby areas.
      </p>

      {page.specs.length > 0 && (
        <section className="mt-10" aria-labelledby="specs-heading">
          <h2 id="specs-heading" className="text-xl font-semibold text-foreground">What we offer</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {page.specs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {page.useCases.length > 0 && (
        <section className="mt-8" aria-labelledby="uses-heading">
          <h2 id="uses-heading" className="text-xl font-semibold text-foreground">Common uses</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {page.useCases.map((use, i) => (
              <li key={i}>{use}</li>
            ))}
          </ul>
        </section>
      )}

      {products.length > 0 && (
        <section className="mt-10" aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-xl font-semibold text-foreground">Related products</h2>
          <ul className="mt-3 space-y-2">
            {products.map((p) => (
              <li key={p!.slug}>
                <Link
                  href={`/products/${p!.slug}`}
                  className="text-primary hover:underline"
                >
                  {p!.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-4">
        <Button asChild>
          <Link href={`/quote?product=${page.productSlugs[0] || ""}`}>
            Request a Quote
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a
            href={getWhatsAppLink(site.whatsapp, whatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp for price
          </a>
        </Button>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
