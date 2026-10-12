import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { baseUrl, entityIds, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { ReelsSection } from "@/components/home/ReelsSection";
import { CounterStamp, GaugeRule } from "@/components/motif/Motif";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import { tt, type Lang } from "@/lib/locale";
import { pageUrl } from "@/lib/seo";
import { siteHi } from "@/content/hi/site";
import "@/components/story/story.css";

function aboutPageSchema(lang: Lang) {
  const hi = lang === "hi";
  const name = hi ? siteHi.name : site.name;
  const description = hi ? siteHi.description : site.description;
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: hi ? `${name} के बारे में` : `About ${name}`,
    description,
    url: pageUrl("about", lang),
    inLanguage: hi ? "hi-IN" : "en-IN",
    mainEntity: {
      "@type": "Organization",
      "@id": entityIds.organization,
      name,
      foundingDate: "1939",
      description,
    },
  };
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return buildPageMeta({
    lang: params.lang as Lang,
    title: `About Us | ${site.name}, Iron & Hardware Since 1939, Siyaganj, Indore`,
    description: `The story of ${site.name}: founded in 1939, now run by the third generation, one counter on Siyaganj Main Road, Indore.`,
    path: "about",
  });
}

function leaders(lang: Lang) {
  const t = tt(lang);
  return [
    {
      era: "1939",
      name: t("Late HM Ibrahim", "स्वर्गीय एच.एम. इब्राहिम"),
      role: t("Founder", "संस्थापक"),
      text: t(
        "He founded the firm and built its name in the steel and hardware trade on honest dealing, sound material and long relationships with customers.",
        "उनकी दूरदृष्टि ने स्टील और हार्डवेयर के व्यापार में भरोसे, गुणवत्ता और लंबे रिश्तों की नींव रखी।"
      ),
    },
    {
      era: t("Then", "तब"),
      name: t("Late Abedeali Bhai Dewaswala (CM)", "स्वर्गीय आबेदअली भाई देवासवाला (सीएम)"),
      role: t("1924 to 2025", "1924 से 2025"),
      text: t(
        "Under him the firm's reputation grew across Indore and the surrounding region, built on close customer relationships and disciplined operations.",
        "उनके नेतृत्व में कंपनी की साख इंदौर और आसपास के इलाकों में और मज़बूत हुई, ग्राहकों से गहरे रिश्ते बने और काम में अनुशासन आया।"
      ),
    },
    {
      era: t("Then", "तब"),
      name: t("Akbar Ali", "अकबर अली"),
      role: t("Led the firm next", "इसके बाद फ़र्म की कमान सँभाली"),
      text: t(
        "He built a skilled, dependable sales and production team, tightened the firm's internal systems and widened its reach.",
        "उन्होंने कुशल और भरोसेमंद बिक्री और उत्पादन टीम खड़ी की, भीतरी व्यवस्थाएँ मज़बूत कीं और फ़र्म का दायरा बढ़ाया।"
      ),
    },
    {
      era: t("Today", "आज"),
      name: t("Shoeb Ali", "शोएब अली"),
      role: t("Leading the firm now", "अब फ़र्म का नेतृत्व"),
      text: t(
        "He brings modern planning and better-organised operations to the family business, with the aim of taking the HM Ibrahim & Co name into every household while keeping the trust it has earned.",
        "वे इस पुश्तैनी कारोबार में आधुनिक रणनीति, सुव्यवस्थित संचालन और आगे की सोच लेकर आए हैं, ताकि एचएम इब्राहिम एंड कंपनी का नाम हर घर तक पहुँचे और भरोसे की विरासत बनी रहे।"
      ),
    },
  ];
}

