/**
 * Guides end with a "Request a Quote" block and a "Related reading" list written into the Markdown. The article page
 * already closes with one product block, one row of three guides and one call to action, so these two sections are
 * lifted out of the body. Their /blog/ links are kept (in order) to fill the row of guides, and an italic review note
 * after them stays at the end of the body.
 */
const DROP = /^##\s+(Request a Quote\b.*|Related reading|संबंधित पठन|.*कोटेशन माँगें.*)\s*$/;

export function splitGuideTail(content: string): { body: string; guideSlugs: string[] } {
  const parts = content.split(/\n(?=## )/);
  const kept: string[] = [];
  const dropped: string[] = [];
  for (const part of parts) {
    const head = part.split("\n", 1)[0];
    (DROP.test(head) ? dropped : kept).push(part);
  }
  const guideSlugs: string[] = [];
  const notes: string[] = [];
  for (const d of dropped) {
    for (const m of d.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)) if (!guideSlugs.includes(m[1])) guideSlugs.push(m[1]);
    for (const line of d.split("\n")) if (/^\*[^*].*\*$/.test(line.trim())) notes.push(line.trim());
  }
  const body = [kept.join("\n"), ...notes].join("\n\n").trimEnd();
  return { body, guideSlugs };
}
