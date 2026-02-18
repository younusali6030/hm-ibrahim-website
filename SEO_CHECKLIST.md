# SEO Implementation Checklist

## What was changed in code

### 1. **Central site config**
- **`lib/site.ts`** — Added. Exports `baseUrl`, `nap`, `localSeo`, and `site`. Use `baseUrl` everywhere for canonicals, sitemap, OG, and schema. Set `NEXT_PUBLIC_SITE_URL` in `.env` for production (e.g. `https://hmibrahimco.com`).

### 2. **On-page SEO**
- **`app/layout.tsx`** — Uses `baseUrl` and `site` from `lib/site`. Global metadata, canonical, OpenGraph, Twitter, robots.
- **`app/page.tsx`** — Home: explicit metadata (title, description, keywords, canonical, OG, Twitter). **Indore intent section** added: “Why buy from us in Indore, Madhya Pradesh” with blocks: Best price in Indore, Wholesale in Indore, Delivery in Indore, Industrial suppliers in Indore. Copy is natural with internal links.
- **`app/products/page.tsx`** — Uses `baseUrl` from `lib/site`.
- **`app/products/[slug]/page.tsx`** — Product metadata (title, description, keywords, canonical, OG, Twitter). **Product schema** (name, description, sku, image, brand, category, offers without price, availability, areaServed, aggregateRating, additionalProperty). **FAQ schema** from `productFaqs`. **Visual breadcrumbs** via `Breadcrumbs`; breadcrumb links to category use `/categories/[slug]`.
- **`app/categories/[category]/page.tsx`** — **New.** Dedicated category URLs: `/categories/iron-steel`, `/categories/wire-mesh`, etc. Each has: unique title/description/canonical/OG, H1 “{Category} in Indore, Madhya Pradesh”, intro copy with location, product grid with links, FAQ accordion + **FAQ schema**, CTA to quote and WhatsApp.
- **`app/indore/page.tsx`** — **New.** Index at `/indore`: “Iron & Hardware in Indore, Madhya Pradesh” with metadata, intro copy, list of links to `/indore/[slug]` pages, and “Visit our shop” CTA.
- **About, Contact, Quote, Services, Catalog, Indore [slug]** — Canonicals and metadata use `baseUrl` from `lib/site`.

### 3. **Local SEO**
- **`components/JsonLd.tsx`** — LocalBusiness schema already had address, geo, opening hours, areaServed, aggregateRating. `areaServed` updated so non-city entries (e.g. “Nearby areas”, states) use `Place` instead of `City` where appropriate.
- **Location in copy** — Indore, Madhya Pradesh, Siyaganj used in home (Indore intent), category pages, indore index, and product metadata.

### 4. **Product SEO**
- Each product has a crawlable URL: `/products/[slug]`.
- **Product schema** on each product page: name, description, sku, image(s), brand, category, offers (availability, url, seller, areaServed; no price). aggregateRating when `site.googleReview` exists. additionalProperty from product specs.
- **FAQ schema** on product pages (from `productFaqs` in `content/faqs.ts`). Category pages also have FAQ schema (product FAQs).

### 5. **Technical SEO**
- **`app/sitemap.ts`** — Dynamic. Includes: static pages (home, about, products, services, quote, contact, catalog, **indore**), **all category URLs** (`/categories/[slug]`), all product URLs, brand URLs, indore sub-pages. Uses `baseUrl` from `lib/site`.
- **`app/robots.ts`** — Allows all, points sitemap to `baseUrl/sitemap.xml`. Uses `baseUrl` from `lib/site`.
- **Canonicals** — Set on layout (home) and on every key page (about, products, categories, product detail, indore, contact, quote, services).
- **JSON-LD** — LocalBusiness in `JsonLd.tsx`, BreadcrumbList via `JsonLdBreadcrumb`, Product and FAQ via `SeoJsonLd` on product/category pages.

