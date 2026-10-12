# H M Ibrahim & Co: design system (evolution, not redesign)

## What stays
- Palette: dark steel. `--background 210 40% 6%`, `--primary #f97316` in rare doses (CTA, one key fact per viewport).
- Type: Big Shoulders Display (h1/h2, `font-display`), Plus Jakarta Sans (h3/h4), Source Sans 3 (body), IBM Plex Mono (`font-mono-brand`, eyebrows and numbers).
- Voice: plain, shop-counter, short sentences. "Shutter up. Stock ready." "Machhar ka full stop." "Border ka vaada."
  Banned: world-class, cutting-edge, seamless, premium, solutions, leverage, best-in-class.
- URLs and information architecture.

## The one motif system (`components/motif/Motif.tsx`)
| Mark | Component | Use |
|---|---|---|
| Wire-gauge ruler | `<GaugeRule label="SWG 8-18" />` | Section top rules, under page heroes, spec sheet dividers. Max one per section. |
| Jali weave | `<JaliWeave />` | Faded into one corner of a hero or panel. Never full-bleed wallpaper. |
| Stencil tag | `<StencilTag>MS ANGLE 40 x 40 x 5</StencilTag>` | Product codes, sizes, category tags. |
| Counter stamp | `<CounterStamp sub="Siyaganj">Cut to size</CounterStamp>` | Once per page at most: spec sheet, success page. Says what the shop does. NEVER a certification claim. |

Rules: one or two marks per viewport. No decorative icons without meaning. No gradient blobs. No identical rounded-card grids:
use ruled lists, tables, ledgers and split rows. Vary radius (inputs 6px, panels 10px, media 14px). Plain secondary text.

## Page header
Every interior page opens with `<PageHero eyebrow title lede>` from `components/site/PageHero.tsx` (jali corner + gauge rule).
Do not write a second header pattern.

## Language
Use `<T en="..." hi="..." />` or `useT()` from `@/lib/i18n` for: nav, page-hero titles/ledes where you can, CTAs, quote form, product names that have a common Hindi name,
FAQ questions. English is always the server-rendered default. Hindi uses Devanagari plus trade words people say (jali, kata taar, kala taar, loha, sariya).

## Conversion
Sticky Call / WhatsApp / Quote bar (`MobileStickyCTA`) is the money feature. Nothing may sit under it: add `pb-28 md:pb-0` to pages with a trailing form or footer links.
Prices are never shown: "Ask for rate".
Real proof only: reviews are verbatim from `content/reviews.ts`. No invented numbers, years, certifications, client names.
Facts that exist: since 1939; 60 Siyaganj Main Road, Indore; opp. Tijori Gali; Mon-Sat 9-8, Sunday closed; Google 4.9 / 633 reviews; own brands CM and Border; Tata Wiron dealer.

## Motion
Respect prefers-reduced-motion. No layout-shifting animation. Opacity/transform only, 150-300ms.
LCP budget 2.5s on throttled mobile 4G: no new eager video, hero images get `priority` only above the fold.
