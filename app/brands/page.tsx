import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { baseUrl, site } from "@/lib/site";
import { stockedBrands } from "@/content/stockedBrands";
import { brandPageVisuals } from "@/content/brandPages";
import { categories } from "@/content/products";
import { getBrandById } from "@/content/brands";

export const metadata: Metadata = {
  title: `Brands: CM, Border and Tata Wiron | ${site.name}, Indore`,
  description: `CM and Border are our own brands of barbed wire and chain link fencing. We are also an authorized Tata Wiron dealer and stock Bansal Wire, H D Wires, Bokadia Wires, STALCO and more in Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/brands` },
};

const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name;

export default function BrandsPage() {
  const cm = getBrandById("cm");
  const border = getBrandById("boarder");
  const tata = getBrandById("tata");
  const own = [
    { brand: cm, v: brandPageVisuals.cm },
    { brand: border, v: brandPageVisuals.boarder },
  ];

  return (
    <>
      <section className="bg-nav text-white">
        <div className="page-container py-12 md:py-20">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">Brands</p>
          <h1 className="mt-3 text-white" style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
            Two of our own. The big names beside them.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            CM and Border are our own barbed wire and chain link brands. Next to them we are an authorized Tata Wiron dealer
            and stock wire and mesh from makers across India.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20" aria-labelledby="own-heading">
        <div className="page-container">
          <h2 id="own-heading" className="text-foreground">Our own brands</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {own.map(({ brand, v }) =>
              brand && v ? (
                <li key={brand.id}>
                  <Link
                    href={`/brands/${brand.id}`}
                    className="group block overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-xl"
                  >
                    <span className="relative block aspect-[16/10] bg-secondary">
                      <Image src={v.hero.src} alt={v.hero.alt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 block h-14 w-24 rounded-sm bg-[#0b121a]/85 p-2">
                        <span className="relative block h-full w-full">
                          <Image src={v.logoClear} alt="" fill sizes="96px" className="object-contain" />
                        </span>
                      </span>
                    </span>
                    <span className="block p-6">
                      <span className="block font-display text-4xl font-extrabold uppercase leading-none text-foreground">
                        {brand.name}
                      </span>
                      <span className="mt-2 block text-muted-foreground">{brand.pageContent?.subtitle}</span>
                      <span className="mt-4 inline-block font-semibold text-foreground underline underline-offset-4 group-hover:text-primary">
                        Barbed wire and chain link range
                      </span>
                    </span>
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </section>

      {tata && (
        <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="tata-heading">
          <div className="page-container grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <span className="relative block h-16 w-40">
              <Image src={tata.logo} alt="Tata Wiron" fill sizes="160px" className="object-contain object-left" />
            </span>
            <div>
              <h2 id="tata-heading" className="text-foreground">Authorized Tata Wiron dealer</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{tata.pageContent?.body}</p>
            </div>
            <Link
              href="/products?tata=1"
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input px-6 font-semibold text-foreground hover:border-foreground/50"
            >
              See Tata products
            </Link>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20" aria-labelledby="stock-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Also on our shelves</p>
          <h2 id="stock-heading" className="mt-2 text-foreground">Brands we stock</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Call or WhatsApp to check what is in stock today. We stock these makers alongside our own brands.
          </p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {stockedBrands.map((b) => (
              <li key={b.name} className="bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">{b.name}</h3>
                  {b.isAuthorized && (
                    <span className="shrink-0 rounded-sm bg-primary px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-primary-foreground">
                      Authorized
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{b.specialty}</p>
                {b.note && <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>}
                {b.categoryTags && (
                  <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {b.categoryTags.map((t) => {
                      const n = categoryName(t);
                      return n ? (
                        <Link key={t} href={`/products?category=${t}`} className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">
                          {n}
                        </Link>
                      ) : null;
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/contact" className="inline-flex min-h-[52px] items-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110">
              Ask for a brand and a rate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
