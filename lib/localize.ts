/**
 * Server-side localisation of content objects.
 *
 *   localize(product, "hi")  deep-maps every string through the Hindi dictionary (exact English text -> Hindi),
 *                            then through pattern rules for rate lines and size ranges.
 *
 * Anything without a Hindi entry is returned unchanged, so a missing translation shows English, never a blank.
 * `npm run i18n:audit` lists what is still English. Import this from server components only: the dictionary is large.
 */
import type { Lang } from "@/lib/locale";
import { catalogHi } from "@/content/hi/catalog";

const dictionary: Record<string, string> = { ...catalogHi };

/** Register more dictionaries (kept separate per area so files stay readable). */
export function addDictionary(d: Record<string, string>) {
  Object.assign(dictionary, d);
}

const RATE_UNITS: Record<string, string> = {
  kg: "किलो",
  metre: "मीटर",
  meter: "मीटर",
  piece: "पीस",
  "sq m": "वर्ग मीटर",
  "sq ft": "वर्ग फीट",
};

const VARY_TERMS: Record<string, string> = {
  size: "साइज़",
  sizes: "साइज़",
  quantity: "मात्रा",
  grade: "ग्रेड",
  finish: "फिनिश",
  mesh: "जाली",
  "mesh size": "जाली साइज़",
  gauge: "गेज",
  "pack size": "पैक साइज़",
  "wire size": "तार का साइज़",
  thickness: "मोटाई",
  pattern: "पैटर्न",
  diameter: "व्यास",
  length: "लंबाई",
  width: "चौड़ाई",
  type: "प्रकार",
  "coil size": "कॉइल साइज़",
  coating: "कोटिंग",
  "NB size": "एनबी साइज़",
  class: "क्लास",
  schedule: "शेड्यूल",
  height: "ऊँचाई",
  "mesh size and height": "जाली साइज़ और ऊँचाई",
  "mesh and coating": "जाली और कोटिंग",
  "mesh and gauge": "जाली और गेज",
  "mesh and wire size": "जाली और तार का साइज़",
};

function joinHi(parts: string[]): string {
  return parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} और ${parts[parts.length - 1]}`;
}

function varyTermsHi(raw: string): string | null {
  const whole = VARY_TERMS[raw];
  if (whole) return whole;
  const bits = raw.split(/\s*(?:,| and )\s*/).filter(Boolean);
  const out: string[] = [];
  for (const b of bits) {
    const t = VARY_TERMS[b];
    if (!t) return null;
    out.push(t);
  }
  return joinHi(out);
}

/** "Approx. ₹52–62 per kg (varies by size and quantity). Confirm for current price." */
function rateHi(s: string): string | null {
  const m = s.match(/^Approx\. (₹[\d,–\-]+) per ([a-z ]+?)(?: \(([^)]*)\))?\.(?: Confirm for current price\.)?$/);
  if (!m) return null;
  const unit = RATE_UNITS[m[2]];
  if (!unit) return null;
  let tail = "";
  if (m[3]) {
    const v = m[3].match(/^varies by (.+)$/);
    if (v) {
      const terms = varyTermsHi(v[1]);
      if (!terms) return null;
      tail = ` (${terms} के अनुसार बदलता है)`;
    } else return null;
  }
  return `लगभग ${m[1]} प्रति ${unit}${tail}। मौजूदा भाव के लिए पूछें।`;
}

function rateHiPieceMix(s: string): string | null {
  // "Approx. ₹25–80 per metre (plastic) / ₹150–350 per metre (SS). Confirm for current price."
  const m = s.match(/^Approx\. (₹[\d,–\-]+) per metre \(plastic\) \/ (₹[\d,–\-]+) per metre \(SS\)\./);
  if (!m) return null;
  return `लगभग ${m[1]} प्रति मीटर (प्लास्टिक) / ${m[2]} प्रति मीटर (एसएस)। मौजूदा भाव के लिए पूछें।`;
}

const WITH_HANDLE = /^Approx\. (₹[\d,–\-]+) per piece \(with handle\)\./;

/** Size and range strings made of numbers and units: "3mm to 10mm", "4 ft", "Up to 25 kg". */
function unitsHi(s: string): string {
  // Only strings that carry a number and read like a spec; never slugs, paths or URLs.
  if (!/\d/.test(s) || s.startsWith("/") || s.includes("://") || !(/\s/.test(s) || /^\d+ft$/.test(s))) return s;
  if (!/\b(to|Up to|inch|inches)\b|\dft\b|\d ft\b/.test(s)) return s;
  return s
    .replace(/\bUp to\b/g, "अधिकतम")
    .replace(/\bto\b/g, "से")
    .replace(/(\d)\s?ft\b/g, "$1 फीट")
    .replace(/\binches\b/g, "इंच")
    .replace(/\binch\b/g, "इंच");
}

/** Translate one string. */
export function tr(s: string, lang: Lang): string {
  if (lang !== "hi" || !s) return s;
  const hit = dictionary[s];
  if (hit) return hit;
  const r = rateHi(s) ?? rateHiPieceMix(s);
  if (r) return r;
  const h = s.match(WITH_HANDLE);
  if (h) return `लगभग ${h[1]} प्रति पीस (दस्ते सहित)। मौजूदा भाव के लिए पूछें।`;
  return unitsHi(s);
}

/** Deep-map every string in a value (objects, arrays, tuples). Non-strings are returned as they are. */
export function localize<T>(value: T, lang: Lang): T {
  if (lang !== "hi") return value;
  return walk(value) as T;
}

function walk(v: unknown): unknown {
  if (typeof v === "string") return tr(v, "hi");
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = walk(val);
    return out;
  }
  return v;
}

/**
 * Every string inside `value` that has a Hindi form, as { english: hindi }.
 * Server pages hand this to client components so they can translate without bundling the dictionary.
 */
export function collectStrings(value: unknown, lang: Lang): Record<string, string> {
  const out: Record<string, string> = {};
  if (lang !== "hi") return out;
  const visit = (v: unknown) => {
    if (typeof v === "string") {
      const h = tr(v, "hi");
      if (h !== v) out[v] = h;
    } else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(visit);
  };
  visit(value);
  return out;
}
