import test from "node:test";
import assert from "node:assert/strict";
import { normalizeIndianMobile, validEmail, validateQuoteFields } from "../lib/quoteValidation.ts";

test("mobile numbers: accepted shapes", () => {
  for (const ok of ["9826053563", "98260 53563", "+91 98260 53563", "098260 53563", "91-9826053563", "6000000000"])
    assert.equal(normalizeIndianMobile(ok)?.length, 10, ok);
});

test("mobile numbers: rejected shapes", () => {
  for (const bad of ["", "12345", "5826053563", "98260535", "98260535631", "abcdefghij", "+1 415 555 0132"])
    assert.equal(normalizeIndianMobile(bad), null, bad);
});

test("email: optional, but must look like one when given", () => {
  assert.equal(validEmail("a@b.co"), true);
  assert.equal(validEmail("a@b"), false);
  assert.equal(validEmail("a b@c.com"), false);
  assert.deepEqual(validateQuoteFields({ name: "Asha", phone: "9826053563", email: "" }), {});
  assert.deepEqual(validateQuoteFields({ name: "Asha", phone: "9826053563" }), {});
  assert.deepEqual(validateQuoteFields({ name: "Asha", phone: "9826053563", email: "oops" }), { email: true });
});

test("required: name (2+ characters) and phone", () => {
  assert.deepEqual(validateQuoteFields({ name: "A", phone: "123" }), { name: true, phone: true });
  assert.deepEqual(validateQuoteFields({ name: "  ", phone: "9826053563" }), { name: true });
});