function values(lang: Lang) {
  const t = tt(lang);
  return [
    { t: t("Reliability", "भरोसा"), d: t("We keep our promises and supply the same quality every time.", "हम हर वादा निभाते हैं, एक-सी गुणवत्ता के साथ जिस पर आप भरोसा कर सकें।") },
    { t: t("Fair pricing", "वाजिब भाव"), d: t("Clear, fair rates for retail and wholesale buyers alike.", "रिटेल और थोक दोनों के लिए साफ़ और प्रतिस्पर्धी रेट।") },
    { t: t("Availability", "उपलब्धता"), d: t("Deep stock and quick fulfilment, so your work does not wait.", "भरपूर स्टॉक और जल्दी सप्लाई, ताकि आपका काम न रुके।") },
    { t: t("Long relationships", "लंबे रिश्ते"), d: t("We grow with our customers and stand by them over the years.", "हम अपने ग्राहकों के साथ बढ़ते हैं और लंबे समय तक उनके साथ खड़े रहते हैं।") },
  ];
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const LEADERS = leaders(lang);
  const VALUES = values(lang);
  const addr = hi ? siteHi.address : site.address;
  return (
    <>
      <SeoJsonLd data={aboutPageSchema(lang)} lang={lang} />
      <PageHero
        eyebrow={<T en="About · Siyaganj, Indore" hi="हमारे बारे में · सियागंज, इंदौर" />}
        title={<T en="Since 1939, one counter on Siyaganj Main Road" hi="1939 से, सियागंज मेन रोड का एक काउंटर" />}
        lede={hi ? siteHi.manufacturerTagline : site.manufacturerTagline}
        image={{
          src: "/about/storefront-hero.jpg",
          alt: t("The HM Ibrahim & Co shopfront at 60 Siyaganj, Indore, with wire mesh, chain link and coils out front", "60 सियागंज, इंदौर पर एच एम इब्राहिम एंड कंपनी की दुकान, आगे वायर मेश, चेन लिंक और कॉइल रखे हुए"),
        }}
      >
        <Link href="/contact" className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <Link href="/brands" className={btnGhostDark}><T en="Our brands" hi="हमारे ब्रांड" /></Link>
      </PageHero>

      {/* Story: copy is the shop's own, from the repo. */}
      <section className="st-sec" aria-labelledby="story-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead eyebrow={t("Our story", "हमारी कहानी")} id="story-heading" title={t("Eight decades of the same promise", "आठ दशक, वही एक वादा")} />
            <div className="mt-8">
              <CounterStamp sub={t("Siyaganj, Indore", "सियागंज, इंदौर")}>{t("Since 1939", "1939 से")}</CounterStamp>
            </div>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            {hi ? (
              <>
                <p className="text-xl text-foreground">
                  1939 में स्थापित, एच. मोहम्मद हुसैन एचएम इब्राहिम एंड कंपनी (सीएम) इंदौर में वायर मेश, स्टील सेक्शन और औद्योगिक हार्डवेयर का एक भरोसेमंद नाम है।
                </p>
                <p>
                  सियागंज के दिल में बसे हम पीढ़ियों से ठेकेदारों, बिल्डरों, फैब्रिकेटरों और कारोबारियों की सेवा करते आए हैं, एक-सी गुणवत्ता, वाजिब भाव और भरोसेमंद सप्लाई के साथ। आज कारोबार तीसरी पीढ़ी के हाथों में है, जो गुणवत्ता और ग्राहक संतुष्टि के उसी संकल्प के साथ विरासत को आगे बढ़ा रही है।
                </p>
                <p>
                  हमारी विशेषज्ञता वायर मेश, वेल्डमेश, परफोरेटेड शीट (एमएस और एसएस), स्टील सेक्शन, जीआई और एमएस तार, फेंसिंग सामग्री और औद्योगिक हार्डवेयर की बड़ी रेंज में है। हमारे फेंसिंग समाधानों में कांटेदार तार, चेन लिंक फेंस और झटका तार शामिल हैं, जो निर्माण और खेती दोनों की ज़रूरत पूरी करते हैं।
                </p>
                <p>
                  औद्योगिक सामग्री के साथ हम फौड़ा, गेंती और सब्बल जैसे टिकाऊ खेती और हाथ के औज़ार भी रखते हैं, ताकि खेत और निर्माण के लिए मज़बूत और भरोसेमंद औज़ार मिलें।
                </p>
              </>
            ) : (
              <>
                <p className="text-xl text-foreground">
                  Founded in 1939, H Mohammed Husain HM Ibrahim &amp; Co (CM) has been a trusted name in wire mesh, steel sections and industrial hardware in Indore.
                </p>
                <p>
                  From the heart of Siyaganj, we have served generations of contractors, builders, fabricators and businesses with consistent quality, fair prices and reliable supply. Today the business is run by the third generation, with the same commitment to quality and to our customers.
                </p>
                <p>
                  We specialise in wire mesh, weldmesh, perforated sheets (MS and SS), steel sections, GI and MS wire, fencing material and industrial hardware. Our fencing range includes barbed wire, chain link fencing and jhatka wire, for both construction and agriculture.
                </p>
                <p>
                  Alongside industrial material, we sell farm and hand tools such as the hoe (faurdha), pickaxe (geti) and crowbar, for field and construction work.
                </p>
              </>
            )}
            {/*
              NEEDS-YOU (see docs/design/NEEDS-YOU-story.md): more history would help here, in the owner's words.
              Not rendered until supplied: how the shop began, the year of the move to 60 Siyaganj Main Road,
              what Siyaganj Main Road was like then, what CM stands for in family terms, which trades came first.
            */}
          </div>
        </div>

        <div className="page-container mt-14">
          <figure>
            <div className="relative aspect-[1024/714] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
              <Image
                src="/about-storefront.png"
                alt={t("The HM Ibrahim & Co shopfront on Siyaganj Main Road, Indore", "सियागंज मेन रोड, इंदौर पर एच एम इब्राहिम एंड कंपनी की दुकान")}
                fill
                sizes="(max-width:1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {addr.line1}, {addr.line2}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Leadership as a ledger, oldest first. */}
      <section className="st-sec st-sec-tint" aria-labelledby="leaders-heading">
        <div className="page-container">
          <SectionHead eyebrow={t("Leadership and legacy", "नेतृत्व और विरासत")} id="leaders-heading" title={t("The hands that built the counter", "वे हाथ जिन्होंने यह काउंटर बनाया")} />
          <ol className="st-ledger mt-10" style={{ ["--st-cols" as string]: "7rem minmax(0,1fr) minmax(0,1.5fr)" }}>
            {LEADERS.map((l) => (
              <li key={l.name} className="st-row">
                <span className="st-key" aria-hidden="true">{l.era}</span>
                <div>
                  <h3 className="st-title">{l.name}</h3>
                  <p className="st-meta">{l.era === "1939" ? (hi ? `${l.role}, 1939` : `${l.role}, 1939`) : l.role}</p>
                </div>
                <p className="st-body">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReelsSection />

      <section className="st-sec" aria-labelledby="values-heading">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead
            eyebrow={t("How we work", "हम कैसे काम करते हैं")}
            id="values-heading"
            title={t("Four things we hold to", "चार बातें जिन पर हम टिके हैं")}
            lede={t(
              "After decades in the trade, we know our products and what each job needs. We will point you to the most suitable and economical choice for your application, with durability and safety in mind.",
              "दशकों के अनुभव से हम अपने उत्पादों और हर काम की ज़रूरत को जानते हैं। टिकाऊपन, सुरक्षा और लंबे समय के मूल्य को ध्यान में रखकर हम आपके काम के लिए सबसे उपयुक्त और किफ़ायती विकल्प सुझाते हैं।"
            )}
          />
          <ul className="st-ledger self-start" style={{ ["--st-cols" as string]: "minmax(0,0.9fr) minmax(0,1.3fr)" }}>
            {VALUES.map((v) => (
              <li key={v.t} className="st-row">
                <h3 className="st-title">{v.t}</h3>
                <p className="st-body">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="st-sec st-sec-tint" aria-labelledby="stock-heading">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-secondary">
              <Image src="/about/warehouse-stock-1.png" alt={t("CM and Border barbed wire and chain link coils in the warehouse", "गोदाम में सीएम और बॉर्डर के कांटेदार तार और चेन लिंक के कॉइल")} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[14px] bg-secondary">
              <Image src="/about/warehouse-stock-2.png" alt={t("Barbed wire rolls, CM and Border brand stock, ready for dispatch", "कांटेदार तार के रोल, सीएम और बॉर्डर ब्रांड का स्टॉक, भेजने के लिए तैयार")} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
            </div>
          </div>
          <div>
            <SectionHead eyebrow={t("What we supply", "हम क्या सप्लाई करते हैं")} id="stock-heading" title={t("Stock that serves construction, fabrication and industry", "निर्माण, फैब्रिकेशन और उद्योग की ज़रूरत का स्टॉक")} />
            <GaugeRule className="mt-6" />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t(
                "We stock iron and steel (MS angles, flats, bright bars, TMT bars and structural sections), pipes and tubes, wire and mesh (GI wire, binding wire, barbed wire, chain link, welded mesh, jali), perforated sheets and pigeon nets, and hardware and tools including welding rods, fasteners, nails, crowbars and pickaxes. Retail and wholesale.",
                "हमारे पास लोहे और स्टील की बड़ी रेंज है (एमएस एंगल, फ्लैट, ब्राइट बार, टीएमटी सरिया और स्ट्रक्चरल सेक्शन), साथ ही पाइप और ट्यूब, तार और जाली (जीआई तार, बाइंडिंग तार, कांटेदार तार, चेन लिंक, वेल्डेड मेश, जालियाँ), और हार्डवेयर व औज़ार जैसे वेल्डिंग रॉड, फास्टनर, कील, सब्बल, गेंती, परफोरेटेड शीट और कबूतर जाली। रिटेल और थोक।"
              )}
            </p>
            <p className="mt-4 text-muted-foreground">{t("For more than eight decades we have held to the same values: trust, integrity and long-term relationships.", "आठ दशकों से भी ज़्यादा समय से हम भरोसे, ईमानदारी और लंबे रिश्तों के उन्हीं मूल्यों पर टिके हैं।")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={btnMain}><T en="Browse the range" hi="पूरी रेंज देखें" /></Link>
            </div>
            {site.gstin && <p className="mt-8 text-sm text-muted-foreground">{t("GSTIN", "जीएसटीआईएन")} <span className="font-mono-brand text-foreground">{site.gstin}</span></p>}
          </div>
        </div>
      </section>

      <div className="page-container st-sec">
        <ReviewsList lang={lang} max={3} title={t("What our customers say", "हमारे ग्राहक क्या कहते हैं")} />
      </div>

      <ContactStrip heading={t("Come to the counter", "काउंटर पर आइए")} waMessage={t("Hi, I read about your shop and would like a rate. Product, size and quantity: ", "नमस्ते, मैंने आपकी दुकान के बारे में पढ़ा और रेट जानना चाहता हूँ। उत्पाद, साइज़ और मात्रा: ")} />
    </>
  );
}
