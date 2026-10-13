import type { BrandVariant, Product } from "@/content/products";

/** Spec-sheet rows built ONLY from content/products.ts. A core row the data does not fill is null (the page lists it once, as something confirmed with the rate); rows that do not apply to the kind of item are never offered. */

export type SheetRow = { key: string; label: string; hi: string; value: string | null };

/** What kind of item this is decides which fields make sense. */
export type SheetKind = "wire" | "rope" | "mesh" | "net" | "sheet" | "tool" | "nails" | "section";

type Def = { key: string; label: string; hi: string; match: RegExp; /** Listed under "confirmed when you ask for the rate" when the data has no value. Non-core rows are left out instead. */ core?: boolean; /** Products for which a non-core row is core (sold by the roll, so its length matters). */ coreFor?: string[] };

const SINGLE_WIRE = ["binding-wire", "gi-wire", "jhatka-machine-fencing-wire", "clutch-wire", "barbed-wire", "concertina-wire"];
const MESH_SLUGS = ["chain-link-fencing", "chicken-net", "plastic-hexagonal-poultry-mesh", "square-mesh", "expanded-metal-mesh"];
const NET_SLUGS = ["pigeon-nets", "safety-net", "fiber-mesh", "pigeon-spikes"];
/** Extruded plastic mesh has no wire, so it is never asked for a gauge. */
const NO_WIRE = ["plastic-hexagonal-poultry-mesh", "square-mesh"];
/** Expanded metal is slit from sheet: it has a strand thickness, not a wire gauge. */
const STRAND = "expanded-metal-mesh";

/** Fittings and accessories: sold by piece, no length or roll. */
const PIECE_ITEMS = ["wire-rope-clamp", "ms-holepass", "concrete-cover-block"];

export function sheetKind(p: { slug: string; categorySlug: string }): SheetKind {
  if (PIECE_ITEMS.includes(p.slug)) return "tool";
  if (p.categorySlug === "perforated-sheets") return "sheet";
  if (p.categorySlug === "construction-tools") return "tool";
  if (p.categorySlug === "nails") return "nails";
  if (/wire-rope$/.test(p.slug)) return "rope";
  if (SINGLE_WIRE.includes(p.slug)) return "wire";
  if (NET_SLUGS.includes(p.slug)) return "net";
  if (MESH_SLUGS.includes(p.slug) || ["wiremesh", "welded-mesh"].includes(p.categorySlug)) return "mesh";
  return "section";
}

const GAUGE = /gauge|swg|wire (size|diameter)|diameter|thickness|wire$/i;
const PACK = /roll|coil|packing|supplied|form|spool|length|height|width/i;
/** Meshes: height is across the roll, length is along it, and neither is the pack or the weight. */
const ROLL_HEIGHT = /height/i;
const ROLL_LENGTH = /(roll|coil)?\s*length/i;
const MESH_PACK = /packing|supplied|weight|per roll|coil|spool|form|width/i;
const FINISH = /finish|coating|galvan/i;

/**
 * Rows per kind. A single wire (binding wire, GI wire, barbed wire) has a gauge and a pack, never a mesh or hole
 * size; a mesh has all three. Rows that do not apply to a kind are not offered at all.
 */
