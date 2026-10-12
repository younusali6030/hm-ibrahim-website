# Search Console findings, 12 Oct 2026

Property `sc-domain:hmibrahim.net`, account younusali6030@gmail.com. Read through the signed-in Search Console UI. Figures are for 11 Jul to 10 Oct 2026.

## Performance
48 clicks, 7.11k impressions, CTR 0.7%, average position 6.8 (a mean of best positions, not a fixed rank). 15 pages had any impression.
Top pages: `/` 35 clicks / 6,596 impressions; `/indore/chain-link-fencing-jaali` 10 / 383; `/products?category=nails` 2 / 24.
511 queries; only 4 had clicks: "fencing indore", "h&m hardware store", "near by ms material shop", "chain link installers near me".

## Indexing
14 indexed, 6 not indexed. The whole sitemap is 196 URLs, so most pages are not yet known to Google.

| URL | Reason | Last crawled | Declared canonical when crawled | Google-selected canonical |
|---|---|---|---|---|
| `/blog/top-hardware-contractors-buy-siyaganj` | Duplicate without user-selected canonical | 19 Sep 2026 | none | `https://www.747live.bet/` |
| `/indore/gi-wire` | same | 7 Sep 2026 | none | `https://www.747live.bet/` |
| `/products/ms-wire-rope` | same | 15 Aug 2026 | none | `https://www.747live.bet/` |
| `/products` | same | 14 Aug 2026 | none | `https://www.747live.bet/` |
| `/products/chicken-net` | same | 11 Aug 2026 | none | `https://www.747live.bet/` |
| `/categories/fencing-material` | Crawled, currently not indexed | 20 Jul 2026 | none | the URL itself |

### What this means
- `747live.bet` is an unrelated sports-betting site. It does not copy or mention this site (fetched 12 Oct). Google grouped five of our pages with its home page as the "same" page, and chose it as the representative.
- When Google crawled these pages (Jul to Sep) no canonical tag was seen. The live pages now all return 200, `index, follow`, and a self-referencing absolute canonical on `www.hmibrahim.net`.
- The base URL used for canonicals, sitemap and schema changed on 12 Oct 2026 (commit `fd3052e`): before it, `baseUrl` fell back to `https://hmibrahimco.com` unless `NEXT_PUBLIC_SITE_URL` was set in Vercel. What the Aug to Sep deployment actually emitted cannot be read from here.
- Googlebot's live test (12 Oct) for `/indore/gi-wire` and `/sitemap.xml`: fetched, indexable, our own HTML returned. Security issues: none. Manual actions: none.
- The root cause of the `747live.bet` grouping is **not confirmed**. Candidates: the old deployment served an empty or interstitial shell to Googlebot (so unrelated pages looked identical), or a firewall or challenge rule affected Googlebot during that period. Checking requires the Vercel project's firewall and deployment history, which the connected Vercel account cannot see.

### What to do
1. Deploy the current branch (self-canonical on every page, richer unique content on the three manufacturer pages).
2. Request indexing for the priority URLs so Google re-evaluates them with the new HTML.
3. Re-inspect the five URLs after about two weeks. If the Google-selected canonical is still `747live.bet`, check the Vercel firewall (Attack Challenge Mode, bot protection) and the deployment history for August and September.

## Sitemaps
All three were submitted 12 Oct 2026 and show "Couldn't fetch", with no "Last read" time. Server-side checks: 200, correct `application/xml`, well-formed, 196 / 138 image URLs / 49 video URLs, all on `www.hmibrahim.net`, robots.txt allows them, no redirects, no `X-Robots-Tag`. Google's own live test fetched `/sitemap.xml` successfully. No fault found on our side; resubmit after the deploy and recheck.
