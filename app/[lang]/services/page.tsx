import type { Metadata } from "next";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { localize } from "@/lib/localize";
import { allProducts } from "@/content/products";
import { isCutToSize } from "@/components/product/specSheet";
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
import Image from "next/image";
import { OrderJourney, OrderRail, OrderScene, type OrderSceneCopy, type PrepStep } from "@/components/services/OrderPrep";
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

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Services: Retail, Wholesale and Bulk Supply",
    description: `Retail, wholesale, bulk orders, warehouse and delivery. How ${site.name} serves builders, contractors and customers in Indore.`,
    path: "services",
  });
}

const frame = "relative overflow-hidden rounded-[10px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10";
const tag = "absolute bottom-2 left-2 rounded-[4px] bg-[#070d14]/85 px-2 py-1 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-white/80";

/** One composition per service, each from different real material: no storefront repeated, no stock pile used twice. */
function ServiceVisual({ slug, lang, num }: { slug: string; lang: Lang; num: string }) {
  const t = tt(lang);
  const sizes = "(max-width:1024px) 100vw, 560px";
  const Num = (
    <span className="absolute left-3 top-3 z-10 font-mono-brand text-xs tracking-[0.18em] text-white/90 drop-shadow" aria-hidden="true">
      {num}
    </span>
  );
  if (slug === "retail") {
    return (
      <div className="grid aspect-[4/3] grid-cols-[1.7fr_1fr] gap-2">
        <div className={frame}>
          {Num}
          <Image src="/reels/tata-wire-rate.jpg" alt={t("At the counter in the Siyaganj shop, under the Tata Wiron and SR signs", "सियागंज की दुकान में काउंटर पर, टाटा वायरॉन और एसआर के बोर्ड के नीचे")} fill sizes={sizes} className="object-cover" style={{ objectPosition: "50% 22%" }} />
          <span className={tag}><T en="At the counter" hi="काउंटर पर" /></span>
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className={frame + " bg-white"}>
            <Image src="/products/fastener-nail.png" alt={t("Nails, sold by the kilo", "कील, किलो के हिसाब से")} fill sizes="240px" className="object-cover" />
            <span className={tag}><T en="Nails" hi="कील" /></span>
          </div>
          <div className={frame + " bg-white"}>
            <Image src="/products/welding-rod.png" alt={t("Welding rods", "वेल्डिंग रॉड")} fill sizes="240px" className="object-cover" />
            <span className={tag}><T en="Welding rods" hi="वेल्डिंग रॉड" /></span>
          </div>
        </div>
      </div>
    );
  }
  if (slug === "wholesale") {
    return (
      <div className={frame + " aspect-[4/3]"}>
        {Num}
        <Image src="/products/binding-wire.png" alt={t("Coils of binding wire, bundled and tied", "बाँधकर रखे बाइंडिंग वायर के कॉइल")} fill sizes={sizes} className="object-cover" />
        <div className="absolute bottom-3 right-3 h-[42%] w-[44%] overflow-hidden rounded-[6px] ring-2 ring-[#0e161e] shadow-xl">
          <Image src="/about/warehouse-stock-1.png" alt={t("Shrink-wrapped CM barbed wire and chain link coils stacked for wholesale", "थोक के लिए रखे श्रिंक-रैप्ड सीएम कंटीला तार और चेन लिंक के कॉइल")} fill sizes="260px" className="object-cover" />
        </div>
        <span className={tag}><T en="Bundled stock" hi="बंडल में माल" /></span>
      </div>
    );
  }
  if (slug === "contractor") {
    return (
      <div className={frame + " aspect-[4/3]"}>
        {Num}
        <Image src="/stock/weldmesh.jpg" alt={t("Customers checking a welded mesh roll at the counter", "काउंटर पर वेल्डमेश का रोल जाँचते ग्राहक")} fill sizes={sizes} className="object-cover" style={{ objectPosition: "50% 70%" }} />
      </div>
    );
  }
  if (slug === "warehouse") {
    return (
      <div className={frame + " aspect-[4/3]"}>
        {Num}
        <Image src="/about/warehouse-stock-2.png" alt={t("Warehouse stock of barbed wire and chain link coils", "गोदाम में कंटीला तार और चेन लिंक का स्टॉक")} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  if (slug === "delivery") {
    return (
      <div className={frame + " aspect-[4/3] bg-[#0b1118]"}>
        {Num}
        <picture>
          <source type="image/avif" srcSet="/fx/services-art-handover.avif" />
          <img src="/fx/services-art-handover.jpg" alt={t("A tied bundle of steel sections and a packing label, ready to collect", "बंधा हुआ स्टील सेक्शन का बंडल और पैकिंग लेबल, ले जाने के लिए तैयार")} width={1368} height={1200} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </picture>
      </div>
    );
  }
  // Cut-to-length: a close-up with the measuring marks that make the idea literal.
  return (
    <div className={frame + " aspect-[4/3]"}>
      {Num}
      <Image src="/videos/expanded-mesh-closeup.jpg" alt={t("Close-up of expanded metal mesh, the kind of sheet that can be cut to length", "एक्सपैंडेड मेटल मेश का क्लोज़-अप, ऐसी शीट जिसे लंबाई में काटा जा सकता है")} fill sizes={sizes} className="object-cover" style={{ objectPosition: "50% 45%" }} />
      <svg className="pointer-events-none absolute inset-x-4 bottom-4 h-6 w-[calc(100%-2rem)]" preserveAspectRatio="none" viewBox="0 0 400 24" aria-hidden="true">
        <rect x="0" y="0" width="400" height="24" fill="rgba(7,13,20,0.7)" />
        {Array.from({ length: 81 }).map((_, i) => (
          <line key={i} x1={i * 5} x2={i * 5} y1="0" y2={i % 10 === 0 ? 16 : i % 5 === 0 ? 11 : 7} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
        ))}
        <line x1="120" x2="120" y1="0" y2="24" stroke="#f97316" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default async function ServicesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const items = localize(services, lang);
  // One source for "what the counter cuts": the same rule that puts the "Cut to size" stamp on a product page.
  const cutNames = allProducts.filter(isCutToSize).map((p) => localize(p, lang).name);
  const PREP: PrepStep[] = [
    { key: "list", label: t("Send your list", "अपनी सूची भेजिए"), line: t("Share the product, size and quantity.", "उत्पाद, साइज़ और मात्रा बताइए।") },
    { key: "check", label: t("We check the details", "हम ब्योरा जाँचते हैं"), line: t("We confirm specifications, stock and the quotation.", "हम स्पेसिफ़िकेशन, स्टॉक और कोटेशन पक्का करते हैं।") },
    { key: "prepare", label: t("Material is prepared", "माल तैयार होता है"), line: t("Your confirmed order is measured, counted or packed as appropriate.", "आपका पक्का ऑर्डर ज़रूरत के हिसाब से नापा, गिना या पैक किया जाता है।") },
    { key: "handover", label: t("Pickup or delivery", "पिकअप या डिलीवरी"), line: t("Arrange collection or discuss delivery for your location.", "खुद ले जाने की व्यवस्था कीजिए, या अपनी जगह के लिए डिलीवरी पर बात कीजिए।") },
  ];
  // Words over the hero picture. An example list and the shop's own handover terms: no sizes, rates or stock figures.
  const SCENE: OrderSceneCopy = {
    listTitle: t("Your list", "आपकी सूची"),
    example: t("example", "उदाहरण"),
    items: [t("Welded mesh", "वेल्डेड मेश"), t("Binding wire", "बाइंडिंग वायर"), t("TMT bars", "टीएमटी सरिया")],
    fieldsTitle: t("Details we confirm", "हम ये ब्योरा पक्का करते हैं"),
    fields: [t("Material", "माल"), t("Size", "साइज़"), t("Quantity", "मात्रा")],
    preparedTitle: t("Your order", "आपका ऑर्डर"),
    prepared: t("Grouped and secured", "इकट्ठा और बँधा हुआ"),
    handover: [
      { term: t("Pickup", "पिकअप"), detail: t("Siyaganj counter", "सियागंज काउंटर") },
      { term: t("Delivery", "डिलीवरी"), detail: t("Confirmed with your quotation", "कोटेशन के साथ तय") },
    ],
  };
  return (
    <>
      <SeoJsonLd data={servicesPageSchema(lang)} lang={lang} />
      <OrderJourney>
        <PageHero
          eyebrow={<T en="Services · Siyaganj, Indore" hi="सेवाएँ · सियागंज, इंदौर" />}
          title={<T en="One counter for a single coil or a whole site" hi="एक काउंटर: एक कॉइल से पूरी साइट तक" />}
          titleSize="clamp(2.1rem, 3.9vw, 3.8rem)"
          lede={t("We serve retail customers, wholesalers, contractors and industrial buyers with supply and support to match the order.", "हम रिटेल ग्राहकों, थोक व्यापारियों, ठेकेदारों और औद्योगिक खरीदारों को ऑर्डर के हिसाब से सप्लाई और सहयोग देते हैं।")}
          art={<OrderScene copy={SCENE} />}
          artBare
          artAuto
          dense
          footer={<OrderRail steps={PREP} heading={t("Your order, from list to collection", "आपका ऑर्डर: सूची से माल उठाने तक")} />}
        >
          <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
          <Link href="/products" className={btnGhostDark}><T en="Browse the range" hi="पूरी रेंज देखें" /></Link>
        </PageHero>
      </OrderJourney>

      <section className="st-sec" aria-labelledby="services-heading">
        <div className="page-container">
          <SectionHead eyebrow={t("What we do", "हम क्या करते हैं")} id="services-heading" title={t("Six ways we serve", "सेवा के छह तरीके")} />
          <ol className="mt-12 space-y-14 lg:space-y-20">
            {items.map((s, i) => {
              return (
                <li key={s.slug} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
                  <div className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                    <ServiceVisual slug={s.slug} lang={lang} num={String(i + 1).padStart(2, "0")} />
                  </div>
                  <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>
                    <h3 className="font-display text-[2rem] font-extrabold uppercase leading-[1.02] text-foreground sm:text-[2.4rem]">{s.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{s.description}</p>
                    {s.slug === "fabrication" && cutNames.length > 0 && (
                      <p className="mt-3 text-base leading-relaxed text-foreground/85">
                        {t("Cut to size at the counter: ", "काउंटर पर नाप से काटा जाता है: ")}
                        {cutNames.join(", ")}
                        {t(". Everything else is sold in its standard length or pack.", "। बाकी सब कुछ उसकी मानक लंबाई या पैक में बिकता है।")}
                      </p>
                    )}
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

      <div className="page-container st-sec">
        <ReviewsList lang={lang} max={3} title={t("From buyers who used the counter", "काउंटर से माल लेने वाले खरीदारों की ज़ुबानी")} />
      </div>

      <ContactStrip heading={t("Send the list", "अपनी सूची भेजिए")} waMessage={t("Hi, I'd like a rate for an order. Product, size and quantity: ", "नमस्ते, मुझे एक ऑर्डर का रेट चाहिए। उत्पाद, साइज़ और मात्रा: ")} />
    </>
  );
}
