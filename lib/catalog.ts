/**
 * Build catalog data for a quote: product details, classifications, and optional
 * tentative rates from web search (Indore, Siyaganj).
 */

import { getProductBySlug, getCategoryBySlug, getProductImages } from "@/content/products";
import type { ProductWithCategory } from "@/content/products";

export type TentativeRate = {
  supplier?: string;
  rate?: string;
  unit?: string;
  note?: string;
};

export type CatalogData = {
  productName: string;
  productSlug: string | null;
  categoryName: string;
  shortDesc: string;
  /** Full URLs for product images (for email catalog) */
  imageUrls: string[];
  /** All classifications we have: specs, sizes, materials, use cases, variants */
  classifications: {
    specs: { label: string; value: string }[];
    sizes: string[];
    materials: string[];
    useCases: string[];
    variants: string[];
    notes: string;
  };
  tentativeRates: TentativeRate[];
  /** Optional indicative rate from product content when no API rates (e.g. "Approx. ₹55–65 per kg") */
  indicativeRateRange?: string;
  /** Search query used for rates (for transparency in catalog) */
  searchContext: string;
};

function getClassifications(product: ProductWithCategory | null): CatalogData["classifications"] {
  if (!product) {
    return { specs: [], sizes: [], materials: [], useCases: [], variants: [], notes: "" };
  }
  return {
    specs: product.specs ?? [],
    sizes: product.sizes ?? [],
    materials: product.materials ?? [],
    useCases: product.useCases ?? [],
    variants: product.variants ?? [],
    notes: product.notes ?? "",
  };
}

/** Search Serper for product + Indore Siyaganj and return organic snippets */
async function searchRatesSerper(productName: string): Promise<string[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  const query = `${productName} price rate Indore Siyaganj`;
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 8 }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      organic?: { title?: string; snippet?: string; link?: string }[];
    };
    const organic = data.organic ?? [];
    return organic
      .map((o) => [o.title, o.snippet].filter(Boolean).join(" — "))
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

/** Parse number from price string (e.g. "58,500" or "62.5" -> 58500, 62.5) */
function parsePriceNumber(s: string): number | null {
  const cleaned = s.replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 && n < 1e7 ? n : null;
}

/**
 * Extract a live rate range from search snippets using regex (no OpenAI).
 * Looks for ₹/Rs. amounts and "per kg", "per metre", etc.; returns one TentativeRate with min–max range.
 */
function extractLiveRangeFromSnippets(snippets: string[]): TentativeRate[] {
  const text = snippets.join(" ");
  const numbers: number[] = [];
  let unit = "per kg";

  const patterns: Array<{ re: RegExp; unitGroup?: number; rangeGroup?: number }> = [
    { re: /(?:₹|Rs\.?)\s*([\d,.]+)\s*[–\-]\s*([\d,.]+)\s*(?:per\s*(kg|metre|m\b|sq\.?\s*m|piece|sq\s*ft|meter))?/gi, unitGroup: 3, rangeGroup: 2 },
    { re: /(?:₹|Rs\.?)\s*([\d,.]+)\s*(?:per\s*(kg|metre|m\b|sq\.?\s*m|piece|sq\s*ft|meter))?/gi, unitGroup: 2 },
    { re: /([\d,.]+)\s*\/?\s*per\s*(kg|metre|m\b|sq\.?\s*m|piece|sq\s*ft|meter)/gi, unitGroup: 2 },
    { re: /(?:₹|Rs\.?)\s*([\d,.]+)/g },
  ];

  for (const { re, unitGroup, rangeGroup } of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const n1 = parsePriceNumber(m[1]);
      if (n1 !== null) numbers.push(n1);
      if (rangeGroup && m[rangeGroup]) {
        const n2 = parsePriceNumber(m[rangeGroup]);
        if (n2 !== null) numbers.push(n2);
      }
      if (unitGroup && m[unitGroup]) {
        const u = String(m[unitGroup]).toLowerCase();
        if (u.includes("kg")) unit = "per kg";
        else if (u.includes("metre") || u === "m") unit = "per metre";
        else if (u.includes("sq") && u.includes("m")) unit = "per sq m";
        else if (u.includes("piece")) unit = "per piece";
      }
    }
  }

  if (numbers.length === 0) return [];
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const minR = min % 1 === 0 ? min : Math.round(min * 10) / 10;
  const maxR = max % 1 === 0 ? max : Math.round(max * 10) / 10;
  const rateStr = minR === maxR ? `₹${minR} ${unit}` : `₹${minR}–${maxR} ${unit}`;
  return [
    {
      supplier: "Market (live search)",
      rate: rateStr,
      note: "From recent Indore/Siyaganj web search. Confirm for current price.",
    },
  ];
}

/** Use OpenAI to extract 3–4 supplier names and tentative rates from search snippets */
async function extractRatesFromSnippets(
  productName: string,
  snippets: string[]
): Promise<TentativeRate[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || snippets.length === 0) return [];

  const text = snippets.slice(0, 8).join("\n\n");
  const prompt = `You are helping build a product catalog for a customer in Indore, Siyaganj. From the following search result snippets about "${productName}" in Indore/Siyaganj, extract up to 4 tentative supplier or market rate mentions. For each mention provide: supplier or source name (or "Market"), rate (e.g. "₹XX per kg" or "Rs. XX"), and optional note. If no clear rates are found, return an empty array. Reply with a JSON array only, no other text. Format: [{"supplier":"...","rate":"...","unit":"...","note":"..."}]

Snippets:
${text}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return [];
    const parsed = JSON.parse(content) as TentativeRate[];
    return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
  } catch {
    return [];
  }
}

/**
 * Build catalog data for the given product slug and/or items text.
 * If productSlug is set, loads full product and category from content.
 * Optionally runs web search (Serper) + LLM (OpenAI) to get tentative rates for Indore/Siyaganj.
 */
export async function getCatalogData(
  productSlug: string | null,
  itemsText: string
): Promise<CatalogData> {
  const product = productSlug ? getProductBySlug(productSlug) : null;
  const category = product ? getCategoryBySlug(product.categorySlug) : null;
  const productName = product?.name ?? (itemsText.split(/[,(\n]/)[0]?.trim() || "Product");
  const categoryName = product?.categoryName ?? category?.name ?? "General";
  const shortDesc = product?.shortDesc ?? "";
  const classifications = getClassifications(product);
  const searchContext = `${productName} — Indore, Siyaganj`;

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com").replace(/\/$/, "");
  const imagePaths = product ? getProductImages(product, category) : [];
  const imageUrls = imagePaths.map((path) => `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`);

  let tentativeRates: TentativeRate[] = [];
  const snippets = await searchRatesSerper(productName);
  if (snippets.length > 0) {
    tentativeRates = await extractRatesFromSnippets(productName, snippets);
    if (tentativeRates.length === 0) {
      tentativeRates = extractLiveRangeFromSnippets(snippets);
    }
  }
  const indicativeRateRange = product?.indicativeRate;

  return {
    productName,
    productSlug: product?.slug ?? null,
    categoryName,
    shortDesc,
    imageUrls,
    classifications,
    tentativeRates,
    indicativeRateRange,
    searchContext,
  };
}
