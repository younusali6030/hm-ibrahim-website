import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site";
import { buildPageMeta } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/utils";
import { stockedBrands } from "@/content/stockedBrands";
import { brandPageVisuals } from "@/content/brandPages";
import { categories, getProductBySlug } from "@/content/products";
import { getBrandById, type BrandId } from "@/content/brands";

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

const btnPrimary =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-primary px-6 text-base font-bold text-primary-foreground transition hover:brightness-110";
const btnOutline =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/40 px-6 text-base font-semibold text-white transition hover:bg-white/10";
const btnOutlineLight =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input px-5 text-base font-semibold text-foreground transition hover:border-foreground/60";

/** Spec values come straight from the product catalog's brand variants; nothing is added here. */
function catalogFacts(brandId: BrandId) {
  const pick = (slug: string, label: string) =>
    getProductBySlug(slug)?.brandVariants?.find((v) => v.brandId === brandId)?.specs?.find((s) => s.label === label)?.value;
  const facts = [
    { label: "Chain link mesh opening", value: pick("chain-link-fencing", "Chainlink mesh opening") },
    { label: "Chain link roll heights", value: pick("chain-link-fencing", "Heights") },
    { label: "Barbed wire", value: pick("barbed-wire", "Type") },
    { label: "Barbed wire coils", value: pick("barbed-wire", "Coils") },
  ];
  return facts.filter((f): f is { label: string; value: string } => !!f.value);
}

const waLink = (message: string) => getWhatsAppLink(site.whatsapp, message);

const wironProducts = Array.from(
  new Map(
    categories
      .flatMap((c) => c.products)
      .filter((p) => p.brandVariants?.some((v) => v.brandId === "tata"))
      .map((p) => [p.slug, p] as const)
  ).values()
);

const SECTIONS = [
  { href: "#own-brands", label: "Our brands" },
  { href: "#tata-wiron", label: "Tata Wiron" },
  { href: "#also-stocked", label: "Also stocked" },
  { href: "#enquire", label: "Enquire" },
];

