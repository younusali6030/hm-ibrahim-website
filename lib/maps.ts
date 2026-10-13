import { site } from "@/content/site";

/** The shop as Google Maps names it: listing name plus address. One destination for every directions link. */
export const SHOP_DEST_TEXT = `${site.googleListingName}, ${site.fullAddress}`;

/**
 * Google Maps driving directions to the shop, pinned to the shop's listing. With `origin` (typed place or
 * "lat,lng") the route starts there; without it Google asks for a starting point. Always travelmode=driving.
 */
export function shopDirectionsUrl(origin?: string | null): string {
  const q = new URLSearchParams({
    api: "1",
    destination: SHOP_DEST_TEXT,
    destination_place_id: site.googlePlaceId,
    travelmode: "driving",
  });
  if (origin) q.set("origin", origin);
  return `https://www.google.com/maps/dir/?${q.toString()}`;
}
