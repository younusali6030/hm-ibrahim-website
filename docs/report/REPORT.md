# Evolution report: before / after

Measured on a local production build (`next build`, `next start`). Baseline = git tag `baseline-pre-evolution`.
Lighthouse 12, mobile (simulated slow 4G, 4x CPU) and desktop. "Throttled LCP" is a second measurement with real
network throttling (1.6 Mbps, 150 ms RTT, 4x CPU, Moto G class). Lighthouse's simulation is more pessimistic than that.

## Lighthouse mobile

| Page | Perf before | Perf after | LCP before (sim) | LCP after (sim) | Transfer before | Transfer after |
|---|---|---|---|---|---|---|
| / | 54 | 91 | 13.1 s | 3.5 s | 6,848 KB | 556 KB |
| /products | 85 | 93 | 4.4 s | 3.2 s | 711 KB | 669 KB |
| /products/gi-wire | 86 | 91 | 4.2 s | 3.5 s | 517 KB | 650 KB |
| /categories/wiremesh | 92 | 91 | 3.3 s | 3.5 s | 644 KB | 688 KB |
| /brands | 88 | 88 | 4.0 s | 3.9 s | 665 KB | 788 KB |
| /contact | 92 | 94 | 3.4 s | 3.1 s | 875 KB | 466 KB |
| /blog/wire-gauge-chart... | 91 | 92 | 3.5 s | 3.4 s | 445 KB | 566 KB |

Accessibility 100 / Best practices 100 / SEO 100 on every page measured (accessibility dipped to 96 during the
work on the language toggle and the map link label; both fixed). CLS 0 everywhere.

## LCP under real throttling (CDP: 1.6 Mbps, 150 ms RTT, 4x CPU)

| Page | LCP | LCP element |
|---|---|---|
| / | 1.3 s | hero poster (AVIF, 36 KB) |
| /products/gi-wire | 1.3 s | product photo |
| /contact | 1.0 s | lede text |
| /brands | 1.1 s | coil poster (AVIF) |
| /categories/wiremesh | 1.0 s | lede text |
| /blog | 0.9 s | first post image |
| /about, /indore | 2.3 to 2.7 s | storefront photo (now served at quality 60; re-measure after deploy) |

**Open item.** Lighthouse's own simulated mobile LCP is still 3.1 to 3.9 s on every page, which is over the 2.5 s
budget by that model. The pages are small (450 to 800 KB), so what remains is simulated fixed cost (CSS and about
180 KB of JS on a 4x CPU), not a large asset. The real-throttle numbers above are inside budget on all pages except
/about and /indore, which are being closed by the quality change.

## Desktop

Performance 100 on every page measured, LCP 0.6 to 0.8 s, TBT 0.

## What fixed the home page

The film's first frame was the LCP element (3 MB mp4 arriving at 13 s). Now: the poster is a real `<img>` with
`fetchpriority=high` (AVIF 36 KB, was 128 KB JPEG), the film waits for the first touch/scroll/key or 10 idle seconds,
it never starts on Save-Data or 2g/3g, and the six chapter clips and twelve reel posters fetch only near the viewport.
Home first-load JS went 159 kB to 127 kB (unused sections removed, fonts down to two preloaded files).

## Health sweep (38 routes x 3 widths = 114 captures)

One h1 on every page, no horizontal overflow, no broken images, no console errors on any route except the expected
404 on the not-found route. `/blog` and one post time out Playwright's "network idle" at 768 px only because one
below-the-fold lazy image stays "in flight"; the pages load normally.

## Static checks

`tsc --noEmit` clean. `next build` clean, 115 static pages. `next lint` is not configured in this repo (it prompts for
setup), so it was not a gate; adding an ESLint config is on the backlog.

## What changed

- **Identity:** one motif system from the counter (gauge ruler, jali weave, stencil tag, counter stamp), used by one shared
  `PageHero`; ledger and spec-sheet layouts replace identical card grids.
