# 14 Validation & testing

## Commands executed (13 Oct 2026, macOS, Node 24.13.1)
`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm audit --omit=dev` · curl HEAD/GET on 6 production paths + robots/sitemap · `dig` apex/www · Lighthouse 12.8.2 script (30 runs) · Playwright-core (Chrome) responsive probe, 9 pages × 5 widths · two screenshots viewed.
Evidence files: `evidence/lh-results.json`, `evidence/resp.json`.
## Re-run recipe
Lighthouse: see 03. Probe: Playwright script in session scratchpad (not retained); recreate from description in 02.
## Unknowns / not verified
| Item | Why | How to close |
|---|---|---|
| Lead delivery to inbox/Sheet | No credentials used; would send real mail | TASK-001 |
| Vercel env values | No Vercel access exercised | TASK-002 |
| Credential in git history | File contents deliberately not read | TASK-002 |
| Field CWV / INP | No CrUX access | PSI + Search Console |
| Current index coverage | Search Console not queried this pass | TASK-003 |
| GA4 data quality | No GA access | TASK-012 |
| Full visual review of all templates | Only home viewed | Manual pass in TASK-011/013 |
| `npm run build` this pass | Not run (no code changed) | TASK-005 |
| Competitor benchmarking | Not performed; avoided unsupported claims | Optional in TASK-015 |
| Prior-audit figures (index counts, axe) | Taken from repo docs, not re-measured | label retained |
