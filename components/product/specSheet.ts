import type { BrandVariant, Product } from "@/content/products";

/** Spec-sheet rows built ONLY from content/products.ts. A value the data does not hold is null ("Ask at counter"). */

export type SheetRow = { key: string; label: string; hi: string; value: string | null };

const WIRE_CATEGORIES = ["wiremesh", "welded-mesh", "wires", "fencing-material", "nails", "safety-nets-equipments"];

type Def = { key: string; label: string; hi: string; match: RegExp };

const WIRE_ROWS: Def[] = [
  { key: "gauge", label: "Gauge / wire size", hi: "गेज / तार साइज़", match: /gauge|swg|wire (size|diameter)|diameter|thickness|wire$/i },
  { key: "mesh", label: "Mesh / hole size", hi: "जाली / छेद का साइज़", match: /mesh|hole|opening|pattern|aperture/i },
  { key: "roll", label: "Roll length / pack", hi: "रोल लंबाई / पैक", match: /roll|length|coil|packing|supplied|form|height|width/i },
];
/** Punched sheet is sold by thickness and sheet size, not by wire gauge or roll length. */
const SHEET_ROWS: Def[] = [
  { key: "thickness", label: "Thickness", hi: "मोटाई", match: /thickness|gauge/i },
  { key: "hole", label: "Hole shape / size", hi: "छेद का आकार / साइज़", match: /hole|pattern|aperture|opening/i },
  { key: "sheet", label: "Sheet size", hi: "शीट साइज़", match: /sheet size|size|length|width|dimension|supplied/i },
];
/** Hand tools: brand, head or blade size, and what comes fitted. */
const TOOL_ROWS: Def[] = [
  { key: "brand", label: "Brand", hi: "ब्रांड", match: /^brand$/i },
  { key: "size", label: "Size / weight", hi: "साइज़ / वज़न", match: /size|weight|length/i },
  { key: "handle", label: "Handle", hi: "दस्ता", match: /handle|type/i },
];
const SECTION_ROWS: Def[] = [
  { key: "size", label: "Size", hi: "साइज़", match: /size|width|diameter|dimension/i },
  { key: "thickness", label: "Thickness / gauge", hi: "मोटाई", match: /thickness|gauge|wall/i },
  { key: "length", label: "Length", hi: "लंबाई", match: /length|roll|packing|supplied/i },
];

export function isSheetKind(categorySlug?: string | null): boolean {
  return categorySlug === "perforated-sheets";
}

export function isToolKind(categorySlug?: string | null): boolean {
  return categorySlug === "construction-tools";
}

export function isWireKind(categorySlug?: string | null): boolean {
  return !!categorySlug && WIRE_CATEGORIES.includes(categorySlug);
}

/** Only categories and items where the counter really cuts to the customer's size. */
export function isCutToSize(p: { slug: string; categorySlug: string }): boolean {
  if (["wiremesh", "welded-mesh", "perforated-sheets"].includes(p.categorySlug)) return true;
  return /wire-rope|pipe/.test(p.slug) && !/clamp/.test(p.slug);
}

type Source = Pick<Product, "specs" | "sizes" | "materials" | "variants" | "useCases" | "notes">;

export function buildSheet(
  src: Source,
  categorySlug: string | undefined,
  tataLine: string | null,
): { rows: SheetRow[]; extras: SheetRow[] } {
  const specs = [...(src.specs ?? [])];
  const used = new Set<number>();
  const take = (re: RegExp) => {
    const i = specs.findIndex((s, idx) => !used.has(idx) && re.test(s.label));
    if (i === -1) return null;
    used.add(i);
    return specs[i].value;
  };

  const defs = isSheetKind(categorySlug)
    ? SHEET_ROWS
    : isToolKind(categorySlug)
      ? TOOL_ROWS
      : isWireKind(categorySlug)
        ? WIRE_ROWS
        : SECTION_ROWS;
  const rows: SheetRow[] = defs.map((d) => ({ key: d.key, label: d.label, hi: d.hi, value: take(d.match) }));

  const materialSpec = take(/material|grade/i);
  const materials = src.materials?.length ? src.materials.join(", ") : materialSpec;
  rows.push({ key: "material", label: "Material", hi: "मटेरियल", value: materials });
  rows.push({ key: "finish", label: "Finish", hi: "फिनिश", value: take(/finish|coating|galvan/i) });

  const extras: SheetRow[] = [];
  specs.forEach((s, idx) => {
    if (!used.has(idx)) extras.push({ key: `x-${idx}`, label: s.label, hi: s.label, value: s.value });
  });
  if (src.sizes?.length) extras.push({ key: "sizes", label: "Sizes", hi: "साइज़", value: src.sizes.join(", ") });
  if (src.variants?.length) extras.push({ key: "variants", label: "Types", hi: "किस्में", value: src.variants.join(", ") });
  if (tataLine) extras.push({ key: "tata", label: "Tata", hi: "टाटा", value: tataLine });
  return { rows, extras };
}

export type CompareRow = { label: string; values: (string | null)[]; differs: boolean };

/** Side-by-side of brand variants: every row is a value the data holds for at least one brand. */
export function compareBrands(variants: BrandVariant[]): CompareRow[] {
  const labels: string[] = [];
  variants.forEach((v) => v.specs?.forEach((s) => s.label !== "Brand" && !labels.includes(s.label) && labels.push(s.label)));
  const rows: CompareRow[] = labels.map((label) => ({
    label,
    values: variants.map((v) => v.specs?.find((s) => s.label === label)?.value ?? null),
    differs: false,
  }));
  rows.push({ label: "Material", values: variants.map((v) => v.materials?.join(", ") ?? null), differs: false });
  rows.push({ label: "Sizes", values: variants.map((v) => v.sizes?.join(", ") ?? null), differs: false });
  rows.push({ label: "Used for", values: variants.map((v) => v.useCases?.join(", ") ?? null), differs: false });
  return rows
    .filter((r) => r.values.some((v) => v))
    .map((r) => ({ ...r, differs: new Set(r.values.map((v) => v ?? "")).size > 1 }));
}
