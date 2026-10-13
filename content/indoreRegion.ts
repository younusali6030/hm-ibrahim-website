/**
 * Places on the Indore regional map. Coordinates are the city-centre points published on each town's Wikipedia
 * infobox (read October 2026); the shop is the Google Business Profile pin from content/site.ts.
 * Relative positions on the map come from projecting these with Web Mercator, so they are true to the ground;
 * the connection lines are schematic enquiry links, not roads, routes or delivery coverage.
 */
export type RegionPlace = {
  id: string;
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
  /** Approximate built-up radius in km, for the muted area shape. Illustrative, not a boundary. */
  km: number;
  /** Where the label sits relative to its dot. */
  side: "left" | "right";
};

export const INDORE_CENTRE = { lat: 22.7186, lon: 75.855 };

export const regionPlaces: RegionPlace[] = [
  { id: "dewas", name: "Dewas", nameHi: "देवास", lat: 22.96, lon: 76.06, km: 5, side: "right" },
  { id: "ujjain", name: "Ujjain", nameHi: "उज्जैन", lat: 23.17, lon: 75.79, km: 6, side: "right" },
  { id: "mhow", name: "Mhow", nameHi: "महू", lat: 22.55, lon: 75.76, km: 3.5, side: "right" },
  { id: "pithampur", name: "Pithampur", nameHi: "पीथमपुर", lat: 22.6197, lon: 75.6933, km: 4, side: "right" },
];
