/**
 * Minimal front-matter reader for content/blog/posts*. The files use one flat `key: "value"` line per field
 * (double-quoted strings, plus bare integers such as image2At). Replaces gray-matter, whose js-yaml 3 chain
 * carries open npm-audit advisories; nested YAML is deliberately not supported and throws.
 */
export type FrontMatter = { data: Record<string, string | number | boolean>; content: string };

export function parseFrontMatter(raw: string): FrontMatter {
  const text = raw.replace(/^﻿/, "");
  const m = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text);
  if (!m) return { data: {}, content: text };
  const data: FrontMatter["data"] = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const kv = /^([A-Za-z0-9_]+):[ \t]*(.*)$/.exec(line);
    if (!kv) throw new Error(`Unsupported front matter line: ${line}`);
    const [, key, valueRaw] = kv;
    const v = valueRaw.trim();
    if (v.startsWith('"')) data[key] = JSON.parse(v) as string;
    else if (v.startsWith("'")) data[key] = v.slice(1, -1).replace(/''/g, "'");
    else if (/^-?\d+(\.\d+)?$/.test(v)) data[key] = Number(v);
    else if (v === "true" || v === "false") data[key] = v === "true";
    else data[key] = v;
  }
  return { data, content: text.slice(m[0].length) };
}
