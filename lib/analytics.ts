/**
 * Google Analytics 4 helpers. Set NEXT_PUBLIC_GA_ID in env to enable.
 * Reports: page views, product views, quote/contact submissions, call/WhatsApp clicks.
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export function isAnalyticsEnabled(): boolean {
  return typeof window !== "undefined" && typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_GA_ID;
}

function getGaId(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env.NEXT_PUBLIC_GA_ID;
}

/**
 * Same-name events inside this window are one click. A component's own onClick and the site-wide
 * ClickTracker both see a click on a tel: or WhatsApp link; only the first one is counted.
 */
const DEDUPE_MS = 600;
const lastFired: Record<string, number> = {};

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  const id = getGaId();
  if (typeof window !== "undefined" && window.gtag && id) {
    const now = Date.now();
    if (lastFired[name] && now - lastFired[name] < DEDUPE_MS) return;
    lastFired[name] = now;
    window.gtag("event", name, params);
  }
}

export function trackPageView(path: string, title?: string) {
  const id = getGaId();
  if (typeof window !== "undefined" && window.gtag && id) {
    window.gtag("event", "page_view", { page_path: path, page_title: title });
  }
}

/** When user views a product page */
export function trackProductView(productSlug: string, productName: string, categoryName?: string) {
  trackEvent("view_item", {
    item_id: productSlug,
    item_name: productName,
    ...(categoryName && { item_category: categoryName }),
  });
}

/** When user submits a quote request that includes a list of items */
export function trackQuoteRequest(source = "quote_form") {
  trackEvent("quote_request", { method: "website", source });
}

/** When user submits the form with just a name and number (a call-back request, no list) */
export function trackContactSubmit(source = "quote_form") {
  trackEvent("contact_submit", { method: "website", source });
}

/** When user clicks Call */
export function trackCallClick(source: string) {
  trackEvent("click_call", { source });
}

/** When user clicks WhatsApp */
export function trackWhatsAppClick(source: string) {
  trackEvent("click_whatsapp", { source });
}

/** When user opens the shop location in Google Maps */
export function trackDirectionsClick(source: string) {
  trackEvent("click_directions", { source });
}
