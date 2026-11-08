# Indore ranking plan (8 Nov 2026)

**Goal:** get hmibrahim.net (the website, not only the Maps listing) onto page 1 for Indore buying searches.

## Where we are now (data from 8 Nov 2026)

**What shows up in Indore today is the Google Maps listing, not the website.** These numbers come from live mobile Google results in Indore:

| Search | Maps listing (map pack) | Website (organic) |
|---|---|---|
| steel jali near me | #1 | not in top 10 |
| barbed wire shop near me | #2 | not in top 10 |
| perforated sheet | #2 | not in top 10 |
| chadar shop near me | #3 | not in top 10 |
| sariya rate today indore | none | #3 (1 of 3 reads, unstable) |
| chain link fencing / fencing indore / pigeon net installation indore | not shown | not in top 10 |

The pages and sites that win instead: Justdial, IndiaMART, TradeIndia, Instagram, and specialist sites (banaraswalawirecrafts.com, srilakshmiwirenetting.com).

**Search Console, last 3 months:**
- The homepage has 6,970 impressions and 51 clicks. Most of those come from people searching the shop's name ("hm", "h&m", "h m").
- The best page is `/indore/chain-link-fencing-jaali`: 307 impressions, 15 clicks, average position 8.4.
- The biggest page that gets almost no clicks is `/hi/blog/tmt-bar-weight-chart-size-guide-indore`: 1,422 impressions, 0.2% CTR, position 7.7.
- These pages sit in "striking distance" (positions 7–10):
  - `/hi/indore/tmt-bars`: 93 impressions, position 8.5
  - `/blog/wire-gauge-chart-swg-bwg-mm-guide`: 500 impressions, position 9.4
  - `/blog/fibre-mesh-plaster-cracks-guide`: 444 impressions, position 6.1

**Pages Google has not indexed (checked with URL Inspection):**

| URL | Status |
|---|---|
| `/indore` (English hub) | Discovered – currently not indexed |
| `/indore/perforated-sheets` | Discovered – currently not indexed |
| `/indore/construction-hardware` | URL is unknown to Google |
| Homepage video structured data | `uploadDate` "2026-10-11" has no time or timezone, which gives 12 warnings |

All other `/indore/*` pages that were checked are indexed. All of them are in sitemap.xml.

---

## Phase 1: Fix indexing (this week, code plus Search Console)

1. **Fix the video `uploadDate`.** It lives in `content/reels.ts:46`. Change `"2026-10-11"` to `"2026-10-11T10:00:00+05:30"`, or have the JSON-LD builder add the time and timezone.
2. **Add stronger internal links to the 3 unindexed pages.**
   - Google "discovered" them but decided they weren't worth crawling. That usually means weak internal links.
   - Link `/indore` and `/indore/perforated-sheets` from the homepage body, not only from the nav or footer.
   - Link `/indore/perforated-sheets` from `/products/ms-perforated-sheet`, `/products/gi-perforated-sheet` and the perforated-sheet blog posts.
   - Link `/indore/construction-hardware` from the `/categories/construction-tools` page and from the geti, crowbar and hammer product pages. "geti price" and "geti tool" already have 55 impressions.
3. **After you deploy,** use Search Console → URL Inspection → *Request indexing* for these URLs:
   - `/indore`
   - `/indore/perforated-sheets`
   - `/indore/construction-hardware`
   - their `/hi/` versions

## Phase 2: Use the Google Maps listing as the lever (this week, in the Google Business Profile app)

The Maps listing already ranks in Indore. Make it send people to the right pages.

1. **Point the website link at `/indore`** once that page is indexed, instead of the homepage.
2. **Add every main product as a GBP "Product"** (barbed wire, chain link jali, perforated sheet, steel jali, weld mesh, TMT/sariya, mosquito net, GI wire). Link each one to its `/indore/<slug>` page.
3. **Check the categories.** Primary: *Wire mesh supplier* or *Hardware store* (whichever is closer to most sales). Secondary: *Steel distributor*, *Fence supply store*, *Building materials supplier*. Add *Fence supply store* if it's missing. "fencing indore" and "chain link fencing" show a map pack that we're not in yet.
4. **Post once a week** (photo + product + link to its Indore page). Start with fencing and pigeon net, the searches where we're missing from the map pack.
5. **Ask for reviews that name the product** ("bought chain link jali for farm fencing"). Reviews that name products help the listing rank for those searches.
6. **Don't add keywords to the business name.** Google can suspend the listing for that.

