# Repeatable measurement plan

Prepared 12 Oct 2026. Purpose: tell apart (1) changes that are live the moment the branch deploys, (2) what Google must recrawl, and
(3) ranking movement, which takes weeks and is not promised.

## What changes when

| Layer | When it is true | How to check |
|---|---|---|
| On-page changes (titles, H1, FAQ, schema, internal links) | The minute the branch deploys | `curl` the URL, read title, meta description, JSON-LD (script in section 4) |
| Recrawl and re-snippet | Days to weeks. The 12 Oct SERPs still show the **older** titles and descriptions for pages already changed on `main`, so expect the same lag | Search Console URL Inspection: "Last crawl" date; Google cache is not available, so compare the SERP title |
| Rank movement | Weeks to months, and may not happen. Directory pages (IndiaMART, JustDial) hold most top positions in every family tested | Search Console average position by page and query, same 28-day window |
| Local pack | Depends on the Business Profile (hours, categories, reviews), not on the website | Weekly manual check or local rank grid |

Average position in Search Console is **not a fixed rank**. It is the mean of the topmost position the page held each time it was shown,
across locations, devices and personalised results. A page can show 11.4 and still be position 3 for some searchers and position 30 for others.
Compare like with like: same query, same page, same date range, same device filter.

## 1. Baseline (day 0, before deploy)

1. Search Console, Performance, last 3 months: export queries, pages, query-by-page, country, device. Store as `docs/seo/gsc/YYYY-MM-DD-*.csv`.
2. Page indexing report: count of indexed pages, and list of "Alternate page with proper canonical" and "Crawled, not indexed".
3. `query-evidence-log.csv` already holds the 35-row public baseline taken 12 Oct 2026.

## 2. Weekly (10 minutes)

- Search Console: clicks, impressions, CTR, average position for these 8 pages and the 6 head queries below.
- Manual check, incognito, `gl=in`, mobile, signed out, recorded as a new CSV row each time (same columns as the log).

Head queries tracked: barbed wire Indore; barbed wire manufacturer Indore; chain link fencing Indore; chain link fencing manufacturer Indore;
wire mesh supplier Indore; binding wire Indore. Hindi: कांटेदार तार इंदौर; चेन लिंक जाली इंदौर.

## 3. Rank tracking in OpenSEO (needs approval)

A scheduled tracker for 30 to 40 keywords costs credits every run. Estimate with `estimate_rank_tracker_cost` before creating one.
This audit used 206 of 413 credits; 207 remain. Suggested: the 14 priority-1 and priority-2 rows of `query-map.md`, weekly, mobile, Indore location.
Approve a monthly cap first.

## 4. Verification script (run after every deploy)

```bash
for p in indore/barbed-wire indore/chain-link-fencing-jaali indore/wire-mesh products/barbed-wire products/chain-link-fencing brands/tata; do
  curl -s "https://www.hmibrahim.net/$p" | grep -o '<title>[^<]*</title>'
done
curl -s https://www.hmibrahim.net/robots.txt | grep -c "Disallow: /$"   # training crawlers still blocked (expect 1 group)
curl -s https://www.hmibrahim.net/sitemap.xml | grep -c "<loc>"
```

## 5. Success measures (and what does not count)

| Counts | Does not count |
|---|---|
| Clicks and impressions from Search Console for the 8 pages, 28 days against the prior 28 | One manual SERP screenshot |
| `quote_request`, `contact_submit`, `click_call`, `click_whatsapp` in GA4, split by landing page and by organic source | "Ranking improved" with no query, date or location |
| Local pack position for the 6 head queries across 4 weekly checks | Position from a location-simulating provider presented as an Indore phone result |
| AI mentions: manual log of the same queries in ChatGPT search, Perplexity, Gemini, Copilot, cited URL recorded | Assuming a citation from an AI Overview row (this pass returned no text or sources for AI Overviews) |

## 6. Review dates

- Day 14 after deploy: recrawl check (titles in the SERP changed?).
- Day 30: first impressions comparison.
- Day 60: decide on the next batch from real queries in Search Console, not guesses.
- Day 90: repeat the full 35-query log and compare.
