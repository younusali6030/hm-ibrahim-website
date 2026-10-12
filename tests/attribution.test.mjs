import test from "node:test";
import assert from "node:assert/strict";
import { classifySource } from "../lib/attribution.ts";

const own = "www.hmibrahim.net";

test("search engine referrers are organic, with the engine named", () => {
  assert.equal(classifySource({ search: "", referrerHost: "www.google.com", ownHost: own }), "organic:google");
  assert.equal(classifySource({ search: "", referrerHost: "www.bing.com", ownHost: own }), "organic:bing");
  assert.equal(classifySource({ search: "", referrerHost: "google.co.in", ownHost: own }), "organic:google");
});

test("campaign tags and click ids win over the referrer", () => {
  assert.equal(classifySource({ search: "?utm_source=Insta&utm_medium=bio", referrerHost: "l.instagram.com", ownHost: own }), "utm:insta/bio");
  assert.equal(classifySource({ search: "?gclid=abc", referrerHost: "www.google.com", ownHost: own }), "google-ads");
});

test("no referrer is direct; other sites are referral; own site is internal", () => {
  assert.equal(classifySource({ search: "", referrerHost: "", ownHost: own }), "direct");
  assert.equal(classifySource({ search: "", referrerHost: "dir.indiamart.com", ownHost: own }), "referral:dir.indiamart.com");
  assert.equal(classifySource({ search: "", referrerHost: "hmibrahim.net", ownHost: own }), "internal");
});

test("campaign values are cut to safe characters", () => {
  const s = classifySource({ search: "?utm_source=a%20b<script>&utm_medium=x", referrerHost: "", ownHost: own });
  assert.match(s, /^utm:[a-z0-9._-]+\/x$/);
});
