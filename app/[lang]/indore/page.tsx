import type { Metadata } from "next";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { indorePagesHi, indoreFaqsHi, indorePhotosHi, placesHi } from "@/content/hi/indore";
import { localize } from "@/lib/localize";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { indorePageSlugs, getIndorePage, type IndorePage } from "@/content/indorePages";
import { getProductBySlug, getProductImages, getCategoryBySlug } from "@/content/products";
import { indoreFaqs, indorePhotos, supplied } from "@/content/indoreStory";
import { baseUrl, localSeo } from "@/lib/site";
import { breadcrumbList, faqPage } from "@/lib/schema";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { btnMain, btnGhostDark } from "@/components/site/PageHero";
import { IndoreHero } from "@/components/indore/IndoreHero";
import { RegionBackdrop, distanceKm } from "@/components/indore/RegionBackdrop";
import { regionPlaces } from "@/content/indoreRegion";
import { site } from "@/content/site";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { CounterStamp, GaugeRule, JaliWeave } from "@/components/motif/Motif";
import { LazySteelSheen } from "@/components/fx/Lazy";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ContactStrip } from "@/components/story/ContactStrip";
import { IndoreReels } from "@/components/indore/IndoreReels";
import { VisitUs } from "@/components/visit/VisitUs";
import { CountUp, PhotoRing, PlaceMarquee, Reveal, ScrollProgress, Tilt } from "@/components/indore/Motion";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";
import "@/components/indore/indore.css";

const { rajwadaNight, rajwadaDay, daly, chhatri, choral } = indorePhotos;

const TITLE = "Iron & Hardware in Indore | Loha Mandi, Siyaganj, Est. 1939";
const DESCRIPTION =
  "Iron, wire mesh and hardware from Siyaganj's Loha Mandi, Indore, since 1939. We have supplied Daly College, Pithampur factories and farmers across MP.";

/** Real places named on the page, also declared to search engines. */
const PLACES_MENTIONED = [
  "Siyaganj", "Loha Mandi", "Rajwada", "Sarafa Bazaar", "Chhappan Dukan", "Lal Bagh Palace", "Krishnapura Chhatris",
  "Khajrana", "Palasia", "Vijay Nagar", "Bhawarkuan", "Rau", "Mhow", "Sanwer Road", "Pithampur", "Daly College",
];

const TITLE_HI = "इंदौर में लोहा और हार्डवेयर | लोहा मंडी, सियागंज, 1939 से";
const DESCRIPTION_HI =
  "सियागंज की लोहा मंडी, इंदौर से 1939 से लोहा, वायर मेश और हार्डवेयर। हमने डैली कॉलेज, पीथमपुर की फैक्ट्रियों और पूरे मध्य प्रदेश के किसानों को सप्लाई किया है।";

const pageSchema = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: lang === "hi" ? TITLE_HI : TITLE,
  description: lang === "hi" ? DESCRIPTION_HI : DESCRIPTION,
  url: pageUrl("indore", lang),
  inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
  about: { "@type": "City", name: "Indore", containedInPlace: { "@type": "State", name: localSeo.state } },
  mentions: PLACES_MENTIONED.map((name) => ({ "@type": "Place", name: `${name}, Indore` })),
  primaryImageOfPage: { "@type": "ImageObject", url: `${baseUrl}${rajwadaNight.src}`, width: rajwadaNight.width, height: rajwadaNight.height },
});

/** Each photo with its author and licence, so search engines and readers see the credit. */
const imageSchemas = (lang: Lang) => Object.entries(indorePhotos).map(([key, p]) => ({
  "@context": "https://schema.org",
  "@type": "ImageObject",
  contentUrl: `${baseUrl}${p.src}`,
  name: lang === "hi" ? indorePhotosHi[key].subject : p.subject,
  description: lang === "hi" ? indorePhotosHi[key].alt : p.alt,
  width: p.width,
  height: p.height,
  creditText: `${p.author} / Wikimedia Commons`,
  creator: { "@type": "Person", name: p.author },
  license: p.licenseUrl,
  acquireLicensePage: p.sourceUrl,
}));

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang as Lang;
  return buildPageMeta({
    lang,
    title: TITLE,
    description: DESCRIPTION,
    path: "indore",
    image: {
      url: "/indore/og-indore.jpg",
      alt:
        lang === "hi"
          ? "रात में राजवाड़ा, इंदौर: सियागंज में 1939 से एचएम इब्राहिम एंड कंपनी, लोहा और हार्डवेयर"
          : "Rajwada, Indore, at night: HM Ibrahim & Co, iron and hardware in Siyaganj since 1939",
    },
  });
}

