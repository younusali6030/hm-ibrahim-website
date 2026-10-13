/**
 * Analytics consent. Google Analytics starts in Consent Mode with analytics storage denied (no analytics cookies;
 * only cookieless pings). The visitor's choice is kept in localStorage under CONSENT_KEY and applied to gtag.
 */
export const CONSENT_KEY = "hm-consent";
export const CONSENT_EVENT = "hm-consent-change";
export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* private mode: the choice still applies for this page view */
  }
  if (typeof window !== "undefined") {
    window.gtag?.("consent", "update", { analytics_storage: choice });
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }
}
