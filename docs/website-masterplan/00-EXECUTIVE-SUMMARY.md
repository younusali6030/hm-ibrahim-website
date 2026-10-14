# 00 Executive summary

**Baseline:** 13 Oct 2026 · Site: https://www.hmibrahim.net (production) + local repo `HM/` (HEAD `a1abac4`, 1 untracked file) · Auditor: Claude (single pass; see 14 for limits)
**Checkpoint (updated end of 13 Oct 2026):** audit COMPLETE; first implementation wave released to production (`main` a6ca5c8). See "Status" below. Resume point for future sessions: start at `10-MASTER-ROADMAP.md`, then `11-TASK-REGISTER.md`.

## What the site is
Bilingual (EN/HI) marketing + lead-generation site for H M Ibrahim & Co, an iron/wire/mesh trader at Siyaganj, Indore (since 1939). No checkout, no prices, no accounts, no admin UI, no database. **Conversion = call, WhatsApp, quote form, walk-in** (README). Next.js 16 App Router, content in TS/Markdown files, quote form is a server action that emails the owner and appends to a Google Sheet. Hosted on Vercel.

## Assessment
Production-ready and unusually well-engineered for its size: strict TS passes, 81/81 unit tests pass, security headers/CSP live, hreflang/canonicals/sitemaps correct, Lighthouse a11y/BP/SEO = 100 on all 5 pages tested. The remaining risk is **not code quality**; it is (a) **unverified lead delivery and a possibly-leaked mailbox credential**, (b) **search discovery** (most URLs not yet indexed, 4 URLs canonicalised by Google to an unrelated domain), (c) **mobile LCP slightly above 2.5 s**, (d) **no CI / no automated journey tests**.

## Measured (production, Lighthouse 12.8.2, 3 runs/config, median; lab only, NOT field data)
| Page | Mobile perf | LCP | TBT | CLS | Desktop perf |
|---|---|---|---|---|---|
| / | 92 | 3.2 s | 29 ms | 0 | 100 |
| /products | 93 | 3.1 s | 7 ms | 0 | 100 |
| /products/binding-wire | 96 | 2.8 s | 4 ms | 0 | 100 |
| /contact | 98 | 2.3 s | 0 | 0.016 | 100 |
| /hi | 94 | 3.0 s | 18 ms | 0 | 100 |
Accessibility, Best Practices, SEO: 100 on all 30 runs. Details: `09`, raw: scratchpad `lh-results.json` (copied to `evidence/` — see 09).

## Ten most consequential problems (ranked by business impact)
| # | Finding | Type |
|---|---|---|
| 1 | AUD-003 Gmail app password may be exposed in git history (file removed, rotation not confirmed) | Documented by prior audit; rotation status UNKNOWN |
| 2 | AUD-009 Lead delivery never proven end-to-end; single-channel fallbacks (Gmail SMTP, Sheets); on total failure lead exists only in logs | Code-verified; delivery NOT tested |
| 3 | AUD-004 175 of 196 sitemap URLs had no confirmed Google status on 13 Oct | Prior audit (Search Console), not re-measured |
| 4 | AUD-002 Google canonicalised 4 pages to `747live.bet` | Prior audit, awaiting recrawl |
| 5 | AUD-005 Mobile lab LCP 2.8–3.2 s on 4 of 5 pages (target ≤2.5) | Measured |
| 6 | AUD-008 No CI, no browser journey tests, no perf/a11y gates; every guarantee depends on a human running checks | Verified (no `.github`) |
| 7 | AUD-011 Image rights unverified for scraped supplier photos | Prior audit; legal exposure |
| 8 | AUD-015 GA4 loads with no consent mechanism | Code-verified; legal judgement needed |
| 9 | AUD-007 `npm audit`: 5 advisories (gray-matter→js-yaml chain; 1 high) | Measured; build-time input only |
| 10 | ~~AUD-006 `/hi/products` 544 KB HTML~~ corrected: ~45 KB compressed, accepted (see 03) | Measured |

## Ten highest-value improvements
1. TASK-001 Prove lead delivery end-to-end (owner inbox + Sheet + failure path) — low effort, protects the only revenue path.
2. TASK-002 Rotate/confirm Gmail credential & audit Vercel env — 30 min, closes #1.
3. TASK-004 Durable lead fallback (persist failed leads) — small, removes "lead lost" case.
4. TASK-003 Recrawl requests + weekly index-coverage tracking — free, drives organic.
5. TASK-005 CI (tsc, lint, test, build) on every push — ~½ day.
6. TASK-010 Mobile LCP pass (identify element, bytes ahead) — ½–2 days.
7. TASK-007 Image-rights register — owner-driven.
8. TASK-014 Playwright smoke journeys (home→quote, product→quote, language switch).
9. TASK-018 Analytics consent decision (and TASK-012 verify GA4 events).
10. TASK-016 Hindi product-index payload reduction.

