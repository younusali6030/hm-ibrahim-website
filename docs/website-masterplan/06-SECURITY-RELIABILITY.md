# 06 Security & reliability

Non-destructive review; no active probing of production beyond GET/HEAD. No secret values read (`.env.local` not opened).

| ID | Finding | Evidence | Severity / confidence |
|---|---|---|---|
| AUD-003 | `token_test.txt` existed in git history (commit c9575d8 removed it); old history still holds it. Rotation not confirmed. Remote: github.com/younusali6030/hm-ibrahim-website | `docs/design/SECURITY-NOTES.md`, `git log --all -- token_test.txt` | High if credential real & unrotated. Contents NOT inspected here. |
| AUD-007 | `npm audit --omit=dev`: 5 (gray-matter, js-yaml, argparse, sprintf-js moderate; `glob` high) | npm audit | Low–Med: gray-matter parses only repo-owned front matter; `glob` path not traced |
| AUD-010 | CSP keeps `script-src 'unsafe-inline'` (no nonces) | next.config.mjs | Low; mitigated by origin allow-list |
| AUD-015 | GA4 loads without consent UI (India DPDP Act / GDPR for EU visitors) | GoogleAnalytics.tsx | Med; legal judgement |
| AUD-029 | No error monitoring / uptime alerting in repo; relies on Vercel logs | package.json | Med |
Positives (verified live): CSP, nosniff, XFO, Referrer-Policy, Permissions-Policy, COOP, HSTS (63072000, no includeSubDomains/preload). Forms: honeypot, rate limit, sniffing. `.env.local` gitignored.
Not tested: XSS fuzzing, CSRF on server action (Next provides origin check), authz (no auth surface), Redis/Sheet credentials scope.
