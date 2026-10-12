/** Helpers that turn catalog data into short, truthful labels for ledger rows. Nothing is invented. */

type SpecLike = { label: string; value: string };

/** A short size range for the stencil tag, taken only from specs / sizes in content/products.ts. */
export function sizeTag(p: { specs?: SpecLike[]; sizes?: string[] }): string | null {
  const spec = p.specs?.find((s) => /size|width|thickness|diameter|gauge|mesh|opening|hole/i.test(s.label));
  let v: string | undefined = spec?.value;
  if (!v && p.sizes?.length) {
    const s = p.sizes.filter((x) => !/:|^as per|^heights|^packing/i.test(x));
    if (s.length >= 2) v = `${s[0]} to ${s[s.length - 1]}`;
    else if (s.length === 1) v = s[0];
  }
  if (!v || /various|as per|stock/i.test(v)) return null;
  v = v.split(/\s*\(/)[0].trim();
  return v.length > 30 ? v.slice(0, 28).replace(/[\s,;/]+\S*$/, "") + "…" : v;
}

/** "wiron": a Tata Wiron brand variant exists. "other": Tata-flagged steel lines, on request. */
export function tataFlag(p: { tataOfficial?: boolean; tataAvailable?: boolean; brandVariants?: { brandId: string }[] }): "wiron" | "other" | null {
  if (p.brandVariants?.some((v) => v.brandId === "tata")) return "wiron";
  if (p.tataOfficial || p.tataAvailable) return "other";
  return null;
}
