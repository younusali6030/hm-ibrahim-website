// The self-hosted Devanagari font is subset to the characters the site uses. If new Hindi copy introduces a letter
// that is not in the subset, the browser silently falls back to a system font for that letter; fail here instead.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const kept = new Set(JSON.parse(fs.readFileSync(path.join(root, "app/fonts/devanagari-codepoints.json"), "utf8")));
const isDeva = (cp) => (cp >= 0x0900 && cp <= 0x097f) || (cp >= 0xa8e0 && cp <= 0xa8ff) || (cp >= 0x1cd0 && cp <= 0x1cff);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|md|mdx|json|css)$/.test(e.name)) yield p;
  }
}

test("every Devanagari character in the source is in the font subset", () => {
  const missing = new Map();
  for (const d of ["app", "components", "lib", "content"]) {
    for (const file of walk(path.join(root, d))) {
      for (const ch of fs.readFileSync(file, "utf8")) {
        const cp = ch.codePointAt(0);
        if (isDeva(cp) && !kept.has(cp)) missing.set(cp, path.relative(root, file));
      }
    }
  }
  const list = [...missing].map(([cp, f]) => `U+${cp.toString(16).toUpperCase()} in ${f}`);
  assert.deepEqual(list, [], "re-run scripts/fonts/subset-devanagari.py");
});

test("the subset font file is small", () => {
  const size = fs.statSync(path.join(root, "app/fonts/NotoSansDevanagari-devanagari.woff2")).size;
  assert.ok(size < 80 * 1024, `font is ${size} bytes`);
});
