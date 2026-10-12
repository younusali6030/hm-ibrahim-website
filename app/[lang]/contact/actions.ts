"use server";

import { headers } from "next/headers";
import { getCategoryBySlug } from "@/content/products";
import { getCatalogData, type CatalogData } from "@/lib/catalog";
import { sendCatalogToCustomer } from "@/lib/catalog-email";
import { sendQuoteNotification } from "@/lib/quote-notification";
import { appendQuoteToSheet } from "@/lib/quote-sheet";

export type QuoteResult =
  | {
      success: true;
      reference: string;
      /** True when a catalog email was actually delivered to the customer. */
      catalogSent: boolean;
    }
  | {
      success: false;
      error: string;
      /** Machine-readable reason, so the form can show the message in the visitor's language. */
      code?: "invalid" | "rate_limited" | "not_saved";
      fieldErrors?: Partial<Record<"name" | "phone" | "email" | "items", string>>;
    };

/**
 * Best-effort rate limit: in-memory, per server instance. On serverless hosts each instance has its own
 * memory and instances are recycled, so this slows down a script on one instance but is not a guarantee.
 * Real protection would need a shared store (Upstash, Vercel KV) or the platform firewall. See docs/design/SECURITY-NOTES.md.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) {
    hits.forEach((v, k) => {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    });
  }
  return false;
}

async function clientIp(): Promise<string> {
  try {
    const h = headers();
    const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
    return fwd || h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

const RATE_SEARCH_BUDGET_MS = 4000;
const CUSTOMER_EMAIL_BUDGET_MS = 9000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

/** Accepts 9876543210, +91 98765 43210, 098765 43210, 91-9876543210. Returns 10 digits or null. */
function normalizeIndianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

function makeReference(now = new Date()): string {
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const yy = String(ist.getUTCFullYear()).slice(2);
  const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(ist.getUTCDate()).padStart(2, "0");
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let tail = "";
  for (let i = 0; i < 4; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `HM-${yy}${mm}${dd}-${tail}`;
}

function buildRateSharedWithCustomer(catalog: CatalogData): string {
  if (catalog.tentativeRates.length > 0) {
    return catalog.tentativeRates
      .map(
        (r) =>
          [r.supplier && `Source: ${r.supplier}`, r.rate && `Rate: ${r.rate}`, r.note && `Note: ${r.note}`]
            .filter(Boolean)
            .join(" | ")
      )
      .join("\n");
  }
  if (catalog.indicativeRateRange?.trim()) return catalog.indicativeRateRange.trim();
  return "No specific rate in catalog (generic message shown).";
}

/**
 * Submit a quote request.
 *
 * Order matters. The lead is saved first (business email + Google Sheet when configured),
 * and the customer sees success as soon as at least one of those channels worked.
 * The customer's catalog email is best effort and can never lose or block the lead.
 */
export async function submitQuote(formData: FormData): Promise<QuoteResult> {
  if (formData.get("website")?.toString()) {
    return { success: true, reference: makeReference(), catalogSent: false };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const phoneRaw = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const itemsRaw = formData.get("items")?.toString().trim() ?? "";
  const productSlug = formData.get("product")?.toString().trim() || null;
  const customerType = formData.get("customerType")?.toString().trim() || "";
  const categorySlug = formData.get("category")?.toString().trim() || "";
  const quantity = formData.get("quantity")?.toString().trim() || "";
  const delivery = formData.get("delivery")?.toString().trim() || "";
  const additionalNotes = formData.get("notes")?.toString().trim() || "";

  // Name and phone are what we need. The list is welcome but optional: a bare call-back request is a real lead.
  const items = itemsRaw.length >= 3 ? itemsRaw : "Call back requested (no list given)";

  const fieldErrors: Partial<Record<"name" | "phone" | "email" | "items", string>> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  const phone = normalizeIndianMobile(phoneRaw);
  if (!phone) fieldErrors.phone = "Enter a 10-digit mobile number, like 98260 53563.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fieldErrors.email = "That email looks incomplete.";
  if (Object.keys(fieldErrors).length > 0 || !phone) {
    return { success: false, error: "Please check the highlighted fields.", code: "invalid", fieldErrors };
  }

  // Per IP and per phone, only for requests that would otherwise be processed.
  const ip = await clientIp();
  if (rateLimited(`ip:${ip}`) || rateLimited(`phone:${phone}`)) {
    console.warn("[quote] rate limited");
    return {
      success: false,
      code: "rate_limited",
      error: "Too many requests from this connection. Please call or WhatsApp us, or try again in a few minutes.",
    };
  }

  const category = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const productCategory = category?.name ?? categorySlug;
  const reference = makeReference();

  const submission = {
    name,
    phone,
    email,
    customerType,
    productCategory,
    items,
    quantity,
    delivery,
    additionalNotes,
    reference,
  };

  // 1) Rates for the customer's catalog (capped, so a slow search never stalls the lead).
  const catalog = await withTimeout(
    getCatalogData(productSlug, items),
    RATE_SEARCH_BUDGET_MS,
    null as CatalogData | null
  ).then((c) => c ?? getCatalogData(productSlug, items, { skipRates: true }));

  // 2) Save the lead on every configured channel at once.
  const [notifyRes, sheetRes] = await Promise.allSettled([
    sendQuoteNotification(submission, buildRateSharedWithCustomer(catalog)),
    appendQuoteToSheet(submission),
  ]);
  const notified = notifyRes.status === "fulfilled" && notifyRes.value.success;
  const sheeted = sheetRes.status === "fulfilled" && sheetRes.value.success;
  if (!notified) console.error("[quote] business notification failed", reference, notifyRes);
  if (!sheeted) console.error("[quote] sheet append failed", reference, sheetRes);

  const nothingConfigured =
    notifyRes.status === "fulfilled" && !notifyRes.value.success && notifyRes.value.skipped === true &&
    sheetRes.status === "fulfilled" && !sheetRes.value.success && sheetRes.value.notConfigured === true;
  if (!notified && !sheeted && nothingConfigured && process.env.NODE_ENV !== "production") {
    // Local development with no email or sheet configured: nothing is sent, the flow can still be tested.
    console.warn("[quote] (dev) no email or sheet configured, lead not stored:", reference);
    return { success: true, reference, catalogSent: false };
  }

  if (!notified && !sheeted) {
    console.error("[quote] LEAD NOT SAVED", JSON.stringify(submission));
    return {
      success: false,
      code: "not_saved",
      error: "We could not register your request just now. Please call us or send it on WhatsApp, it takes a minute.",
    };
  }

  // 3) Catalog to the customer: optional, best effort.
  let catalogSent = false;
  if (email) {
    const sent = await withTimeout(
      sendCatalogToCustomer(email, catalog).then((r) => r.success),
      CUSTOMER_EMAIL_BUDGET_MS,
      false
    );
    catalogSent = sent;
    if (!sent) console.error("[quote] customer catalog not delivered", reference);
  }

  return { success: true, reference, catalogSent };
}
