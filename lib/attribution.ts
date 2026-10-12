/**
 * First-touch attribution for the quote form: which page the visit started on and how the visitor arrived.
 * Stored in sessionStorage for the visit only. It lets an enquiry be traced to a landing page and a channel
 * (organic search, direct, referral, campaign). No cookie, no identifier, nothing sent anywhere by itself.
 */

const KEY = "hmLanding";

export type Landing = { path: string; source: string };

const ENGINES = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu|startpage|qwant|brave)\./i;

/** Pure: how did this visit arrive? Exported for tests. */
export function classifySource(input: { search: string; referrerHost: string; ownHost: string }): string {
  const q = new URLSearchParams(input.search);
  const src = (q.get("utm_source") ?? "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 40);
  const med = (q.get("utm_medium") ?? "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 40);
  if (src || med) return `utm:${src || "-"}/${med || "-"}`;
  if (q.has("gclid")) return "google-ads";
  const host = input.referrerHost.toLowerCase().replace(/^www\./, "");
  if (!host) return "direct";
  if (host === input.ownHost.toLowerCase().replace(/^www\./, "")) return "internal";
  const engine = host.match(ENGINES);
  if (engine) return `organic:${engine[2].toLowerCase()}`;
  return `referral:${host.slice(0, 60)}`;
}

/** Call on every route change. Only the first call of a visit stores anything. */
export function captureLanding(pathname: string): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    let referrerHost = "";
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {
      /* unparseable referrer: treated as direct */
    }
    const value: Landing = {
      path: pathname.slice(0, 200),
      source: classifySource({ search: window.location.search, referrerHost, ownHost: window.location.hostname }),
    };
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage blocked: the form still works, the enquiry just carries no landing page */
  }
}

export function readLanding(): Landing | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Landing>;
    return typeof v.path === "string" && typeof v.source === "string" ? { path: v.path, source: v.source } : null;
  } catch {
    return null;
  }
}
