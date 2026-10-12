import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { indorePageSlugs, getIndorePage } from "@/content/indorePages";
import { getProductBySlug, getProductImages, getCategoryBySlug } from "@/content/products";
import { site, baseUrl } from "@/lib/site";
import { getWhatsAppLink } from "@/lib/utils";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { FAQAccordion } from "@/components/FAQAccordion";
import { faqPage } from "@/lib/schema";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import { indorePagesHi } from "@/content/hi/indore";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import "@/components/story/story.css";

type Props = { params: { lang: string; slug: string } };

export function generateStaticParams() {
  return indorePageSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const lang = params.lang as Lang;
  const base = getIndorePage(slug);
  if (!base) return { title: "Products in Indore" };
  const page = lang === "hi" ? { ...base, ...indorePagesHi[base.slug] } : base;
  return buildPageMeta({ lang, title: page.title, description: page.description, path: `indore/${page.slug}` });
}

export default async function IndoreLandingPage({ params }: Props) {
  const { slug } = params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const base = getIndorePage(slug);
  if (!base) notFound();
  const page = hi ? { ...base, ...indorePagesHi[base.slug] } : base;

  const products = base.productSlugs.map((s) => getProductBySlug(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const hero = products[0] ? getProductImages(products[0], getCategoryBySlug(products[0].categorySlug))[0] : undefined;
  const topic = page.topic ?? (hi ? page.h1.replace(/^इंदौर में /, "") : page.h1.replace(/ in Indore$/, ""));
  const pageFaqs = page.faqs ?? [];
  const faqSchema = faqPage(pageFaqs);
  const waMessage = hi
    ? `नमस्ते, मुझे ${topic} में रुचि है। कृपया भाव और उपलब्धता बताइए।`
    : `Hi, I'm interested in ${topic}. Please share price and availability.`;
  const productsL = localize(products, lang);

  return (
    <>
      {faqSchema && <SeoJsonLd data={faqSchema} lang={lang} />}
      <JsonLdBreadcrumb
        lang={lang}
        items={[
          { name: t("Home", "होम"), url: "/" },
          { name: t("Indore", "इंदौर"), url: "/indore" },
          { name: page.h1, url: `/indore/${page.slug}` },
        ]}
      />
      <PageHero
        eyebrow={
          <>
            <Link href="/indore" className="hover:text-white">{t("Indore", "इंदौर")}</Link> / {page.h1}
          </>
        }
        title={page.h1}
        lede={page.intro}
        compact
        image={hero ? { src: hero, alt: hi ? `${page.h1}: एच एम इब्राहिम एंड कंपनी, सियागंज` : `${page.h1} from HM Ibrahim & Co, Siyaganj` } : undefined}
      >
        <Link href={`/contact?product=${page.productSlugs[0] ?? ""}`} className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <a href={getWhatsAppLink(site.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
          {t("WhatsApp for a rate", "रेट के लिए व्हाट्सएप")}
        </a>
      </PageHero>

      <section className="st-sec">
        <div className="page-container grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            {page.intro2 && <p className="text-lg leading-relaxed text-muted-foreground">{page.intro2}</p>}
            <p className="mt-4 text-muted-foreground">
              {hi ? (
                <>
                  हम <strong className="text-foreground">सियागंज, इंदौर</strong> में हैं, और सियागंज, लोहा मंडी, नई सियागंज, देवास, उज्जैन, महू, पीथमपुर और आसपास के इलाकों में माल देते हैं। पूरे भारत से ऑर्डर स्वीकार किए जाते हैं; डिलीवरी की व्यवस्था हर कोटेशन के साथ तय की जाती है।
                </>
              ) : (
                <>
                  We are in <strong className="text-foreground">Siyaganj, Indore</strong>, and supply Siyaganj, Loha Mandi, New Siyaganj, Dewas, Ujjain, Mhow, Pithampur and nearby areas. Orders accepted across India; delivery arrangements confirmed with each quotation.
                </>
              )}
            </p>

            {page.specs.length > 0 && (
              <>
                <h2 className="mt-12 text-foreground">{t("What we offer", "हम क्या देते हैं")}</h2>
                <ul className="st-ledger mt-5">
                  {page.specs.map((s) => (
                    <li key={s} className="border-b border-border py-3.5 text-foreground">{s}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            {page.useCases.length > 0 && (
              <>
                <p className="st-eyebrow">{t("Used for", "उपयोग")}</p>
                <ul className="st-ledger mt-4">
                  {page.useCases.map((u) => (
                    <li key={u} className="border-b border-border py-3 font-semibold text-foreground">{u}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

      {products.length > 0 && (
        <section className="st-sec st-sec-tint" aria-labelledby="related-heading">
          <div className="page-container">
            <SectionHead eyebrow={t("Product pages", "उत्पाद पेज")} id="related-heading" title={t("Related products", "संबंधित उत्पाद")} />
            <ul className="st-ledger mt-8" style={{ ["--st-cols" as string]: "6rem minmax(0,1fr) auto" }}>
              {productsL.map((p) => {
                const img = getProductImages(p, getCategoryBySlug(p.categorySlug))[0];
                return (
                  <li key={p.slug} className="st-row items-center !py-4">
                    <span className="relative block aspect-[4/3] w-24 overflow-hidden rounded-[10px] bg-secondary">
                      {img && <Image src={img} alt="" fill sizes="96px" className="object-cover" />}
                    </span>
                    <h3 className="st-title" style={{ fontSize: "1.5rem" }}>{p.name}</h3>
                    <Link href={`/products/${p.slug}`} className="st-link">
                      {t("Ask for rate", "रेट पूछें")}<span className="sr-only">: {p.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {pageFaqs.length > 0 && (
        <section className="st-sec" aria-labelledby="faq-heading">
          <div className="page-container">
            <SectionHead eyebrow={t("Questions", "सवाल")} id="faq-heading" title={t("Common questions", "आम सवाल")} />
            <FAQAccordion
              inline
              faqs={pageFaqs.map((f, i) => ({ id: `${page.slug}-${i + 1}`, question: f.question, answer: f.answer }))}
            />
          </div>
        </section>
      )}

      <div className="page-container st-sec">
        <ReviewsList lang={lang} max={3} productSlug={page.productSlugs[0]} />
      </div>

      <ContactStrip
        heading={hi ? `${topic} चाहिए?` : `Need ${topic}?`}
        quoteHref={`/contact?product=${page.productSlugs[0] ?? ""}`}
        waMessage={waMessage}
      />
    </>
  );
}
