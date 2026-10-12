# Typography & Trust Implementation — Deliverables

## Summary

- **Router:** Next.js App Router (`app/`)
- **Typography:** Upgraded with CSS type scale (clamp), line-height, letter-spacing; two Google fonts (Plus Jakarta Sans, Source Sans 3) with explicit weights.
- **Trust:** Trust badges, testimonials (placeholders clearly marked), optional stats strip; no fake claims; no Review schema for placeholders.

---

## A) Typography Upgrades

### Files changed

| File | Changes |
|------|--------|
| **`app/globals.css`** | Added CSS variables: `--text-h1` through `--text-h4`, `--text-body`, `--text-small` (all `clamp()` for responsiveness), `--leading-*`, `--tracking-*`. Applied to `body` and all `h1`–`h6`; `p` line-height. Added `.space-section` for vertical rhythm. |
| **`tailwind.config.ts`** | Extended `fontSize` with `h1`–`h4`, `body`, `small` using the new CSS variables and line-height/letter-spacing. |
| **`app/layout.tsx`** | Added explicit `weight: ["400", "500", "600", "700"]` to both Google fonts (Plus Jakarta Sans, Source Sans 3). |

### Result

- Headings scale with viewport (clamp); mobile-friendly.
- Consistent line-height and letter-spacing across the site.
- No layout redesign; only typography and spacing.

---

## B) Trust System

### New files

| File | Purpose |
|------|--------|
| **`content/trust.ts`** | Data: `trustBadges` (Since 1939, Bulk Stock, Wholesale Pricing, Fast Dispatch, Quality Checked), `trustTestimonials` (placeholders with `name: "Client (placeholder)"`, `isPlaceholder: true`), `trustMetrics` (placeholders, value `"—"` or `"85+"` for years). Comments explain how to add/update real testimonials. `getTestimonialsForProduct(categorySlug, productSlug, limit)` for product page. |
| **`components/trust/TrustBadges.tsx`** | Renders trust badges as icon + label chips (Calendar, Package, BadgeIndianRupee, Truck, ShieldCheck). |
| **`components/trust/TestimonialsGrid.tsx`** | Grid of testimonial cards (quote, name, companyType, city, optional stars); CTA “Request a Quote” below. |
| **`components/trust/StatsStrip.tsx`** | Optional strip; only shows metrics where `value !== "—"` (e.g. “85+ Years in business”). Placeholders clearly labeled in data. |
| **`components/trust/ProductTestimonials.tsx`** | 2–3 testimonials for product page using `getTestimonialsForProduct`; “Request a Quote” CTA. |

### Files modified

| File | Changes |
|------|--------|
| **`app/page.tsx`** | Import and render `TrustBadges` and `StatsStrip`. New “Trust” section above footer: StatsStrip, then TrustBadges in a bordered section, then existing CTASection. |
| **`app/about/page.tsx`** | Import `TrustBadges`, `TestimonialsGrid`. Main heading uses `text-h1 font-heading`. New section at bottom: TrustBadges, then TestimonialsGrid (title “What our customers say”) with CTA “Request a Quote”. Compliance h2 uses `text-h2 font-heading`. |
| **`app/products/[slug]/page.tsx`** | Import `TrustBadges`, `ProductTestimonials`. After “Related products”, new “Trust” section: TrustBadges, then ProductTestimonials (category + product slug, max 3). Related heading uses `text-h3 font-heading`, links use `text-small`. |
| **`content/testimonials.ts`** | Comment updated: TODO to replace with real testimonials; pointer to `content/trust.ts` for placeholders. |

### Schema

- **LocalBusiness:** Already on homepage (and site-wide) via `components/JsonLd.tsx` — no change.
- **Review schema:** Not added; testimonials in `trust.ts` are placeholders. Add Review/aggregateRating only when using real person/company and rating with permission.

---

## C) Testimonials — Admin-light

- Testimonials live in **`content/trust.ts`** (and existing carousel in **`content/testimonials.ts`**).
- **How to update/add:** Edit `content/trust.ts`. For a real testimonial: add an object with `isPlaceholder: false`, real `name`, `companyType`, `city`, `quote`; get permission. For placeholders: keep `name: "Client (placeholder)"` and `isPlaceholder: true`.
- **`trustMetrics`:** All entries have `isPlaceholder: true` and values `"—"` except “85+ Years”. Comments and `StatsStrip` only show metrics with a non-empty value; replace in `trust.ts` when you have real data.

---

## D) Files Changed / Created (Full List)

**Created:**

- `content/trust.ts`
- `components/trust/TrustBadges.tsx`
- `components/trust/TestimonialsGrid.tsx`
- `components/trust/StatsStrip.tsx`
- `components/trust/ProductTestimonials.tsx`
- `TYPOGRAPHY_AND_TRUST_DELIVERABLES.md` (this file)

**Modified:**

- `app/globals.css`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/about/page.tsx`
- `app/products/[slug]/page.tsx`
- `content/testimonials.ts`

---

## E) Commands to Run & Deploy

```bash
# Install dependencies (if needed)
npm install

# Dev server
npm run dev

# Production build
npm run build

# Git
git add .
git status
git commit -m "Typography upgrades and trust system (badges, testimonials, stats strip)"
git push origin main
```

After push, if Vercel (or your host) is connected to the repo, it will deploy from `main`.
