"use client";

import Image from "next/image";
import { getBrandById } from "@/content/brands";
import type { BrandId } from "@/content/brands";
import type { BrandVariant } from "@/content/products";
import { compareBrands } from "@/components/product/specSheet";
import { T, useLang } from "@/lib/i18n";

type Props = {
  variants: BrandVariant[];
  selectedBrandId: BrandId | null;
  onSelect?: (brandId: BrandId | null) => void;
  className?: string;
  /** Translate a catalog string / a comma list of catalog strings. Identity in English. */
  L?: (s: string) => string;
  Lj?: (s: string) => string;
};

const ASK = "Confirmed at quote";

/** Brand switcher: logos to choose from and one line about the chosen brand. */
export function ProductBrandSelector({ variants, selectedBrandId, onSelect, className = "", L = (s) => s }: Props) {
  const { lang } = useLang();
  const hi = lang === "hi";
  const brands = variants.map((v) => getBrandById(v.brandId)).filter((b): b is NonNullable<typeof b> => !!b);
  if (brands.length === 0) return null;
  // Nothing is chosen until the visitor chooses: the enquiry carries a brand only when one was picked.
  const selected = selectedBrandId ? getBrandById(selectedBrandId) : undefined;

  return (
    <div className={className}>
      <h2 className="font-display text-2xl font-extrabold uppercase leading-none text-foreground">
        <T en={brands.length > 1 ? "Brand" : "Brand and pack"} hi={brands.length > 1 ? "ब्रांड" : "ब्रांड और पैक"} />
      </h2>
      <div role="radiogroup" aria-label={hi ? "ब्रांड" : "Brand"} className={"mt-3 grid gap-2 " + (brands.length === 1 ? "grid-cols-1" : brands.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {brands.map((brand) => {
          const on = selectedBrandId === brand.id;
          return (
            <button
              key={brand.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onSelect?.(on ? null : brand.id)}
              className={
                "flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[6px] border px-2 py-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                (on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-foreground/50")
              }
            >
              <span className="relative h-6 w-16">
                <Image src={brand.logo} alt="" fill sizes="64px" className="object-contain" />
              </span>
              <span className="text-sm font-semibold text-foreground">{L(brand.name)}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {selected ? (
          <>
            <span className="font-semibold text-foreground">{L(selected.name)}.</span> {L(selected.tagline)}.
          </>
        ) : (
          <T
            en="Choose a brand to see its range and carry it into your enquiry. Until then the enquiry names the product only."
            hi="किसी ब्रांड को चुनिए ताकि उसकी रेंज दिखे और वह आपकी पूछताछ में जाए। तब तक पूछताछ में सिर्फ़ उत्पाद का नाम जाएगा।"
          />
        )}
      </p>
    </div>
  );
}

/** Side-by-side of what the catalog says for each brand, on normalised fields. Nothing renders for one brand. */
export function ProductBrandComparison({ variants, selectedBrandId, className = "", L = (s) => s, Lj = (s) => s }: Props) {
  const { lang } = useLang();
  const hi = lang === "hi";
  const brands = variants.map((v) => getBrandById(v.brandId)).filter((b): b is NonNullable<typeof b> => !!b);
  if (brands.length < 2) return null;
  const rows = compareBrands(variants);
  const differing = rows.filter((r) => r.differs);
  const selected = selectedBrandId ? getBrandById(selectedBrandId) : undefined;

  return (
    <div className={`overflow-x-auto ${className}`} tabIndex={0} role="region" aria-label={hi ? "ब्रांड की तुलना" : "Brand comparison"}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="pb-2 text-left font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {differing.length > 0 ? (
            <T
              en={`Side by side: ${differing.length} real difference${differing.length === 1 ? "" : "s"} marked`}
              hi={`आमने-सामने: ${differing.length} असली फ़र्क़ चिह्नित`}
            />
          ) : (
            <T
              en="Side by side: the catalog lists the same spec for each brand. Ask at the counter which is on the shelf."
              hi="आमने-सामने: कैटलॉग में हर ब्रांड का स्पेक एक है। काउंटर पर पूछिए कौन सा माल शेल्फ़ पर है।"
            />
          )}
        </caption>
        <thead>
          <tr className="border-y border-border">
            <th scope="col" className="py-2 pr-3 font-mono-brand text-xs font-normal uppercase tracking-wider text-muted-foreground">
              <span className="sr-only">{hi ? "स्पेक" : "Spec"}</span>
            </th>
            {brands.map((b) => (
              <th
                key={b.id}
                scope="col"
                className={"px-2 py-2 font-display text-lg font-extrabold uppercase " + (b.id === selected?.id ? "text-primary" : "text-foreground")}
              >
                {L(b.name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border align-top">
              <th scope="row" className="py-2 pr-3 font-normal text-muted-foreground">
                {r.differs && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary align-middle" aria-hidden="true" />}
                {hi ? r.hi ?? L(r.label) : r.label}
                {r.differs && <span className="sr-only"> {hi ? "(ब्रांड के बीच अलग)" : "(differs between brands)"}</span>}
              </th>
              {r.values.map((v, i) => (
                <td key={i} className={"px-2 py-2 " + (v ? "text-foreground" : "text-muted-foreground")}>
                  {v ? Lj(v) : hi ? "रेट के समय पक्का" : ASK}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
