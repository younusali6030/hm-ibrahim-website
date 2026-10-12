import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { indorePageSlugs, getIndorePage, type IndorePage } from "@/content/indorePages";
import { getProductBySlug, getProductImages, getCategoryBySlug } from "@/content/products";
import { baseUrl, site, localSeo } from "@/lib/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `Iron & Hardware in Indore, ${localSeo.state}`,
  description: `Iron, steel, wire mesh, barbed wire, chain link and construction hardware in Indore. ${site.name}, Siyaganj. Retail and wholesale.`,
  url: `${baseUrl}/indore`,
};

export const metadata: Metadata = {
  title: `Iron & Hardware in Indore, ${localSeo.state} | ${site.name}`,
  description: `Buy iron, steel, wire mesh, barbed wire, chain link and construction hardware in Indore from ${site.name}, Siyaganj. Retail and wholesale, with delivery to Dewas, Ujjain, Mhow and Pithampur.`,
  alternates: { canonical: `${baseUrl}/indore` },
  openGraph: {
    title: `Iron & Hardware in Indore | ${site.name}`,
    description: "Iron, steel, wire mesh and hardware from Siyaganj, Indore. Retail and wholesale.",
    url: `${baseUrl}/indore`,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
};

function imageFor(page: IndorePage) {
  const p = page.productSlugs.map((s) => getProductBySlug(s)).find(Boolean);
  if (!p) return null;
  return getProductImages(p, getCategoryBySlug(p.categorySlug))[0] ?? null;
}

export default function IndoreIndexPage() {
  const pages = indorePageSlugs.map((s) => getIndorePage(s)).filter((p): p is IndorePage => p != null);

  return (
    <>
      <SeoJsonLd data={schema} />
      <PageHero
        eyebrow={`Indore, ${localSeo.state}`}
        title="Iron and hardware, bought where Indore has bought it since 1939"
        lede={`${site.name} sits on Siyaganj Main Road, one of Indore's oldest iron and hardware markets. Walk in, call, or send a list. We supply retail and wholesale, and deliver across Indore and nearby towns.`}
        image={{ src: "/about/storefront-hero.jpg", alt: "The H M Ibrahim & Co shopfront on Siyaganj Main Road, Indore" }}
      >
        <Link href="/contact" className={btnMain}>Get a quote</Link>
        <a href="#range" className={btnGhostDark}>What we supply</a>
      </PageHero>

      <section className="border-b border-border bg-card" aria-label="Reach">
        <ul className="page-container grid grid-cols-2 gap-px bg-border bg-clip-content md:grid-cols-4">
          {[
            { big: "Siyaganj", small: "Opposite Tijori Gali" },
            { big: "Retail + wholesale", small: "From one coil to a truckload" },
            { big: "Delivery", small: "Indore and nearby towns" },
            { big: "Since 1939", small: "Same road, same shop" },
          ].map((f) => (
            <li key={f.big} className="bg-card px-4 py-6 md:py-8">
              <p className="font-display text-3xl font-extrabold uppercase leading-none text-foreground md:text-4xl">{f.big}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.small}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="range" className="scroll-mt-24 py-14 md:py-20" aria-labelledby="range-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">What Indore buys from us</p>
          <h2 id="range-heading" className="mt-2 max-w-3xl text-foreground">Six things people drive to Siyaganj for</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => {
              const img = imageFor(page);
              return (
                <li key={page.slug}>
                  <Link
                    href={`/indore/${page.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-xl"
                  >
                    <span className="relative block aspect-[16/10] bg-secondary">
                      {img && (
                        <Image src={img} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="font-display text-3xl font-extrabold uppercase leading-none text-foreground">{page.h1}</span>
                      <span className="mt-3 line-clamp-3 text-sm text-muted-foreground">{page.intro}</span>
                      <span className="mt-4 text-sm font-bold text-foreground underline underline-offset-4 group-hover:text-primary">
                        Read more
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="areas-heading">
        <div className="page-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Where we deliver</p>
            <h2 id="areas-heading" className="mt-2 text-foreground">Indore, and the towns around it</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ask about delivery when you order. Dispatch depends on stock, quantity and location.
            </p>
          </div>
          <ul className="flex flex-wrap content-start gap-2">
            {site.areasServed.map((a) => (
              <li key={a} className="rounded-sm border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="page-container py-14 md:py-20">
        <ReviewsList max={3} title="What Indore buyers say" />
      </div>

      <section className="bg-nav py-14 text-white md:py-20">
        <div className="page-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-white">Come to the counter</h2>
            <p className="mt-3 max-w-xl text-white/80">
              {site.address.line1}, {site.address.line2}, {site.address.city}. Call first if you want stock confirmed.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className={btnMain}>Get a quote</Link>
            <Link href="/contact#visit-heading" className={btnGhostDark}>Directions</Link>
          </div>
        </div>
      </section>
    </>
  );
}