const DEFS: Record<SheetKind, Def[]> = {
  wire: [
    { key: "gauge", label: "Gauge", hi: "गेज", match: GAUGE, core: true },
    { key: "pack", label: "Pack / coil", hi: "पैक / कॉइल", match: PACK, core: true },
  ],
  rope: [
    { key: "dia", label: "Diameter", hi: "व्यास", match: /diameter|size|thickness/i, core: true },
    { key: "construction", label: "Construction", hi: "बनावट", match: /construction|strand|core|type/i },
    { key: "pack", label: "Length / pack", hi: "लंबाई / पैक", match: PACK, core: true },
  ],
  mesh: [
    { key: "gauge", label: "Gauge / wire size", hi: "गेज / तार साइज़", match: GAUGE, core: true },
    { key: "mesh", label: "Mesh / hole size", hi: "जाली / छेद का साइज़", match: /mesh|hole|opening|pattern|aperture/i, core: true },
    { key: "height", label: "Roll height", hi: "रोल की ऊँचाई", match: ROLL_HEIGHT },
    {
      key: "length",
      label: "Roll length",
      hi: "रोल की लंबाई",
      match: ROLL_LENGTH,
      coreFor: ["chain-link-fencing", "chicken-net", "plastic-hexagonal-poultry-mesh", "square-mesh", "pvc-coated-weldmesh"],
    },
    /** Roll width is its own row so it is not read as the pack. */
    { key: "width", label: "Roll width", hi: "रोल की चौड़ाई", match: /roll width|^width$/i },
    { key: "pack", label: "Pack / roll", hi: "पैक / रोल", match: MESH_PACK, core: true },
  ],
  net: [
    { key: "mesh", label: "Mesh / hole size", hi: "जाली / छेद का साइज़", match: /mesh|hole|opening|pattern|aperture/i },
    { key: "size", label: "Size", hi: "साइज़", match: /size|width|length|dimension|supplied|packing/i, core: true },
  ],
  /** Punched sheet is sold by thickness and sheet size, not by wire gauge or roll length. */
  sheet: [
    { key: "thickness", label: "Thickness", hi: "मोटाई", match: /thickness|gauge/i, core: true },
    { key: "hole", label: "Hole shape / size", hi: "छेद का आकार / साइज़", match: /hole|pattern|aperture|opening/i, core: true },
    { key: "sheet", label: "Sheet size", hi: "शीट साइज़", match: /sheet size|size|length|width|dimension|supplied/i, core: true },
  ],
  /** Hand tools: brand, head or blade size, and what comes fitted. */
  tool: [
    { key: "brand", label: "Brand", hi: "ब्रांड", match: /^brand$/i },
    { key: "overall", label: "Overall length", hi: "कुल लंबाई", match: /overall length/i },
    { key: "size", label: "Size / weight", hi: "साइज़ / वज़न", match: /size|weight|length/i },
    { key: "handle", label: "Handle", hi: "दस्ता", match: /handle/i },
  ],
  nails: [
    { key: "size", label: "Length", hi: "लंबाई", match: /length|size/i, core: true },
    { key: "pack", label: "Pack", hi: "पैक", match: /packing|pack|weight|sold/i },
  ],
  section: [
    { key: "size", label: "Size", hi: "साइज़", match: /size|width|diameter|dimension|\bnb\b/i, core: true },
    // Solid bars and beams have no wall thickness: shown only where the data gives one.
    { key: "thickness", label: "Thickness / gauge", hi: "मोटाई", match: /thickness|gauge|wall/i },
    { key: "length", label: "Length", hi: "लंबाई", match: /length|roll|packing|supplied/i, core: true },
  ],
};

/** Material is a core row for everything except hand tools and nets, where it is only shown when known. */
const MATERIAL_CORE: Record<SheetKind, boolean> = { wire: true, rope: true, mesh: true, net: false, sheet: true, tool: false, nails: false, section: true };
/** Finish is only ever shown when the data holds a value. */
const SHOW_FINISH = true;

export function isSheetKind(categorySlug?: string | null): boolean {
  return categorySlug === "perforated-sheets";
}

export function isToolKind(categorySlug?: string | null): boolean {
  return categorySlug === "construction-tools";
}

export function isWireKind(categorySlug?: string | null): boolean {
  return !!categorySlug && ["wiremesh", "welded-mesh", "wires", "fencing-material", "nails", "safety-nets-equipments"].includes(categorySlug);
}

/** Only categories and items where the counter really cuts to the customer's size. */
export function isCutToSize(p: { slug: string; categorySlug: string }): boolean {
  if (["wiremesh", "welded-mesh", "perforated-sheets"].includes(p.categorySlug)) return true;
  return /wire-rope|pipe/.test(p.slug) && !/clamp/.test(p.slug);
}

type Source = Pick<Product, "specs" | "sizes" | "materials" | "variants" | "useCases" | "notes">;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, " ").trim();

