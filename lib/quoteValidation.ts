/**
 * Quote-form validation, shared by the form (instant feedback on the phone) and the server action (the real check),
 * so the two can never disagree about what a valid number or email is.
 */

/** Accepts 9876543210, +91 98765 43210, 098765 43210, 91-9876543210. Returns the 10 digits or null. */
export function normalizeIndianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function validEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

export type QuoteFieldKey = "name" | "phone" | "email" | "items";

/** Name and phone are required; email is optional but must look like one when given; the list is optional. */
export function validateQuoteFields(v: { name: string; phone: string; email?: string }): Partial<Record<QuoteFieldKey, true>> {
  const bad: Partial<Record<QuoteFieldKey, true>> = {};
  if (v.name.trim().length < 2) bad.name = true;
  if (!normalizeIndianMobile(v.phone)) bad.phone = true;
  if (v.email && v.email.trim() && !validEmail(v.email)) bad.email = true;
  return bad;
}

/** Delivery choices the form offers. The server stores the key; the business email shows the label. */
export const DELIVERY_MODES = ["pickup", "delivery", "flexible"] as const;
export type DeliveryMode = (typeof DELIVERY_MODES)[number];
export function normalizeDeliveryMode(raw: string): DeliveryMode | "" {
  const v = raw.trim().toLowerCase();
  return (DELIVERY_MODES as readonly string[]).includes(v) ? (v as DeliveryMode) : "";
}

export const CUSTOMER_TYPES = ["retail", "wholesale", "contractor", "other"] as const;
export function normalizeCustomerType(raw: string): string {
  const v = raw.trim().toLowerCase();
  return (CUSTOMER_TYPES as readonly string[]).includes(v) ? v : "";
}

/**
 * "Needed by" as YYYY-MM-DD. Accepts today up to one year ahead (the day is compared in India time, so a
 * request sent after midnight there is not rejected for "yesterday"). Anything else is dropped, not an error:
 * the date is a convenience for the counter, never a reason to lose a lead.
 */
export function normalizeNeededBy(raw: string, now = new Date()): string {
  const m = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime()) || d.getUTCMonth() !== Number(m[2]) - 1) return "";
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const today = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate());
  const t = d.getTime();
  return t >= today && t <= today + 366 * 86400000 ? raw.trim() : "";
}

/** One optional photo or specification sheet. Small, and checked by content, not by the name the browser gives it. */
export const ATTACHMENT_MAX_BYTES = 3 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf";

export type AttachmentKind = "jpg" | "png" | "webp" | "pdf";

export function sniffAttachment(head: Uint8Array): AttachmentKind | null {
  const is = (...b: number[]) => b.every((x, i) => head[i] === x);
  if (is(0xff, 0xd8, 0xff)) return "jpg";
  if (is(0x89, 0x50, 0x4e, 0x47)) return "png";
  if (is(0x25, 0x50, 0x44, 0x46)) return "pdf";
  if (is(0x52, 0x49, 0x46, 0x46) && head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50) return "webp";
  return null;
}

export const ATTACHMENT_MIME: Record<AttachmentKind, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};
