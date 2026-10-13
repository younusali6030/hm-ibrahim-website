# Agent rules — read before ANY change to this site

Site: Next.js 16 lead-gen site for HM Ibrahim & Co. Read `HM/AGENTS.md` (Next 16 differs from training data) first.

## Before
1. Read `10-MASTER-ROADMAP.md`, `11-TASK-REGISTER.md`, `12-DESIGN-AND-ENGINEERING-STANDARDS.md`.
2. Name the TASK-ID you implement (or document a new one in 11 + 13 first).
3. Re-verify the finding still holds in the current code/production.
4. List dependencies and what could break (quote flow, locale routing, SEO metadata).
5. Define acceptance tests before editing.
## During
Change only what the task needs; keep existing business logic, wording rules and brand; no new dependencies or unrelated refactors; keep EN/HI parity; follow patterns in 12.
## After
1. `npx tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` when routes/config changed.
2. Test the affected journey at 390 and 1440; run axe if UI changed; Lighthouse ×3 if perf/SEO-affecting.
3. Verify acceptance criteria; record evidence in 13; set status in 11.
4. Name the next dependency-ready task.
**No task is ☑ without recorded evidence.** Critical newly found issues may be fixed first: log them as AUD/TASK entries immediately after. Never print or commit secrets; never deploy without the owner's go-ahead.
