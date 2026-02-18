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
