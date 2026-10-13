# 07 Engineering quality

| Gate | Result 13 Oct |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run lint` | 0 errors, 12 warnings |
| `npm test` | 81/81 pass (14 files; node:test) |
| `npm run build` | not re-run this pass (prior audit built it; `.next` present). Run in TASK-005 |
| CI/CD | **none** (no `.github`); Vercel builds on push |
| E2E / a11y / perf automation | none in repo (prior audits used ad-hoc scripts) |
| Dependencies | Next 16.4, React 19.3, Tailwind 3.4, framer-motion 11 (limited use), three 0.186 |
Strengths: tests encode business rules (spec sheets, safety wording, cache rules); AGENTS.md warns agents about Next 16; docs are extensive. Weaknesses: AUD-008 no CI/e2e; AUD-014 lint warnings; AUD-017 doc sprawl.
Another engineer could maintain this using README + `docs/design/SYSTEM.md`; the product-data conventions are the main implicit knowledge.
