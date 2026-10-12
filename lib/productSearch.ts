/**
 * Product search for /products. Pure functions, no imports, so the same code runs on the server (building each
 * product's search text) and in the browser (matching a typed query), and can be unit-tested directly.
 *
 * How a query matches a product:
 *   - The query is normalised and split into words. A product matches when EVERY word is found.
 *   - "Names" text (product name, aliases, category, "also called" spec) is tried first. "Description" text
 *     (the one-line summary) is only used when no product matches on names, so "flat" finds Flats, not every
 *     product whose summary happens to say "flat head".
 *   - Short words (up to 3 letters: gi, ms, ss, tmt) must start a word; longer words may match inside a word
 *     ("mesh" finds "wiremesh"). A long word may also match across a space ("chainlink" finds "chain link").
 */

/** Lower-case, strip punctuation, fold common transliteration spellings (jaali -> jali, taar -> tar, machhar -> machar). */
export function normalizeText(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[​-‍﻿]/g, "")
    // Devanagari nukta forms: ड़ -> ड़ (composed) so typed and stored spellings agree.
    .replace(/ड़/g, "ड़")
    .replace(/ढ़/g, "ढ़")
    // Keep Latin letters, digits and the Devanagari block (letters and vowel signs); everything else is a separator.
    .replace(/[^a-z0-9\u0900-\u097f]+/g, " ")
    // Latin transliteration: doubled vowels and "hh" are spelling noise (jaali, taar, kaala, machhar).
    .replace(/(a{2,}|e{2,}|i{2,}|o{2,}|u{2,})/g, (m) => m[0])
    .replace(/h{2,}/g, "h")
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchEntry = {
  /** Normalised: name, aliases, category name, "also called" spec. */
  names: string;
  /** Normalised: summary line. Used only when nothing matches on names. */
  desc: string;
};

/** Build the searchable text of one product. Pass every string that should find it (English and Hindi). */
export function buildSearchEntry(parts: { names: Array<string | undefined | null>; desc?: Array<string | undefined | null> }): SearchEntry {
  const join = (xs: Array<string | undefined | null> = []) =>
    normalizeText(xs.filter((x): x is string => !!x).join(" | "));
  return { names: join(parts.names), desc: join(parts.desc) };
}

export function queryWords(query: string): string[] {
  const n = normalizeText(query);
  return n ? n.split(" ") : [];
}

function wordMatches(haystack: string, word: string): boolean {
  if (!word) return true;
  if (word.length <= 3) {
    return haystack.startsWith(word) || haystack.includes(" " + word);
  }
  if (haystack.includes(word)) return true;
  // "chainlink" vs "chain link": try again with the spaces taken out.
  return word.length >= 5 && haystack.replace(/ /g, "").includes(word);
}

function allWords(haystack: string, words: string[]): boolean {
  return words.every((w) => wordMatches(haystack, w));
}

/**
 * Filter entries for a query. Returns the matching ids in input order.
 * An empty query matches everything.
 */
export function searchProducts<T extends string>(entries: ReadonlyArray<{ id: T } & SearchEntry>, query: string): T[] {
  const words = queryWords(query);
  if (words.length === 0) return entries.map((e) => e.id);
  const onNames = entries.filter((e) => allWords(e.names, words));
  if (onNames.length > 0) return onNames.map((e) => e.id);
  return entries.filter((e) => allWords(e.names + " | " + e.desc, words)).map((e) => e.id);
}

type CatalogProduct = { slug: string; name: string; shortDesc: string; specs?: { label: string; value: string }[] };
type CatalogCategory = { name: string; products: CatalogProduct[] };

/**
 * One search entry per unique product slug. `toHindi` maps an English catalogue string to its Hindi form
 * (identity when there is none), so a Hindi or English query finds the same product from either language's page.
 */
export function buildProductEntries(
  categories: CatalogCategory[],
  aliases: Record<string, string[]>,
  toHindi: (s: string) => string = (s) => s
): Array<{ id: string } & SearchEntry> {
  const listedIn = new Map<string, string[]>();
  const first = new Map<string, CatalogProduct>();
  for (const c of categories) {
    for (const p of c.products) {
      listedIn.set(p.slug, [...(listedIn.get(p.slug) ?? []), c.name]);
      if (!first.has(p.slug)) first.set(p.slug, p);
    }
  }
  return Array.from(first.values()).map((p) => ({
    id: p.slug,
    ...buildSearchEntry({
      names: [
        p.name,
        toHindi(p.name),
        ...(listedIn.get(p.slug) ?? []).flatMap((n) => [n, toHindi(n)]),
        ...(aliases[p.slug] ?? []),
        ...(p.specs ?? []).filter((s) => /also called/i.test(s.label)).map((s) => s.value),
      ],
      desc: [p.shortDesc, toHindi(p.shortDesc)],
    }),
  }));
}
