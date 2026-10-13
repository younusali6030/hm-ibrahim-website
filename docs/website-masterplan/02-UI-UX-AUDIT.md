# 02 UI/UX audit

**Method:** automated probe at 360/390/768/1024/1440 on 9 templates (45 page×width cases) + two viewed screenshots (home 390 and 1440). Not a full manual review of every template (see 14).

## Measured
| Check | Result |
|---|---|
| Page-level horizontal overflow (scrollWidth > viewport) | **0 of 45** |
| Pages with exactly one `<h1>` | 45 of 45 |
| Images missing `alt` attribute | 0 |
| Elements beyond viewport | all inside intentional snap carousels / min-width tables (false positives) |
| Interactive targets < 24 px | max 4 on most pages; **13 on /categories/wiremesh, 18 on /indore** (elements not yet identified) |
Prior audit (docs/report/AUDIT-2026-10.md) reports axe 0 violations on 14 pages × 2 widths and a target-size sweep clean; my count differs because my probe counts any link/button <24 px incl. inline links, which WCAG 2.2 exempts in text. Treat AUD-019 as "verify", not "defect".

## Observations (expert judgement)
- Mobile home: strong value proposition, sticky Get a quote / call / WhatsApp bar, rating shown. Good.
- Desktop home: three-panel video hero; the small mono eyebrow "SIYAGANJ, INDORE · SINCE 1939" sits on busy imagery and reads weakly (AUD-023, contrast to verify with a measured ratio before changing).
- Language switch visible in header on all widths.

| ID | Finding | Priority | Acceptance |
|---|---|---|---|
| AUD-019 | Verify sub-24 px targets on `/categories/wiremesh` and `/indore` | P2 | Each target ≥24 px or inline-in-text exempt; axe `target-size` 0 |
| AUD-023 | Desktop hero eyebrow contrast over video | P3 | Measured ≥4.5:1 at 3 sampled frames |

No redesign recommended. The UI is consistent and conversion-oriented; effort belongs in verification, not restyling.