export default function BrandsPage() {
  const tata = getBrandById("tata");
  const own = (["cm", "border"] as const)
    .map((id) => ({ brand: getBrandById(id), v: brandPageVisuals[id] }))
    .filter((x) => x.brand && x.v);

  return (
    <>
      {/* Opening */}
      <section className="bg-nav text-white">
        <div className="page-container py-6 md:py-8">
          <h1 className="text-white" style={{ fontSize: "clamp(2.25rem, 5.4vw, 4.25rem)" }}>
            Wire &amp; fencing brands in Indore
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            CM and Border are our own barbed wire and chain link fencing brands. Alongside them we stock Tata Wiron and wire
            and mesh from other makers.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a href="#own-brands" className={btnPrimary}>
              Explore our brands
            </a>
            <Link href="/contact?category=fencing-material" className={btnOutline}>
              Check price &amp; availability
            </Link>
          </div>
          <p className="mt-4 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/65">
            Since 1939 &middot; Siyaganj, Indore
          </p>
        </div>
        <nav aria-label="On this page" className="border-t border-white/10 bg-black/20">
          <ul className="page-container flex gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => (
              <li key={s.href} className="shrink-0">
                <a
                  href={s.href}
                  className="inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* CM and Border */}
      <section id="own-brands" className="py-6 md:py-8" aria-labelledby="own-heading">
        <div className="page-container">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="own-heading" className="text-foreground" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Our own brands</h2>
            <p className="text-sm text-muted-foreground">Barbed wire and chain link fencing (jali)</p>
          </div>
          <ul className="mt-4 grid gap-5 md:grid-cols-2 md:gap-6">
            {own.map(({ brand, v }, index) => {
              if (!brand || !v) return null;
              const facts = catalogFacts(brand.id);
              const uses = getProductBySlug("chain-link-fencing")?.brandVariants?.find((x) => x.brandId === brand.id)?.useCases;
              return (
                <li key={brand.id} className="flex">
                  <article className="flex w-full flex-col overflow-hidden rounded-sm border border-border bg-card">
                    <div className="relative aspect-[16/6] bg-secondary">
                      <Image
                        src={v.hero.src}
                        alt={v.hero.alt}
                        fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        priority={index === 0}
                        className="object-cover object-center"
                      />
                      <span className="absolute left-3 top-3 block h-12 w-20 rounded-sm bg-[#0b121a]/85 p-1.5">
                        <span className="relative block h-full w-full">
                          <Image src={v.logoClear} alt={`${brand.name} logo`} fill sizes="80px" className="object-contain" />
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="font-display text-5xl font-extrabold uppercase leading-none text-foreground">{brand.name}</h3>
                      <p className="mt-2 text-base text-muted-foreground">
                        {brand.name} barbed wire and chain link fencing (jali). {brand.pageContent?.subtitle}
                      </p>
                      {facts.length > 0 && (
                        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
                          {facts.map((f) => (
                            <div key={f.label} className="bg-background/60 p-3">
                              <dt className="text-xs text-muted-foreground">{f.label}</dt>
                              <dd className="mt-0.5 text-sm font-semibold text-foreground">{f.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {uses && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Used for: </span>
                          {uses.join(", ")}
                        </p>
                      )}
                      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                        <Link href={`/contact?brand=${brand.id}&category=fencing-material`} className={btnPrimary + " sm:flex-1"}>
                          Enquire about {brand.name}
                        </Link>
                        <Link href={`/brands/${brand.id}`} className={btnOutlineLight + " sm:flex-1"}>
                          Explore {brand.name}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted-foreground">
            Not sure which one suits your fence?
            <a
              href={waLink("Hi, I need help choosing between CM and Border brand barbed wire / chain link. My use, size and quantity: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline underline-offset-4 hover:text-primary"
            >
              Ask us on WhatsApp
            </a>
          </p>
        </div>
      </section>

      {/* Tata Wiron */}
      {tata && (
        <section id="tata-wiron" className="border-y border-border bg-card py-8 md:py-12" aria-labelledby="tata-heading">
          <div className="page-container grid items-center gap-6 md:grid-cols-[auto_1fr_auto] md:gap-8">
            <span className="relative block h-14 w-36 md:h-16 md:w-44">
              <Image src={tata.logo} alt="Tata Wiron logo" fill sizes="176px" className="object-contain object-left" />
            </span>
            <div>
              <h2 id="tata-heading" className="text-foreground">Tata Wiron</h2>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                Tata Wiron lines listed in our catalog: {wironProducts.map((p) => p.name).join(", ")}. Confirm current
                availability with us before you order.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href="/products?tata=wiron" className={btnPrimary}>
                Browse Tata Wiron products
              </Link>
              <Link href="/contact?brand=tata&category=wires" className={btnOutlineLight}>
                Check availability
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Other stocked brands */}
      <section id="also-stocked" className="py-8 md:py-14" aria-labelledby="stock-heading">
        <div className="page-container">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Also on our shelves</p>
          <h2 id="stock-heading" className="mt-1 text-foreground">Other brands we deal in</h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Stock changes, so check price and availability with us for the brand you need.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stockedBrands.map((b) => {
              const firstTag = b.categoryTags?.find((t) => categories.some((c) => c.slug === t));
              const tagName = categories.find((c) => c.slug === firstTag)?.name;
              return (
                <li key={b.name} className="flex">
                  <article className="flex w-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-primary/60">
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-foreground">{b.name}</h3>
                      <p className="mt-2 text-base leading-snug text-muted-foreground">{b.specialty}</p>
                      {b.location && <p className="mt-1 text-sm text-muted-foreground">{b.location}</p>}
                      {firstTag && tagName && (
                        <Link
                          href={`/products?category=${firstTag}`}
                          className="mt-4 inline-flex min-h-[44px] w-fit items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground hover:border-foreground/60"
                        >
                          {tagName}
                        </Link>
                      )}
                    </div>
                    <Link
                      href={`/contact?brand=${encodeURIComponent(b.name)}${firstTag ? `&category=${firstTag}` : ""}`}
                      className="flex min-h-[52px] items-center justify-between gap-2 border-t border-border bg-primary/10 px-5 font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Check availability
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing enquiry */}
      <section id="enquire" className="bg-nav py-10 text-white md:py-14" aria-labelledby="enquire-heading">
        <div className="page-container grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <h2 id="enquire-heading" className="text-white">Not sure which brand fits your requirement?</h2>
            <p className="mt-3 max-w-xl text-base text-white/85 md:text-lg">
              Tell us the product, size and quantity you need. We will check what we have and quote you for it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={waLink("Hi, I'm not sure which brand to choose. Product, size and quantity I need: ")}
              target="_blank"
              rel="noopener noreferrer"
              className={btnPrimary}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              WhatsApp us
            </a>
            <Link href="/contact" className={btnOutline}>
              Request a quote
            </Link>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={btnOutline + " whitespace-nowrap"}>
              <Phone className="h-5 w-5" aria-hidden />
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
