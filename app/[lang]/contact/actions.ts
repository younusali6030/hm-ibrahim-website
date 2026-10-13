"use server";

import { headers } from "next/headers";
import { getCategoryBySlug } from "@/content/products";
import { getCatalogData, type CatalogData } from "@/lib/catalog";
import { sendCatalogToCustomer } from "@/lib/catalog-email";
import { rateLimited } from "@/lib/rateLimit";
import { sendQuoteNotification } from "@/lib/quote-notification";
import { appendQuoteToSheet } from "@/lib/quote-sheet";
import {
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MIME,
  normalizeCustomerType,
  normalizeDeliveryMode,
  normalizeIndianMobile,
  normalizeNeededBy,
  sniffAttachment,
  validEmail,
} from "@/lib/quoteValidation";

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
 * Rate limit: 5 requests per 10 minutes, per IP and per phone number. Shared across instances when a Redis REST
 * store is configured (lib/rateLimit.ts), otherwise per-instance memory. See docs/design/SECURITY-NOTES.md.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

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
  const customerType = normalizeCustomerType(formData.get("customerType")?.toString() ?? "");
  const categorySlug = formData.get("category")?.toString().trim() || "";
  const quantity = (formData.get("quantity")?.toString().trim() || "").slice(0, 120);
  const delivery = normalizeDeliveryMode(formData.get("delivery")?.toString() ?? "");
  const deliveryLocation = (formData.get("deliveryLocation")?.toString().trim() || "").replace(/[\u0000-\u001f]/g, " ").slice(0, 160);
  const neededBy = normalizeNeededBy(formData.get("neededBy")?.toString() ?? "");
  const additionalNotes = (formData.get("notes")?.toString().trim() || "").slice(0, 1000);
  // Attribution is for reporting only: short, printable, never trusted for anything else.
  const clean = (k: string, max: number) =>
    (formData.get(k)?.toString().trim() || "").replace(/[^\x20-\x7e]/g, "").slice(0, max);
  const landingPage = clean("landing", 200);
  const trafficSource = clean("source", 120);

  // Name and phone are what we need. The list is welcome but optional: a bare call-back request is a real lead.
  const items = itemsRaw.length >= 3 ? itemsRaw : "Call back requested (no list given)";

  const fieldErrors: Partial<Record<"name" | "phone" | "email" | "items", string>> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  const phone = normalizeIndianMobile(phoneRaw);
  if (!phone) fieldErrors.phone = "Enter a 10-digit mobile number, like 98260 53563.";
  if (email && !validEmail(email)) fieldErrors.email = "That email looks incomplete.";
  if (Object.keys(fieldErrors).length > 0 || !phone) {
    return { success: false, error: "Please check the highlighted fields.", code: "invalid", fieldErrors };
  }

  // Per IP and per phone, only for requests that would otherwise be processed.
  const ip = await clientIp();
  if ((await rateLimited(`ip:${ip}`, RATE_MAX, RATE_WINDOW_MS)) || (await rateLimited(`phone:${phone}`, RATE_MAX, RATE_WINDOW_MS))) {
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

  // One optional file. A bad file never costs the lead: it is dropped and the request goes through without it.
  let attachment: { filename: string; contentType: string; content: Buffer } | null = null;
  const file = formData.get("attachment");
  if (file && typeof file !== "string" && file.size > 0 && file.size <= ATTACHMENT_MAX_BYTES) {
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const kind = sniffAttachment(bytes.subarray(0, 16));
      if (kind) {
        attachment = {
          filename: `enquiry-${Date.now().toString(36)}.${kind}`,
          contentType: ATTACHMENT_MIME[kind],
          content: bytes,
        };
      }
    } catch {
      attachment = null;
    }
  }

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
    deliveryLocation,
    neededBy,
    productSlug: (productSlug ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 80),
    landingPage,
    trafficSource,
    attachment,
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
