# 09 Measurement scorecard

## A. Tool-generated (Lighthouse 12.8.2, headless Chrome, macOS, production, 13 Oct 2026, 3 runs, median)
Full table in `03`. Accessibility/Best Practices/SEO = 100 on `/`, `/products`, `/products/binding-wire`, `/contact`, `/hi` for both mobile and desktop (30/30 runs). Evidence: `evidence/lh-results.json`.
Other tools: `tsc` pass; ESLint 0 err/12 warn; node:test 81/81; npm audit 5 vulns.
NOT MEASURED: CrUX/INP field data, PageSpeed Insights API, WebPageTest, axe re-run this pass.

## B. Expert scorecard (professional judgement, not an industry standard)
| Category (weight) | Score | Confidence | Basis | Target |
|---|---:|---|---|---:|
| UI/UX usability (15) | 82 | Medium | probe + 2 screenshots + prior axe | 88 |
| Visual design (10) | 82 | Low-Med | 2 screenshots only | 88 |
| Accessibility (10) | 90 | Medium | LH 100, prior axe 0 violations, target-size to verify | 95 |
| Performance (10) | 80 | High (lab) / none (field) | LH, LCP>2.5 s mobile | 90 |
| Technical SEO (12) | 85 | Medium | code + live checks; index coverage poor | 92 |
| Content & organic growth (10) | 60 | Low | rich content but unproven discovery | 75 |
| Conversion effectiveness (10) | 70 | Low | design sound; no data | 80 |
| Architecture & code quality (10) | 85 | Medium | tsc/tests/structure | 88 |
| Security & privacy (8) | 72 | Medium | headers good; credential, consent open | 85 |
| Reliability & testing (5) | 60 | Medium | unit tests, no CI/e2e/monitoring | 80 |
**Weighted total ≈ 78/100** (0.15·82+0.10·82+0.10·90+0.10·80+0.12·85+0.10·60+0.10·70+0.10·85+0.08·72+0.05·60 = 78.0). Partial-confidence: content, conversion, visual categories rest on thin evidence; do not quote 78 externally.
Rubric: 90+ excellent, 75–89 adequate/strong with specific gaps, 50–74 deficient, <50 critical.
