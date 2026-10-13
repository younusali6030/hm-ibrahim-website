"use client";

import Link from "@/components/LocaleLink";
import { site } from "@/content/site";
import { categories } from "@/content/products";
import { getWhatsAppLink, telHref } from "@/lib/utils";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { SectionHead } from "@/components/story/SectionHead";
import { T, useT } from "@/lib/i18n";
import { catNameHi } from "@/content/hi/names";
import "@/components/story/story.css";

export default function NotFound() {
  const t = useT();
  const hi = t("en", "hi") === "hi";
  const tel = telHref(site.phone);
  return (
    <>
      <PageHero
        eyebrow={<T en="404 · Page not found" hi="404 · पेज नहीं मिला" />}
        title={<T en="That shutter is down." hi="यह शटर बंद है।" />}
        lede={t("The link may be old, or the page may have moved. Search the products, or ask the counter. We will find it.", "लिंक पुराना हो सकता है, या पेज हट गया हो। उत्पाद खोजिए, या काउंटर से पूछिए। हम ढूँढ देंगे।")}
        compact
      >
        <form action={hi ? "/hi/products" : "/products"} method="get" role="search" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="nf-q" className="sr-only">{t("Search products", "उत्पाद खोजें")}</label>
          <input
            id="nf-q"
            name="q"
            type="search"
            placeholder={t("Wire, mesh, angle, TMT…", "तार, जाली, एंगल, टीएमटी...")}
            className="min-h-[52px] w-full rounded-[6px] border border-white/40 bg-white/5 px-4 text-white placeholder:text-white/60"
          />
          <button type="submit" className={btnMain + " shrink-0"}>
            <T en="Search" hi="खोजें" />
          </button>
        </form>
      </PageHero>

      <section className="st-sec" aria-labelledby="nf-cats">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead eyebrow={t("Or pick a shelf", "या कोई शेल्फ चुनिए")} id="nf-cats" title={t("Browse by category", "श्रेणी के अनुसार देखें")} />
          <ul className="st-ledger self-start sm:columns-2 sm:gap-x-10">
            {categories.map((c) => (
              <li key={c.slug} className="break-inside-avoid border-b border-border">
                <Link href={`/categories/${c.slug}`} className="flex min-h-[48px] items-center font-semibold text-foreground hover:text-primary">
                  {hi ? catNameHi[c.slug] ?? c.name : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="st-sec st-sec-tint pb-28 md:pb-20" aria-labelledby="nf-ask">
        <div className="page-container">
          <SectionHead eyebrow={t("Ask the counter", "काउंटर से पूछिए")} id="nf-ask" title={t("Still not found?", "अब भी नहीं मिला?")} lede={t("Tell us what you were looking for. Mon to Sat, 10 am to 8 pm.", "बताइए आप क्या ढूँढ रहे थे। सोम से शनि, 10 से 8।")} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={tel} className={btnMain}>
              <T en={`Call ${site.phone}`} hi={`कॉल करें ${site.phone}`} />
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, t("Hi, I could not find a page on your website. I was looking for: ", "नमस्ते, मुझे आपकी वेबसाइट पर एक पेज नहीं मिला। मैं यह ढूँढ रहा था: "))}
              target="_blank"
              rel="noopener noreferrer"
              className={btnGhostDark}
            >
              <T en="WhatsApp" hi="व्हाट्सएप" /><span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
            </a>
            <Link href="/" className={btnGhostDark}>
              <T en="Back to home" hi="होम पर जाएँ" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