### 6. **Content & structure**
- **Products dataset** — Still `content/products.ts` (categories + products). Product metadata and schema use existing fields (name, shortDesc, categorySlug, specs, materials, etc.). No new product fields added; location keywords come from metadata logic.
- **Category pages** — Generated from same `categories` array; each category has its own URL and internal links to products.
- **Internal linking** — Product breadcrumbs link to `/categories/[slug]`. Footer: **Categories** (all category pages) and **Products in Indore** (indore sub-pages). Navbar: added **Indore** to main nav.
- **`components/Breadcrumbs.tsx`** — New. Visual breadcrumb (e.g. Home > Products > Category > Product) for product and category pages.
- **`components/SeoJsonLd.tsx`** — New. Helper to render JSON-LD script(s) from schema object(s).

---

## What you must do outside code

1. **Google Business Profile**
   - Create or claim your profile for “HM Ibrahim & Co” at the Siyaganj address.
   - Add correct NAP (name, address, phone), hours, and category (e.g. hardware store / building materials).
   - Add website URL (your live domain).
   - Use the same `profileUrl` (or the real Google Maps/Business URL) in `content/site.ts` → `googleReview.profileUrl` so the site’s rating badge and schema match.

2. **Google Search Console**
   - Add the property for your domain (e.g. `https://hmibrahimco.com`).
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`.
   - Monitor indexing for home, `/products`, `/categories/*`, `/products/*`, and `/indore` (and `/indore/*`).
   - Fix any coverage or mobile issues reported.

3. **Citations & NAP**
   - Use the same NAP from `content/site.ts` (and `lib/site.ts` nap) on directories, social profiles, and any listings (JustDial, Sulekha, etc.) so NAP is consistent everywhere.

4. **Reviews**
   - Encourage Google reviews and, if you collect them elsewhere, consider adding Review schema later (optional). `aggregateRating` in schema uses `site.googleReview`; keep that updated with real rating and count.

5. **Domain & env**
   - Set `NEXT_PUBLIC_SITE_URL` in production (e.g. Vercel env) to your real domain (e.g. `https://hmibrahimco.com`). No trailing slash. This drives canonicals, sitemap, OG, and schema URLs.

6. **Rich results**
   - Test key URLs in [Google Rich Results Test](https://search.google.com/test/rich-results): home (LocalBusiness), a product page (Product + FAQ), a category page (FAQ).
   - Optionally validate [schema.org](https://validator.schema.org/) for a few pages.

7. **Performance**
   - Keep using Next.js Image where possible; images are already optimized. Monitor Core Web Vitals (e.g. PageSpeed Insights) and fix any regressions.

---

## File summary

| File | Action |
|------|--------|
| `lib/site.ts` | **Created** — baseUrl, nap, localSeo, site |
| `components/SeoJsonLd.tsx` | **Created** — JSON-LD helper |
| `components/Breadcrumbs.tsx` | **Created** — Visual breadcrumbs |
| `components/home/IndoreIntentSection.tsx` | **Created** — Indore intent blocks on home |
| `app/categories/[category]/page.tsx` | **Created** — Category pages with SEO + FAQ |
| `app/indore/page.tsx` | **Created** — Indore index |
| `app/layout.tsx` | **Updated** — baseUrl/site from lib/site |
| `app/page.tsx` | **Updated** — metadata + IndoreIntentSection |
| `app/products/[slug]/page.tsx` | **Updated** — Product/FAQ schema, Breadcrumbs, lib/site, category link to /categories |
| `app/sitemap.ts` | **Updated** — baseUrl, categories, indore index |
| `app/robots.ts` | **Updated** — baseUrl from lib/site |
| `app/about/page.tsx`, `app/contact/page.tsx`, `app/quote/page.tsx`, `app/services/page.tsx`, `app/catalog/page.tsx`, `app/indore/[slug]/page.tsx` | **Updated** — baseUrl/site from lib/site |
| `components/JsonLd.tsx` | **Updated** — baseUrl, areaServed schema fix |
| `components/JsonLdBreadcrumb.tsx` | **Updated** — baseUrl from lib/site |
| `components/layout/Footer.tsx` | **Updated** — Categories column, Indore in quick links |
| `components/layout/Navbar.tsx` | **Updated** — Indore in nav |