## Roadmap summary
Phase 0 (≈1–2 days, mostly owner actions) → Phase 1 foundations (≈2–4 days) → Phase 2 UI polish (small; ≈2–3 days) → Phase 3 perf/SEO (≈2–4 days) → Phase 4 content (gated on indexing evidence) → 5 reliability → 6 cadence. Full detail: `10`.

## First five tasks, in order
TASK-002 → TASK-001 → TASK-004 → TASK-005 → TASK-003 (TASK-003 is calendar-bound; start it in parallel on day 1).
**Single best first task: TASK-001** (prove a quote reaches the owner). Every other improvement is worthless if enquiries are silently lost, and it has never been verified.

## Corrections to earlier documentation
- `docs/seo/search-console-audit-2026-10-13.md` says apex `hmibrahim.net` does not resolve. **Re-checked today:** it resolves (A 216.198.79.1) and returns HTTP 308. Treat as fixed; confirm the 308 target is `https://www.hmibrahim.net/` (TASK-003).

## Documents
`AGENT-RULES.md` (read first, every session) · 01–14 as listed in the folder. Existing prior material is referenced, not duplicated: `docs/report/AUDIT-2026-10.md`, `docs/seo/*`, `docs/design/SECURITY-NOTES.md`, `docs/geo/*`.

## Unknowns
See `14-VALIDATION-AND-TESTING.md` §Unknowns. Biggest: real-user CWV, Search Console current numbers, Vercel env state, lead inbox delivery, GA4 data quality.


## Status at end of 13 Oct 2026 (after the first implementation wave)
| Finding | Status |
|---|---|
| AUD-001 apex domain | Fixed (resolves, 308 to www); confirm target in Search Console |
| AUD-002 foreign canonical (4 URLs) | OPEN: owner to request indexing / recrawl (TASK-003) |
| AUD-003 credential in git history | OPEN: owner to rotate/confirm Gmail app password (TASK-002) |
| AUD-004 low index coverage | OPEN: sitemap now 212 URLs; owner resubmits; monitor weekly |
| AUD-005 mobile LCP | Diagnosed; lab-only; no change (D-003); reopen on field data |
| AUD-006 `/hi/products` size | Closed: ~45 KB compressed (D-004) |
| AUD-007 npm audit | FIXED: 0 advisories |
| AUD-008 no CI / e2e | PARTIAL: smoke tests added; CI workflow written but not active (TASK-026) |
| AUD-009 lead delivery / fallback | PARTIAL: fallback store shipped (needs Upstash env); Sheet path confirmed by owner; inbox not confirmed |
| AUD-011 image rights | Closed on owner attestation |
| AUD-012 AI crawler policy | FIXED: allowed by owner decision; `llms.txt` lists all products |
| AUD-015 analytics consent | FIXED: Consent Mode banner |
| AUD-019 / AUD-023 targets and contrast | FIXED |
| AUD-025 Hindi guides | FIXED: all 24 have Hindi editions (native review pending) |
Not yet re-measured: Lighthouse and the expert scorecard (09) still show the 13 Oct baseline; re-run after the next deploy settles.

## Still remaining (as of end of 13 Oct 2026)
**Owner actions**
1. Rotate / confirm the Gmail app password (TASK-002).
2. Confirm owner inbox and customer catalogue email receive a test quote (TASK-001).
3. Search Console: request indexing for the 4 pages mapped to `747live.bet`, resubmit the 212-URL sitemap, log coverage weekly (TASK-003).
4. Add CI workflow via GitHub UI or a token with `workflow` scope (TASK-026).
5. Set Upstash/KV env vars in Vercel so the lead fallback and shared rate limit work (TASK-002).
6. Send warehouse street addresses and phawda specifications (handle types, weights, qualities).
7. Native read of the 15 new Hindi guides; update Google Business Profile hours and warehouses.
8. Decide catalogue-editing approach (TASK-020).
**Engineering (next)**
9. Re-run Lighthouse x3 and refresh the scorecard (09) after the deploy settles.
10. TASK-015 content plan from Search Console data (needs 4+ weeks); TASK-017 Lighthouse CI budget (needs CI).
11. Optional: shop-front video on About, tap-to-load map on `/indore`, wholesale/bulk landing page (needs owner terms).
