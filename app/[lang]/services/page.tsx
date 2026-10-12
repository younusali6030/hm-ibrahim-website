import type { Metadata } from "next";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";
import Link from "@/components/LocaleLink";
import { baseUrl, site } from "@/lib/site";
import { services } from "@/content/services";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import { PhotoPlate } from "@/components/ui/PhotoPlate";
import "@/components/story/story.css";

function servicesPageSchema(lang: Lang) {
  const hi = lang === "hi";
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: hi ? `सेवाएँ, ${siteHi.name}` : `Services, ${site.name}`,
    description: hi
      ? `${siteHi.name}, सियागंज, इंदौर से रिटेल, थोक, बल्क ऑर्डर, गोदाम और डिलीवरी।`
      : `Retail, wholesale, bulk orders, warehouse and delivery from ${site.name}, Siyaganj, Indore.`,
    url: pageUrl("services", lang),
  };
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Services: Retail, Wholesale and Bulk Orders",
    description: `Retail, wholesale, bulk orders, warehouse and delivery. How ${site.name} serves builders, contractors and customers in Indore.`,
    path: "services",
  });
}

const SERVICE_PHOTOS: Record<string, { src: string; position?: string; en: string; hi: string }> = {
  retail: { src: "/about/storefront-hero.jpg", en: "The HM Ibrahim & Co shopfront on Siyaganj Main Road, Indore", hi: "सियागंज मेन रोड, इंदौर पर एच एम इब्राहिम एंड कंपनी की दुकान" },
  wholesale: { src: "/about/warehouse-stock-1.png", en: "Shrink-wrapped CM barbed wire and chain link coils stacked for wholesale", hi: "थोक के लिए रखे श्रिंक-रैप्ड सीएम कंटीला तार और चेन लिंक के कॉइल" },
  contractor: { src: "/stock/weldmesh.jpg", position: "50% 70%", en: "Customers checking a welded mesh roll at the counter", hi: "काउंटर पर वेल्डमेश का रोल जाँचते ग्राहक" },
  warehouse: { src: "/about/warehouse-stock-2.png", en: "Warehouse stock of barbed wire and chain link coils", hi: "गोदाम में कंटीला तार और चेन लिंक का स्टॉक" },
  delivery: { src: "/reels/shop-par-bharosa.jpg", en: "Inside the Siyaganj shop, looking out to the market street", hi: "सियागंज की दुकान के अंदर से बाज़ार की गली का नज़ारा" },
  fabrication: { src: "/hero/poster-wide.jpg", en: "Staff handling wire, mesh and tools in the shop", hi: "दुकान में तार, जाली और औज़ार सँभालता स्टाफ़" },
};

export default function ServicesPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  const items = localize(services, lang);
  const STEPS = [
    { t: t("Tell us what you need", "बताइए आपको क्या चाहिए"), d: t("Send a list, call, or walk in. Sizes and quantities help us quote exactly.", "सूची भेजिए, कॉल कीजिए या सीधे आइए। साइज़ और मात्रा से हम सही भाव बता पाते हैं।") },
    { t: t("We confirm stock and rate", "हम स्टॉक और रेट पक्का करते हैं"), d: t("We check the shelf and come back with a rate and what is available today.", "हम शेल्फ देखते हैं और रेट के साथ बताते हैं कि आज क्या उपलब्ध है।") },
    { t: t("Collect it, or we dispatch", "खुद ले जाइए, या हम भेज देते हैं"), d: t("Pick up from our Siyaganj counter, or ask about delivery for your location.", "हमारे सियागंज काउंटर से उठाइए, या अपनी जगह के लिए डिलीवरी के बारे में पूछिए।") },
  ];
  return (
    <>
      <SeoJsonLd data={servicesPageSchema(lang)} lang={lang} />
      <PageHero
        eyebrow={<T en="Services · Siyaganj, Indore" hi="सेवाएँ · सियागंज, इंदौर" />}
        title={<T en="One counter for a single coil or a whole site" hi="एक काउंटर: एक कॉइल से पूरी साइट तक" />}
        lede={t("We serve retail customers, wholesalers, contractors and industrial buyers with supply and support to match the order.", "हम रिटेल ग्राहकों, थोक व्यापारियों, ठेकेदारों और औद्योगिक खरीदारों को ऑर्डर के हिसाब से सप्लाई और सहयोग देते हैं।")}
      >
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <Link href="/products" className={btnGhostDark}><T en="Browse the range" hi="पूरी रेंज देखें" /></Link>
      </PageHero>

      <section className="st-sec" aria-labelledby="services-heading">
        <div className="page-container">
          <SectionHead eyebrow={t("What we do", "हम क्या करते हैं")} id="services-heading" title={t("Six ways we serve", "सेवा के छह तरीके")} />
          <ol className="mt-12 space-y-14 lg:space-y-20">
            {items.map((s, i) => {
              const ph = SERVICE_PHOTOS[s.slug];
              return (
                <li key={s.slug} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
                  {ph && (
                    <div className={`group relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10 lg:col-span-6 [perspective:900px] ${i % 2 ? "lg:order-2" : ""}`}>
                      <PhotoPlate src={ph.src} alt={lang === "hi" ? ph.hi : ph.en} position={ph.position} sizes="(max-width:1024px) 100vw, 560px" />
                      <span className="absolute left-3 top-3 font-mono-brand text-xs tracking-[0.18em] text-white/90 drop-shadow" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  )}
                  <div className={`${ph ? "lg:col-span-6" : "lg:col-span-12"} ${i % 2 ? "lg:order-1" : ""}`}>
                    <h3 className="font-display text-[2rem] font-extrabold uppercase leading-[1.02] text-foreground sm:text-[2.4rem]">{s.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{s.description}</p>
                    {(s.slug === "delivery" || s.slug === "fabrication") && (
                      <p className="st-meta mt-3">{t("Subject to availability. Please enquire at the time of order.", "उपलब्धता के अनुसार। कृपया ऑर्डर के समय पूछ लें।")}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="st-sec st-sec-tint" aria-labelledby="how-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead eyebrow={t("How an order works", "ऑर्डर कैसे चलता है")} id="how-heading" title={t("Three steps, no paperwork to start", "तीन कदम, शुरुआत में कोई कागज़ी कार्रवाई नहीं")} />
          <ol className="st-ledger self-start" style={{ ["--st-cols" as string]: "4rem minmax(0,1fr)" }}>
            {STEPS.map((s, i) => (
              <li key={s.t} className="st-row">
                <span className="st-key" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="st-title">{s.t}</h3>
                  <p className="st-body mt-2">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="page-container st-sec">
        <ReviewsList lang={lang} max={3} title={t("From buyers who used the counter", "काउंटर से माल लेने वाले खरीदारों की ज़ुबानी")} />
      </div>

      <ContactStrip heading={t("Send the list", "अपनी सूची भेजिए")} waMessage={t("Hi, I'd like a rate for an order. Product, size and quantity: ", "नमस्ते, मुझे एक ऑर्डर का रेट चाहिए। उत्पाद, साइज़ और मात्रा: ")} />
    </>
  );
}
