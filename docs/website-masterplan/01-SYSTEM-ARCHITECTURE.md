# 01 System architecture

## Map
```
Visitor ─► Vercel edge ─► proxy.ts (locale rewrite: / → /en, /hi stays, /en/* 308→/*)
        ─► app/[lang]/* (RSC pages; 57 of 158 .tsx files are "use client")
              content/*.ts + content/blog/posts*/*.md  (no CMS, no DB; gray-matter + react-markdown)
              lib/seo.ts, lib/schema.ts (metadata + JSON-LD), lib/i18n.tsx (<T en hi>)
        ─► Quote form (app/[lang]/contact/QuoteForm.tsx)
              └► server action submitQuote (contact/actions.ts)
                    ├ validate (lib/quoteValidation.ts, honeypot, magic-byte attachment sniff ≤3 MB)
                    ├ rate limit (lib/rateLimit.ts: Upstash/KV REST, else per-instance memory)
                    ├ catalog + indicative rates (lib/catalog.ts; optional Serper/OpenAI, 4 s cap)
                    ├ lead save, parallel: Gmail SMTP notify (lib/quote-notification.ts) + Google Sheet append (lib/quote-sheet.ts)
                    └ customer catalog email (best effort, 9 s cap)
        ─► GA4 (components/GoogleAnalytics.tsx, lazy; events in lib/analytics.ts)
        ─► Click-to-call / WhatsApp / directions (tracked via lib/analytics.ts)
Admin: NONE. "Dashboard" = the Google Sheet + owner inbox. Database: NONE.
```
Lead attribution: `lib/attribution.ts` captures landing page/source client-side, sent as form fields.

## Key workflows traced
| Workflow | Path | Verified how |
|---|---|---|
| Enquiry | page CTA → `/contact?product=…` → server action → email+Sheet → `/contact/success` | Code read; **delivery not exercised** |
| Language switch | `LocaleLink`, `lib/locale.ts`, `proxy.ts` | tests/locale.test.mjs pass |
| Product search | `lib/productSearch.ts` + `content/productAliases.ts` | tests pass |

## Strengths to keep
Single-source content modules; deterministic URL/locale rules with tests; spec-sheet generator per item kind; CSP + header tests; honeypot + sniffing; lead-first ordering in the action (customer email can't block a lead); build-time lastmod script.

## Findings
| ID | Finding | Evidence | Sev |
|---|---|---|---|
| AUD-009 | Lead save has only two channels, both third-party; on both failing the lead is `console.error`-ed (PII in logs) and visitor told to call. No durable queue. | `contact/actions.ts` L202-218 | High |
| AUD-009b | Rate limit falls back to per-instance memory when Upstash env missing; env state unknown | `lib/rateLimit.ts` | Med |
| AUD-022 | Catalogue is 1,476 lines of hand-edited TS (`content/products.ts`); only developers can update products; bus-factor risk | file size | Med |
| AUD-014 | 12 React-compiler lint warnings (set-state-in-effect ×10, refs-in-render ×2) | `npm run lint` | Low |
| AUD-017 | Docs sprawl and stale items: duplicate `spec-gap-copy-2026-10-12 2.md`; README/DEPLOY name personal Gmail; empty `../docs/seo/visibility-audit-2026-10.md` | repo | Low |
| AUD-018 | Untracked `content/blog/posts-hi/farm-fencing-…md`; prod commit vs HEAD unknown | `git status` | Low |

No recommendation to change framework, add a DB, or introduce a CMS now. A CMS is only justified if owners must edit products themselves (decision, TASK-020).
