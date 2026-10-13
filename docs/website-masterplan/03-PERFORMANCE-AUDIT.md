# 03 Performance audit

Tool: Lighthouse 12.8.2 (npx cache), Chrome headless, one Mac, production URLs, 13 Oct 2026. Mobile = default simulated 4G/4× CPU; desktop = custom preset (1350 px, 10 Mbps, no CPU slowdown). Three runs each, median reported. **Lab only. No CrUX/field data was obtained (NOT MEASURED).** TBT is not INP.

| Page | Dev | Perf (3 runs) | LCP | FCP | TBT | CLS | SI | Transfer |
|---|---|---|---|---|---|---|---|---|
| / | M | 92/92/94 | 3.2 | 1.7 | 29 | 0 | 1.7 | 535 KB |
| /products | M | 93/94/94 | 3.1 | 1.1 | 7 | 0 | 1.2 | 603 KB |
| /products/binding-wire | M | 96/92/96 | 2.8 | 1.2 | 4 | 0 | 1.2 | 566 KB |
| /contact | M | 98/98/98 | 2.3 | 0.9 | 0 | 0.016 | 0.9 | 391 KB |
| /hi | M | 96/94/94 | 3.0 | 1.4 | 18 | 0 | 1.4 | 518 KB |
| all five | D | 99–100 | 0.5–0.8 | 0.3 | 0 | 0 | 0.3–0.4 | 560 KB–1.1 MB |
Server: TTFB 0.10 s on `/` (single curl, Vercel cache HIT). HTML sizes (uncompressed, curl): / 251 KB, /products/binding-wire 154 KB, /hi/products **544 KB**.

## Findings
| ID | Finding | Cause (hypothesis, verify) | Fix direction |
|---|---|---|---|
| AUD-005 | Mobile LCP 2.8–3.2 s on 4/5 pages vs ≤2.5 s goal | Prior audit: simulated LCP dominated by bytes ahead of LCP (JS ≈170 KB, fonts ≈100 KB); hero is video/3D | Identify LCP element per page via LH trace; defer non-hero JS; confirm poster is the LCP candidate and is preloaded |
| AUD-006 | CORRECTED 13 Oct: `/products` is ~504 KB uncompressed HTML in EN and ~544 KB in HI, but only ~42 KB (EN) / ~45 KB (HI) over the wire with Brotli. Size is next/image srcset (≈103 KB), class attributes and 93 product images; not Hindi-specific, not a user-visible problem | Accepted, no action (TASK-016 closed) |
| AUD-024 | Mobile perf variance (92–96) between identical runs | Lab noise + video | Budget by median-of-3 |

Targets (benchmarks, not claims): perf ≥90 mobile (met 5/5), LCP ≤2.5 s lab mobile (met 1/5), field LCP p75 ≤2.5 s, INP ≤200 ms, CLS ≤0.1 (met).
Reproduce: `npx lighthouse https://www.hmibrahim.net/ --preset=perf --form-factor=mobile` ×3; field data via PageSpeed Insights / Search Console CWV report.
