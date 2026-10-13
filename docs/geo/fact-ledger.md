# Fact ledger

One row per business fact the site, its structured data or `llms.txt` states. "Source" is where the value is
authored; everything else must read from it or match it. Last reviewed 12 Oct 2026.

Status: **Confirmed** (owner said so in chat), **Observed** (seen on an official profile, not confirmed by the owner),
**Open** (conflict or unverified, left as is).

| Fact | Value | Status | Authored in | Also stated in |
|---|---|---|---|---|
| Trade name | HM Ibrahim & Co | Observed | `content/site.ts` `name` | schema, metadata, `llms.txt` |
| Legal name | H Mohammed Husain HM Ibrahim & Co | Observed (Google listing name "H Mohammed Husain HM Ibrahim & Co (CM)") | `legalName` | schema, `llms.txt` |
| Address | 60, Siyaganj Main Road, Opp. Tijori Gali, Siyaganj, Indore, MP 452007 | Observed (matches Google listing) | `address` | schema, contact page, `llms.txt` |
| Primary phone / WhatsApp | +91 98260 53563 | Observed (matches Google listing) | `phone`, `whatsapp` | schema, click-to-call, `llms.txt` |
| Alternate phone | +91 99930 78654 | Observed (Instagram bio and posts) | `phoneAlt` | schema, `llms.txt` |
| Founded | 1939 | Observed (Instagram "Since 1939") | schema `foundingDate` | copy, `llms.txt` |
| **Opening hours** | Mon to Sat 9 am to 8 pm; Sunday closed | **Open: conflict.** Google listing says 10 am to 8 pm | `hours` | schema `openingHoursSpecification`, FAQ, `llms.txt`, hi site |
| **Manufacturing** | The shop manufactures barbed wire, chain link fencing and wire mesh. The rest of the range is stocked and supplied. | **Confirmed 12 Oct 2026** | `manufacturerTagline` (en, hi) | About, catalogue, `llms.txt` |
| **Order reach** | "Orders accepted across India; delivery arrangements confirmed with each quotation." | **Confirmed 12 Oct 2026** | `orderReach` (en in `content/site.ts`, hi in `content/hi/site.ts`) | schema `areaServed` = Country India, FAQs, product and category pages, guides, `llms.txt` |
| Delivery | Not free, not universal. Confirmed per quotation. Collection from the Siyaganj warehouse is possible. | Confirmed (same message) | FAQ id 4 | services page |
| Local supply towns | Dewas, Ujjain, Mhow, Pithampur and nearby | Observed (existing copy; not re-confirmed) | `content/productSeoContent.ts`, FAQ id 8 | Indore pages |
| Own brands | CM, Border (barbed wire and chain link fencing) | Observed (existing copy, Instagram "{CM}") | `content/brands.ts` | brands pages, schema `brand` |
| Tata | Authorised Tata Wiron dealer | Open: stated in copy, no dealership document seen | `authorizedDealer` | brands page, `llms.txt` |
| GSTIN | 23AACFH8321H1ZP | Observed (existing) | `gstin` | schema `taxID`, footer |
| Google rating | 4.9 from 633 reviews | Observed (Google listing, 12 Oct 2026) | `googleReview` | page badges only; not in schema by design |
| Profiles in `sameAs` | Google Maps cid 13885147699571790648, Instagram `hmibrahimsince1939`, IndiaMART, Justdial | Observed (Instagram bio links to hmibrahim.net) | `content/site.ts` | schema |
| Domain | www.hmibrahim.net canonical; apex `hmibrahim.net` has no DNS records | Open (needs DNS change, see GEO doc section 7) | `lib/site.ts` `PRODUCTION_URL` | all canonicals |
| Prices | Not published; "ask for rate" | Confirmed (existing policy) | n/a | schema has no Offer |
| Email | shoebali786@gmail.com (primary), akbar1972@rediffmail.com (alt) | Observed (existing) | `email`, `emailAlt` | schema `email` |

## Crawler policy (owner decision 12 Oct 2026)

Block model-training crawlers; keep search, discovery and user-requested retrieval. Defined in `lib/crawlerPolicy.ts`,
published by `app/robots.ts`. Tokens verified against each operator's own page on 12 Oct 2026.

| Operator | Training control (blocked) | Search / retrieval token (allowed) | Separable? |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot`, `ChatGPT-User` | Yes. OpenAI says each setting is independent. `ChatGPT-User` is user-triggered and robots rules may not apply to it |
| Anthropic | `ClaudeBot` | `Claude-SearchBot`, `Claude-User` | Yes. Anthropic describes each separately; it gives a snippet only for ClaudeBot |
| Apple | `Applebot-Extended` (does not crawl; opts out of foundation-model training) | `Applebot` (Spotlight, Siri, Safari search) | Yes. Apple says blocked pages can still appear in search |
| Common Crawl | `CCBot` | none | n/a: archive used as training data by third parties |
| Meta | `meta-externalagent` (training and product indexing) | `meta-webindexer` (Meta AI search) | Yes, but `meta-externalfetcher` (user-requested) and `facebookexternalhit` (link previews) may bypass robots.txt. Neither is blocked |
| Google | `Google-Extended` | `Googlebot` | **Partly.** Google-Extended covers Gemini training **and** Gemini grounding together, and Google says it does not affect Search. Google's pages do not say whether AI Overviews are covered; they ride on Search and cannot be separated by robots.txt |
| Microsoft | none in robots.txt | `Bingbot` | **No.** Microsoft's own help page could not be read in this session. Secondary sources say Bing's AI controls are the `NOCACHE` / `NOARCHIVE` meta tags, and that `NOARCHIVE` also removes the page from Copilot answers. Not applied, so Copilot and Bing citations stay possible. Verify at Microsoft before changing |
| Amazon | none | `Amazonbot` | **No.** Amazon documents one token ("may be used to train Amazon AI models") and says the `noarchive` meta tag is the training control. Left allowed |
| ByteDance | `Bytespider` | none | n/a: no operator documentation found; blocked on reputation |
| Perplexity | none needed | `PerplexityBot`, `Perplexity-User` | Perplexity states neither is used to train foundation models; `Perplexity-User` generally ignores robots.txt |

What this does **not** do: robots.txt is a request. It does not stop a crawler that ignores it, does not remove
anything already collected, and says nothing about licensed or third-party copies (for example the shop's pages on
IndiaMART or Justdial).

## Added 13 Oct 2026 (owner statement in chat)
| Fact | Wording used | Status | Where |
|---|---|---|---|
| Warehouses | Structural items (TMT bars, MS flat bars, MS round bars, MS channels, MS pipes, GI pipes, angles) are handled from warehouses in Loha Mandi and New Loha Mandi. Street addresses not published. | Confirmed by owner 13 Oct 2026 | FAQ 11 (EN/HI), services "Warehouse Availability", structural-items category Q&A, `public/llms.txt` |
| Retail at Siyaganj | Retail quantities of the structural items are also stocked at the Siyaganj shop. | Confirmed by owner 13 Oct 2026 | same |
| Customers | Bulk orders, retail quantities, walk-in customers, shop owners (plus contractors, traders, industrial buyers). | Confirmed by owner 13 Oct 2026 | FAQ 2 |
| Phawda | Sold with and without handle, wood / metal / plastic handles, different weights and qualities. Not yet reflected in product specs. | Owner statement; spec details not entered | product pages `sr-hoe-faurdha*` |
