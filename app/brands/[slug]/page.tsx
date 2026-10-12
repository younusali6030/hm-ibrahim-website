import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { inHouseBrands, getBrandById } from "@/content/brands";
import type { BrandId } from "@/content/brands";
import { brandPageVisuals } from "@/content/brandPages";
import { getProductBySlug } from "@/content/products";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { BrandVideo } from "../BrandVideo";

type Props = { params: Promise<{ slug: string }> };

const validSlugs: BrandId[] = ["cm", "border"];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandById(slug as BrandId);
  const visuals = brandPageVisuals[slug as BrandId];
  if (!brand?.pageContent || !validSlugs.includes(brand.id)) return { title: "Brand" };
  const description = `${brand.pageContent.subtitle} ${brand.name} barbed wire and chain link fencing (jali), made and sold by ${site.name}, Siyaganj, Indore since 1939.`;
  return buildPageMeta({
    title: `${brand.name} Barbed Wire & Chain Link Fencing in Indore`,
    description,
    path: `brands/${brand.id}`,
    ...(visuals ? { image: { url: visuals.hero.src, alt: visuals.hero.alt } } : {}),
  });
}

const RANGE = [
  { slug: "barbed-wire", label: "Barbed wire", blurb: "Single and double strand coils for farms, boundaries and security." },
  { slug: "chain-link-fencing", label: "Chain link fencing (jali)", blurb: "Rolls in a range of mesh sizes and heights for compounds, grounds and industry." },
] as const;

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  if (!validSlugs.includes(slug as BrandId)) notFound();
  const brand = getBrandById(slug as BrandId);
  const visuals = brandPageVisuals[slug as BrandId];
  if (!brand?.pageContent || !visuals) notFound();

  const { title, subtitle, body, prominentTagline } = brand.pageContent;
  const other = inHouseBrands.find((b) => b.id !== brand.id && b.id !== "tata");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    url: `${baseUrl}/brands/${slug}`,
    logo: `${baseUrl}${visuals.logoClear}`,
    description: subtitle,
    brand: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <SeoJsonLd data={schema} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-nav text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(ellipse 60% 80% at 85% 40%, ${visuals.accent}33, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="page-container relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
              <Link href="/" className="hover:text-white">Home</Link> / <Link href="/brands" className="hover:text-white">Brands</Link> / <span className="text-white">{brand.name}</span>
            </nav>
            <div className="mt-8 flex items-center gap-4">
              <span className="relative block h-16 w-28 shrink-0">
                <Image src={visuals.logoClear} alt={`${brand.name} logo`} fill className="object-contain object-left" priority sizes="112px" />
              </span>
              <span className="h-10 w-px bg-white/25" aria-hidden="true" />
              <span className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/70">Our own brand</span>
            </div>
            <h1 className="mt-6 text-white" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>{title}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">{subtitle}</p>
            {prominentTagline && (
              <p className="mt-6 inline-block border-l-4 py-1 pl-4 text-lg font-semibold italic text-white" style={{ borderColor: visuals.accent }}>
                {prominentTagline}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?brand=${brand.id}`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground transition hover:brightness-110"
              >
                Get a {brand.name} quote
              </Link>
              <a
                href="#range"
                className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10"
              >
                See the range
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/15">
            <Image src={visuals.hero.src} alt={visuals.hero.alt} fill priority sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-b border-border bg-card" aria-label={`${brand.name} at a glance`}>
        <ul className="page-container grid grid-cols-3 gap-px bg-border bg-clip-content">
          {visuals.facts.map((f) => (
            <li key={f.small} className="bg-card px-3 py-6 sm:px-6 sm:py-8">
              <p className="font-display text-3xl font-extrabold uppercase leading-none text-foreground sm:text-5xl">{f.big}</p>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{f.small}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Range */}
      <section id="range" className="py-14 md:py-20" aria-labelledby="range-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">The range</p>
          <h2 id="range-heading" className="mt-2 text-foreground">What {brand.name} makes</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {RANGE.map((r) => {
              const product = getProductBySlug(r.slug);
              const variant = product?.brandVariants?.find((v) => v.brandId === brand.id);
              if (!product || !variant) return null;
              return (
                <article key={r.slug} className="flex flex-col overflow-hidden rounded-sm border border-border bg-card">
                  <div className="relative aspect-[16/10] bg-secondary">
                    <Image
                      src={variant.images[0]}
                      alt={`${brand.name} ${r.label}`}
                      fill
                      sizes="(max-width:1024px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-3xl font-extrabold uppercase leading-none text-foreground">{r.label}</h3>
                    <p className="mt-2 text-muted-foreground">{r.blurb}</p>
                    {variant.specs && (
                      <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
                        {variant.specs.map((s) => (
                          <div key={s.label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-muted-foreground">{s.label}</dt>
                            <dd className="text-right font-medium text-foreground">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {variant.useCases && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Used for: </span>
                        {variant.useCases.join(", ")}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/contact?product=${product.slug}&category=${product.categorySlug}&brand=${brand.id}`}
                        className="inline-flex min-h-[48px] items-center rounded-sm bg-primary px-5 font-bold text-primary-foreground hover:brightness-110"
                      >
                        Quote this
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex min-h-[48px] items-center rounded-sm border border-input px-5 font-semibold text-foreground hover:border-foreground/50"
                      >
                        Full details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story + video */}
      <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="story-heading">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">The name</p>
            <h2 id="story-heading" className="mt-2 text-foreground">Why buyers ask for {brand.name}</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
              {body.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Sold from our shop at {site.address.line1}, {site.address.line2}, {site.address.city}. Retail and wholesale.
            </p>
          </div>
          <BrandVideo />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-14 md:py-20" aria-labelledby="gallery-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">In stock</p>
          <h2 id="gallery-heading" className="mt-2 text-foreground">{brand.name} on our shelves</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {visuals.gallery.map((g, i) => (
              <li key={g.src} className={"relative overflow-hidden rounded-sm bg-secondary " + (i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square")}>
                <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"} className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section className="bg-nav py-14 text-white md:py-20">
        <div className="page-container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-white">Need {brand.name} for your site?</h2>
            <p className="mt-3 max-w-xl text-white/80">Send your list. We confirm stock and rates, and pack it for pickup or delivery.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={`/contact?brand=${brand.id}`} className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110">
              Get a quote
            </Link>
            {other && (
              <Link href={`/brands/${other.id}`} className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10">
                See {other.name}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
