import Link from "@/components/LocaleLink";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories, getCategoryThumbnails } from "@/content/products";
import { GaugeRule, StencilTag } from "@/components/motif/Motif";
import { T } from "@/lib/i18n";
import { localize } from "@/lib/localize";
import type { Lang } from "@/lib/locale";

/** Counter names buyers search for, each linked to the page that owns the term (docs/seo/keyword-map.md). */
const OFTEN_ASKED: { href: string; en: string; hi: string }[] = [
  { href: "/products/mosquito-net", en: "Mosquito net (machhar jali)", hi: "मच्छर जाली" },
  { href: "/products/ss-fine-mesh", en: "SS fine mesh", hi: "एसएस फाइन मेश" },
  { href: "/indore/perforated-sheets", en: "Perforated sheet (chaddar jali)", hi: "चादर जाली (परफोरेटेड शीट)" },
  { href: "/products/ms-perforated-sheet", en: "MS perforated sheet", hi: "एमएस परफोरेटेड शीट" },
  { href: "/products/gi-perforated-sheet", en: "GI perforated sheet", hi: "जीआई परफोरेटेड शीट" },
  { href: "/products/sr-crowbar", en: "Crowbar (sabbal)", hi: "सब्बल" },
  { href: "/products/sr-pickaxe-geti", en: "Pickaxe (geti)", hi: "गेंती" },
  { href: "/products/sr-hoe-faurdha-with-handle", en: "Hoe (faurdha, phawda) with handle", hi: "दस्ते सहित फौड़ा" },
  { href: "/products/sr-sledge-hammer", en: "Sledge hammer", hi: "घन (स्लेज हैमर)" },
];

/** The counter as a ledger: one ruled row per range, a few real photos, a count, and a way in. */
export function CategoryShowcase({ lang = "en" }: { lang?: Lang }) {
  const cats = localize(categories, lang);
  const hi = lang === "hi";
  return (
    <section className="py-14 md:py-20" aria-labelledby="categories-heading">
      <div className="page-container">
        <p data-reveal className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <T en="The counter" hi="काउंटर" />
        </p>
        <h2 id="categories-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          <T en="Every wire, mesh, sheet and bar a build calls for" hi="तार, जाली, शीट और सरिया: जो भी निर्माण को चाहिए" />
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          <T en="In stock at our Siyaganj counter, for retail and wholesale. Pick a range, then ask for a rate." hi="सियागंज काउंटर पर स्टॉक में, रिटेल और थोक दोनों के लिए। रेंज चुनें, फिर रेट पूछें।" />
        </p>

        <div className="mt-10">
          <GaugeRule label={hi ? `${cats.length} श्रेणियाँ` : `${cats.length} ranges`} />
          <ol className="mt-2">
            {cats.map((cat, i) => {
              const thumbs = getCategoryThumbnails(cat, 3);
              return (
                <li key={cat.slug} data-reveal className="border-b border-border">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group grid min-h-[76px] grid-cols-[2rem_1fr_auto] items-center gap-x-3 gap-y-1 py-4 sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-x-6 sm:py-5"
                  >
                    <span className="font-mono-brand text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.75rem] font-extrabold uppercase leading-none text-foreground transition-colors group-hover:text-primary sm:text-4xl lg:text-5xl">
                        {cat.name}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <StencilTag className="text-muted-foreground">
                          {cat.products.length} {hi ? "आइटम" : cat.products.length === 1 ? "item" : "items"}
                        </StencilTag>
                        <span className="line-clamp-1 text-sm text-muted-foreground">
                          {cat.products.slice(0, 3).map((p) => p.name).join(" · ")}
                        </span>
                      </span>
                    </span>
                    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                      {thumbs.map((t) => (
                        <span key={t.src} className="relative h-14 w-14 overflow-hidden rounded-[6px] bg-secondary ring-1 ring-white/10 transition group-hover:ring-primary/60">
                          <Image src={t.src} alt="" fill sizes="56px" className="object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                        </span>
                      ))}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ol>
          <nav aria-label={hi ? "अक्सर माँगे जाने वाले" : "Often asked for"} className="mt-8">
            <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <T en="Often asked for at the counter" hi="काउंटर पर अक्सर माँगे जाने वाले" />
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {OFTEN_ASKED.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {hi ? l.hi : l.en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6">
            <Link href="/products" className="glass-btn glass-btn-main">
              <T en="Browse all products" hi="सभी प्रोडक्ट देखें" /> <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