export function buildSheet(
  src: Source,
  product: { slug: string; categorySlug: string },
  tataLine: string | null,
): { rows: SheetRow[]; extras: SheetRow[]; kind: SheetKind } {
  const kind = sheetKind(product);
  const specs = [...(src.specs ?? [])];
  const used = new Set<number>();
  const take = (re: RegExp) => {
    const i = specs.findIndex((s, idx) => !used.has(idx) && re.test(s.label));
    if (i === -1) return null;
    used.add(i);
    return specs[i].value;
  };

  const rows: SheetRow[] = [];
  for (const def of DEFS[kind]) {
    if (def.key === "gauge" && NO_WIRE.includes(product.slug)) continue;
    const d = def.key === "gauge" && product.slug === STRAND ? { ...def, label: "Strand thickness", hi: "पत्ती की मोटाई", match: /strand|thickness/i } : def;
    const value = take(d.match);
    const core = d.core || d.coreFor?.includes(product.slug);
    if (value === null && !core) continue;
    rows.push({ key: d.key, label: d.label, hi: d.hi, value });
  }

  const materialSpec = take(/material|grade/i);
  const materials = src.materials?.length ? src.materials.join(", ") : materialSpec;
  if (materials || MATERIAL_CORE[kind]) rows.push({ key: "material", label: "Material", hi: "मटेरियल", value: materials });
  const finish = take(FINISH);
  if (SHOW_FINISH && finish) rows.push({ key: "finish", label: "Finish", hi: "फिनिश", value: finish });

  // Availability only where the product copy itself says so.
  if (src.notes && /availability depends on stock/i.test(src.notes)) {
    rows.push({ key: "availability", label: "Availability", hi: "उपलब्धता", value: "Depends on stock. Confirm at the counter." });
  }

  const shown = rows.map((r) => (r.value ? norm(r.value) : "")).filter(Boolean);
  const alreadyShown = (v: string) => {
    const n = norm(v);
    return !n || shown.some((s) => s === n || (n.length >= 12 && s.includes(n)));
  };

  const extras: SheetRow[] = [];
  specs.forEach((s, idx) => {
    if (used.has(idx)) return;
    // "Use" repeats the Common uses list; a value already in a row above is not listed twice.
    if (/^uses?$/i.test(s.label) && src.useCases?.length) return;
    // A "Types" spec and the Types list below say the same thing; keep the fuller list.
    if (/^types?$/i.test(s.label) && src.variants?.length) return;
    if (alreadyShown(s.value)) return;
    extras.push({ key: `x-${idx}`, label: s.label, hi: s.label, value: s.value });
  });

  // Sizes: "Packing: ..." entries are pack lines (already a row); gauges are already in the gauge row.
  const gaugeShown = rows.some((r) => r.key === "gauge" && r.value);
  const sizes = (src.sizes ?? []).filter((x) => !/^packing:/i.test(x) && !alreadyShown(x));
  const allGauges = sizes.length > 0 && sizes.every((x) => /\b(swg|bwg)\b|gauge/i.test(x));
  const joined = norm(sizes.join(", "));
  const everything = [...shown, ...extras.map((e) => norm(e.value ?? ""))];
  const sizesRepeat = everything.some((v) => v === joined || (joined.length >= 12 && (v.includes(joined) || joined.includes(v))));
  if (sizes.length && !sizesRepeat && !(gaugeShown && allGauges)) extras.push({ key: "sizes", label: "Sizes", hi: "साइज़", value: sizes.join(", ") });
  if (src.variants?.length) {
    const v = src.variants.filter((x) => !alreadyShown(x));
    if (v.length) extras.push({ key: "variants", label: "Types", hi: "किस्में", value: v.join(", ") });
  }
  if (tataLine) extras.push({ key: "tata", label: "Tata", hi: "टाटा", value: tataLine });
  // Nothing on file: say so once instead of rendering an empty table.
  if (rows.length === 0 && extras.length === 0) rows.push({ key: "details", label: "Size and details", hi: "साइज़ और जानकारी", value: null });
  return { rows, extras, kind };
}

/**
 * Rows with no value on file are not shown as rows of placeholder text. They are listed once,
 * as what the customer should confirm when asking for the rate.
 */
export function splitSheetRows(rows: SheetRow[]): { known: SheetRow[]; unknown: SheetRow[] } {
  const known = rows.filter((r) => r.value !== null || r.key === "availability");
  const unknown = rows.filter((r) => r.value === null && r.key !== "availability" && r.key !== "details");
  return { known, unknown };
}

