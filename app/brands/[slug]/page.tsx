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
import { PageHero, btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { GaugeRule, StencilTag } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

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
      <PageHero
        eyebrow={
          <>
            <Link href="/brands" className="hover:text-white">Brands</Link> / {brand.name} / Our own brand
          </>
        }
        title={title}
        lede={subtitle}
        image={{ src: visuals.hero.src, alt: visuals.hero.alt }}
      >
        <Link href={`/contact?brand=${brand.id}`} className={btnMain}>
          <T en={`Get a ${brand.name} quote`} hi={`${brand.name} का कोटेशन पाएँ`} />
        </Link>
        <a href="#range" className={btnGhostDark}><T en="See the range" hi="रेंज देखें" /></a>
      </PageHero>

      {/* Brand tag and voice line */}
      <section className="border-b border-border" aria-label={`${brand.name} at a glance`}>
        <div className="page-container grid items-center gap-8 py-10 md:grid-cols-[auto_1fr] md:gap-14 md:py-14">
          <div className="flex items-center gap-5">
            <span className="relative block h-16 w-28 shrink-0">
              <Image src={visuals.logoClear} alt={`${brand.name} logo`} fill className="object-contain object-left" sizes="112px" />
            </span>
            <StencilTag>{brand.name} · Own brand</StencilTag>
          </div>
          {prominentTagline ? (
            <p className="border-l-2 border-primary pl-5 font-display text-3xl font-extrabold uppercase leading-[1.05] text-foreground md:text-5xl">
              {prominentTagline}
            </p>
          ) : (
            <p className="max-w-2xl text-lg text-muted-foreground">Barbed wire and chain link fencing (jali), sold from our shop at Siyaganj, Indore.</p>
          )}
        </div>
        <div className="page-container pb-10">
          <GaugeRule label="Catalog range" />
          <dl className="st-spec mt-6 !border-t-0 sm:grid sm:grid-cols-3 sm:gap-x-8">
            {visuals.facts.map((f) => (
              <div key={f.small} className="!block">
                <dt className="text-sm">{f.small}</dt>
                <dd className="!text-left font-display text-3xl font-extrabold uppercase leading-none">{f.big}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Range */}
      <section id="range" className="st-sec scroll-mt-24" aria-labelledby="range-heading">
        <div className="page-container">
          <SectionHead eyebrow="The range" id="range-heading" title={`What ${brand.name} makes`} />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {RANGE.map((r) => {
              const product = getProductBySlug(r.slug);
              const variant = product?.brandVariants?.find((v) => v.brandId === brand.id);
              if (!product || !variant) return null;
              return (
                <li key={r.slug} className="st-row">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
                    <Image src={variant.images[0]} alt={`${brand.name} ${r.label}`} fill sizes="(max-width:768px) 100vw, 40vw" className="object-contain p-4" />
                  </div>
                  <div>
                    <h3 className="st-title">{r.label}</h3>
                    <p className="st-body mt-2">{r.blurb}</p>
                    {variant.specs && (
                      <dl className="st-spec mt-5 text-sm">
                        {variant.specs.map((s) => (
                          <div key={s.label}>
                            <dt>{s.label}</dt>
                            <dd>{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {variant.useCases && (
                      <p className="st-body mt-4 text-sm">
                        <span className="font-semibold text-foreground">Used for: </span>
                        {variant.useCases.join(", ")}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={`/contact?product=${product.slug}&category=${product.categorySlug}&brand=${brand.id}`} className={btnMain}>
                        Quote this
                      </Link>
                      <Link href={`/products/${product.slug}`} className={btnGhost}>
                        Full details
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Story + video */}
      <section className="st-sec st-sec-tint" aria-labelledby="story-heading">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="The name" id="story-heading" title={`Why buyers ask for ${brand.name}`} />
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
      <section className="st-sec" aria-labelledby="gallery-heading">
        <div className="page-container">
          <SectionHead eyebrow="In stock" id="gallery-heading" title={`${brand.name} on our shelves`} />
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {visuals.gallery.map((g, i) => (
              <li key={g.src} className={"relative overflow-hidden rounded-[14px] bg-secondary " + (i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square")}>
                <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"} className="object-cover" />
              </li>
            ))}
          </ul>
          {other && (
            <p className="mt-8">
              <Link href={`/brands/${other.id}`} className="st-link">See {other.name}, our other own brand</Link>
              <span className="mx-3 text-muted-foreground" aria-hidden="true">/</span>
              <Link href="/brands#tata-wiron" className="st-link">Tata Wiron</Link>
            </p>
          )}
        </div>
      </section>

      <ContactStrip
        heading={`Need ${brand.name} for your site?`}
        headingId="close-heading"
        quoteHref={`/contact?brand=${brand.id}`}
        waMessage={`Hi, I need ${brand.name} brand wire. Product, size and quantity: `}
      />
    </>
  );
}
