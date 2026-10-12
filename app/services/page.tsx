import type { Metadata } from "next";
import Link from "next/link";
import { baseUrl, site } from "@/lib/site";
import { services } from "@/content/services";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Services, ${site.name}`,
  description: `Retail, wholesale, bulk orders, warehouse and delivery from ${site.name}, Siyaganj, Indore.`,
  url: `${baseUrl}/services`,
};

export const metadata: Metadata = {
  title: "Services | Retail, Wholesale, Bulk Orders & Delivery",
  description: `Retail, wholesale, bulk orders, warehouse and delivery. How ${site.name} serves builders, contractors and customers in Indore.`,
  alternates: { canonical: `${baseUrl}/services` },
};

const STEPS = [
  { t: "Tell us what you need", d: "Send a list, call, or walk in. Sizes and quantities help us quote exactly." },
  { t: "We confirm stock and rate", d: "We check the shelf and come back with a rate and what is available today." },
  { t: "Collect it, or we dispatch", d: "Pick up from our Siyaganj counter, or ask about delivery for your location." },
];

export default function ServicesPage() {
  return (
    <>
      <SeoJsonLd data={servicesPageSchema} />
      <PageHero
        eyebrow="Services"
        title="One counter for a single coil or a whole site"
        lede="We serve retail customers, wholesalers, contractors and industrial buyers with supply and support to match the order."
      >
        <Link href="/contact" className={btnMain}>Get a quote</Link>
        <Link href="/products" className={btnGhostDark}>Browse the range</Link>
      </PageHero>

      <section className="py-14 md:py-20" aria-labelledby="services-heading">
        <div className="page-container">
          <h2 id="services-heading" className="sr-only">What we offer</h2>
          <ol className="divide-y divide-border border-y border-border">
            {services.map((s, i) => (
              <li key={s.slug} className="grid gap-4 py-8 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8 md:py-10">
                <span className="font-display text-6xl font-extrabold leading-none text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-4xl font-extrabold uppercase leading-none text-foreground">{s.title}</h3>
                <div>
                  <p className="text-lg leading-relaxed text-muted-foreground">{s.description}</p>
                  {(s.slug === "delivery" || s.slug === "fabrication") && (
                    <p className="mt-2 text-sm italic text-muted-foreground">Subject to availability. Please enquire at the time of order.</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="how-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">How an order works</p>
          <h2 id="how-heading" className="mt-2 text-foreground">Three steps, no paperwork to start</h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="bg-background p-7">
                <span className="font-display text-5xl font-extrabold leading-none text-primary">{i + 1}</span>
                <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-none text-foreground">{s.t}</h3>
                <p className="mt-3 text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="page-container py-14 md:py-20">
        <ReviewsList max={3} title="From buyers who used the counter" />
      </div>
    </>
  );
}
