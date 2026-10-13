/**
 * The products shown in the Products hero showroom, with the catalogue category each one belongs to. Kept free of
 * three.js so the server page can read it without pulling the renderer into its bundle.
 */
export const SHOWROOM_ITEMS = [
  { slug: "tmt-bars", category: "structural-items" },
  { slug: "bright-bars", category: "structural-items" },
  { slug: "ms-angles", category: "structural-items" },
  { slug: "gi-pipes", category: "structural-items" },
  { slug: "ms-flats", category: "structural-items" },
  { slug: "ms-round-bars", category: "structural-items" },
  { slug: "chain-link-fencing", category: "fencing-material" },
  { slug: "barbed-wire", category: "fencing-material" },
  { slug: "expanded-metal-mesh", category: "wiremesh" },
  { slug: "gi-wiremesh", category: "wiremesh" },
  { slug: "gi-weldmesh", category: "welded-mesh" },
  { slug: "gi-perforated-sheet", category: "perforated-sheets" },
  { slug: "gi-wire", category: "wires" },
  { slug: "gi-wire-rope", category: "wires" },
  { slug: "binding-wire", category: "wires" },
  { slug: "concertina-wire", category: "wires" },
] as const;

export type ShowroomSlug = (typeof SHOWROOM_ITEMS)[number]["slug"];
export type LabelPoint = { slug: string; x: number; y: number } | null;