/** A trailing "Packing: ..." sentence repeats the pack row above; drop it from the free-text note. */
export function trimRepeatedPacking(note: string, packRowShown: boolean): string {
  if (!packRowShown) return note;
  return note.replace(/\s*(?:Packing|पैकिंग):[^.।]*[.।]\s*$/, "").trim();
}

export type CompareRow = { label: string; hi?: string; values: (string | null)[]; differs: boolean; /** Informational rows (uses) are shown but never counted as a difference. */ informational?: boolean };

/**
 * Common comparison fields. Labels from different brands ("Roll height" / "Height", "Roll length" / "Bundle
 * length") map to one field so comparable values land on one row and are not reported as missing.
 * Order here is the order of the rows.
 */
const CANON: { field: string; label: string; hi: string; match: RegExp }[] = [
  { field: "opening", label: "Opening", hi: "छेद / जाली का साइज़", match: /opening|aperture|mesh size|hole/i },
  { field: "wireDiameter", label: "Wire size", hi: "तार का साइज़", match: /wire (size|diameter)|^diameter|^gauge$|common gauges?|^gauge\b/i },
  { field: "height", label: "Height", hi: "ऊँचाई", match: /height/i },
  { field: "length", label: "Length", hi: "लंबाई", match: /(roll|bundle|coil)?\s*length/i },
  { field: "finish", label: "Finish", hi: "फिनिश", match: /^finish$|coating|galvan/i },
  { field: "type", label: "Type", hi: "किस्म", match: /^type$/i },
  { field: "packWeight", label: "Pack weight", hi: "पैक का वज़न", match: /^coils?$|weight/i },
  { field: "packType", label: "Pack type", hi: "पैक का प्रकार", match: /^pack(ing)?$|farming wire pack/i },
  { field: "soldBy", label: "Sold by", hi: "बिक्री", match: /sold by/i },
];

const flat = (v: string) => v.toLowerCase().replace(/[^a-z0-9.\u0900-\u097f]+/g, " ").trim();

/** Side-by-side of brand variants: every row is a value the data holds for at least one brand. */
export function compareBrands(variants: BrandVariant[]): CompareRow[] {
  const byField = new Map<string, CompareRow>();
  const other = new Map<string, CompareRow>();
  const place = (label: string, vi: number, value: string) => {
    const c = CANON.find((x) => x.match.test(label));
    const store = c ? byField : other;
    const key = c ? c.field : label;
    let row = store.get(key);
    if (!row) {
      row = { label: c ? c.label : label, hi: c?.hi, values: variants.map(() => null), differs: false };
      store.set(key, row);
    }
    // Two source labels for one field in one brand (e.g. "Pack" and "Packing"): keep both values, once each.
    const prev = row.values[vi];
    row.values[vi] = prev && !flat(prev).includes(flat(value)) ? `${prev}; ${value}` : prev ?? value;
  };
  variants.forEach((v, vi) =>
    v.specs?.forEach((s) => {
      if (s.label === "Brand") return;
      place(s.label, vi, s.value);
    })
  );
  const rows: CompareRow[] = [
    ...CANON.map((c) => byField.get(c.field)).filter((r): r is CompareRow => !!r),
    ...Array.from(other.values()),
  ];
  rows.push({ label: "Material", hi: "मटेरियल", values: variants.map((v) => v.materials?.join(", ") ?? null), differs: false });
  // A sizes list only adds a row where a brand has no spec rows of its own (otherwise it repeats them).
  if (variants.some((v) => v.sizes?.length && !v.specs?.length)) {
    rows.push({ label: "Sizes", hi: "साइज़", values: variants.map((v) => (v.specs?.length ? null : v.sizes?.join(", ") ?? null)), differs: false });
  }
  rows.push({ label: "Used for", hi: "कहाँ लगता है", values: variants.map((v) => v.useCases?.join(", ") ?? null), differs: false, informational: true });
  return rows
    .filter((r) => r.values.some((v) => v))
    .map((r) => {
      // A difference needs two real values that disagree; an absent value is not a difference.
      const present = r.values.filter((v): v is string => !!v).map(flat);
      return { ...r, differs: !r.informational && new Set(present).size > 1 };
    });
}
