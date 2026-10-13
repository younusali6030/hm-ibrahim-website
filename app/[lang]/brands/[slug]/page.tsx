import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { inHouseBrands, getBrandById } from "@/content/brands";
import type { BrandId } from "@/content/brands";
import { brandPageVisuals } from "@/content/brandPages";
import { getProductBySlug } from "@/content/products";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { videoObject } from "@/lib/schema";
import { brandVideos } from "@/content/reels";
import { BrandVideo } from "../BrandVideo";
import { PageHero, btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { GaugeRule, StencilTag } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

const validSlugs: BrandId[] = ["cm", "border", "tata"];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const lang = params.lang as Lang;
  const brand = localize(getBrandById(slug as BrandId), lang);
  const visuals = localize(brandPageVisuals[slug as BrandId], lang);
  if (!brand?.pageContent || !validSlugs.includes(brand.id)) return { title: "Brand" };
  const isTata = brand.id === "tata";
  const description = isTata
    ? lang === "hi"
      ? `सियागंज, इंदौर में अधिकृत टाटा वायरॉन डीलर: जीआई तार, बाइंडिंग तार, कांटेदार तार और चेन लिंक फेंसिंग (जाली), ${siteHi.name} से। रेट पूछें।`
      : `Authorised Tata Wiron dealer at Siyaganj, Indore: GI wire, binding wire, barbed wire and chain link fencing (jali) from ${site.name}. Ask for the rate.`
    : lang === "hi"
      ? `${brand.pageContent.subtitle} ${brand.name} कांटेदार तार और चेन लिंक फेंसिंग (जाली), ${siteHi.name}, सियागंज, इंदौर द्वारा 1939 से निर्मित और विक्रीत।`
      : `${brand.pageContent.subtitle} ${brand.name} barbed wire and chain link fencing (jali), made and sold by ${site.name}, Siyaganj, Indore since 1939.`;
  return buildPageMeta({
    lang,
    title: isTata
      ? lang === "hi"
        ? "इंदौर में टाटा वायरॉन डीलर: तार, कांटेदार तार, जाली"
        : "Tata Wiron Dealer in Indore: Wire, Barbed, Chain Link"
      : `${brand.name} Barbed Wire & Chain Link Fencing in Indore`,
    description,
    path: `brands/${brand.id}`,
    ...(visuals ? { image: { url: visuals.hero.src, alt: visuals.hero.alt } } : {}),
  });
}