function imageFor(page: IndorePage) {
  const p = page.productSlugs.map((s) => getProductBySlug(s)).find(Boolean);
  if (!p) return null;
  return getProductImages(p, getCategoryBySlug(p.categorySlug))[0] ?? null;
}

/** The shop on Google Maps: the same destination the footer and the visit block use. */
const SHOP_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;

const PLACES = [
  "Siyaganj", "Loha Mandi", "Rajwada", "Sarafa Bazaar", "Chhappan Dukan", "Lal Bagh", "Khajrana",
  "Palasia", "Vijay Nagar", "Rau", "Mhow", "Pithampur", "Dewas", "Ujjain",
];

export default async function IndoreIndexPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const pages = indorePageSlugs.map((s) => getIndorePage(s)).filter((p): p is IndorePage => p != null);
  const faqSource = hi ? indoreFaqsHi : indoreFaqs;
  const faqs = faqSource.map((f, i) => ({ ...f, id: `indore-${i + 1}` }));
  const reach = regionPlaces
    .map((p) => ({ id: p.id, name: hi ? p.nameHi : p.name, km: distanceKm(p.lat, p.lon) }))
    .sort((a, b) => a.km - b.km);
  const reachMax = Math.max(...reach.map((r) => r.km));
  const pageH1 = (page: IndorePage) => (hi ? indorePagesHi[page.slug].h1 : page.h1);

  return (
    <>
      <ScrollProgress />
      <SeoJsonLd
        lang={lang}
        data={[
          pageSchema(lang),
          breadcrumbList([
            { name: t("Home", "होम"), url: "/" },
            { name: t("Indore", "इंदौर"), url: "/indore" },
          ]),
          faqPage(faqSource) ?? {},
          ...imageSchemas(lang),
        ]}
      />

      {/* Hero: the shop at the centre of its region */}
      <IndoreHero
        eyebrow={<T en={`Indore, ${localSeo.state}`} hi="इंदौर, मध्य प्रदेश" />}
        title={<T en="We have sold iron to Indore since 1939. We watched it grow." hi="हम 1939 से इंदौर को लोहा बेच रहे हैं। हमने इसे बढ़ते देखा है।" />}
        lede={t(
          "One counter in Siyaganj, Indore's iron and hardware market. The same promise since the day it opened: the right material, a fair rate, and a straight answer.",
          "सियागंज, इंदौर के लोहा-हार्डवेयर बाज़ार में एक काउंटर। जिस दिन खुला, उसी दिन से एक ही वादा: सही माल, सही रेट, सीधा जवाब।"
        )}
        actions={
          <>
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <a href={SHOP_MAPS_URL} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
          <T en="Visit our Siyaganj shop" hi="हमारी सियागंज दुकान पर आइए" />
          <span className="sr-only"> <T en="(opens Google Maps in a new tab)" hi="(गूगल मैप्स नए टैब में खुलेगा)" /></span>
        </a>
          </>
        }
        stats={
          <dl className="mt-7 grid max-w-xl grid-cols-3 border-t border-white/20">
            {[
              { v: "1939", k: "Counter opened", kHi: "काउंटर खुला" },
              { v: <CountUp to={600} suffix="+" duration={1.4} />, k: "Google reviews", kHi: "गूगल रिव्यू" },
              { v: hi ? "10 से 8" : "10AM–8PM", k: "Monday to Saturday", kHi: "सोमवार से शनिवार" },
            ].map((s) => (
              <div key={s.k} className="py-3 pr-3">
                <dd className="font-display text-2xl font-extrabold leading-none text-white sm:text-3xl md:text-[2.1rem]">{s.v}</dd>
                <dt className="mt-1 font-mono-brand text-[10px] uppercase tracking-[0.12em] text-white/60 sm:text-[11px]">
                  <T en={s.k} hi={s.kHi} />
                </dt>
              </div>
            ))}
          </dl>
        }
        city={{ src: rajwadaNight.src, alt: hi ? indorePhotosHi.rajwadaNight.alt : rajwadaNight.alt, label: t("Rajwada, Indore", "राजवाड़ा, इंदौर"), position: "50% 58%" }}
        second={{ src: chhatri.src, alt: hi ? indorePhotosHi.chhatri.alt : chhatri.alt, label: t("Krishnapura Chhatris", "कृष्णपुरा छत्रियाँ") }}
        counter={{
          src: "/about/storefront-hero.jpg",
          alt: t(
            "The HM Ibrahim & Co counter at 60 Siyaganj Main Road, Indore, with wire mesh and chain link out front",
            "60 सियागंज मेन रोड, इंदौर पर एच एम इब्राहिम एंड कंपनी का काउंटर, आगे वायर मेश और चेन लिंक"
          ),
          label: t("Our counter, Siyaganj", "हमारा काउंटर, सियागंज"),
          position: "50% 30%",
        }}
        places={regionPlaces.map((p) => ({ id: p.id, name: hi ? p.nameHi : p.name }))}
        backdrop={
          <RegionBackdrop
            names={Object.fromEntries(regionPlaces.map((p) => [p.id, hi ? p.nameHi : p.name]))}
          />
        }
      />

      {/* Practical visit information first (address, hours, directions), before the city-name banner. */}
      <section className="page-container py-6 md:py-8" aria-label={t("Visit the counter", "काउंटर पर आइए")}>
        <VisitUs variant="full" compact source="indore_visit" />
      </section>

      {/* Where the work is: the places run past as a banner. The list is real text, read once by assistive tech. */}
      <nav className="border-y border-border" aria-label={t("Places we serve", "जिन जगहों पर हम सेवा देते हैं")}>
        <PlaceMarquee items={hi ? placesHi : PLACES} />
      </nav>

      {/* Our story in Indore */}
      <section className="ind-sec" aria-labelledby="story-heading">
        <div className="page-container grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="st-eyebrow"><T en="Our story in Indore" hi="इंदौर में हमारी कहानी" /></p>
            <h2 id="story-heading" className="mt-3 text-foreground">
              <T
                en="The commercial capital of Madhya Pradesh, and the counter that has supplied it since 1939"
                hi="मध्य प्रदेश की व्यावसायिक राजधानी, और वह काउंटर जो 1939 से इसे सप्लाई कर रहा है"
              />
            </h2>
            {/* City imagery: Rajwada is a landmark of Indore, shown for the city, not as a place we supplied. */}
            <figure className="mt-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-black ring-1 ring-white/15">
                <div className="ind-kb absolute inset-0">
                  <Image src={rajwadaNight.src} alt={hi ? indorePhotosHi.rajwadaNight.alt : rajwadaNight.alt} fill sizes="(max-width:1024px) 100vw, 34vw" className="object-cover" />
                  <Image src={rajwadaDay.src} alt="" aria-hidden="true" fill sizes="(max-width:1024px) 100vw, 34vw" className="ind-xfade object-cover" style={{ objectPosition: "50% 60%" }} />
                </div>
              </div>
              <figcaption className="mt-2 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {t("Rajwada, Indore: the city we supply", "राजवाड़ा, इंदौर: वह शहर जिसे हम सप्लाई करते हैं")}
              </figcaption>
            </figure>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <Reveal>
              <p>
                <T
                  en="Indore is the largest city in Madhya Pradesh and its commercial capital. It grew from a Holkar trading town around Rajwada and the old bazaars into a city that trades, manufactures and builds: the factories of Pithampur and the Sanwer Road industrial area on one side, Sarafa Bazaar and Chhappan Dukan on the other, and new buildings going up along AB Road, Vijay Nagar, Bhawarkuan and the Super Corridor."
                  hi="इंदौर मध्य प्रदेश का सबसे बड़ा शहर और उसकी व्यावसायिक राजधानी है। होल्कर काल के एक व्यापारिक कस्बे से, राजवाड़ा और पुराने बाज़ारों के आसपास बढ़ते हुए यह ऐसा शहर बना जो व्यापार करता है, बनाता है और निर्माण करता है: एक तरफ पीथमपुर की फैक्ट्रियाँ और सांवेर रोड का औद्योगिक क्षेत्र, दूसरी तरफ सराफा बाज़ार और छप्पन दुकान, और एबी रोड, विजय नगर, भंवरकुआँ और सुपर कॉरिडोर पर उठती नई इमारतें।"
                />
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                <T
                  en="Siyaganj and Loha Mandi are where that building starts. For generations, builders and fabricators from Palasia and Vijay Nagar to Rau and Mhow have come to these lanes for iron, steel, wire, mesh and hardware. Our counter at 60 Siyaganj Main Road, opposite Tijori Gali, opened in 1939 and has been here ever since."
                  hi="इस निर्माण की शुरुआत सियागंज और लोहा मंडी से होती है। पीढ़ियों से पलासिया और विजय नगर से लेकर राऊ और महू तक के बिल्डर और फैब्रिकेटर लोहा, स्टील, तार, जाली और हार्डवेयर के लिए इन्हीं गलियों में आते रहे हैं। 60 सियागंज मेन रोड, तिजोरी गली के सामने, हमारा काउंटर 1939 में खुला और तब से यहीं है।"
                />
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-foreground">
                <T
                  en="We did not build Indore. Contractors, fabricators, schools, factories and farmers did. But every one of them needed material they could trust, at a rate that was fair, from someone who would still be there for the next order. That has been our whole job."
                  hi="इंदौर हमने नहीं बनाया। उसे ठेकेदारों, फैब्रिकेटरों, स्कूलों, फैक्ट्रियों और किसानों ने बनाया। लेकिन हर किसी को भरोसे का माल चाहिए था, सही रेट पर, और ऐसे आदमी से जो अगले ऑर्डर पर भी वहीं मिले। हमारा पूरा काम यही रहा है।"
                />
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3D photo ring */}
      <section className="ind-sec ind-tint overflow-hidden" aria-labelledby="city-heading">
        <div className="page-container">
          <div className="max-w-3xl">
            <p className="st-eyebrow"><T en="The city around the counter" hi="काउंटर के आसपास का शहर" /></p>
            <h2 id="city-heading" className="mt-3 text-foreground">
              <T en="Indore, as we have watched it grow" hi="इंदौर, जैसा हमने उसे बढ़ते देखा" />
            </h2>
          </div>
          <PhotoRing
            photos={[
              { src: daly.src, alt: hi ? indorePhotosHi.daly.alt : daly.alt, label: t("Daly College", "डैली कॉलेज") },
              { src: chhatri.src, alt: hi ? indorePhotosHi.chhatri.alt : chhatri.alt, label: t("Krishnapura Chhatris", "कृष्णपुरा छत्रियाँ") },
              { src: choral.src, alt: hi ? indorePhotosHi.choral.alt : choral.alt, label: t("Choral dam, Mhow", "चोरल डैम, महू") },
              {
                src: "/about/storefront-hero.jpg",
                alt: t(
                  "The HM Ibrahim & Co counter at 60 Siyaganj Main Road, Indore, with wire mesh and chain link out front",
                  "60 सियागंज मेन रोड, इंदौर पर एच एम इब्राहिम एंड कंपनी का काउंटर, आगे वायर मेश और चेन लिंक रखे हुए"
                ),
                label: t("Our counter, Siyaganj", "हमारा काउंटर, सियागंज"),
              },
              {
                src: "/about/warehouse-stock-1.png",
                alt: t(
                  "CM and Border barbed wire and chain link coils stacked in the HM Ibrahim & Co warehouse",
                  "एचएम इब्राहिम एंड कंपनी के गोदाम में रखे सीएम और बॉर्डर के कांटेदार तार और चेन लिंक के कॉइल"
                ),
                label: t("Our stock", "हमारा स्टॉक"),
              },
            ]}
          />
          <p className="mx-auto mt-2 max-w-3xl text-center text-[15px] leading-relaxed text-muted-foreground">
            <T
              en="Rajwada and Sarafa Bazaar in the old city, Chhappan Dukan and Palasia, Lal Bagh Palace, Khajrana, the Krishnapura Chhatris, Daly College, and out to Rau, Mhow, the Choral dam and the Pithampur industrial area. Builders and fabricators working across all of them come to Siyaganj for iron, wire and mesh."
              hi="पुराने शहर में राजवाड़ा और सराफा बाज़ार, छप्पन दुकान और पलासिया, लाल बाग पैलेस, खजराना, कृष्णपुरा छत्रियाँ, डैली कॉलेज, और आगे राऊ, महू, चोरल डैम और पीथमपुर औद्योगिक क्षेत्र तक। इन सब जगहों पर काम करने वाले बिल्डर और फैब्रिकेटर लोहा, तार और जाली के लिए सियागंज आते हैं।"
            />
          </p>
        </div>
      </section>

      {/* How far the counter is from the towns it supplies: straight-line distances from the same coordinates as the map. */}
      <section className="ind-sec" aria-labelledby="reach-heading">
        <div className="page-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="st-eyebrow"><T en="From Siyaganj to the region" hi="सियागंज से पूरे इलाके तक" /></p>
            <h2 id="reach-heading" className="mt-3 text-foreground">
              <T en="How far our Indore counter is from Dewas, Ujjain, Mhow and Pithampur" hi="हमारा इंदौर काउंटर देवास, उज्जैन, महू और पीथमपुर से कितनी दूर है" />
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              <T
                en="Straight-line distance from 60 Siyaganj Main Road to each town centre. The road is longer. Delivery arrangements are confirmed with each quotation."
                hi="60 सियागंज मेन रोड से हर शहर के केंद्र तक की सीधी दूरी। सड़क से दूरी इससे ज़्यादा होती है। डिलीवरी की व्यवस्था हर कोटेशन के साथ तय होती है।"
              />
            </p>
          </Reveal>
          <figure className="m-0 self-center">
            <ul className="border-t border-foreground/40">
              {reach.map((r) => (
                <li key={r.id} className="ind-reach-row">
                  <Link href={`/contact?location=${encodeURIComponent(r.name)}`} className="st-title block min-h-[28px] !text-[1.4rem]">{r.name}</Link>
                  <span className="ind-reach-bar" aria-hidden="true"><i style={{ ["--w" as string]: `${Math.round((r.km / reachMax) * 100)}%` }} /></span>
                  <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">
                    {r.km}<span className="ml-1 font-mono-brand text-[11px] font-normal uppercase tracking-[0.12em] text-muted-foreground">{t("km", "किमी")}</span>
                  </span>
                </li>
              ))}
            </ul>
            <figcaption className="mt-3 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("Straight-line distance from our counter. Choose a town to enquire for it.", "हमारे काउंटर से सीधी दूरी। पूछताछ के लिए कोई शहर चुनिए।")}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Who we have supplied, with the counter on camera */}
      <section className="ind-sec scroll-mt-24" id="supplied" aria-labelledby="supplied-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="st-eyebrow"><T en="Who we have supplied" hi="हमने किसे सप्लाई किया" /></p>
            <h2 id="supplied-heading" className="mt-3 text-foreground">
              <T en="From a school campus to a farmer's boundary" hi="स्कूल के कैंपस से किसान की मेड़ तक" />
            </h2>
            <ul className="mt-6 border-t border-foreground/40">
              {supplied.map((s, i) => (
                <li key={s.name} className="border-b border-border">
                  <Reveal delay={i * 0.04} y={14} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
                    <div>
                      <h3 className="st-title !text-[1.5rem]"><T en={s.name} hi={s.nameHi} /></h3>
                      <p className="st-meta"><T en={s.kind} hi={s.kindHi} /></p>
                    </div>
                    <p className="st-body self-center"><T en={s.line} hi={s.lineHi} /></p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-[3px] border-primary pl-4 text-lg leading-relaxed text-foreground">
              <T
                en="We grow when Indore grows. We aim to be the counter this city's builders, factories and farmers trust first, and to keep contributing to its growth."
                hi="इंदौर बढ़ता है तो हम बढ़ते हैं। हमारा लक्ष्य है कि इस शहर के बिल्डर, फैक्ट्रियाँ और किसान सबसे पहले हम पर भरोसा करें, और हम इसकी तरक्की में योगदान देते रहें।"
              />
            </p>
          </div>
          <div className="min-w-0">
            <p className="st-eyebrow"><T en="From the counter" hi="काउंटर से" /></p>
            <p className="st-lede mb-5 mt-3 !text-base">
              <T
                en="Real stock and real customers, filmed in Siyaganj. Tap a reel to play."
                hi="असली माल और असली ग्राहक, सियागंज में फ़िल्माए गए। चलाने के लिए रील पर टैप करें।"
              />
            </p>
            <IndoreReels />
          </div>
        </div>
      </section>

      {/* What Indore buys, and where it goes */}
      <section className="ind-sec ind-tint scroll-mt-24" id="range" aria-labelledby="range-heading">
        <div className="page-container">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="st-eyebrow"><T en="What Indore buys from us" hi="इंदौर हमसे क्या लेता है" /></p>
              <h2 id="range-heading" className="mt-3 text-foreground">
                <T en="Six things people come to Siyaganj for" hi="छह चीज़ें जिनके लिए लोग सियागंज आते हैं" />
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              <T
                en="Across Indore, from Palasia, Vijay Nagar, Bhawarkuan and Rau to the Super Corridor and Sanwer Road, and to Mhow, Pithampur, Dewas and Ujjain. Orders accepted across India; delivery arrangements confirmed with each quotation."
                hi="पूरे इंदौर में, पलासिया, विजय नगर, भंवरकुआँ और राऊ से लेकर सुपर कॉरिडोर और सांवेर रोड तक, और महू, पीथमपुर, देवास और उज्जैन तक। पूरे भारत से ऑर्डर स्वीकार किए जाते हैं; डिलीवरी की व्यवस्था हर कोटेशन के साथ तय की जाती है।"
              />
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {pages.map((page, i) => {
              const img = imageFor(page);
              return (
                <li key={page.slug}>
                  <Reveal delay={(i % 3) * 0.06} y={18}>
                    <Link
                      href={`/indore/${page.slug}`}
                      className="ind-tile group block overflow-hidden rounded-[10px] border border-border bg-background"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden bg-secondary sm:aspect-[16/10]">
                        {img && (
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="(max-width:1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </span>
                      <span className="flex items-center justify-between gap-2 p-3 sm:p-4">
                        <span className="st-title !text-[1.05rem] sm:!text-[1.35rem]">{pageH1(page)}</span>
                        <span aria-hidden="true" className="text-xl text-primary transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Questions and proof, side by side */}
      <section className="ind-sec" aria-labelledby="faq-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="st-eyebrow"><T en="Questions" hi="सवाल" /></p>
            <h2 id="faq-heading" className="mt-3 text-foreground">
              <T en="What people ask us about buying iron in Indore" hi="इंदौर में लोहा खरीदने के बारे में लोग क्या पूछते हैं" />
            </h2>
            <div className="[&>div]:!mt-6 [&>div]:!max-w-none">
              <FAQAccordion faqs={faqs} inline />
            </div>
          </div>
          <div>
            <ReviewsList lang={lang} max={2} title={t("What Indore buyers say", "इंदौर के खरीदार क्या कहते हैं")} />
          </div>
        </div>
      </section>

      <ContactStrip
        heading={t("Need iron, wire or mesh in Indore?", "इंदौर में लोहा, तार या जाली चाहिए?")}
        headingId="indore-close-heading"
        waMessage={t("Hi, I'm in Indore and would like a rate. Product, size and quantity: ", "नमस्ते, मैं इंदौर में हूँ और रेट जानना चाहता हूँ। उत्पाद, साइज़ और मात्रा: ")}
      />
    </>
  );
}