## Phase 3: Push striking-distance pages into the top 3 (weeks 2–4, code)

| Page | Target searches | Change |
|---|---|---|
| `/hi/blog/tmt-bar-weight-chart-size-guide-indore` (1,422 impr, 0.2% CTR) | "32 mm ka sariya kitna kg hota hai", "1 टन में कितना सरिया होता है", "6 एमएम सरिया का वजन" | Put the answer in the title and meta description (e.g. "32mm सरिया = 6.31 kg/m…"). Put the full weight table at the top. Add FAQ items for each size. |
| `/indore/tmt-bars` + `/hi/indore/tmt-bars` | "sariya rate today indore", "indore sariya rate", "indore sariya ka bhav" | Add a dated "Indore rate this week" box. Even a price range plus a WhatsApp prompt counts. Pages with a current date win this search. We already show up at #3 sometimes. |
| `/indore/chain-link-fencing-jaali` (best page) | "chain link fencing", "fencing indore", "tar fencing indore" | Add "tar fencing / taar fencing" wording, plus a price-per-sq-ft or per-roll section and photos of real Indore installations. |
| `/blog/wire-gauge-chart-swg-bwg-mm-guide` (500 impr, pos 9.4) | "8 swg to mm", "gi wire gauge to mm", "12 bwg to mm" | Put a one-line answer at the top of the page for each gauge. Link to `/indore/gi-wire`. |
| `/indore/perforated-sheets` (once indexed) | "perforated sheet" (43 impr, pos 6.8), "perforated sheet indore" | Add hole-size × thickness table, price-per-sheet guidance, photos of stock. |

## Phase 4: New pages for gaps where we have nothing (month 2)

1. **`/indore/pigeon-net`** (Hindi: kabootar jali). People search "pigeon net installation indore" and "pigeon net indore". Right now only blog posts cover this (70 + 10 impressions, around position 7.5). Pages for this intent rank better than blog posts.
2. **`/indore/fencing`**: a hub for barbed wire, chain link, concertina, angles and posts, aimed at "fencing indore" and "fencing material indore". Link it to the three product pages.
3. **Refresh the Siyaganj and hardware-market blog posts** to target "indore hardware wholesale market" (positions 40–60 today). Add a map, opening hours, what to buy where, and the shop's own location.

## Phase 5: Listings and links (ongoing)

Justdial, IndiaMART and TradeIndia take most of the top-10 spots for every Indore search we checked. Being *on* those platforms gets the shop into those results, and each listing is a link back.

- Claim or refresh **Justdial**, **IndiaMART** and **TradeIndia** listings. Use the exact same name, address and phone as Google Maps. Link each product to its `/indore/<slug>` page.
- Copy you can paste is already in `profile-copy-ready-to-paste.md`. More link ideas are in `offsite-actions.md` §C.

## How to measure

- **Weekly (free):** In Search Console, filter to the `/indore/` pages. Watch whether impressions rise and the average position moves toward the top 5.
- **Rank tracker (costs credits, needs approval):** track these 15 searches in Indore, mobile:
  - steel jali near me, barbed wire shop near me, perforated sheet, chain link fencing, fencing indore
  - sariya rate today indore, tmt bar indore, pigeon net installation indore, wire mesh indore, weld mesh indore
  - gi wire indore, mosquito net indore, ms angle indore, indore hardware wholesale market, 32 mm ka sariya kitna kg hota hai
- **Re-check on 8 Dec 2026:**
  - Are all `/indore/*` pages indexed?
  - Is the website in the organic top 10 for at least 5 of these searches?
