# Handoff to design: SEO changes that need a component or page edit

Everything below is in files the SEO agent does not own (`app/**/page.tsx`, `app/layout.tsx`, `components/*`).
Each item says what is wrong, the exact change, and how to check it. Helpers already exist in `lib/seo.ts`,
`lib/schema.ts` and `content/*`, so most edits are one line.

Priority: P1 = affects indexing, snippets or rich results. P2 = quality. P3 = polish.

## P1-1. Home page metadata has no og:image and a 203-character description

`app/page.tsx` exports its own `metadata` with an `openGraph` object that has no `images`. Next replaces the
layout's `openGraph` wholesale, so the home page ships no `og:image`. Title is 78 characters, description 203.

Change:

```ts
import { buildPageMeta } from "@/lib/seo";
export const metadata: Metadata = buildPageMeta({
  title: "Iron, Wire and Mesh in Indore since 1939",
  description:
    "Iron, wire and mesh from Siyaganj Main Road, Indore, since 1939. Wire mesh, jali, barbed wire, TMT bars, perforated sheets. Retail and wholesale. Ask for the rate.",
  path: "",
});
```

Check: `curl -s localhost:3000/ | grep -o '<meta property="og:image"[^>]*>'` returns one tag.

## P1-2. Pages with their own `metadata` object: move to `buildPageMeta`

These skip the title budget, the og:image template and the overrides in `content/seoOverrides.ts`:
`app/products/page.tsx` (title 81, description 202), `app/services/page.tsx` (78), `app/catalog/page.tsx`,
`app/indore/page.tsx` (67 / 197), `app/indore/[slug]/page.tsx`, `app/categories/[category]/page.tsx`,
`app/privacy/page.tsx`, `app/terms/page.tsx`.

For each, replace the object with `buildPageMeta({ title, description, path })`. `path` has no leading slash,
for example `products`, `indore/wire-mesh`, `categories/wires`. For `indore/[slug]` pass
`path: \`indore/${page.slug}\``. For categories pass `path: \`categories/${category.slug}\``; the range titles and
descriptions are already written in `content/seoOverrides.ts` and are applied automatically. `/catalog` should also
pass `noIndex: true` only if the owner decides it is a print view (see NEEDS YOU in REPORT.md); otherwise leave indexable.

## P1-3. Root layout default og:image

`app/layout.tsx` hard-codes `/logo-dark.png` in `openGraph.images` and `twitter.images`. Use the helper so the
default template is picked up as soon as `public/og/default.png` exists:

```ts
import { ogImage } from "@/lib/seo";
const og = ogImage("default");
// openGraph.images: [{ url: og.url, width: og.width ?? 1200, height: og.height ?? 630, alt: ... }]
// twitter.images: [og.url]
```

## P1-4. Home FAQ schema lists 6 questions, the page shows 4

`app/page.tsx`: `faqs.slice(0, 6)` goes into the FAQPage schema but `FAQAccordion` renders `faqs.slice(0, 4)`.
Google requires the marked-up questions to be visible. Use one constant for both:

```ts
const homeFaqs = faqs.slice(0, 4);
// schema: homeFaqs.map(...)    UI: <FAQAccordion faqs={homeFaqs} .../>
```

Or build the schema with `faqPage(homeFaqs)` from `lib/schema.ts`.

## P1-5. Category FAQs are templated and repeat a claim

`app/categories/[category]/page.tsx` `buildCategoryFaqs()` stamps the same answer onto every product
("We keep multiple sizes ... ready ... Stock moves quickly"). That is boilerplate repeated across 9 pages and
claims stock levels the shop has not confirmed. Replace with the real product FAQs already written in
`content/productCopy.ts` (first FAQ of each product), or show two category-level FAQs only. All FAQs that stay on
the page remain valid for FAQPage because they are visible.

## P2-1. Schema builders to adopt (optional, the sanitiser already cleans what is there)

`components/SeoJsonLd.tsx` now passes every node through `sanitizeJsonLd()`: it removes `offers`, `sku`/`mpn` (were
the URL slug), `speakable`, ratings and reviews, and turns duplicated business fragments into `@id` references.
Nothing breaks if the pages are left alone. To add what the sanitiser cannot invent:

| Page | Add | Builder in `lib/schema.ts` |
|---|---|---|
| `/products` | ItemList of all 53 products (now capped at 30) | `itemList(name, items)` |
| `/` | VideoObject per reel (12) | `videoObject()` with `homeReels` from `content/reels.ts` |
| `/brands/cm`, `/brands/border` | VideoObject for the walkthrough | `videoObject()` with `brandVideos` |
| `/indore/[slug]` | ItemList of the related products | `itemList()` |
| `/blog/[slug]` | Use the builder for BlogPosting (author and publisher as `@id`) | `blogPostingJsonLd()` |
| product pages | Product with `brand` set to CM / Border / Tata Wiron only where a brand variant exists | `productJsonLd({ brands })` |

Do not add Offer, AggregateRating, Review or `priceRange`. See the rules at the top of `lib/schema.ts`.

## P2-2. Reels list lives in a component

`components/home/ReelsSection.tsx` holds the 12 reels inline. `content/reels.ts` has the same list for the video
sitemap. Make the component import `homeReels` so one edit updates both. Titles in the file mirror the on-page titles.

## P2-3. /catalog has two h1 elements

Crawl of `/catalog` shows `h1: 2`. Keep one h1; demote the second to h2.

## P2-4. Logo preloaded as the high-priority image on every page

Home HTML contains `<link rel="preload" as="image" ... logo-wordmark.png ... fetchPriority="high">` with a
srcset up to 3840 px. The nav logo is 154 to 168 px wide. This competes with the real LCP image. In the Navbar
`Image`: give it `width`/`height` of the displayed size, `sizes="168px"`, and remove `priority`. Then mark the hero
image (not the logo) `priority`.

## P2-5. Fonts

Four Google font families are loaded in `app/layout.tsx` (Plus Jakarta Sans 4 weights, Source Sans 3 4 weights,
Big Shoulders Display 2, IBM Plex Mono 1). Four woff2 files are preloaded on the home page. Drop unused weights and,
if Plus Jakarta Sans is only used for a few headings, remove it. Target: 3 preloaded font files.

## P2-6. Product page: related blog posts are built from `getRelatedBlogSlugsForProduct`

Already correct. Every product now returns 2 to 3 guide slugs (`content/productCopy.ts`). Nothing to do. Just make
sure the "Related products & reading" block stays above the fold on mobile.

## P3. Alt text

Spot-check shows several product images reuse another product's file (for example `ms-channels` uses
`ms-angle.png`, `sponge` uses `welding-rod.png`, `ms-i-beams-joists` uses `ms-round-bar.png`). Real photos for
channels, I-beams, sponge and aluminium/MS wiremesh (currently `gi-wire.png`) would help image search and trust.
