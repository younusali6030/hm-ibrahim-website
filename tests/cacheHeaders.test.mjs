// Regression: the media cache rule must not catch page routes that share a folder name (/products, /brands, /blog).
import test from "node:test";
import assert from "node:assert/strict";
import config from "../next.config.mjs";

const rules = await config.headers();
// Next compiles "/dir/:path*.(ext|ext)" to a regex; this mirrors that for the one pattern shape used here.
function toRegex(source) {
  const m = source.match(/^\/([a-z]+)\/:path\*\.\(([^)]+)\)$/);
  assert.ok(m, `unexpected source shape: ${source}`);
  return new RegExp(`^/${m[1]}/.+\\.(${m[2]})$`);
}
const matches = (path) => rules.some((r) => toRegex(r.source).test(path));

test("page routes sharing a media folder name are not long-cached", () => {
  for (const page of ["/products", "/products/", "/products/binding-wire", "/brands", "/brands/cm", "/blog", "/blog/how-to-choose-tmt-bars-indore"]) {
    assert.equal(matches(page), false, page);
  }
});

test("real files in the media folders still get the long cache", () => {
  for (const file of ["/products/v2/ms-flats-1.webp", "/hero/poster.avif", "/reels/nail-reel.mp4", "/blog/some-image.jpg", "/brands/cm.png", "/videos/binding-wire.jpg"]) {
    assert.equal(matches(file), true, file);
  }
});
