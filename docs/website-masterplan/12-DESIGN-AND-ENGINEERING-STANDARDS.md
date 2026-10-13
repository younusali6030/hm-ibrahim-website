# 12 Design & engineering standards

Authoritative design system: `docs/design/SYSTEM.md` (do not fork it here). Rules below are the cross-cutting engineering standards implied by the audit.
1. **Never state prices, ratings, or specs not in the content modules**; held attributes stay hidden until maker spec on file (tests enforce).
2. Bilingual: every user-visible string uses `<T en hi>` or content/hi dictionaries; EN URLs stay un-prefixed.
3. Page metadata via `lib/seo.ts` / `content/seoOverrides.ts` only; JSON-LD via `lib/schema.ts` only; no invented schema.
4. Media: `next/image`, explicit sizes, `priority` only for the LCP image; videos need pause control and poster.
5. Third-party scripts must be added to the CSP in `next.config.mjs` and justified in 13.
6. Touch targets ≥44 px primary, ≥24 px minimum; one H1; visible focus.
7. No new dependency without a recorded reason; Next 16 docs in `node_modules/next/dist/docs/` before using Next APIs (AGENTS.md).
8. Motion: only to explain state; respect reduced motion; framer-motion not on non-Indore pages.
9. Leads are never blocked or lost by optional work (customer email, rates lookup).
## Quality gates
| When | Run |
|---|---|
| Every change | `npx tsc --noEmit`, `npm run lint`, `npm test` |
| Pull request/CI | above + `npm run build`, `lastmod:check` (TASK-005) |
| UI change | axe on touched templates at 390 & 1440; screenshot at 360/390/768/1024/1440 |
| Perf-affecting | Lighthouse ×3 median vs table in 03 (no regression >5 pts; LCP not worse) |
| Pre-deploy | smoke journeys (TASK-014), headers check (`tests/cacheHeaders.test.mjs`) |
| Monthly | LH ×3, `npm audit`, Search Console coverage, broken-link crawl of sitemap |
Thresholds are enforced only after TASK-017 establishes a CI baseline.
