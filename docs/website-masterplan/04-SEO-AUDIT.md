# 04 SEO audit

Audience: buyers of iron, wire, mesh, fencing in Indore/Madhya Pradesh (retail, contractors, farmers); EN + HI; local + product-intent. Existing deep material: `docs/seo/*` (keyword-map, query-map, product-opportunity-table, measurement-plan, search-console audits) — **not duplicated here; use those as the keyword source.** No search volumes or rankings are asserted in this audit.

## Verified today (live)
- robots.txt valid; 3 sitemaps; sitemap.xml lists 196 `<loc>`; 404 returns true 404 with noindex; `/lab` 404; HSTS present; HTML pages `max-age=0, must-revalidate` (the stale-cache bug from the earlier audit is fixed).
- Titles are unique and keyworded on 6 sampled templates; one H1 each; hreflang/canonical handled in `lib/seo.ts` with tests (`seo.test.mjs`, `seoOwnership.test.mjs`).
- JSON-LD: Organization/HardwareStore, WebSite, BreadcrumbList, Product (no offers by design), FAQPage, BlogPosting, VideoObject, ItemList.

## Findings
| ID | Finding | Evidence | Pri |
|---|---|---|---|
| AUD-004 | Low index coverage: 175/196 URLs not confirmed indexed (13 Oct) | `docs/seo/search-console-audit-2026-10-13.md` | P1 |
| AUD-002 | Google-selected canonical `747live.bet` for 4 URLs | same | P1 |
| AUD-001 | Apex domain: earlier "does not resolve" now **resolves + 308** (fixed) | dig/curl today | closed; verify target |
| AUD-012 | robots.txt blocks GPTBot/ClaudeBot/Google-Extended/etc. while `llms.txt` and `docs/geo` pursue AI visibility — contradictory strategy | robots.txt, public/llms.txt | P3 owner decision |
| AUD-013 | Product rich results "invalid" (no offer/rating) | SC audit | accept; do not invent prices |
| AUD-025 | Hindi: only 6/24 guides have HI editions; HI pages heavier | docs/report | P2 content |

## Strategy
Hold new page creation until indexing of existing 196 URLs is proven (TASK-003 → TASK-015). Then expand where Search Console shows impressions without clicks (striking-distance pages) rather than speculative pages. Internal linking from home hubs already exists; revisit with data.
