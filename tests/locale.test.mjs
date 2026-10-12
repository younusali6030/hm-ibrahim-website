import test from "node:test";
import assert from "node:assert/strict";
import { localePath, stripLocale } from "../lib/locale.ts";

test("localePath: English is the plain URL, Hindi is under /hi", () => {
  assert.equal(localePath("hi", "/products"), "/hi/products");
  assert.equal(localePath("en", "/hi/products"), "/products");
  assert.equal(localePath("hi", "/"), "/hi");
  assert.equal(localePath("en", "/hi"), "/");
  assert.equal(localePath("hi", "/hi/contact"), "/hi/contact");
});

test("localePath leaves external, protocol-relative and hash links alone", () => {
  assert.equal(localePath("hi", "https://wa.me/919826053563"), "https://wa.me/919826053563");
  assert.equal(localePath("hi", "//cdn.example.com/x"), "//cdn.example.com/x");
  assert.equal(localePath("hi", "#quote"), "#quote");
});

test("stripLocale does not mistake /history for /hi", () => {
  assert.deepEqual(stripLocale("/history"), { lang: "en", path: "/history" });
  assert.deepEqual(stripLocale("/hi/blog"), { lang: "hi", path: "/blog" });
  assert.deepEqual(stripLocale("/hi"), { lang: "hi", path: "/" });
});

test("stripLocale: the internal /en rewrite path maps back to the public path (server-rendered language link)", () => {
  assert.deepEqual(stripLocale("/en"), { lang: "en", path: "/" });
  assert.deepEqual(stripLocale("/en/products"), { lang: "en", path: "/products" });
  assert.equal(localePath("hi", stripLocale("/en/products/binding-wire").path), "/hi/products/binding-wire");
  assert.deepEqual(stripLocale("/english"), { lang: "en", path: "/english" });
});
