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

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  const id = getGaId();
  if (typeof window !== "undefined" && window.gtag && id) {
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

/** When user submits a quote request */
export function trackQuoteRequest() {
  trackEvent("quote_request", { method: "website" });
}

/** When user submits the contact form */
export function trackContactSubmit() {
  trackEvent("contact_submit", { method: "website" });
}

/** When user clicks Call */
export function trackCallClick(source: string) {
  trackEvent("click_call", { source });
}

/** When user clicks WhatsApp */
export function trackWhatsAppClick(source: string) {
  trackEvent("click_whatsapp", { source });
}
