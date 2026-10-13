// Run: npm test. Guards the facts and policies that search and answer engines read.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { site } from "../content/site.ts";
import { ALLOW_TRAINING_CRAWLERS, SEARCH_CRAWLERS, TRAINING_CRAWLERS, NOT_SEPARABLE, DISALLOWED_PATHS, robotsRules } from "../lib/crawlerPolicy.ts";

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
  assert.match(llms, /Monday to Saturday, 10 am to 8 pm/);
  assert.match(site.hours.weekdays, /10 am to 8 pm/);
});

test("social profile URLs are real https profile URLs on the right host", () => {
  const ig = new URL(site.social.instagram);
  assert.equal(ig.protocol, "https:");
  assert.equal(ig.hostname, "www.instagram.com");
  for (const v of Object.values(site.social)) assert.ok(v === "" || v.startsWith("https://"));
});

test("crawler policy: owner allows AI crawlers; only API and thank-you pages are disallowed", () => {
  assert.equal(ALLOW_TRAINING_CRAWLERS, true);
  for (const bot of TRAINING_CRAWLERS) assert.ok(!SEARCH_CRAWLERS.includes(bot), `${bot} is in both lists`);
  for (const bot of NOT_SEPARABLE) assert.ok(!TRAINING_CRAWLERS.includes(bot), `${bot} is listed as not separable`);
  const rules = robotsRules();
  const blocked = rules.filter((r) => r.disallow === "/").flatMap((r) => [r.userAgent].flat());
  assert.deepEqual(blocked, [], "no crawler may be blocked from the whole site");
  assert.equal(rules.length, 1);
  const star = rules.find((r) => r.userAgent === "*");
  assert.equal(star.allow, "/");
  for (const p of ["/api/", "/contact/success", "/hi/contact/success"]) assert.ok(DISALLOWED_PATHS.includes(p) && star.disallow.includes(p), p);
});

test("llms.txt lists every product with its English and Hindi page", async () => {
  const { allProducts } = await import("../content/products.ts");
  for (const p of allProducts) {
    assert.ok(llms.includes(`https://www.hmibrahim.net/products/${p.slug})`), `${p.slug} en`);
    assert.ok(llms.includes(`https://www.hmibrahim.net/hi/products/${p.slug})`), `${p.slug} hi`);
  }
  assert.match(llms, /wholesale or in bulk to shop owners, traders/);
});

const EN_REACH = "Orders accepted across India; delivery arrangements confirmed with each quotation.";
const HI_REACH = "पूरे भारत से ऑर्डर स्वीकार किए जाते हैं; डिलीवरी की व्यवस्था हर कोटेशन के साथ तय की जाती है।";

test("the owner-confirmed reach sentence is the one in site.ts, Hindi site.ts and llms.txt", () => {
  assert.equal(site.orderReach, EN_REACH);
  assert.ok(llms.includes(EN_REACH));
  assert.deepEqual([...site.areasServed], ["India"]);
  const hiSite = fs.readFileSync(path.join(root, "content/hi/site.ts"), "utf8");
  assert.ok(hiSite.includes(HI_REACH));
});

test("no page copy still limits delivery to nearby areas or promises free or universal delivery", () => {
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|md|txt)$/.test(e.name)) files.push(p);
    }
  };
  for (const d of ["content", "app", "components", "public"]) walk(path.join(root, d));
  const bad = [/Delivery depends on/i, /Delivery can be arranged/i, /delivery subject to/i, /free delivery/i, /deliver(y)? (to|across) (all|every)/i, /we deliver everywhere/i];
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    for (const re of bad) assert.ok(!re.test(t), `${path.relative(root, f)}: matches ${re}`);
  }
});

test("manufacturer claim names only barbed wire, chain link fencing and wire mesh", () => {
  assert.match(site.manufacturerTagline, /^We manufacture barbed wire, chain link fencing and wire mesh\./);
  assert.doesNotMatch(site.manufacturerTagline, /SS|welded|hardware|steel|TMT|pipe/i);
  assert.match(llms, /manufactures barbed wire, chain link fencing and wire mesh/);
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
