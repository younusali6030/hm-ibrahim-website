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
