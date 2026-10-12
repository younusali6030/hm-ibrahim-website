import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { ReelsSection } from "@/components/home/ReelsSection";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${site.name}`,
  description: site.description,
  url: `${baseUrl}/about`,
  mainEntity: {
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: site.name,
    foundingDate: "1939",
    description: site.description,
  },
};

export const metadata: Metadata = buildPageMeta({
  title: `About Us | ${site.name}, iron & hardware since 1939, Siyaganj Indore`,
  description: `The story of ${site.name}: founded in 1939, four generations of leadership, one counter on Siyaganj Main Road, Indore.`,
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
        eyebrow="About"
        title="Since 1939, one counter on Siyaganj Main Road"
        lede={site.manufacturerTagline}
        image={{
          src: "/about/storefront-hero.jpg",
          alt: "The H M Ibrahim & Co shopfront at 60 Siyaganj, Indore, with wire mesh, chain link and coils out front",
        }}
      >
        <Link href="/contact" className={btnMain}>Get a quote</Link>
        <Link href="/brands" className={btnGhostDark}>Our brands</Link>
      </PageHero>

      <section className="py-14 md:py-20" aria-labelledby="story-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Our story</p>
            <h2 id="story-heading" className="mt-2 text-foreground">Eight decades of the same promise</h2>
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
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="leaders-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Leadership and legacy</p>
          <h2 id="leaders-heading" className="mt-2 text-foreground">The hands that built the counter</h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {LEADERS.map((l) => (
              <li key={l.name} className="flex flex-col bg-background p-6">
                <span className="font-display text-5xl font-extrabold uppercase leading-none text-primary">{l.era}</span>
                <span className="mt-4 font-display text-2xl font-extrabold uppercase leading-tight text-foreground">{l.name}</span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{l.role}</span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReelsSection />

      <section className="py-14 md:py-20" aria-labelledby="values-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">How we work</p>
            <h2 id="values-heading" className="mt-2 text-foreground">Four things we hold to</h2>
            <p className="mt-5 text-muted-foreground">
              With decades of experience we know our products and what each job needs. We guide you to the most suitable and cost-effective choice for your application, with durability, safety and long-term value in mind.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <li key={v.t} className="bg-card p-6">
                <span className="font-mono-brand text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none text-foreground">{v.t}</h3>
                <p className="mt-3 text-muted-foreground">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="stock-heading">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
              <Image src="/about/warehouse-stock-1.png" alt="CM and Border barbed wire and chain link coils in the warehouse" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
              <Image src="/about/warehouse-stock-2.png" alt="Barbed wire rolls, CM and Border brand stock, ready for dispatch" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
          </div>
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">What we supply</p>
            <h2 id="stock-heading" className="mt-2 text-foreground">Stock that serves construction, fabrication and industry</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We stock a wide range of iron and steel (MS angles, flats, bright bars, TMT bars and structural sections), plus pipes and tubes, wire and mesh (GI wire, binding wire, barbed wire, chain link, welded mesh, jalies), and hardware and tools including welding rods, fasteners, nails, crowbars, pickaxes, perforated sheets and pigeon nets. Retail and wholesale.
            </p>
            <p className="mt-4 text-muted-foreground">For over eight decades we have kept to the same values of trust, integrity and long-term relationships.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={btnMain}>Browse the range</Link>
            </div>
            {site.gstin && <p className="mt-8 text-sm text-muted-foreground">GSTIN <span className="font-mono-brand text-foreground">{site.gstin}</span></p>}
          </div>
        </div>
      </section>

      <div className="page-container py-14 md:py-20">
        <ReviewsList max={3} title="What our customers say" />
      </div>
    </>
  );
}
