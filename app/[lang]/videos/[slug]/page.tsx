import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { reels, getReel, reelText, clock, isoDuration } from "@/content/reels";
import { getProductBySlug, getCategoryBySlug } from "@/content/products";
import { getBrandById } from "@/content/brands";
import { site } from "@/content/site";
import { siteHi } from "@/content/hi/site";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { videoObject } from "@/lib/schema";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WatchPlayer } from "@/components/video/WatchPlayer";
import { btnMain, btnGhostDark, btnGhost } from "@/components/site/PageHero";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { indoreSlugsForProducts } from "@/content/indorePages";
import { IndoreBuyLinks } from "@/components/indore/IndoreBuyLinks";
import "@/components/story/story.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return reels.map((r) => ({ slug: r.id }));
}

export const dynamicParams = false;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang: l, slug } = await props.params;
  const lang = l as Lang;
  const reel = getReel(slug);
  if (!reel) return { title: "Video" };
  const en = reel.en;
  const hi = reel.hi;
  return buildPageMeta({
    lang,
    path: `videos/${reel.id}`,
    title: en.seoTitle,
    description: `${en.summary} Watch the ${clock(reel.duration)} clip, then ask for a rate on WhatsApp or call.`,
    hi: { title: hi.seoTitle, description: `${hi.summary} ${clock(reel.duration)} का वीडियो देखिए, फिर व्हाट्सऐप या कॉल पर रेट पूछिए।` },
    image: { url: `/reels/${reel.id}.jpg`, alt: lang === "hi" ? hi.title : en.title },
  });
}

