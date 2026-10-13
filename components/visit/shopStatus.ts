/**
 * Shop hours and the live open/closed state. Mon to Sat 10 am to 8 pm, Sunday closed (see content/site.ts).
 * Always computed in Asia/Kolkata so a visitor's own timezone never matters.
 */
export const OPEN_HOUR = 10;
export const CLOSE_HOUR = 20;

export type ShopState =
  | { kind: "open" }
  | { kind: "before-open" } // a working day, before 10 am: "Opens 10 am"
  | { kind: "after-close"; reopens: "tomorrow" | "monday" } // after 8 pm
  | { kind: "sunday" };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getShopState(now: Date = new Date()): ShopState {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const wd = DAYS.indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
  // Some engines print midnight as 24.
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;

  if (wd === 0) return { kind: "sunday" };
  if (hour < OPEN_HOUR) return { kind: "before-open" };
  if (hour >= CLOSE_HOUR) return { kind: "after-close", reopens: wd === 6 ? "monday" : "tomorrow" };
  return { kind: "open" };
}
