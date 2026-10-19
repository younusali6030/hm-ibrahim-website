/**
 * Reads the owner's indicative rate string ("Approx. ₹52–62 per kg (varies by size). Confirm for current price.")
 * into numbers. The same parsed value drives the visible price line on the product page and the AggregateOffer
 * in its Product schema, so the two never disagree. Strings without a ₹ range and a unit return null.
 */

export type RateUnit = "kg" | "metre" | "sq m" | "piece";

export type IndicativeRate = { low: number; high: number; unit: RateUnit };

/** UN/CEFACT codes for UnitPriceSpecification.unitCode. */
export const RATE_UNIT_CODE: Record<RateUnit, string> = { kg: "KGM", metre: "MTR", "sq m": "MTK", piece: "H87" };

export function parseIndicativeRate(rate: string | undefined): IndicativeRate | null {
  if (!rate) return null;
  const unitMatch = rate.match(/\bper\s+(kg|metre|meter|piece|sq\.? ?m)\b/i);
  if (!unitMatch) return null;
  const raw = unitMatch[1].toLowerCase().replace(/[\s.]/g, "");
  const unit: RateUnit | undefined = ({ kg: "kg", metre: "metre", meter: "metre", piece: "piece", sqm: "sq m" } as const)[
    raw as "kg" | "metre" | "meter" | "piece" | "sqm"
  ];
  if (!unit) return null;
  // Every ₹ amount in the string, including ranges ("₹25–80 … / ₹150–350") split on the dash.
  const amounts = [...rate.matchAll(/₹\s?([\d,]+)(?:\s?[–-]\s?([\d,]+))?/g)]
    .flatMap((m) => [m[1], m[2]])
    .filter((n): n is string => !!n)
    .map((n) => Number(n.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!amounts.length) return null;
  return { low: Math.min(...amounts), high: Math.max(...amounts), unit };
}
