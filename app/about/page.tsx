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
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-7xl min-w-0">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">About HM Ibrahim & Co</h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{site.tagline}</p>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground">{site.manufacturerTagline}</p>

      <div className="mt-10 sm:mt-12 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] lg:grid-cols-[minmax(0,340px)_1fr] md:gap-10">
        <section className="md:pt-1" aria-label="Our store">
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg md:mx-0 md:max-w-none flex justify-center">
            <Image
              src="/logo-transparent.png"
              alt="HM Ibrahim & Co"
              width={280}
              height={96}
              className="h-24 w-auto object-contain"
            />
          </div>
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:mx-0 md:max-w-none mt-6">
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
            <h2 id="story-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
              Our Story
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Founded in 1939, H.Mohammed.Husain.HM.Ibrahim&Co (CM) has been a trusted name in wiremesh, steel sections, and industrial hardware in Indore.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Located in the heart of Siyaganj, we have proudly served generations of contractors, builders, fabricators, and businesses with consistent quality, fair pricing, and reliable supply. Today, the business is being managed by the third generation, continuing the legacy with the same commitment to quality and customer satisfaction.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We specialize in a wide range of products including wiremesh, weldmesh, perforated sheets (MS & SS), steel sections, GI & MS wires, fencing materials, and industrial hardware. Our fencing solutions include barbed wire, chainlink fence, and zatka (jhatka) wire, catering to both construction and agricultural needs.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              In addition to industrial materials, we also deal in durable agricultural and manual tools such as hoe, pickaxe, and crowbar, ensuring strong and dependable equipment for field and construction use.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              With decades of experience in the industry, we possess in-depth product knowledge and practical understanding of customer requirements. We guide our customers in selecting the most suitable and cost-effective products based on their specific application, ensuring durability, safety, and long-term value.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              For over eight decades, we have continued to support modern construction and agricultural requirements while maintaining the traditional business values of trust, integrity, and long-term relationships.
            </p>
          </section>

          <section className="mt-10 pt-10 border-t border-border" aria-labelledby="leadership-heading">
            <h2 id="leadership-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
              Our Leadership & Legacy
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              HM Ibrahim & Co. was founded by Late H.M. Ibrahim, whose vision laid the foundation of trust, quality, and long-term relationships in the steel and hardware trade.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              The firm was later managed by Late Abedeali Bhai Dewaswala (CM) (1924–2025). Under his leadership, the company strengthened its reputation across Indore and surrounding regions, building deep customer relationships and operational discipline.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              The command was then entrusted to Akbar Ali, who built a highly skilled and trustworthy sales and production team, strengthening internal systems and expanding the firm&apos;s reach.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Today, the firm is scaling under the supervision of Shoeb Ali, who brings modern strategy, structured operations, and forward-thinking execution to this hereditary business — ensuring the HM Ibrahim & Co. name reaches every household while preserving its legacy of trust.
            </p>
          </section>

          <section aria-labelledby="values-heading">
            <h2 id="values-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
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
            <h2 id="supply-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
              What We Supply
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
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