export default async function WatchPage(props: Props) {
  const { lang: l, slug } = await props.params;
  const lang = l as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const reel = getReel(slug);
  if (!reel) notFound();
  const text = reelText(reel, lang);

  const products = (reel.products ?? []).map((s) => localize(getProductBySlug(s), lang)).filter((p) => p !== null);
  const categories = (reel.categories ?? []).map((s) => localize(getCategoryBySlug(s), lang)).filter((c) => c !== null);
  const brands = (reel.brands ?? []).map((b) => localize(getBrandById(b), lang)).filter((b) => b !== undefined && b !== null);
  const first = products[0];
  const quoteHref = first ? `/contact?product=${first.slug}&category=${first.categorySlug}` : categories[0] ? `/contact?category=${categories[0].slug}` : "/contact";
  // Indore landing pages for what the clip shows: its products first, then its categories' products (TASK-032).
  const indoreSlugs = indoreSlugsForProducts(
    [...(reel.products ?? []), ...categories.flatMap((c) => c.products.map((p) => p.slug))],
    2,
  );
  const more = reels.filter((r) => r.id !== reel.id);
  const addr = hi ? siteHi.address : site.address;
  const hours = hi ? siteHi.hours : site.hours;

  const crumbs = [
    { name: t("Home", "होम"), url: "/" },
    { name: t("Videos", "वीडियो"), url: "/videos" },
    { name: text.short, url: `/videos/${reel.id}` },
  ];

  return (
    <>
      <SeoJsonLd
        data={videoObject({
          name: text.title,
          description: text.summary,
          thumbnail: `/reels/${reel.id}.jpg`,
          contentUrl: `/reels/${reel.id}.mp4`,
          uploadDate: reel.uploadDate,
          duration: isoDuration(reel.duration),
        })}
        lang={lang}
      />
      <JsonLdBreadcrumb items={crumbs.map((c) => ({ name: c.name, url: pageUrl(c.url, lang) }))} lang={lang} />

      {/* The video is the page: first thing in the main column, above the fold on phones and desktop. */}
      <section className="bg-nav text-white">
        <div className="page-container py-6 md:py-12">
          <Breadcrumbs items={crumbs} lang={lang} className="mb-4 text-white/70 [&_[aria-current]]:text-white" />
          {/* Phones: title, video, details. md and up: video on the left spanning both rows, text on the right. */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-12 md:gap-y-0 lg:gap-x-16">
            <div className="md:col-start-2 md:row-start-1">
              <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                {t("Video", "वीडियो")} · {clock(reel.duration)} · {reel.customer ? t("Customer on camera", "ग्राहक कैमरे पर") : t("Filmed at our shop", "हमारी दुकान पर फ़िल्माया")}
              </p>
              <h1 className="mt-3 text-white" style={{ fontSize: "clamp(1.9rem, 4.6vw, 3.8rem)" }}>
                {text.title}
              </h1>
            </div>
            <div className="mx-auto w-full max-w-[300px] md:col-start-1 md:row-span-2 md:row-start-1 md:mx-0 md:max-w-[360px]">
              <WatchPlayer id={reel.id} title={text.title} />
            </div>
            <div className="md:col-start-2 md:row-start-2">
              <p className="max-w-2xl text-lg leading-relaxed text-white/80 md:mt-5">{text.summary}</p>
              <dl className="mt-6 grid max-w-xl gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/60">{t("Filmed at", "जगह")}</dt>
                  <dd className="text-white">{`${addr.line1}, ${addr.city}`}</dd>
                </div>
                <div>
                  <dt className="text-white/60">{t("Shop hours", "दुकान का समय")}</dt>
                  <dd className="text-white">{hours.weekdays}</dd>
                </div>
                <div>
                  <dt className="text-white/60">{t("Length", "अवधि")}</dt>
                  <dd className="text-white">{clock(reel.duration)}</dd>
                </div>
                <div>
                  <dt className="text-white/60">{t("Sound", "आवाज़")}</dt>
                  <dd className="text-white">{t("On. Tap play to hear it.", "चालू। सुनने के लिए प्ले दबाइए।")}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={quoteHref} className={btnMain}>
                  {first ? (hi ? `${first.name} का कोटेशन पाएँ` : `Get a ${first.name} quote`) : t("Get a quote", "कोटेशन पाएँ")}
                </Link>
                <Link href="/videos" className={btnGhostDark}>
                  {t("All videos", "सभी वीडियो")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is in the clip: the catalogue entries it shows, straight from content/products.ts. */}
      {(products.length > 0 || categories.length > 0 || brands.length > 0) && (
        <section className="st-sec" aria-labelledby="in-video-heading">
          <div className="page-container">
            <SectionHead eyebrow={t("In this video", "इस वीडियो में")} id="in-video-heading" title={t("What you are looking at", "आप क्या देख रहे हैं")} />
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {products.map((p) => (
                <li key={p.slug} className="rounded-[14px] border border-border bg-card p-6">
                  <h3 className="st-title">{p.name}</h3>
                  <p className="st-body mt-2">{p.shortDesc}</p>
                  {p.specs && p.specs.length > 0 && (
                    <dl className="st-spec mt-5 text-sm">
                      {p.specs.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {p.useCases && p.useCases.length > 0 && (
                    <p className="st-body mt-4 text-sm">
                      <span className="font-semibold text-foreground">{t("Used for: ", "उपयोग: ")}</span>
                      {p.useCases.join(", ")}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/products/${p.slug}`} className={btnGhost}>
                      {t("Full details", "पूरी जानकारी")}
                    </Link>
                  </div>
                </li>
              ))}
              {categories.map((c) => (
                <li key={c.slug} className="rounded-[14px] border border-border bg-card p-6">
                  <h3 className="st-title">{c.name}</h3>
                  <p className="st-body mt-2">{c.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-5">
                    {c.products.slice(0, 8).map((p) => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}`} className="st-link inline-flex min-h-[44px] items-center">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Link href={`/categories/${c.slug}`} className={btnGhost}>
                      {hi ? `सभी ${c.name}` : `All ${c.name.toLowerCase()}`}
                    </Link>
                  </div>
                </li>
              ))}
              {brands.map((b) => (
                <li key={b.id} className="rounded-[14px] border border-border bg-card p-6">
                  <h3 className="st-title">{b.name}</h3>
                  <p className="st-body mt-2">
                    {b.id === "tata"
                      ? t("We are an authorised Tata Wiron dealer at Siyaganj, Indore.", "हम सियागंज, इंदौर में अधिकृत टाटा वायरॉन डीलर हैं।")
                      : hi
                        ? `${b.name} हमारा अपना ब्रांड है, जो हमारी सियागंज की दुकान से बिकता है।`
                        : `${b.name} is our own brand, sold from our Siyaganj shop.`}
                  </p>
                  <div className="mt-5">
                    <Link href={`/brands/${b.id}`} className={btnGhost}>
                      {hi ? `${b.name} ब्रांड पेज` : `${b.name} brand page`}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {indoreSlugs.length > 0 && (
        <div className="page-container pb-12 md:pb-16">
          <IndoreBuyLinks slugs={indoreSlugs} lang={lang} />
        </div>
      )}

      <section className="st-sec st-sec-tint" aria-labelledby="more-heading">
        <div className="page-container">
          <SectionHead eyebrow={t("From the shop floor", "दुकान के फ़र्श से")} id="more-heading" title={t("More videos", "और वीडियो")} />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {more.map((r) => {
              const rt = reelText(r, lang);
              return (
                <li key={r.id}>
                  <Link href={`/videos/${r.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="relative block aspect-[9/16] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
                      <Image src={`/reels/${r.id}.jpg`} alt="" fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw" className="object-cover transition-transform group-hover:scale-[1.03]" />
                      <span className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono-brand text-xs text-white">{clock(r.duration)}</span>
                    </span>
                    <span className="mt-2 block font-semibold leading-snug text-foreground group-hover:text-primary">{rt.short}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactStrip
        heading={first ? (hi ? `${first.name} चाहिए?` : `Need ${first.name.toLowerCase()}?`) : t("Come to the counter", "काउंटर पर आइए")}
        headingId="close-heading"
        quoteHref={quoteHref}
        waMessage={hi ? `नमस्ते, मैंने आपका वीडियो "${text.short}" देखा। उत्पाद, साइज़ और मात्रा: ` : `Hi, I saw your video "${text.short}". Product, size and quantity: `}
      />
    </>
  );
}
