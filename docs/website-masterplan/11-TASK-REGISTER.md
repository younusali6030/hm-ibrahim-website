# 11 Task register

Status: ☐ open · ◐ in progress · ☑ done (only with evidence recorded in 13). Pri P0 = lead/credential risk now. All tasks open at baseline 13 Oct 2026.

| ID | Ph | Pri | Title | Findings | Effort | Risk | Depends | Status |
|---|---|---|---|---|---|---|---|---|
| TASK-001 | 0 | P0 | Prove quote delivery end-to-end on production | AUD-009 | S | Low | 002 | ☐ |
| TASK-002 | 0 | P0 | Confirm/rotate Gmail app password; audit Vercel env (NEXT_PUBLIC_SITE_URL absent, UPSTASH_*, GA ID, QUOTE_*) | AUD-003, 009b | S | Low | – | ☐ |
| TASK-003 | 0 | P1 | Request recrawl of 4 foreign-canonical URLs; confirm apex 308 target; weekly index coverage log | AUD-001/002/004 | S + ongoing | Low | – | ☐ |
| TASK-004 | 0 | P1 | Durable lead fallback when mail+Sheet both fail (store in Upstash list or secondary mail; stop logging PII to console) | AUD-009 | M | Med | – | ☑ code complete, not deployed |
| TASK-005 | 1 | P1 | CI workflow: tsc, lint, test, build on push/PR | AUD-008 | S | Low | – | ☑ workflow added, not yet run on GitHub |
| TASK-006 | 1 | P2 | Trace `glob` high advisory; replace gray-matter or pin patched | AUD-007 | S–M | Low | 005 | ☑ code complete, not deployed |
| TASK-007 | 5 | P1 | Image-rights register for scraped supplier photos; replace or get permission | AUD-011 | M (owner) | Med | – | ☑ owner attestation 13 Oct (see 13) |
| TASK-008 | 1 | P3 | Resolve 12 React lint warnings | AUD-014 | M | Med (UI regress) | 005 | ☒ deferred by decision D-005 |
| TASK-009 | 1 | P3 | Docs hygiene: remove duplicate/empty files, drop personal email from README/DEPLOY, commit/delete untracked post | AUD-017/018 | S | Low | – | ☑ partly: duplicate removed; blog post left to owner |
| TASK-010 | 3 | P1 | Mobile LCP: identify element + blocking bytes per template, fix, re-measure | AUD-005 | M | Med | – | ◐ diagnosed, no change; see 13 |
| TASK-011 | 2 | P2 | Identify sub-24 px targets on wiremesh & indore; fix real ones | AUD-019 | S | Low | – | ☑ code complete, not deployed |
| TASK-012 | 5 | P2 | Verify GA4 events/key events with DebugView; record baseline counts | AUD-020/031 | S | Low | – | ◐ collection confirmed; DebugView/key events owner |
| TASK-013 | 2 | P3 | Measure and, if <4.5:1, fix desktop hero eyebrow contrast | AUD-023 | S | Low | – | ☑ code complete, not deployed |
| TASK-014 | 5 | P2 | Playwright smoke journeys (home→quote, product→quote prefill, EN/HI switch, mobile menu) | AUD-008 | M | Low | 005 | ☑ passes locally 7/7; CI run pending |
| TASK-015 | 4 | P2 | Search Console-driven content/linking plan (after ≥4 wks data) | AUD-004/025 | M | Low | 003 | ☐ |
| TASK-016 | 3 | P2 | Cut `/hi/products` HTML/RSC payload | AUD-006 | M | Med | – | ☒ closed: premise corrected, no change |
| TASK-017 | 3 | P2 | Lighthouse CI + bundle budget using median-of-3 | AUD-005/008 | M | Low | 005,010 | ☐ |
| TASK-018 | 4 | P2 | Analytics consent decision and implementation if required | AUD-015 | M | Med | – | ☑ code complete, not deployed |
| TASK-019 | 4 | P3 | Decide AI-crawler policy; align robots.txt, llms.txt, GEO docs | AUD-012 | S | Low | owner | ☑ code complete, not deployed; outcomes not promised |
| TASK-020 | 5 | P3 | Decide whether owners need to edit catalogue without code (CMS/Sheet-sourced) | AUD-022 | S (decision) | – | – | ☐ |
| TASK-021 | 6 | P3 | Monthly cadence: LH ×3, SC coverage, dependency audit, record in 13 | – | S/mo | Low | 017 | ☐ |
| TASK-022 | 4 | P2 | Hindi editions of the 15 English-only guides | AUD-025 | M | Low | – | ☑ code complete; Hindi wording needs owner/native review |

## Acceptance + verification (selected)
- **TASK-001** Accept: one test lead with a distinctive name appears in owner inbox and Sheet within 2 min, reference matches, success page shows; catalog email arrives if email given; remove test row. Verify: screenshot of inbox/Sheet recorded in 13. Rollback: n/a.
- **TASK-002** Accept: old app password revoked; new one set in Vercel; redeploy; TASK-001 passes after. 
- **TASK-004** Accept: with mail and Sheet credentials deliberately invalid in a preview env, the lead is retrievable from fallback store and no PII reaches console. Rollback: feature-flag env var.
- **TASK-005** Accept: workflow green on a PR; fails on an intentional type error.
- **TASK-010** Accept: median-of-3 mobile LCP ≤2.5 s on /, /products, /products/[slug], /hi (lab, same preset as 03); a11y/BP/SEO remain 100.
- **TASK-016** Accept: `/hi/products` HTML ≤300 KB uncompressed, search/filter behaviour tests pass.
- Others: acceptance as stated in title; add specifics when picked up (AGENT-RULES step 5).