- **Product pages:** spec-sheet table from catalog data only (missing = "Ask at counter"), real CM / Border / Tata
  comparison, Ask for rate / Call / WhatsApp, unverifiable chips ("Quality Checked", "Fast Dispatch") removed.
- **Conversion:** shorter quote form with product/brand/qty prefilled (product name, not slug), WhatsApp fallback,
  success page with next steps, live Siyaganj open/closed status, click tracking for call, WhatsApp, directions.
- **Language:** EN / हिं toggle on nav, hero, proof strip, categories, quote form, page heroes, spec labels.
  One URL per page, so only `en-IN` hreflang is declared (see "Decision for you").
- **Effects (each once, all with static fallbacks):** liquid-steel wordmark in the footer, steel sheen on /indore hero,
  rendered barbed-wire coil loop on /brands (8 s, seamless, 978 KB). All three are original code or renders;
  the liquid-logo repo is PolyForm Shield and was not copied.
- **SEO:** see `docs/seo/REPORT.md` (score 53 to 76 before handoffs; handoffs applied since).
- **Media:** `docs/perf/MEDIA_REPORT.md` (public/ 159 MB to about 132 MB; the source videos were already efficient).
- **Hygiene:** duplicate `actions 2.ts`, `token_test.txt`, `.Rhistory` removed; 13 unused components/content files removed;
  stale planning docs archived; README matches the repo; personal-email defaults replaced; rate limit + honeypot added.

## NEEDS YOU

1. **Rotate the Gmail app password.** `token_test.txt` was tracked in git history before commit c9575d8.
   Rewrite history or at least rotate (`docs/design/SECURITY-NOTES.md`). `.env.local` is gitignored and was never printed.
2. Real **social URLs** (Instagram, IndiaMART, JustDial, Facebook) for `site.social` and schema `sameAs`.
3. **One business name** to use everywhere (four variants exist).
4. **Third or fourth generation** (about meta said four, copy says third).
5. **Primary host in Vercel** (www vs apex); the code canonicalises to `www.hmibrahim.net`, brief says `hmibrahim.net`.
6. Confirm **"All India shipping on request"** and **"We call you back during shop hours"** are promises you keep.
7. **Which items are cut to size at the counter** (stamp currently on mesh, perforated sheets, wire rope, pipes).
8. **Parking / entry notes** (none exist, none shown), shop **lat/long** and **payment methods** if wanted in schema.
9. **CM vs Border real differences** (catalog lists identical specs).
10. How the shop began, the year it moved to 60 Siyaganj Main Road, and the privacy/terms review date.
11. Real photos for products currently showing another product's image (channels, I-beams, sponge, aluminium mesh)
    and re-shoots for the low-resolution ones listed in `docs/perf/MEDIA_REPORT.md`.
12. Set **`NEXT_PUBLIC_GA_ID`** in Vercel; set the three email variables there too.
13. Approve credit-based **keyword / rank / AI-visibility** checks in OpenSEO (none were run).

## Decision for you

**Hindi URLs.** The toggle swaps text on the same URL. Google will not index the Hindi text, and `hi-IN` hreflang
would be dishonest without a separate page. If Hindi search traffic matters, add `/hi/...` pages for the home page,
the six Indore pages and the top ten products; the `<T en hi>` strings are already in place to feed them.

## Not done, and why

- **Next 14 to current:** not attempted. The site builds and passes on 14.2.35; an upgrade touches `next/image`,
  fonts and server actions and is better done on its own branch with the Lighthouse suite above.
- **Deploy, domain, email, posting:** none, per your rules.
- **Credit-based OpenSEO research:** not run (needs your approval).
- **Real product photography:** needs the shop.
- **ESLint config:** `next lint` prompts; add `eslint-config-next` rules in a follow-up.

## Screenshots

`home-1440.png`, `home-390.png`, `products-1440.png`, `product-1440.png`, `brands-1440.png`, `about-1440.png`,
`contact-390.png` in this folder (top of page, final build). Raw Lighthouse JSON beside them.
