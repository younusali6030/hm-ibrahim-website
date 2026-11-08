# Monthly Indore rate update (owner decision D-018)

Once a month (owner, 9 Nov 2026): check market prices, write the midpoints on the site, test, and publish. Suggested time: the 1st of each month, morning in India, before the shop opens.

## What gets updated

| Item | File | Field |
|---|---|---|
| TMT bars (branded Fe 500D), per kg | `content/marketRates.ts` | `tmt-bars`: asOf, low, high, mid |
| Chain link jali (GI), per kg | `content/marketRates.ts` + `content/products.ts` (`chain-link-fencing` indicativeRate) | same range in both |
| MS perforated sheet, per kg | `content/marketRates.ts` (`perforated-sheets`) + `content/products.ts` (`ms-perforated-sheet`) | same range in both |
| GI perforated sheet, per kg | `content/products.ts` (`gi-perforated-sheet`) | MS range + ₹10 |

- `asOf` is today's date in India (YYYY-MM-DD).
- `mid` = (low + high) / 2. `tests/marketRates.test.mjs` checks this.
- Keep the wording of the `indicativeRate` strings and change only the numbers. Use the en dash "–".
- The TMT product-page range (`tmt-bars` indicativeRate) is the owner's own and is not part of this update.

## Sources

- Tata nexarc Indore steel and TMT price pages
- IndiaMART Indore listings
- Ambashakti
- Dealer pages

Prefer sources dated within the last 30 days, and record each URL and date in the comment at the top of `content/marketRates.ts`.

## Guardrails

Leave an item unchanged, including its date, and say why if either is true:
- fewer than 2 usable sources were found for it
- its midpoint would move by more than 20 %

## Steps

1. **Work in a clean copy of `main`:**
   - Use `git fetch origin`, then `git worktree add --detach <tmp>/hm-rates origin/main`.
   - Symlink `node_modules` from the main checkout into it.
   - Never edit the main checkout. It often has uncommitted work in progress.
2. **Edit the values** listed above.
3. **Check:** `npx tsc --noEmit` and `npm test` must both pass.
4. **Log it:** add one row to `docs/website-masterplan/13-CHANGELOG-AND-DECISIONS.md`:
   `| <date> | RATES (monthly, D-018) | <item: old mid → new mid (low–high)> ; sources: … |`
5. **Commit** only those files, with the message "Monthly Indore market rates <date>".
6. **Deploy:** `git push origin HEAD:main`. Vercel deploys from `main`.
7. **Clean up:** remove the worktree.
8. **Confirm:** check that https://www.hmibrahim.net/indore/tmt-bars shows the new figure.

## Status

On 9 Nov 2026, a scheduled task that published automatically was refused by the permission check, because it pushes to production unattended. See `docs/website-masterplan/13-CHANGELOG-AND-DECISIONS.md` for what is set up now.
