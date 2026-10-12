/** Heading ids and a table of contents, derived from the Markdown so the page and the TOC always agree. */

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TocItem = { id: string; text: string };

export function extractToc(md: string): TocItem[] {
  const out: TocItem[] = [];
  const seen = new Set<string>();
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;
    const text = m[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_]/g, "");
    let id = slugifyHeading(text) || "section";
    let n = 2;
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`;
    seen.add(id);
    out.push({ id, text });
  }
  return out;
}

/** Product slugs linked from the article body, in order of first mention. */
export function extractProductSlugs(md: string, limit = 4): string[] {
  const slugs: string[] = [];
  const re = /\]\(\/products\/([a-z0-9-]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) if (!slugs.includes(m[1])) slugs.push(m[1]);
  return slugs.slice(0, limit);
}
