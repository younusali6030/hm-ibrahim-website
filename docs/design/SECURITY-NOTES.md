# Security notes

## Secrets
- `.env.local` is gitignored (`.gitignore` line 14) and is not tracked. Its values were not read or printed while preparing this note.
- A file named `token_test.txt` was tracked in git history and removed in commit `c9575d8`. Everything before that commit still contains it. Treat any credential that was in it as exposed.

### Recommended
1. Rotate the Gmail App Password used for `GMAIL_APP_PASSWORD` now (Google Account > Security > App passwords: revoke, create a new one), then update `.env.local` and the Vercel environment variable. Rotation is the fix that matters; history rewrite alone does not un-leak a secret.
2. Optionally rewrite history to drop the file (`git filter-repo --path token_test.txt --invert-paths`), then force-push. Everyone must re-clone. Only worthwhile if the repo is or may become public; do it after rotation, not instead of it.
3. If the repo has ever been on a public remote, assume the old password was scraped.
4. Consider a dedicated sender mailbox for the site rather than a personal account.

## What changed in code
- Personal email defaults removed from `.env.example`, `lib/quote-notification.ts`, `lib/catalog-email.ts`. Sender and recipient now come only from env; if unset the email is logged and skipped, never sent elsewhere.
- The customer catalog email footer showed the sender mailbox; it now shows the public shop email from `content/site.ts`.
- Quote server action: honeypot field (`website`), in-memory rate limit of 5 per 10 minutes per IP and per phone number.

## Rate limit
`lib/rateLimit.ts`: 5 requests per 10 minutes per IP and per phone number. With `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or the Vercel KV pair) the counter is shared by every serverless instance. Without them, or if the store is unreachable, it falls back to per-instance memory, which only slows a script down. Set the variables in Vercel to get the real limit.

## Response headers (next.config.mjs)
CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy and COOP on every route. Scripts and styles keep `'unsafe-inline'` because Next.js inlines its bootstrap and the JSON-LD blocks; the policy still blocks framing, plugins, base-tag and cross-site form posts, and limits script, XHR, image and frame origins to the site, Google Tag Manager / GA4 and the Google Maps embed. A new third-party script or embed must be added to the policy or the browser will block it.

## Dependencies
`npm audit --omit=dev` (13 Oct 2026): nodemailer and source-map-js fixed. Left: Next.js 14 advisories and its bundled postcss (fix is Next 16), and gray-matter's js-yaml chain (parses only our own markdown). Plan the Next upgrade on its own branch.

## Other things seen (not changed, not in this scope)
- `README.md` and `DEPLOY.md` still name a personal Gmail address as the default sender.
- `content/site.ts` carries a business email that is public by design; confirm it is the one the owners want shown.
- On a failed save the server logs the lead (name, phone, items) so it is not lost. Those logs contain personal data; restrict who can read them.
