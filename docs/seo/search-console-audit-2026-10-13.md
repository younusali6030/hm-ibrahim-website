# Search Console audit, 13 Oct 2026

Property `sc-domain:hmibrahim.net`. Builds on `search-console-findings-2026-10-12.md`. URL-level data: `url-inventory-2026-10-13.csv`.
"Confirmed" means read from Search Console or the live site today. Sampled, not exhaustive: 17 URLs were inspected individually.

## Prioritised issues

| # | Issue | Affected | Evidence | Done | Remaining |
|---|---|---|---|---|---|
| 1 | Old build declared every canonical on a host that does not exist | Every page crawled before 12 Oct | Google's stored HTML for `/quote` (crawled 20 Sep) and `/` (10 Oct) contains `<link rel="canonical" href="https://hm-ibrahim-website.verce/...">`, and the same host in `og:url` and schema (54 to 60 times per page). GitHub deployment records show no production deploy between Feb and 12 Oct, so this build served every Jul to Sep crawl. Google reported it as "User-declared canonical: None". | Already fixed in code on 12 Oct (`lib/site.ts` hard-codes `https://www.hmibrahim.net`). Verified live on all 196 URLs. | Remove or correct `NEXT_PUBLIC_SITE_URL` in Vercel so the bad value cannot return (owner; production code no longer reads it). |
| 2 | Google chose `https://www.747live.bet/` as canonical for four pages | `/products`, `/indore/gi-wire`, `/products/ms-wire-rope`, `/blog/top-hardware-contractors-buy-siyaganj` | Inspected today: still "Duplicate without user-selected canonical", last crawls 14 Aug to 19 Sep. See section below. | Two pages from the same group (`/products/chicken-net`, `/categories/fencing-material`) were recrawled 12 Oct with the valid canonical and are now indexed as themselves. | Four pages await recrawl. Request indexing when Search Console accepts it; "Validate fix" not started. |
| 3 | Main sitemap: "Sitemap could not be read" | `https://www.hmibrahim.net/sitemap.xml` (196 URLs) | Last read 13 Oct, type "Unknown", 0 discovered. Live test by Googlebot on 13 Oct: "URL is available to Google". Server returns 200, well-formed XML. The two companion sitemaps read fine. | Resubmitted 13 Oct (accepted, still failing). Candidate fix prepared on branch `fix/sitemap-strict-order`, not committed or deployed. | Decide whether to deploy the branch, then resubmit once. |
| 4 | Apex domain does not resolve | `hmibrahim.net` | Authoritative GoDaddy nameservers return no A or AAAA record; only NS, SOA and the Google verification TXT. Vercel reports the domain as misconfigured. `www` is a CNAME to Vercel and works. | None possible: the connected Vercel account does not contain this project, and DNS is at GoDaddy. | Owner: see "Apex domain" below. |
| 5 | Most pages not yet discovered | 175 of 196 sitemap URLs have no confirmed Google status | Sampled pages show "URL is unknown to Google" or "Discovered, currently not indexed". Inspections show the main sitemap as "No referring sitemaps detected" or "Temporary processing error". | Homepage indexing requested (it links to the main hubs). | Depends on issue 3. |
| 6 | Stale legacy URLs in the index | 6 `/products?category=...`, 2 `/quote...` | Listed as indexed in the report; live they canonicalise to `/products` or 308 to `/contact`. | None needed. | Legitimate exclusions; they drop out on recrawl. Do not use Removals. |
| 7 | Product rich results flagged invalid | 1 item (old markup) | "Either offers, review or aggregateRating should be specified". Live schema deliberately has no price or rating (`lib/schema.ts`). | Left as is. No prices invented. | Will stay "invalid" for product snippets; does not affect indexing. |

## Why Google picked the betting domain (issue 2)

What is established:
- The four pages were crawled between 14 Aug and 19 Sep, when the site declared its canonical on the non-existent host `hm-ibrahim-website.verce` (a truncated `vercel.app` address, almost certainly a mistyped `NEXT_PUBLIC_SITE_URL`). Google could not use it, so the pages had no usable canonical.
- Google's stored HTML for two other pages from the same build contains no betting content, links, scripts, iframes or redirects. External hosts found: Google Tag Manager, WhatsApp, IndiaMART, JustDial, schema.org only.
- Current HTML, headers and redirects are clean on all 196 URLs. Security Issues and Manual Actions: none.
- `747live.bet` (Next.js behind Cloudflare) returns no HM Ibrahim content to a browser or a Googlebot user agent from here, and Google has no pages from it matching our terms (`site:` query, 13 Oct).

What is not established:
- Google keeps no stored HTML for the four affected URLs ("View crawled page" is disabled), so what Googlebot received on those four crawls cannot be seen.
- Why Google's duplicate grouping landed on that particular domain. The invalid canonical explains why Google was free to choose another URL; it does not explain the choice. Possibilities that cannot be tested from here: a grouping error on Google's side, or the other site showing copied content only to Google's own IP addresses.
- One inconsistency: `/products?category=wires` (crawled 14 Sep, same build) shows a declared canonical of `https://www.hmibrahim.net/products`. Not explained.

