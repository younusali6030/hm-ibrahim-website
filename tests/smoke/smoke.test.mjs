/**
 * Browser smoke journeys. Not part of `npm test` (needs a running server and Chrome).
 *   npm run build && npx next start -p 3000 &   then   npm run test:smoke
 * Target another server with SMOKE_BASE_URL. Nothing here submits a real lead: the form test sends an invalid
 * phone number, which the server action rejects before saving or emailing anything.
 */
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const BASE = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
let browser;

before(async () => {
  browser = await chromium.launch({ channel: "chrome" });
});
after(async () => {
  await browser?.close();
});

async function page(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: width < 768 });
  const p = await ctx.newPage();
  p.setDefaultTimeout(15000);
  return { p, close: () => ctx.close() };
}

test("home: one H1 and the quote CTA leads to /contact", async () => {
  const { p, close } = await page();
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    assert.equal(await p.locator("h1").count(), 1);
    await p.getByRole("link", { name: "Get a quote" }).first().click();
    await p.waitForURL(/\/contact/);
    assert.ok(await p.locator('textarea[name="items"]').isVisible());
  } finally {
    await close();
  }
});

test("product page: quote link carries the product to the form", async () => {
  const { p, close } = await page();
  try {
    await p.goto(BASE + "/products/binding-wire", { waitUntil: "load" });
    const href = await p.locator('a[href*="/contact?product=binding-wire"]').first().getAttribute("href");
    assert.match(href, /product=binding-wire/);
    await p.goto(BASE + href, { waitUntil: "load" });
    await p.waitForSelector('textarea[name="items"]');
    const items = await p.locator('textarea[name="items"]').inputValue();
    assert.match(items.toLowerCase(), /binding wire/);
  } finally {
    await close();
  }
});

test("quote form: invalid phone shows an error and does not reach the success page", async () => {
  const { p, close } = await page(390, 844);
  try {
    await p.goto(BASE + "/contact", { waitUntil: "load" });
    await p.locator('input[name="name"]').fill("Smoke Test");
    await p.locator('input[name="phone"]').fill("123");
    await p.getByRole("button", { name: /get my quote/i }).click();
    await p.waitForTimeout(2500);
    assert.ok(!/\/contact\/success/.test(p.url()), "must stay on the form");
    assert.ok(await p.locator('[aria-invalid="true"], [role="alert"]').first().isVisible());
  } finally {
    await close();
  }
});

test("language switch keeps the page: /products -> /hi/products with lang=hi-IN", async () => {
  const { p, close } = await page();
  try {
    await p.goto(BASE + "/products", { waitUntil: "load" });
    await p.locator('header a[href="/hi/products"]').first().click();
    await p.waitForURL(/\/hi\/products/);
    assert.equal(await p.locator("html").getAttribute("lang"), "hi-IN");
  } finally {
    await close();
  }
});

test("mobile menu opens and lists the main sections", async () => {
  const { p, close } = await page(390, 844);
  try {
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.getByRole("button", { name: "Open menu" }).click();
    for (const name of ["Products", "Brands", "Indore", "Blog"]) {
      assert.ok(await p.getByRole("link", { name, exact: true }).first().isVisible(), name);
    }
  } finally {
    await close();
  }
});

test("unknown URL returns a real 404", async () => {
  const { p, close } = await page();
  try {
    const res = await p.goto(BASE + "/this-page-does-not-exist", { waitUntil: "load" });
    assert.equal(res.status(), 404);
  } finally {
    await close();
  }
});

test("no horizontal overflow on key pages at 360 px", async () => {
  const { p, close } = await page(360, 800);
  try {
    for (const path of ["/", "/products", "/products/binding-wire", "/contact", "/indore"]) {
      await p.goto(BASE + path, { waitUntil: "load" });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(o <= 0, `${path} overflows by ${o}px`);
    }
  } finally {
    await close();
  }
});
