import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { indorePageSlugs, getIndorePage, type IndorePage } from "@/content/indorePages";
import { getProductBySlug, getProductImages, getCategoryBySlug } from "@/content/products";
import { baseUrl, site, localSeo } from "@/lib/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { GaugeRule } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Iron & Hardware in Indore, ${localSeo.state}`,
  description: `Iron, steel, wire mesh, barbed wire, chain link and construction hardware in Indore. ${site.name}, Siyaganj. Retail and wholesale.`,
  url: `${baseUrl}/indore`,
};

export const metadata: Metadata = buildPageMeta({
  title: `Iron and Hardware in Indore, ${localSeo.state}`,
  description: `Iron, steel, wire mesh, barbed wire, chain link and hardware in Indore from ${site.name}, Siyaganj. Retail and wholesale, delivery to Dewas, Ujjain, Mhow and Pithampur.`,
  path: "indore",
});

function imageFor(page: IndorePage) {
  const p = page.productSlugs.map((s) => getProductBySlug(s)).find(Boolean);
  if (!p) return null;
  return getProductImages(p, getCategoryBySlug(p.categorySlug))[0] ?? null;
}

const MARKETS = ["Siyaganj", "Loha Mandi", "New Siyaganj"];

export default function IndoreIndexPage() {
  const pages = indorePageSlugs.map((s) => getIndorePage(s)).filter((p): p is IndorePage => p != null);
  const towns = site.areasServed.filter((a) => !/^(indore|nearby areas)$/i.test(a));

  return (
    <>
      <SeoJsonLd data={schema} />
      <PageHero
        eyebrow={<T en={`Indore, ${localSeo.state}`} hi={`इंदौर, ${localSeo.state}`} />}
        title={<T en="Iron and hardware, bought where Indore has bought it since 1939" hi="लोहा और हार्डवेयर, वहीं से जहाँ से इंदौर 1939 से ले रहा है" />}
        lede={`${site.name} sits on Siyaganj Main Road, one of Indore's oldest iron and hardware markets. Walk in, call, or send a list. We supply retail and wholesale, and deliver across Indore and nearby towns.`}
        image={{ src: "/about/storefront-hero.jpg", alt: "The H M Ibrahim & Co shopfront on Siyaganj Main Road, Indore" }}
        compact
        sheen
      >
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <a href="#range" className={btnGhostDark}><T en="What we supply" hi="क्या मिलता है" /></a>
      </PageHero>

      <section className="st-sec scroll-mt-24" id="range" aria-labelledby="range-heading">
        <div className="page-container">
          <SectionHead
            eyebrow="What Indore buys from us"
            id="range-heading"
            title="Six things people come to Siyaganj for"
          />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "9rem minmax(0,1fr) minmax(0,1.3fr)" }}>
            {pages.map((page) => {
              const img = imageFor(page);
              return (
                <li key={page.slug} className="st-row items-center">
                  <span className="relative hidden aspect-[4/3] overflow-hidden rounded-[14px] bg-secondary md:block">
                    {img && <Image src={img} alt="" fill sizes="144px" className="object-cover" />}
                  </span>
                  <h3 className="st-title">
                    <Link href={`/indore/${page.slug}`} className="hover:text-primary">{page.h1}</Link>
                  </h3>
                  <div>
                    <p className="st-body line-clamp-3">{page.intro}</p>
                    <Link href={`/indore/${page.slug}`} className="st-link">
                      Read more<span className="sr-only"> about {page.h1}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="st-sec st-sec-tint" aria-labelledby="areas-heading">
        <div className="page-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead
              eyebrow="Where we deliver"
              id="areas-heading"
              title="The iron markets, and the towns around them"
              lede="Ask about delivery when you order. Dispatch depends on stock, quantity and location."
            />
          </div>
          <div>
            <GaugeRule label="Indore" />
            <dl className="st-spec mt-4 !border-t-0">
              <div>
                <dt>Markets</dt>
                <dd>{MARKETS.join(", ")}</dd>
              </div>
              <div>
                <dt>Nearby towns</dt>
                <dd>{towns.slice(0, 4).join(", ")}</dd>
              </div>
              <div>
                <dt>Other states</dt>
                <dd>{towns.slice(4).filter((a) => !/^madhya/i.test(a)).join(", ") || "On enquiry"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="page-container st-sec">
        <ReviewsList max={3} title="What Indore buyers say" />
      </div>

      <ContactStrip heading="Come to the counter" waMessage="Hi, I'm in Indore and would like a rate. Product, size and quantity: " />
    </>
  );
}
