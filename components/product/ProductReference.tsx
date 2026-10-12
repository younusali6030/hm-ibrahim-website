import { productReference } from "@/content/productReference";
import type { Lang } from "@/lib/locale";

/**
 * Trade reference for the product family: standards, gauge tables and common constructions. It is not the
 * shop's spec sheet and not a stock list; the note above the table says so. Renders nothing without data.
 */
export function ProductReference({ slug, lang }: { slug: string; lang: Lang }) {
  const ref = productReference[slug];
  if (!ref) return null;
  const hi = lang === "hi";
  return (
    <section className="mt-8" aria-labelledby="trade-ref-heading" data-trade-reference>
      <h2 id="trade-ref-heading" className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">
        {hi ? "ट्रेड रेफ़रेंस" : "Trade reference"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {hi
          ? "इस उत्पाद के परिवार के सामान्य आँकड़े, मानकों और बाज़ार की लिस्टिंग से। यह हमारे स्टॉक की सूची नहीं है: साइज़, पैक और उपलब्धता रेट के साथ पक्की की जाती है।"
          : "General figures for this product family, from standards and trade listings. This is not our stock list: size, pack and availability are confirmed with the rate."}
      </p>
      <dl className="mt-3 border-t border-border">
        {ref.rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-4 border-b border-border py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">{hi ? r.label.hi : r.label.en}</dt>
            <dd className="text-foreground">{hi ? r.value.hi : r.value.en}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
