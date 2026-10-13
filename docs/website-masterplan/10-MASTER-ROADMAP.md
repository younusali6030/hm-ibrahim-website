# 10 Master roadmap

Prioritisation: (Impact × Confidence) ÷ Effort, adjusted for dependency and risk. Effort S ≤½ d, M 1–2 d, L 3+ d. Tasks are defined in `11-TASK-REGISTER.md`; this file only orders them.

| Phase | Goal | Tasks | Exit criteria |
|---|---|---|---|
| 0 Stabilise | Nothing can silently lose a lead or leak a credential | TASK-002, 001, 004, 003 | Credential rotated or confirmed; test lead arrives in inbox + Sheet; failed-lead path proven; recrawl requested |
| 1 Foundations | Guardrails so later work is safe | 005, 006, 008 (lint), 009 (docs) | CI green on push; audit count understood; docs consolidated |
| 2 UI/UX | Verified, not redesigned | 011 (targets), 013 (eyebrow contrast) | axe target-size clean on all templates |
| 3 Perf & SEO | Mobile LCP ≤2.5 s lab on 5 templates; payload trim | 010, 016, 017 (budget) | LH median-of-3 meets target; budget in CI |
| 4 Content & growth | Expand only where data says | 015, 018 (consent), 019 (AI crawler policy) | Decision records; content list derived from Search Console |
| 5 Reliability | Detect problems before customers do | 014 (e2e), 012 (analytics verification), 020 (CMS decision), 007 (image rights) | Smoke suite in CI; uptime/error alerts |
| 6 Continuous | Cadence | TASK-021 | Monthly LH + SC review recorded in 13 |

Dependencies: 017 needs 005; 014 needs 005; 015 needs 003 results (≥4 weeks); 010 before 017 (set budget after improvement); 004 before 001's failure-path test.
Parallel: 003 (calendar-bound) runs alongside everything; 007 and 018 are owner-led.