export default async function BrandPage(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  if (!validSlugs.includes(slug as BrandId)) notFound();
  const brand = localize(getBrandById(slug as BrandId), lang);
  const visuals = localize(brandPageVisuals[slug as BrandId], lang);
  if (!brand?.pageContent || !visuals) notFound();

  const isTata = brand.id === "tata";
  const RANGE = [
    ...(isTata
      ? [{ slug: "gi-wire", label: t("GI wire", "जीआई तार"), blurb: t("Galvanised wire in coils, 8 to 18 SWG, for binding, light fencing and general use.", "बाँधने, हल्की फेंसिंग और सामान्य उपयोग के लिए कॉइल में गैल्वनाइज़्ड तार, 8 से 18 SWG।") }]
      : []),
    { slug: "barbed-wire", label: t("Barbed wire", "कांटेदार तार"), blurb: isTata ? t("Coils for farms, boundaries and security fencing, with Tata's coating.", "खेत, बाउंड्री और सुरक्षा फेंसिंग के लिए टाटा की कोटिंग वाले कॉइल।") : t("Single and double strand coils for farms, boundaries and security.", "खेत, बाउंड्री और सुरक्षा के लिए सिंगल और डबल स्ट्रैंड कॉइल।") },
    { slug: "chain-link-fencing", label: t("Chain link fencing (jali)", "चेन लिंक फेंसिंग (जाली)"), blurb: t("Rolls in a range of mesh sizes and heights for compounds, grounds and industry.", "कंपाउंड, मैदान और उद्योग के लिए अलग-अलग खानों और ऊँचाइयों के रोल।") },
  ] as const;

  const { title, subtitle, body, prominentTagline } = brand.pageContent;
  const others = inHouseBrands.filter((b) => b.id !== brand.id).map((b) => localize(b, lang));
  const addr = hi ? siteHi.address : site.address;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    url: pageUrl(`brands/${slug}`, lang),
    logo: `${baseUrl}${visuals.logoClear}`,
    description: subtitle,
    brand: { "@type": "Organization", name: hi ? siteHi.name : site.name },
  };

  return (
    <>
      <SeoJsonLd
        data={[
          schema,
          ...brandVideos
            .filter((v) => v.page === `/brands/${brand.id}`)
            .map((v) => videoObject({ name: v.title, description: v.description, thumbnail: `${v.src}.jpg`, contentUrl: `${v.src}.mp4`, uploadDate: v.uploadDate, pageUrl: pageUrl(`brands/${brand.id}`, lang) })),
        ]}
        lang={lang}
      />
      <PageHero
        eyebrow={
          <>
            <Link href="/brands" className="hover:text-white">{t("Brands", "ब्रांड")}</Link> / {brand.name} / {isTata ? t("Authorised partner", "अधिकृत पार्टनर") : t("Our own brand", "हमारा अपना ब्रांड")}
          </>
        }
        title={title}
        lede={subtitle}
        image={{ src: visuals.hero.src, alt: visuals.hero.alt }}
      >
        <Link href={`/contact?brand=${brand.id}`} className={btnMain}>
          {hi ? `${brand.name} का कोटेशन पाएँ` : `Get a ${brand.name} quote`}
        </Link>
        <a href="#range" className={btnGhostDark}><T en="See the range" hi="रेंज देखें" /></a>
      </PageHero>

      {/* Brand tag and voice line */}
      <section className="border-b border-border" aria-label={hi ? `${brand.name} एक नज़र में` : `${brand.name} at a glance`}>
        <div className="page-container grid items-center gap-8 py-10 md:grid-cols-[auto_1fr] md:gap-14 md:py-14">
          <div className="flex items-center gap-5">
            <span className="relative block h-16 w-28 shrink-0">
              <Image src={visuals.logoClear} alt={hi ? `${brand.name} लोगो` : `${brand.name} logo`} fill className="object-contain object-left" sizes="112px" />
            </span>
            <StencilTag>{brand.name} · {isTata ? t("Authorised partner", "अधिकृत पार्टनर") : t("Own brand", "अपना ब्रांड")}</StencilTag>
          </div>
          {prominentTagline ? (
            <p className="border-l-2 border-primary pl-5 font-display text-3xl font-extrabold uppercase leading-[1.05] text-foreground md:text-5xl">
              {prominentTagline}
            </p>
          ) : (
            <p className="max-w-2xl text-lg text-muted-foreground">
              {isTata
                ? t("GI wire, barbed wire and chain link fencing (jali), sold from our shop at Siyaganj, Indore.", "जीआई तार, कांटेदार तार और चेन लिंक फेंसिंग (जाली), हमारी सियागंज, इंदौर की दुकान से।")
                : t("Barbed wire and chain link fencing (jali), sold from our shop at Siyaganj, Indore.", "कांटेदार तार और चेन लिंक फेंसिंग (जाली), हमारी सियागंज, इंदौर की दुकान से।")}
            </p>
          )}
        </div>
        <div className="page-container pb-10">
          <GaugeRule label={t("Catalog range", "कैटलॉग रेंज")} />
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
          <SectionHead eyebrow={t("The range", "रेंज")} id="range-heading" title={isTata ? t("What we stock from Tata Wiron", "टाटा वायरॉन से हम क्या रखते हैं") : hi ? `${brand.name} क्या बनाता है` : `What ${brand.name} makes`} />
          <ul className="st-ledger mt-10" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {RANGE.map((r) => {
              const product = localize(getProductBySlug(r.slug), lang);
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
                        <span className="font-semibold text-foreground">{t("Used for: ", "उपयोग: ")}</span>
                        {variant.useCases.join(", ")}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href={`/contact?product=${product.slug}&category=${product.categorySlug}&brand=${brand.id}`} className={btnMain}>
                        {t("Quote this", "इसका कोटेशन लें")}
                      </Link>
                      <Link href={`/products/${product.slug}`} className={btnGhost}>
                        {t("Full details", "पूरी जानकारी")}
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
        <div className={"page-container grid items-center gap-10 lg:gap-16 " + (isTata ? "" : "lg:grid-cols-[1.2fr_0.8fr]")}>
          <div>
            <SectionHead eyebrow={isTata ? t("The brand", "ब्रांड") : t("The name", "नाम")} id="story-heading" title={hi ? `खरीदार ${brand.name} क्यों माँगते हैं` : `Why buyers ask for ${brand.name}`} />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
              {body.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {hi
                ? `हमारी दुकान ${addr.line1}, ${addr.line2}, ${addr.city} से बिकता है। रिटेल और थोक।`
                : `Sold from our shop at ${addr.line1}, ${addr.line2}, ${addr.city}. Retail and wholesale.`}
            </p>
          </div>
          {!isTata && <BrandVideo />}
        </div>
      </section>

      {/* Gallery */}
      <section className="st-sec" aria-labelledby="gallery-heading">
        <div className="page-container">
          <SectionHead eyebrow={t("In stock", "स्टॉक में")} id="gallery-heading" title={hi ? `हमारी शेल्फ पर ${brand.name}` : `${brand.name} on our shelves`} />
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {visuals.gallery.map((g, i) => (
              <li key={g.src} className={"relative overflow-hidden rounded-[14px] bg-secondary " + (i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square")}>
                <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"} className={isTata ? "object-contain p-3" : "object-cover"} />
              </li>
            ))}
          </ul>
          {others.length > 0 && (
            <p className="mt-8 flex flex-wrap items-center gap-x-3">
              {others.map((o, i) => o && (
                <span key={o.id} className="inline-flex items-center gap-3">
                  {i > 0 && <span className="text-muted-foreground" aria-hidden="true">/</span>}
                  <Link href={`/brands/${o.id}`} className="st-link">
                    {o.id === "tata" ? t("Tata Wiron, our authorised line", "टाटा वायरॉन, हमारी अधिकृत लाइन") : hi ? `${o.name} देखें` : `See ${o.name}`}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <ContactStrip
        heading={hi ? `अपनी साइट के लिए ${brand.name} चाहिए?` : `Need ${brand.name} for your site?`}
        headingId="close-heading"
        quoteHref={`/contact?brand=${brand.id}`}
        waMessage={hi ? `नमस्ते, मुझे ${brand.name} ब्रांड का तार चाहिए। उत्पाद, साइज़ और मात्रा: ` : `Hi, I need ${brand.name} brand wire. Product, size and quantity: `}
      />
    </>
  );
}
