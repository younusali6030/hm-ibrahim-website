import type { Metadata } from "next";
import Image from "next/image";
import { baseUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${site.name} — our story since 1939, values, and what we supply. Trusted iron and hardware trading in Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-7xl min-w-0">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">About HM Ibrahim & Co</h1>
      <p className="mt-4 text-lg text-muted-foreground">{site.tagline}</p>
      <p className="mt-2 text-muted-foreground">{site.manufacturerTagline}</p>

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-10">
        <section className="md:pt-1" aria-label="Our store">
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:mx-0 md:max-w-none">
            <Image
              src="/about-storefront.png"
              alt="H.M. Ibrahim & Company storefront at 60 Siyaganj, Indore — angles, flats, channels, bright bars, rebar, pipes, wire mesh, and hardware on display."
              width={680}
              height={453}
              className="h-auto w-full object-cover"
              priority
            />
            <p className="px-4 py-3 text-center text-sm text-muted-foreground">
              Our store at 60, Siyaganj — your trusted source for iron and hardware since 1939.
            </p>
          </div>

          <section className="mt-8" aria-labelledby="warehouse-heading">
            <h2 id="warehouse-heading" className="text-xl font-semibold text-foreground mb-4">
              Stock at our warehouse
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              CM and Border barbed wire & chain link — ready for dispatch.
            </p>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src="/about/warehouse-stock-1.png"
                  alt="CM and Border barbed wire and chain link coils in warehouse"
                  width={680}
                  height={453}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src="/about/warehouse-stock-2.png"
                  alt="Barbed wire rolls — CM and Border brand stock at warehouse"
                  width={680}
                  height={453}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
            </div>
          </section>
        </section>

        <div className="min-w-0 space-y-10">
          <section aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-2xl font-semibold text-foreground">
              Our Story
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Since 1939, HM Ibrahim & Co has stood at the heart of Indore&apos;s iron and hardware trade. For over eight decades we have been the go-to name for builders, contractors, fabricators, and retailers who demand quality materials and dependable service. Based in the historic Siyaganj market — Indore&apos;s premier hub for steel and hardware — we have built lasting, multi-generation relationships with our clients and take pride in being part of their growth.
            </p>
          </section>

          <section className="mt-10 pt-10 border-t border-border" aria-labelledby="leadership-heading">
            <h2 id="leadership-heading" className="text-2xl font-semibold text-foreground">
              Our Leadership & Legacy
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              HM Ibrahim & Co. was founded by Late H.M. Ibrahim, whose vision laid the foundation of trust, quality, and long-term relationships in the steel and hardware trade.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The firm was later managed by Late Abedeali Bhai Dewaswala (CM) (1924–2025). Under his leadership, the company strengthened its reputation across Indore and surrounding regions, building deep customer relationships and operational discipline.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The command was then entrusted to Akbar Ali, who built a highly skilled and trustworthy sales and production team, strengthening internal systems and expanding the firm&apos;s reach.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Today, the firm is scaling under the supervision of Shoeb Ali, who brings modern strategy, structured operations, and forward-thinking execution to this hereditary business — ensuring the HM Ibrahim & Co. name reaches every household while preserving its legacy of trust.
            </p>
          </section>

          <section aria-labelledby="values-heading">
            <h2 id="values-heading" className="text-2xl font-semibold text-foreground">
              Our Values
            </h2>
            <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">Reliability</strong> — We deliver on every promise, with consistent quality you can count on.</li>
              <li><strong className="text-foreground">Fair pricing</strong> — Transparent, competitive rates for retail and wholesale alike.</li>
              <li><strong className="text-foreground">Availability</strong> — Strong stock and quick fulfillment so your projects stay on track.</li>
              <li><strong className="text-foreground">Long-term relationships</strong> — We grow with our customers and stand by them for the long run.</li>
            </ul>
          </section>

          <section aria-labelledby="supply-heading">
            <h2 id="supply-heading" className="text-2xl font-semibold text-foreground">
              What We Supply
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We stock a wide range of iron and steel — MS angles, flats, bright bars, TMT bars, and structural sections — plus pipes and tubes, wire and mesh (GI wire, binding wire, barbed wire, chain link, welded mesh, jalies), and hardware and tools including welding rods, fasteners, nails, crowbars, pickaxes, perforated sheets, and pigeon nets. Our product range serves construction, fabrication, and industrial needs for both retail and wholesale customers.
            </p>
          </section>

          {site.gstin && (
            <section aria-labelledby="compliance-heading">
              <h2 id="compliance-heading" className="text-2xl font-semibold text-foreground">
                Compliance
              </h2>
              <p className="mt-4 text-muted-foreground">
                GSTIN: <span className="font-mono text-foreground">{site.gstin}</span>
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
