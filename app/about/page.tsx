import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseUrl, entityIds, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { ReelsSection } from "@/components/home/ReelsSection";
import { CounterStamp, GaugeRule } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${site.name}`,
  description: site.description,
  url: `${baseUrl}/about`,
  mainEntity: {
    "@type": "Organization",
    "@id": entityIds.organization,
    name: site.name,
    foundingDate: "1939",
    description: site.description,
  },
};

export const metadata: Metadata = buildPageMeta({
  title: `About Us | ${site.name}, iron & hardware since 1939, Siyaganj Indore`,
  description: `The story of ${site.name}: founded in 1939, now run by the third generation, one counter on Siyaganj Main Road, Indore.`,
  path: "about",
});

const LEADERS = [
  {
    era: "1939",
    name: "Late H.M. Ibrahim",
    role: "Founder",
    text: "His vision laid the foundation of trust, quality and long-term relationships in the steel and hardware trade.",
  },
  {
    era: "Then",
    name: "Late Abedeali Bhai Dewaswala (CM)",
    role: "1924 to 2025",
    text: "Under his leadership the company strengthened its reputation across Indore and surrounding regions, building deep customer relationships and operational discipline.",
  },
  {
    era: "Then",
    name: "Akbar Ali",
    role: "Led the firm next",
    text: "He built a highly skilled and trustworthy sales and production team, strengthening internal systems and expanding the firm's reach.",
  },
  {
    era: "Today",
    name: "Shoeb Ali",
    role: "Leading the firm now",
    text: "He brings modern strategy, structured operations and forward-thinking execution to this hereditary business, so the HM Ibrahim & Co. name reaches every household while its legacy of trust stays intact.",
  },
];

const VALUES = [
  { t: "Reliability", d: "We deliver on every promise, with consistent quality you can count on." },
  { t: "Fair pricing", d: "Transparent, competitive rates for retail and wholesale alike." },
  { t: "Availability", d: "Strong stock and quick fulfilment so your projects stay on track." },
  { t: "Long relationships", d: "We grow with our customers and stand by them for the long run." },
];

export default function AboutPage() {
  return (
    <>
      <SeoJsonLd data={aboutPageSchema} />
      <PageHero
        eyebrow={<T en="About · Siyaganj, Indore" hi="हमारे बारे में · सियागंज, इंदौर" />}
        title={<T en="Since 1939, one counter on Siyaganj Main Road" hi="1939 से, सियागंज मेन रोड का एक काउंटर" />}
        lede={site.manufacturerTagline}
        image={{
          src: "/about/storefront-hero.jpg",
          alt: "The H M Ibrahim & Co shopfront at 60 Siyaganj, Indore, with wire mesh, chain link and coils out front",
        }}
      >
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <Link href="/brands" className={btnGhostDark}><T en="Our brands" hi="हमारे ब्रांड" /></Link>
      </PageHero>

      {/* Story: copy is the shop's own, from the repo. */}
      <section className="st-sec" aria-labelledby="story-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead eyebrow="Our story" id="story-heading" title="Eight decades of the same promise" />
            <div className="mt-8">
              <CounterStamp sub="Siyaganj, Indore">Since 1939</CounterStamp>
            </div>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p className="text-xl text-foreground">
              Founded in 1939, H.Mohammed.Husain.HM.Ibrahim&amp;Co (CM) has been a trusted name in wiremesh, steel sections, and industrial hardware in Indore.
            </p>
            <p>
              Located in the heart of Siyaganj, we have proudly served generations of contractors, builders, fabricators, and businesses with consistent quality, fair pricing, and reliable supply. Today, the business is being managed by the third generation, continuing the legacy with the same commitment to quality and customer satisfaction.
            </p>
            <p>
              We specialize in a wide range of products including wiremesh, weldmesh, perforated sheets (MS &amp; SS), steel sections, GI &amp; MS wires, fencing materials, and industrial hardware. Our fencing solutions include barbed wire, chainlink fence, and zatka (jhatka) wire, catering to both construction and agricultural needs.
            </p>
            <p>
              In addition to industrial materials, we also deal in durable agricultural and manual tools such as hoe, pickaxe, and crowbar, ensuring strong and dependable equipment for field and construction use.
            </p>
            {/*
              NEEDS-YOU (see docs/design/NEEDS-YOU-story.md): more history would help here, in the owner's words.
              Not rendered until supplied: how the shop began, the year of the move to 60 Siyaganj Main Road,
              what Siyaganj Main Road was like then, what CM stands for in family terms, which trades came first.
            */}
          </div>
        </div>

        <div className="page-container mt-14">
          <figure>
            <div className="relative aspect-[1024/714] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
              <Image
                src="/about-storefront.png"
                alt="The H M Ibrahim & Co shopfront on Siyaganj Main Road, Indore"
                fill
                sizes="(max-width:1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {site.address.line1}, {site.address.line2}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Leadership as a ledger, oldest first. */}
      <section className="st-sec st-sec-tint" aria-labelledby="leaders-heading">
        <div className="page-container">
          <SectionHead eyebrow="Leadership and legacy" id="leaders-heading" title="The hands that built the counter" />
          <ol className="st-ledger mt-10" style={{ ["--st-cols" as string]: "7rem minmax(0,1fr) minmax(0,1.5fr)" }}>
            {LEADERS.map((l) => (
              <li key={l.name} className="st-row">
                <span className="st-key" aria-hidden="true">{l.era}</span>
                <div>
                  <h3 className="st-title">{l.name}</h3>
                  <p className="st-meta">{l.era === "1939" ? `${l.role}, 1939` : l.role}</p>
                </div>
                <p className="st-body">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReelsSection />

      <section className="st-sec" aria-labelledby="values-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead
            eyebrow="How we work"
            id="values-heading"
            title="Four things we hold to"
            lede="With decades of experience we know our products and what each job needs. We guide you to the most suitable and cost-effective choice for your application, with durability, safety and long-term value in mind."
          />
          <ul className="st-ledger self-start" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {VALUES.map((v) => (
              <li key={v.t} className="st-row">
                <h3 className="st-title">{v.t}</h3>
                <p className="st-body">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="st-sec st-sec-tint" aria-labelledby="stock-heading">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-secondary">
              <Image src="/about/warehouse-stock-1.png" alt="CM and Border barbed wire and chain link coils in the warehouse" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[14px] bg-secondary">
              <Image src="/about/warehouse-stock-2.png" alt="Barbed wire rolls, CM and Border brand stock, ready for dispatch" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
          </div>
          <div>
            <SectionHead eyebrow="What we supply" id="stock-heading" title="Stock that serves construction, fabrication and industry" />
            <GaugeRule className="mt-6" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We stock a wide range of iron and steel (MS angles, flats, bright bars, TMT bars and structural sections), plus pipes and tubes, wire and mesh (GI wire, binding wire, barbed wire, chain link, welded mesh, jalies), and hardware and tools including welding rods, fasteners, nails, crowbars, pickaxes, perforated sheets and pigeon nets. Retail and wholesale.
            </p>
            <p className="mt-4 text-muted-foreground">For over eight decades we have kept to the same values of trust, integrity and long-term relationships.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={btnMain}><T en="Browse the range" hi="पूरी रेंज देखें" /></Link>
            </div>
            {site.gstin && <p className="mt-8 text-sm text-muted-foreground">GSTIN <span className="font-mono-brand text-foreground">{site.gstin}</span></p>}
          </div>
        </div>
      </section>

      <div className="page-container st-sec">
        <ReviewsList max={3} title="What our customers say" />
      </div>

      <ContactStrip heading="Come to the counter" waMessage="Hi, I read about your shop and would like a rate. Product, size and quantity: " />
    </>
  );
}
