import type { Metadata } from "next";
import { baseUrl, entityIds, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero } from "@/components/site/PageHero";
import { VisitUs } from "@/components/visit/VisitUs";
import { T } from "@/lib/i18n";
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
      <SeoJsonLd data={contactPageSchema} />
      <PageHero
        eyebrow={<T en="H M Ibrahim & Co, Siyaganj, Indore" hi="H M Ibrahim & Co, सियागंज, इंदौर" />}
        title={<T en="Get a quote" hi="कोटेशन पाएँ" />}
        lede={
          <T
            en="Send your list, or just your name and number. We check stock and call you back with rates during shop hours. Prefer to talk? Call or WhatsApp, or walk in."
            hi="अपनी लिस्ट भेजिए, या सिर्फ़ नाम और नंबर। हम स्टॉक देखकर दुकान के समय में रेट के साथ कॉल करते हैं। सीधे बात करनी हो तो कॉल या व्हाट्सएप कीजिए, या दुकान पर आइए।"
          />
        }
        compact
      />

      <div className="page-container section-padding pb-14 md:pb-20" id="quote" data-track="contact_page">
        <QuoteFormWrapper />
      </div>

      <section className="border-t border-border bg-card py-14 md:py-20">
        <div className="page-container grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <VisitUs variant="full" source="contact_visit" embed />
          <div>
            <h2 className="text-foreground">
              <T en="Call, WhatsApp or write" hi="कॉल, व्हाट्सएप या ईमेल" />
            </h2>
            <dl className="mt-6 space-y-5 text-base" data-track="contact_details">
              <div>
                <dt className="text-sm font-semibold text-foreground">
                  <T en="Phone" hi="फ़ोन" />
                </dt>
                <dd className="mt-1 text-muted-foreground">
                  <a href={tel(site.phone)} className="inline-block min-h-[44px] py-2.5 font-semibold text-foreground underline underline-offset-4">
                    {site.phone}
                  </a>{" "}
                  ({site.phoneLabel})
                  <br />
                  <a href={tel(site.phoneAlt)} className="inline-block min-h-[44px] py-2.5 font-semibold text-foreground underline underline-offset-4">
                    {site.phoneAlt}
                  </a>{" "}
                  ({site.phoneAltLabel})
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-foreground">
                  <T en="Email" hi="ईमेल" />
                </dt>
                <dd className="mt-1 break-words text-muted-foreground">
                  <a href={`mailto:${site.email}`} className="inline-block min-h-[44px] py-2.5 underline underline-offset-4">
                    {site.email}
                  </a>
                  <br />
                  <a href={`mailto:${site.emailAlt}`} className="inline-block min-h-[44px] py-2.5 underline underline-offset-4">
                    {site.emailAlt}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
