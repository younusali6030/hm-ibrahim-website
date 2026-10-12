import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";
import Link from "next/link";
import { baseUrl, site } from "@/lib/site";
import { services } from "@/content/services";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Services, ${site.name}`,
  description: `Retail, wholesale, bulk orders, warehouse and delivery from ${site.name}, Siyaganj, Indore.`,
  url: `${baseUrl}/services`,
};

export const metadata: Metadata = buildPageMeta({
  title: "Services: Retail, Wholesale and Bulk Orders",
  description: `Retail, wholesale, bulk orders, warehouse and delivery. How ${site.name} serves builders, contractors and customers in Indore.`,
  path: "services",
});

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
        eyebrow={<T en="Services · Siyaganj, Indore" hi="सेवाएँ · सियागंज, इंदौर" />}
        title={<T en="One counter for a single coil or a whole site" hi="एक काउंटर: एक कॉइल से पूरी साइट तक" />}
        lede="We serve retail customers, wholesalers, contractors and industrial buyers with supply and support to match the order."
      >
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <Link href="/products" className={btnGhostDark}><T en="Browse the range" hi="पूरी रेंज देखें" /></Link>
      </PageHero>

      <section className="st-sec" aria-labelledby="services-heading">
        <div className="page-container">
          <SectionHead eyebrow="What we do" id="services-heading" title="Six ways we serve" />
          <ol className="st-ledger mt-10">
            {services.map((s, i) => (
              <li key={s.slug} className="st-row">
                <span className="st-key" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="st-title">{s.title}</h3>
                <div>
                  <p className="st-body text-lg">{s.description}</p>
                  {(s.slug === "delivery" || s.slug === "fabrication") && (
                    <p className="st-meta">Subject to availability. Please enquire at the time of order.</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="st-sec st-sec-tint" aria-labelledby="how-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead eyebrow="How an order works" id="how-heading" title="Three steps, no paperwork to start" />
          <ol className="st-ledger self-start" style={{ ["--st-cols" as string]: "4rem minmax(0,1fr)" }}>
            {STEPS.map((s, i) => (
              <li key={s.t} className="st-row">
                <span className="st-key" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="st-title">{s.t}</h3>
                  <p className="st-body mt-2">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="page-container st-sec">
        <ReviewsList max={3} title="From buyers who used the counter" />
      </div>

      <ContactStrip heading="Send the list" waMessage="Hi, I'd like a rate for an order. Product, size and quantity: " />
    </>
  );
}