Status: not resolved. It is resolved per URL only when an inspection shows "Google-selected canonical: Inspected URL". If any of the four still show the betting domain two weeks after a recrawl, report it to Google via the Search Console help forum.

## Sitemap (issue 3)

- Exact URL submitted: `https://www.hmibrahim.net/sitemap.xml`. It is the same URL listed in robots.txt.
- Not a blocking problem: Googlebot fetches it, robots.txt allows it, no `X-Robots-Tag`, no redirect.
- Differences from the two sitemaps that work: element order (Next 14 writes `<xhtml:link>` before `<lastmod>`, which is out of order in the sitemap schema), `Content-Type: application/xml` without a charset, and `max-age=0`.
- The branch rewrites it as a route handler like the other two: `loc`, `lastmod`, then `xhtml:link`; `application/xml; charset=utf-8`. Built and checked locally: same 196 URLs, valid XML. This is a likely cause, not a confirmed one.

## Apex domain (issue 4)

1. Vercel, project for this site, Settings, Domains: add `hmibrahim.net` and set it to redirect (308) to `www.hmibrahim.net`.
2. GoDaddy DNS for `hmibrahim.net`: add an `A` record, host `@`, value `76.76.21.21` (the value Vercel recommends for this domain), TTL 1 hour. Leave the `www` CNAME alone.
3. Check: `curl -I https://hmibrahim.net/` returns 308 to `https://www.hmibrahim.net/`.

## Reconciliation: report versus the 196 sitemap URLs

The Page indexing report (data to 8 Oct) knows 20 URLs: 14 indexed, 6 not. Eight of the 14 are legacy URLs that are not in the sitemap.

| Status of the 196 sitemap URLs | Count | Basis |
|---|---|---|
| Indexed | 9 | 5 inspected today, 4 from the report |
| Appears in a `site:` search, not inspected | 1 | `/indore/wire-mesh` |
| Not indexed, canonical shown as the betting domain | 4 | Inspected today |
| Discovered, currently not indexed | 3 | Inspected today |
| Unknown to Google | 4 | Inspected today |
| Not confirmed | 175 | Not inspected and not in the report |

Of the 175 unconfirmed, 132 are listed in the image or video sitemap (which Google has read), and 43 are in neither, so they depend on the main sitemap or internal links. All 196 are meant to be indexed; none is blocked, noindexed, redirected or canonicalised elsewhere.

## Requests

| Action | Status |
|---|---|
| `sitemap.xml` | Submitted (resubmitted 13 Oct). Not read by Google. |
| `sitemap-images.xml`, `sitemap-videos.xml` | Submitted 12 Oct. Read: 138 and 49 pages. |
| Request indexing `/` | Submitted 13 Oct. |
| Request indexing `/products` | Failed twice: "Oops! Something went wrong". Whether this is the daily quota is not confirmed. |
| Validate fix | Not started. |

Next indexing requests, in order, when available: `/products`, `/indore/gi-wire`, `/products/ms-wire-rope`, `/blog/top-hardware-contractors-buy-siyaganj`, `/products/barbed-wire`, `/products/chain-link-fencing`, `/hi`, `/brands/tata`.

## Search performance, 12 Jul to 11 Oct (observed)

47 clicks, 7.11k impressions, CTR 0.7%, average position 6.8. India 43 clicks / 6,921 impressions; mobile 88% of impressions. Search Console has no city breakdown, so Indore cannot be isolated.

- The homepage has 6,598 of the impressions and 35 clicks. About 2,080 impressions come from 110 very short brand-like queries ("h", "hm", "h&m"), where the listing shows but is rarely the thing searched for. That drags CTR down and is not fixable.
- `/indore/chain-link-fencing-jaali`: 379 impressions, 9 clicks, position 7.8. The only non-home page with real traction.
- Commercial queries already near the top with no clicks: "perforated sheet" (48 impressions, position 6.4), "machhar" (69, 4.8), "chadar factory near me" (10, 2.4), "sariya shop near me" (9, 8.4), "chain link fencing" (8, 3.2), "tmt bar supplier near me" (6, 3.5), "ss wire mesh" (5, 2.4), "steel shop indore" (4, 4.5).
- Indore-named queries ranking poorly: "fencing indore" (18.2), "mosquito net indore" (23.5), "indore hardware wholesale market" (41), "hardware shop siyaganj indore" (53.5).
- Competing pages: six `/products?category=` URLs collect 121 impressions that belong to `/products` and the category pages.

Estimate, not data: the pages built for these terms (perforated sheets, mosquito net, TMT, the Indore pages) are mostly not indexed yet, so the gap is discovery first, copy second.
