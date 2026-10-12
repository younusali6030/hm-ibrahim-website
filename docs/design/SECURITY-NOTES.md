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

## Limits of the rate limit
It lives in server memory. On serverless hosts each instance has its own counter and instances restart, so it only slows a script; it is not a guarantee. For real protection add a shared store (Upstash Redis or Vercel KV) or a Vercel Firewall rate-limit rule on the `/contact` route.

## Other things seen (not changed, not in this scope)
- `README.md` and `DEPLOY.md` still name a personal Gmail address as the default sender.
- `content/site.ts` carries a business email that is public by design; confirm it is the one the owners want shown.
- On a failed save the server logs the lead (name, phone, items) so it is not lost. Those logs contain personal data; restrict who can read them.
