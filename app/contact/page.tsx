import type { Metadata } from "next";
import { baseUrl, entityIds, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { QuoteFormWrapper } from "./QuoteFormWrapper";

// Quote submissions email the business and the customer; allow time on serverless hosts.
export const maxDuration = 30;

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Get a quote or contact H M Ibrahim & Co",
  description: `Request a quote or contact ${site.name}, Siyaganj, Indore. Iron and hardware, retail and wholesale.`,
  url: `${baseUrl}/contact`,
  mainEntity: {
    "@type": "LocalBusiness",
    "@id": entityIds.localBusiness,
    name: site.name,
    telephone: site.phone.replace(/\s/g, ""),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pincode,
      addressCountry: site.address.country,
    },
  },
};

export const metadata: Metadata = buildPageMeta({
  title: `Get a Quote & Contact | ${site.name}, Siyaganj, Indore`,
  description: `Request a quote for iron, wire, mesh and hardware, or visit ${site.name} at 60 Siyaganj Main Road, Indore. Call, WhatsApp or send your list.`,
  path: "contact",
});

export default function ContactPage() {
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
  return (
    <>
      <div className="page-container section-padding" id="quote">
        <SeoJsonLd data={contactPageSchema} />
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          H M Ibrahim &amp; Co, Siyaganj, Indore
        </p>
        <h1 className="mt-2 text-foreground">Get a quote</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Send your list. We check stock and call you back with rates, usually the same working day. Prefer to talk? Call
          or WhatsApp us, or walk in.
        </p>
        <QuoteFormWrapper />
      </div>

      <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="visit-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Visit the shop
            </p>
            <h2 id="visit-heading" className="mt-2 text-foreground">
              Find us on Siyaganj Main Road
            </h2>
            <dl className="mt-8 space-y-5 text-base">
              <div>
                <dt className="text-sm font-semibold text-foreground">Address</dt>
                <dd className="mt-1 text-muted-foreground">
                  {site.address.line1}, {site.address.line2}, {site.address.city}, {site.address.state} {site.address.pincode}
                  <br />
                  Opposite Tijori Gali. Ask for H M Ibrahim &amp; Co.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Hours</dt>
                <dd className="mt-1 text-muted-foreground">
                  {site.hours.weekdays}
                  <br />
                  {site.hours.sunday}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Phone</dt>
                <dd className="mt-1 text-muted-foreground">
                  <a href={tel(site.phone)} className="inline-block py-2.5 font-semibold text-foreground underline underline-offset-4">
                    {site.phone}
                  </a>{" "}
                  ({site.phoneLabel})
                  <br />
                  <a href={tel(site.phoneAlt)} className="inline-block py-2.5 font-semibold text-foreground underline underline-offset-4">
                    {site.phoneAlt}
                  </a>{" "}
                  ({site.phoneAltLabel})
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">Email</dt>
                <dd className="mt-1 break-words text-muted-foreground">
                  <a href={`mailto:${site.email}`} className="inline-block py-2.5 underline underline-offset-4">{site.email}</a>
                  <br />
                  <a href={`mailto:${site.emailAlt}`} className="inline-block py-2.5 underline underline-offset-4">{site.emailAlt}</a>
                </dd>
              </div>
            </dl>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input bg-background px-6 font-semibold text-foreground hover:border-foreground/50"
            >
              Get directions
            </a>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-muted lg:aspect-auto lg:min-h-[28rem]">
            <iframe
              title="H M Ibrahim & Co on the map, Siyaganj, Indore"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.fullAddress)}&output=embed`}
              className="h-full w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
