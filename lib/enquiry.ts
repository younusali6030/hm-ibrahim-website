import type { SheetKind } from "../components/product/specSheet";

/**
 * One description of "what the visitor is asking about", used by every quote and WhatsApp link so the
 * product page, the sticky bar and the contact form never disagree. Only values the visitor actually chose
 * are filled; everything else is left blank for them to fill in, never pre-selected from a list of sizes.
 */
export type EnquiryContext = {
  productSlug: string;
  productName: string;
  categorySlug: string;
  brandId?: string | null;
  brandName?: string | null;
  /** Field labels to leave blank in the message (from enquiryFields). Defaults to Size and Quantity. */
  fields?: string[];
  /** Spec choices the visitor explicitly made, keyed by field label (none exist yet; the form is open text). */
  selected?: Record<string, string>;
};

/** Fields the customer is asked to supply, by kind of item (see sheetKind). Blank unless chosen. */
export function enquiryFields(kind: SheetKind): string[] {
  switch (kind) {
    case "mesh":
      return ["Required opening", "Wire diameter", "Height", "Quantity"];
    case "wire":
    case "rope":
      return ["Gauge / diameter", "Pack", "Quantity"];
    case "sheet":
      return ["Thickness", "Hole size", "Sheet size", "Quantity"];
    default:
      return ["Size", "Quantity"];
  }
}

export function enquiryText(c: EnquiryContext): string {
  const parts = [`Product: ${c.productName}`];
  if (c.brandName) parts.push(`Brand: ${c.brandName}`);
  for (const f of c.fields ?? ["Size", "Quantity"]) parts.push(`${f}: ${c.selected?.[f] ?? ""}`);
  return parts.join("; ");
}

export function enquiryTextHi(c: EnquiryContext): string {
  const parts = [`उत्पाद: ${c.productName}`];
  if (c.brandName) parts.push(`ब्रांड: ${c.brandName}`);
  parts.push("साइज़: ", "मात्रा: ");
  return parts.join("; ");
}

/** /contact link carrying the product, category and the brand the visitor picked (nothing else). */
export function quoteHrefFor(c: Pick<EnquiryContext, "productSlug" | "categorySlug" | "brandId">): string {
  const q = new URLSearchParams({ product: c.productSlug, category: c.categorySlug });
  if (c.brandId) q.set("brand", c.brandId);
  return `/contact?${q.toString()}`;
}
