import Link from "@/components/LocaleLink";
import type { Category } from "@/content/products";
import { categoryGuides, deliveryFacts, quoteUnit } from "@/content/categoryGuides";
import { GaugeRule } from "@/components/motif/Motif";
import type { Lang } from "@/lib/locale";

type Guide = { slug: string; title: string; lang?: Lang };

type Props = {
  /** English record: spec and use-case strings are read from it. */
  categoryEn: Category;
  /** Localised record: names shown to the visitor. */
  category: Category;
  lang: Lang;
  guides: Guide[];
};

/**
 * What a buyer needs to decide, in the order they need it: the choice, a comparison drawn from the catalogue
 * data, what to send with the enquiry, how it reaches them, and the guides that go deeper.
 * Everything is data or reviewed copy; no price, stock level or delivery date is promised.
 */
export function CategoryGuide({ categoryEn, category, lang, guides }: Props) {
  const hi = lang === "hi";
  const g = categoryGuides[category.slug];
  if (!g) return null;
  const pick = (b: { en: string; hi: string }) => (hi ? b.hi : b.en);

  const rows = category.products.map((p, i) => {
    const en = categoryEn.products[i];
    return {
      slug: p.slug,
      name: p.name,
      material: p.materials?.slice(0, 3).join(", ") ?? "",
      types: p.variants?.slice(0, 3).join(", ") ?? "",
      unit: quoteUnit(en?.indicativeRate, hi),
      use: p.useCases?.slice(0, 2).join(", ") ?? "",
    };
  });
  const showMaterial = rows.some((r) => r.material);
  const showTypes = rows.some((r) => r.types);
  const showUnit = rows.some((r) => r.unit);
  const showUse = rows.some((r) => r.use);
  const th = "px-3 py-2 text-left font-mono-brand text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground";
  const td = "px-3 py-3 align-top text-sm text-foreground/90";

  return (
    <section className="border-t border-border py-10 md:py-14" aria-labelledby="choose-heading">
      <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <GaugeRule tone="primary" label={hi ? "चुनाव" : "Choosing"} />
          <h2 id="choose-heading" className="mt-2 text-foreground">
            {hi ? `${category.name}: कैसे चुनें` : `How to choose: ${category.name}`}
          </h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">{pick(g.decision)}</p>

          {rows.length > 1 && (showMaterial || showTypes || showUnit || showUse) && (
            <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label={hi ? "तुलना तालिका" : "Comparison table"}>
              <table className="w-full min-w-[34rem] border-collapse border-t border-border">
                <caption className="sr-only">{hi ? `${category.name} की तुलना` : `${category.name} compared`}</caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className={th}>{hi ? "उत्पाद" : "Product"}</th>
                    {showMaterial && <th scope="col" className={th}>{hi ? "मटेरियल" : "Material"}</th>}
                    {showTypes && <th scope="col" className={th}>{hi ? "किस्में" : "Types"}</th>}
                    {showUnit && <th scope="col" className={th}>{hi ? "आम तौर पर भाव प्रति" : "Usually quoted per"}</th>}
                    {showUse && <th scope="col" className={th}>{hi ? "किस काम में" : "Used for"}</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.slug} className="border-b border-border">
                      <th scope="row" className={`${td} font-semibold`}>
                        <Link href={`/products/${r.slug}`} className="underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                          {r.name}
                        </Link>
                      </th>
                      {showMaterial && <td className={td}>{r.material || "–"}</td>}
                      {showTypes && <td className={td}>{r.types || "–"}</td>}
                      {showUnit && <td className={td}>{r.unit ?? "–"}</td>}
                      {showUse && <td className={td}>{r.use || "–"}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-8">
          <div>
            <h3 className="font-display text-xl font-extrabold uppercase leading-none text-foreground">
              {hi ? "रेट पूछते समय बताइए" : "Send with your enquiry"}
            </h3>
            <ol className="mt-3 border-t border-border">
              {g.send.map((s, i) => (
                <li key={i} className="flex gap-3 border-b border-border py-2.5 text-sm text-foreground/90">
                  <span className="font-mono-brand text-xs text-muted-foreground" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span>{pick(s)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-xl font-extrabold uppercase leading-none text-foreground">
              {hi ? "पिकअप और डिलीवरी" : "Pickup and delivery"}
            </h3>
            <ul className="mt-3 space-y-2 border-t border-border pt-3 text-sm leading-relaxed text-foreground/90">
              <li>{pick(deliveryFacts.pickup)}</li>
              <li>{pick(deliveryFacts.nearby)}</li>
              <li>{pick(deliveryFacts.india)}</li>
            </ul>
          </div>

          {guides.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-extrabold uppercase leading-none text-foreground">
                {hi ? "गाइड पढ़ें" : "Read before you buy"}
              </h3>
              <ul className="mt-3 border-t border-border">
                {guides.map((p) => (
                  <li key={p.slug} className="border-b border-border">
                    <Link
                      href={`/blog/${p.slug}`}
                      lang={p.lang && p.lang !== lang ? p.lang : undefined}
                      className="flex min-h-[44px] items-center py-2 text-sm text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
