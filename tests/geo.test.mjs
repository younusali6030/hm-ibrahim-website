// Run: npm test. Guards the facts and policies that search and answer engines read.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { site } from "../content/site.ts";
import { ALLOW_TRAINING_CRAWLERS, SEARCH_CRAWLERS, TRAINING_CRAWLERS, DISALLOWED_PATHS } from "../lib/crawlerPolicy.ts";

const root = path.resolve(import.meta.dirname, "..");
const llms = fs.readFileSync(path.join(root, "public/llms.txt"), "utf8");
const digits = (s) => s.replace(/\D/g, "");

test("llms.txt repeats the same business facts as content/site.ts", () => {
  assert.ok(digits(llms).includes(digits(site.phone).slice(-10)), "primary phone");
  assert.ok(digits(llms).includes(digits(site.phoneAlt).slice(-10)), "alternate phone");
  assert.ok(llms.includes(site.address.line1), "street");
  assert.ok(llms.includes(site.address.pincode), "pincode");
  assert.ok(llms.includes(site.googleReview.profileUrl), "Google profile");
  assert.ok(llms.includes(site.social.instagram), "Instagram");
  assert.match(llms, /Monday to Saturday, 9 am to 8 pm/);
  assert.match(site.hours.weekdays, /9 am to 8 pm/);
});

test("social profile URLs are real https profile URLs on the right host", () => {
  const ig = new URL(site.social.instagram);
  assert.equal(ig.protocol, "https:");
  assert.equal(ig.hostname, "www.instagram.com");
  for (const v of Object.values(site.social)) assert.ok(v === "" || v.startsWith("https://"));
});

test("crawler policy: search and training lists never overlap, noindex paths are covered", () => {
  assert.equal(typeof ALLOW_TRAINING_CRAWLERS, "boolean");
  for (const bot of TRAINING_CRAWLERS) assert.ok(!SEARCH_CRAWLERS.includes(bot), `${bot} is in both lists`);
  for (const p of ["/api/", "/contact/success", "/hi/contact/success"]) assert.ok(DISALLOWED_PATHS.includes(p), p);
});

const en = path.join(root, "content/blog/posts");
const hi = path.join(root, "content/blog/posts-hi");
const tableNumbers = (md) =>
  md
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|[\s|:-]+$/.test(l))
    .flatMap((l) => l.match(/\d+(?:\.\d+)?/g) ?? []);

test("every Hindi guide has an English original with the same numbers in its tables", () => {
  for (const f of fs.readdirSync(hi).filter((x) => x.endsWith(".md"))) {
    assert.ok(fs.existsSync(path.join(en, f)), `${f}: no English original`);
    const h = fs.readFileSync(path.join(hi, f), "utf8");
    const e = fs.readFileSync(path.join(en, f), "utf8");
    assert.match(h, /^title: ".+"/m, `${f}: title`);
    assert.match(h, /^description: ".+"/m, `${f}: description`);
    assert.deepEqual(tableNumbers(h), tableNumbers(e), `${f}: table numbers differ from the English guide`);
  }
});

test("Hindi guides link only to paths that exist", () => {
  const products = fs.readFileSync(path.join(root, "content/products.ts"), "utf8");
  for (const f of fs.readdirSync(hi).filter((x) => x.endsWith(".md"))) {
    const h = fs.readFileSync(path.join(hi, f), "utf8");
    for (const [, href] of h.matchAll(/\]\((\/[^)\s]+)\)/g)) {
      const m = href.match(/^\/blog\/(.+)$/);
      if (m) assert.ok(fs.existsSync(path.join(en, `${m[1]}.md`)), `${f}: missing blog ${href}`);
      const p = href.match(/^\/products\/(.+)$/);
      if (p) assert.ok(products.includes(`slug: "${p[1]}"`), `${f}: missing product ${href}`);
    }
  }
});
