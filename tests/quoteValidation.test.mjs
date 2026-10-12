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

import {
  normalizeDeliveryMode,
  normalizeCustomerType,
  normalizeNeededBy,
  sniffAttachment,
  ATTACHMENT_MAX_BYTES,
} from "../lib/quoteValidation.ts";

test("delivery mode and customer type: only known keys are kept", () => {
  assert.equal(normalizeDeliveryMode("Pickup"), "pickup");
  assert.equal(normalizeDeliveryMode("courier"), "");
  assert.equal(normalizeCustomerType("Wholesale"), "wholesale");
  assert.equal(normalizeCustomerType("<script>"), "");
});

test("needed-by: today to one year ahead, India time, else dropped", () => {
  const now = new Date("2026-10-12T20:00:00Z"); // 13 Oct 01:30 in India
  assert.equal(normalizeNeededBy("2026-10-13", now), "2026-10-13");
  assert.equal(normalizeNeededBy("2026-10-12", now), "");
  assert.equal(normalizeNeededBy("2027-10-12", now), "2027-10-12");
  assert.equal(normalizeNeededBy("2028-01-01", now), "");
  assert.equal(normalizeNeededBy("2026-02-31", now), "");
  assert.equal(normalizeNeededBy("tomorrow", now), "");
});

test("attachment: recognised by its first bytes, not its name", () => {
  assert.equal(sniffAttachment(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])), "jpg");
  assert.equal(sniffAttachment(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d])), "png");
  assert.equal(sniffAttachment(Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])), "pdf");
  assert.equal(sniffAttachment(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), "webp");
  assert.equal(sniffAttachment(Uint8Array.from([0x4d, 0x5a, 0x90, 0x00])), null); // an .exe renamed to .jpg
  assert.ok(ATTACHMENT_MAX_BYTES <= 4 * 1024 * 1024);
});
