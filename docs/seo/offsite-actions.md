# Off-site actions (prepared, not executed)

Prepared 12 Oct 2026. Nothing here was published, edited or sent. Each item needs the owner (or someone with the login) to act.
Evidence references are rows in `query-evidence-log.csv` (Q-number is the `id` column) or live checks made on 12 Oct 2026.

## A. Fix first (they change what searchers see and click)

| # | Where | What is wrong today | Exact action | Evidence |
|---|---|---|---|---|
| A1 | DNS at the registrar or Vercel | `hmibrahim.net` (apex) has no A record; `www` is a CNAME to Vercel. The Google listing and the Instagram bio link to the apex. | Add `hmibrahim.net` to the Vercel project and set it to redirect to `https://www.hmibrahim.net`, then add the A/ALIAS record Vercel shows. Verify with `curl -I https://hmibrahim.net/`. | `dig +short hmibrahim.net A` returned nothing on 12 Oct 2026 |
| A2 | Google Business Profile hours | Search shows "Opens 10 am". The site, schema and `llms.txt` say 9 am to 8 pm. JustDial also shows 10:00 am. | Owner decides the true hours. If 10 am is right, change `content/site.ts` (`hours`), `public/llms.txt`, `content/hi/site.ts` and the schema hours (one source: `site.hours`), and keep `tests/geo.test.mjs` in step. If 9 am is right, change the GBP and JustDial. | Q1 pack rows: "Closed · Opens 10 am"; JustDial page "Monday 10:00 Am - 8:00 Pm" |
| A3 | Google Business Profile website field | Points at the apex, which does not resolve until A1 is done. | Set the website to `https://www.hmibrahim.net/` now; it can stay after A1. | Ledger row "Domain" |
| A4 | Search Console | Not connected to OpenSEO, so clicks, impressions and queries are unknown. `site:` shows 10 sampled URLs, mostly redirected or parameter URLs, with old titles. | Add a Domain property for `hmibrahim.net`, submit `https://www.hmibrahim.net/sitemap.xml`, `sitemap-images.xml`, `sitemap-videos.xml`. After deploy, use URL Inspection, Request indexing on the 8 URLs in section D. In OpenSEO project settings, connect Search Console (the project's domain is currently `hmibrahimco.com`, not `hmibrahim.net`; fix it). | Q35 (`site:`), OpenSEO `not_connected` |

## B. Profile copy that matches the confirmed facts

Manufacturing scope (owner, 12 Oct 2026): barbed wire, chain link fencing, wire mesh. Everything else stocked. Orders accepted across India.

| # | Where | Exact text or change |
|---|---|---|
| B1 | GBP business description (750 characters max) | "HM Ibrahim & Co, 60 Siyaganj Main Road, Indore, since 1939. We manufacture barbed wire, chain link fencing and wire mesh. We also stock TMT bars, MS angles, pipes, binding wire, GI wire, perforated sheets, mosquito net, wire rope and construction tools, and are an authorised Tata Wiron dealer. Retail and wholesale. Orders accepted across India. Ask for the rate on WhatsApp or by phone." |
| B2 | GBP categories | Keep the existing primary. Look in the GBP category picker for the closest available to "Wire products manufacturer" or "Fence supply store" and add it only if the owner agrees it is true. Do not add a manufacturer category for perforated sheet, mosquito net, TMT or pipes. |
| B3 | GBP products (one entry each, photo, no price) | Barbed wire; Chain link fencing; Welded wire mesh; Crimp wire mesh; Binding wire; Perforated sheet; Mosquito net roll; Tata Wiron binding wire. Use the site's product names and link each to its `https://www.hmibrahim.net/products/...` page. |
| B4 | GBP Q and A | Seed four owner-written answers: "Do you manufacture barbed wire?", "Do you supply outside Indore?", "Do you have Tata Wiron?", "What are your hours?" Use the exact sentences from the FAQ blocks on `/indore/barbed-wire`. |
| B5 | JustDial (listing "H Mohd Husain H M Ibrahim & Co") | Add categories Barbed Wire Manufacturers, Chain Link Fencing Manufacturers, Wire Mesh Manufacturers (it is listed today under dealer categories such as Stainless Steel Wire Mesh Dealers and Welded Mesh Dealers). Correct hours to the answer from A2. Website `https://www.hmibrahim.net`. |
| B6 | IndiaMART | IndiaMART category pages hold rank 1 to 5 on most queries tested, and no IndiaMART page for the shop appeared in the brand query. Confirm whether the listing in `content/site.ts` is live and claimed. If it is, add three product listings (barbed wire, chain link, wire mesh) with the specs from the site and no price. If it is not, the owner opens the account (not done here). |
| B7 | TradeIndia ("H. Mohd. Husain HM Ibrahim Company") | Listing says "Distributor, Supplier of Iron & Hardware Items". Add "manufacturer of barbed wire, chain link fencing and wire mesh". |
| B8 | Instagram bio (`@hmibrahimsince1939`) | Says "Wholesale Distributor & Retailer ... Pan India Supply". Add "Manufacturer of barbed wire, chain link, wire mesh" and the `www` link. |
| B9 | Facebook | Two thin pages appear: "H. M. Ibrahim & Company" (5 likes) and `/chottemullaji/`. Claim or merge, and use one name. |
| B10 | Name | The business is shown as "H Mohammed Husain HM Ibrahim & Co (CM)" on Google, "H Mohd Husain H M Ibrahim & Co" on JustDial, "HM Ibrahim & Co" on the site. Pick one display name and one legal name line and use it on every profile. |

## C. Legitimate links and listings to look at (not contacted)

| Candidate | Why | Check before acting |
|---|---|---|
| Tata Wiron dealer or contractor locator (tatawiron.com) | The "Tata Wiron dealer Indore" SERP lists tatawiron.com pages; being on the locator is a real, first-party signal. | Whether the shop already has a dealer record; ask the Tata Wiron area contact. |
| Indore builders, contractors and fabricators associations | Customers of the three manufactured lines. | Their member directories accept listings only from members. |
| Customers' own sites (farms, schools, factories the shop supplied) | A named testimonial with a link is a real citation. | Ask each customer; never ask for a specific link text. |

No purchased links, no directory submission services, no review swaps.

## D. Request indexing after deploy (Search Console, URL Inspection)

`/indore/barbed-wire`, `/indore/chain-link-fencing-jaali`, `/indore/wire-mesh`, `/hi/indore/barbed-wire`, `/hi/indore/chain-link-fencing-jaali`,
`/products/barbed-wire`, `/products/chain-link-fencing`, `/brands/tata`.
