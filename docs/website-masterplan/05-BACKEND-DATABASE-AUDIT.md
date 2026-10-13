# 05 Backend & database audit

No database, ORM, migrations, auth, or admin. State lives in: Google Sheet (leads), owner inbox, browser localStorage (quote draft, 24 h), in-memory rate-limit map.

| ID | Finding | Evidence | Sev | Simplest fix |
|---|---|---|---|---|
| AUD-009 | Lead failure path logs PII and relies on visitor to retry by phone | actions.ts L202-218 | High | TASK-004: write failed lead to Upstash list (already a dependency path) or secondary mail; alert owner |
| AUD-026 | Sheet headers appended only; column drift risk if edited by hand | quote-sheet.ts | Low | Document "do not reorder columns" in sheet + README |
| AUD-027 | Reference uses `Math.random` (4 chars of 31) — collisions possible, not security-relevant | actions.ts makeReference | Low | Accept or use crypto.randomUUID slice |
| AUD-028 | Client IP from first `x-forwarded-for` entry; spoofable if not behind Vercel (it is) | actions.ts clientIp | Info | None on Vercel |
Positives: input length caps, phone normalisation, attachment magic-byte sniff + 3 MB cap, timeouts around third parties, honeypot returns fake success.
Server Action `bodySizeLimit 4mb` matches the 3 MB attachment cap.
Backup/recovery: Sheet is the record; Google handles durability. No export routine documented (TASK-004 note).
