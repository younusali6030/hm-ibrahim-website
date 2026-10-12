import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { buildPageMeta } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/utils";
import { stockedBrands } from "@/content/stockedBrands";
import { brandPageVisuals } from "@/content/brandPages";
import { categories, getProductBySlug } from "@/content/products";
import { getBrandById, type BrandId } from "@/content/brands";
import { PageHero, btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { GaugeRule, StencilTag } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

// The root layout template appends " | HM Ibrahim & Co", so the title here carries no business name.
export const metadata: Metadata = buildPageMeta({
  title: "CM, Border & Tata Wiron Brands in Indore",
  description:
    "CM and Border are our own barbed wire and chain link brands. We also stock Tata Wiron and wire and mesh from other makers at our Siyaganj shop, Indore.",
  path: "brands",
  image: {
    url: "/brands/cm-chainlink.jpg",
    alt: "CM brand chain link fencing rolls stacked at the HM Ibrahim & Co shop in Siyaganj, Indore",
  },
});


const waLink = (message: string) => getWhatsAppLink(site.whatsapp, message);

/** One row per spec label, one column per brand, straight from the catalog's brand variants. */
const COMPARE_LABELS = [
  { label: "Chainlink mesh opening", name: "Mesh opening" },
  { label: "Wire size", name: "Wire size" },
  { label: "Heights", name: "Roll heights" },
  { label: "Finish", name: "Finish" },
] as const;

function compareCell(brandId: BrandId, label: string) {
  return getProductBySlug("chain-link-fencing")
    ?.brandVariants?.find((v) => v.brandId === brandId)
    ?.specs?.find((s) => s.label === label)?.value;
}

const wironProducts = Array.from(
  new Map(
    categories
      .flatMap((c) => c.products)
      .filter((p) => p.brandVariants?.some((v) => v.brandId === "tata"))
      .map((p) => [p.slug, p] as const)
  ).values()
);

export default function BrandsPage() {
  const tata = getBrandById("tata");
  const own = (["cm", "border"] as const)
    .map((id) => ({ brand: getBrandById(id), v: brandPageVisuals[id] }))
    .filter((x) => x.brand && x.v);
  const cols: { id: BrandId; name: string }[] = [
    { id: "cm", name: "CM" },
    { id: "border", name: "Border" },
    { id: "tata", name: "Tata Wiron" },
  ];

  return (
    <>
      <PageHero
        eyebrow={<T en="Brands · Siyaganj, Indore · Since 1939" hi="ब्रांड · सियागंज, इंदौर · 1939 से" />}
        title={<T en="Wire & fencing brands in Indore" hi="इंदौर में तार और जाली के ब्रांड" />}
        lede="CM and Border are our own barbed wire and chain link fencing brands. Alongside them we stock Tata Wiron and wire and mesh from other makers."
        compact
        film
      >
        <a href="#own-brands" className={btnMain}><T en="Explore our brands" hi="हमारे ब्रांड देखें" /></a>
        <Link href="/contact?category=fencing-material" className={btnGhostDark}>
          <T en="Check price & availability" hi="रेट और स्टॉक पूछें" />
        </Link>
      </PageHero>

      {/* Own brands */}
      <section id="own-brands" className="st-sec scroll-mt-24" aria-labelledby="own-heading">
        <div className="page-container">
          <SectionHead
            eyebrow="Our own brands"
            id="own-heading"
            title="Two names we put on the roll"
            lede="Barbed wire and chain link fencing (jali), sold from our shop in Siyaganj."
          />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {own.map(({ brand, v }, index) => {
              if (!brand || !v) return null;
              const uses = getProductBySlug("chain-link-fencing")?.brandVariants?.find((x) => x.brandId === brand.id)?.useCases;
              return (
                <li key={brand.id} className="st-row">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
                    <Image
                      src={v.hero.src}
                      alt={v.hero.alt}
                      fill
                      sizes="(max-width:768px) 100vw, 40vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <span className="relative block h-12 w-20 shrink-0">
                        <Image src={v.logoClear} alt={`${brand.name} logo`} fill sizes="80px" className="object-contain object-left" />
                      </span>
                      <StencilTag>{brand.name} · Own brand</StencilTag>
                    </div>
                    <h3 className="st-title mt-4" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>
                      {brand.pageContent?.title ?? brand.name}
                    </h3>
                    <p className="mt-2 text-lg text-foreground">{brand.pageContent?.subtitle}</p>
                    {brand.pageContent?.prominentTagline && (
                      <p className="mt-3 border-l-2 border-primary pl-4 text-lg font-semibold italic text-foreground">
                        {brand.pageContent.prominentTagline}
                      </p>
                    )}
                    {uses && (
                      <p className="st-body mt-4">
                        <span className="font-semibold text-foreground">Used for: </span>
                        {uses.join(", ")}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                      <Link href={`/brands/${brand.id}`} className="st-link">
                        The {brand.name} story <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link href={`/contact?brand=${brand.id}&category=fencing-material`} className="st-link">
                        Enquire about {brand.name}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Compare */}
      <section className="st-sec st-sec-tint" aria-labelledby="compare-heading">
        <div className="page-container">
          <SectionHead
            eyebrow="Side by side"
            id="compare-heading"
            title="Chain link, three names"
            lede="CM and Border are listed to the same mesh and wire range. What changes is the name on the wrapper and the story behind it. Tata Wiron is the authorized Tata line."
          />
          <GaugeRule label="Chain link (jali)" className="mt-10" />
          <div
            className="mt-4 overflow-x-auto rounded-[10px] border border-border"
            role="region"
            aria-label="Chain link specs by brand, scrolls sideways on small screens"
            tabIndex={0}
          >
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="bg-secondary font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">Spec</th>
                  {cols.map((c) => (
                    <th key={c.id} scope="col" className="px-4 py-3 font-medium">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_LABELS.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">{r.name}</th>
                    {cols.map((c) => (
                      <td key={c.id} className="px-4 py-3 text-foreground">
                        {compareCell(c.id, r.label) ?? <span className="text-muted-foreground">Ask us</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 text-muted-foreground">
            Not sure which one suits your fence?
            <a
              href={waLink("Hi, I need help choosing between CM and Border brand barbed wire / chain link. My use, size and quantity: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="st-link"
            >
              Ask us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </section>

      {/* Tata Wiron */}
      {tata && (
        <section id="tata-wiron" className="st-sec scroll-mt-24" aria-labelledby="tata-heading">
          <div className="page-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="relative block h-14 w-40">
                <Image src={tata.logo} alt="Tata Wiron logo" fill sizes="160px" className="object-contain object-left" />
              </span>
              <h2 id="tata-heading" className="mt-6 text-foreground">Tata Wiron</h2>
              <p className="mt-2 text-lg text-foreground">{tata.pageContent?.subtitle}</p>
              <p className="st-body mt-4">{tata.pageContent?.body}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/products?tata=wiron" className={btnMain}>Browse Tata Wiron products</Link>
                <Link href="/contact?brand=tata&category=wires" className={btnGhost}>Check availability</Link>
              </div>
            </div>
            <div>
              <p className="st-eyebrow">Tata Wiron lines in our catalog</p>
              <ul className="st-ledger mt-4">
                {wironProducts.map((p) => (
                  <li key={p.slug} className="border-b border-border">
                    <Link href={`/products/${p.slug}`} className="flex min-h-[52px] items-center justify-between gap-4 py-2 font-semibold text-foreground hover:text-primary">
                      {p.name}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="st-meta">Confirm current availability with us before you order.</p>
            </div>
          </div>
        </section>
      )}

      {/* Other stocked brands */}
      <section id="also-stocked" className="st-sec st-sec-tint scroll-mt-24" aria-labelledby="stock-heading">
        <div className="page-container">
          <SectionHead
            eyebrow="Also on our shelves"
            id="stock-heading"
            title="Other brands we deal in"
            lede="Stock changes, so check price and availability with us for the brand you need."
          />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,1fr) minmax(0,1.2fr) 14rem" }}>
            {stockedBrands.map((b) => {
              const firstTag = b.categoryTags?.find((t) => categories.some((c) => c.slug === t));
              const tagName = categories.find((c) => c.slug === firstTag)?.name;
              return (
                <li key={b.name} className="st-row !py-5 items-center">
                  <h3 className="st-title" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)" }}>{b.name}</h3>
                  <div>
                    <p className="st-body">{b.specialty}</p>
                    {b.location && <p className="st-meta">{b.location}</p>}
                    {firstTag && tagName && (
                      <Link href={`/products?category=${firstTag}`} className="st-link text-sm">
                        {tagName}
                      </Link>
                    )}
                  </div>
                  <Link
                    href={`/contact?brand=${encodeURIComponent(b.name)}${firstTag ? `&category=${firstTag}` : ""}`}
                    className="st-link md:justify-self-end"
                  >
                    Check availability <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactStrip
        heading="Not sure which brand fits?"
        headingId="enquire-heading"
        quoteHref="/contact?category=fencing-material"
        waMessage="Hi, I'm not sure which brand to choose. Product, size and quantity I need: "
      />
    </>
  );
}
