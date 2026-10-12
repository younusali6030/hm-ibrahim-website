import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
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
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import "@/components/story/story.css";

// The root layout template appends " | HM Ibrahim & Co", so the title here carries no business name.
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang as Lang;
  return buildPageMeta({
    lang,
    title: "CM, Border & Tata Wiron Brands in Indore",
    description:
      "CM and Border are our own barbed wire and chain link brands. We also stock Tata Wiron and wire and mesh from other makers at our Siyaganj shop, Indore.",
    path: "brands",
    image: {
      url: "/brands/cm-chainlink.jpg",
      alt:
        lang === "hi"
          ? "सियागंज, इंदौर में एचएम इब्राहिम एंड कंपनी की दुकान पर रखे सीएम ब्रांड चेन लिंक फेंसिंग के रोल"
          : "CM brand chain link fencing rolls stacked at the HM Ibrahim & Co shop in Siyaganj, Indore",
    },
  });
}


const waLink = (message: string) => getWhatsAppLink(site.whatsapp, message);

/** One row per spec label, one column per brand, straight from the catalog's brand variants. */
const COMPARE_LABELS = [
  { label: "Chain link mesh opening", name: "Mesh opening", hi: "जाली का खाना" },
  { label: "Wire size", name: "Wire size", hi: "तार का साइज़" },
  { label: "Heights", name: "Roll heights", hi: "रोल की ऊँचाई" },
  { label: "Finish", name: "Finish", hi: "फिनिश" },
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

export default function BrandsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const tata = localize(getBrandById("tata"), lang);
  const own = (["cm", "border"] as const)
    .map((id) => ({ brand: localize(getBrandById(id), lang), v: localize(brandPageVisuals[id], lang) }))
    .filter((x) => x.brand && x.v);
  const cols: { id: BrandId; name: string }[] = [
    { id: "cm", name: t("CM", "सीएम") },
    { id: "border", name: t("Border", "बॉर्डर") },
    { id: "tata", name: t("Tata Wiron", "टाटा वायरॉन") },
  ];
  const stocked = localize(stockedBrands, lang);
  const catsL = localize(categories, lang);
  const wiron = localize(wironProducts, lang);

  return (
    <>
      <PageHero
        eyebrow={<T en="Brands · Siyaganj, Indore · Since 1939" hi="ब्रांड · सियागंज, इंदौर · 1939 से" />}
        title={<T en="Wire & fencing brands in Indore" hi="इंदौर में तार और जाली के ब्रांड" />}
        lede={t("CM and Border are our own barbed wire and chain link fencing brands. Alongside them we stock Tata Wiron and wire and mesh from other makers.", "सीएम और बॉर्डर हमारे अपने कांटेदार तार और चेन लिंक फेंसिंग ब्रांड हैं। इनके साथ हम टाटा वायरॉन और दूसरे निर्माताओं के तार व जाली भी रखते हैं।")}
        compact
        film
      >
        <a href="#own-brands" className={btnMain}><T en="Explore our brands" hi="हमारे ब्रांड देखें" /></a>
        <Link href="/contact?category=fencing-material" className={btnGhostDark}>
          <T en="Check price and availability" hi="रेट और स्टॉक पूछें" />
        </Link>
      </PageHero>

      {/* Own brands */}
      <section id="own-brands" className="st-sec scroll-mt-24" aria-labelledby="own-heading">
        <div className="page-container">
          <SectionHead
            eyebrow={t("Our own brands", "हमारे अपने ब्रांड")}
            id="own-heading"
            title={t("Two names we put on the roll", "दो नाम जो हम रोल पर लगाते हैं")}
            lede={t("Barbed wire and chain link fencing (jali), sold from our shop in Siyaganj.", "कांटेदार तार और चेन लिंक फेंसिंग (जाली), हमारी सियागंज की दुकान से।")}
          />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {own.map(({ brand, v }, index) => {
              if (!brand || !v) return null;
              const uses = localize(getProductBySlug("chain-link-fencing"), lang)?.brandVariants?.find((x) => x.brandId === brand.id)?.useCases;
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
                        <Image src={v.logoClear} alt={hi ? `${brand.name} लोगो` : `${brand.name} logo`} fill sizes="80px" className="object-contain object-left" />
                      </span>
                      <StencilTag>{brand.name} · {t("Own brand", "अपना ब्रांड")}</StencilTag>
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
                        <span className="font-semibold text-foreground">{t("Used for: ", "उपयोग: ")}</span>
                        {uses.join(", ")}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                      <Link href={`/brands/${brand.id}`} className="st-link">
                        {hi ? `${brand.name} की कहानी` : `The ${brand.name} story`} <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link href={`/contact?brand=${brand.id}&category=fencing-material`} className="st-link">
                        {hi ? `${brand.name} के बारे में पूछें` : `Enquire about ${brand.name}`}
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
            eyebrow={t("Side by side", "आमने-सामने")}
            id="compare-heading"
            title={t("Chain link, three names", "चेन लिंक, तीन नाम")}
            lede={t("CM and Border are listed to the same mesh and wire range. What changes is the name on the wrapper and the story behind it. Tata Wiron is the authorised Tata line.", "सीएम और बॉर्डर एक ही जाली और तार की रेंज में हैं। फ़र्क रैपर पर लगे नाम और उसके पीछे की कहानी का है। टाटा वायरॉन अधिकृत टाटा लाइन है।")}
          />
          <GaugeRule label={t("Chain link (jali)", "चेन लिंक (जाली)")} className="mt-10" />
          <div
            className="mt-4 overflow-x-auto rounded-[10px] border border-border"
            role="region"
            aria-label={t("Chain link specs by brand, scrolls sideways on small screens", "ब्रांड के अनुसार चेन लिंक स्पेक, छोटी स्क्रीन पर बगल में खिसकती है")}
            tabIndex={0}
          >
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="bg-secondary font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">{t("Spec", "स्पेक")}</th>
                  {cols.map((c) => (
                    <th key={c.id} scope="col" className="px-4 py-3 font-medium">{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_LABELS.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 font-medium text-muted-foreground">{hi ? r.hi : r.name}</th>
                    {cols.map((c) => (
                      <td key={c.id} className="px-4 py-3 text-foreground">
                        {((v) => (v ? localize(v, lang) : undefined))(compareCell(c.id, r.label)) ?? <span className="text-muted-foreground">{t("Ask us", "हमसे पूछें")}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 text-muted-foreground">
            {t("Not sure which one suits your fence?", "पक्का नहीं कि आपकी फेंस के लिए कौन-सा ठीक रहेगा?")}
            <a
              href={waLink(t("Hi, I need help choosing between CM and Border brand barbed wire / chain link. My use, size and quantity: ", "नमस्ते, मुझे सीएम और बॉर्डर ब्रांड के कांटेदार तार / चेन लिंक में से चुनने में मदद चाहिए। मेरा उपयोग, साइज़ और मात्रा: "))}
              target="_blank"
              rel="noopener noreferrer"
              className="st-link"
            >
              {t("Ask us on WhatsApp", "व्हाट्सएप पर पूछें")}<span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
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
                <Image src={tata.logo} alt={t("Tata Wiron logo", "टाटा वायरॉन लोगो")} fill sizes="160px" className="object-contain object-left" />
              </span>
              <h2 id="tata-heading" className="mt-6 text-foreground">{t("Tata Wiron", "टाटा वायरॉन")}</h2>
              <p className="mt-2 text-lg text-foreground">{tata.pageContent?.subtitle}</p>
              <p className="st-body mt-4">{tata.pageContent?.body}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/brands/tata" className={btnMain}>{t("Tata Wiron range and details", "टाटा वायरॉन रेंज और जानकारी")}</Link>
                <Link href="/contact?brand=tata&category=wires" className={btnGhost}>{t("Check availability", "उपलब्धता पूछें")}</Link>
              </div>
            </div>
            <div>
              <p className="st-eyebrow">{t("Tata Wiron lines in our catalog", "हमारे कैटलॉग में टाटा वायरॉन की लाइनें")}</p>
              <ul className="st-ledger mt-4">
                {wiron.map((p) => (
                  <li key={p.slug} className="border-b border-border">
                    <Link href={`/products/${p.slug}`} className="flex min-h-[52px] items-center justify-between gap-4 py-2 font-semibold text-foreground hover:text-primary">
                      {p.name}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="st-meta">{t("Confirm current availability with us before you order.", "ऑर्डर से पहले मौजूदा उपलब्धता हमसे पक्की कर लीजिए।")}</p>
            </div>
          </div>
        </section>
      )}

      {/* Other stocked brands */}
      <section id="also-stocked" className="st-sec st-sec-tint scroll-mt-24" aria-labelledby="stock-heading">
        <div className="page-container">
          <SectionHead
            eyebrow={t("Also on our shelves", "हमारी शेल्फ पर और भी")}
            id="stock-heading"
            title={t("Other brands we deal in", "दूसरे ब्रांड जिनका हम काम करते हैं")}
            lede={t("Stock changes, so check price and availability with us for the brand you need.", "स्टॉक बदलता रहता है, इसलिए जिस ब्रांड की ज़रूरत है उसका भाव और उपलब्धता हमसे पूछ लीजिए।")}
          />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,1fr) minmax(0,1.2fr) 14rem" }}>
            {stocked.map((b, bi) => {
              const firstTag = b.categoryTags?.find((tag) => categories.some((c) => c.slug === tag));
              const tagName = catsL.find((c) => c.slug === firstTag)?.name;
              return (
                <li key={b.name} className="st-row !py-5 items-center">
                  <h3 className="st-title" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)" }}>{b.name}</h3>
                  <div>
                    <p className="st-body">{b.specialty}</p>
                    {b.location && <p className="st-meta">{b.location}</p>}
                    {firstTag && tagName && (
                      <Link href={`/categories/${firstTag}`} className="st-link text-sm">
                        {tagName}
                      </Link>
                    )}
                  </div>
                  <Link
                    href={`/contact?brand=${encodeURIComponent(stockedBrands[bi].name)}${firstTag ? `&category=${firstTag}` : ""}`}
                    className="st-link md:justify-self-end"
                  >
                    {t("Check availability", "उपलब्धता पूछें")} <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactStrip
        heading={t("Not sure which brand fits?", "पक्का नहीं कि कौन-सा ब्रांड ठीक रहेगा?")}
        headingId="enquire-heading"
        quoteHref="/contact?category=fencing-material"
        waMessage={t("Hi, I'm not sure which brand to choose. Product, size and quantity I need: ", "नमस्ते, मुझे पक्का नहीं कि कौन-सा ब्रांड लूँ। मुझे जो उत्पाद, साइज़ और मात्रा चाहिए: ")}
      />
    </>
  );
}
