# Pre-launch checklist

Use this to verify the site before going live.

## Forms

- [ ] **Quote form** (`/quote`): Submit with real email; business receives email and submitter receives confirmation.
- [ ] **Contact form** (`/contact`): Submit and confirm business receives the message.
- [ ] **Honeypot:** Leave the hidden "website" field empty (bots that fill it are ignored).
- [ ] **Validation:** Try submitting with missing required fields; errors should show.

## Links and CTAs

- [ ] **Navbar:** All links (Home, About, Products, Services, Request Quote, Contact) work.
- [ ] **Footer:** All links including Privacy, Terms, Download Catalog (add `public/catalog.pdf` if needed).
- [ ] **Call button:** Opens phone dialler with correct number (check `content/site.ts`).
- [ ] **WhatsApp:** Opens WhatsApp with correct number and prefilled message.
- [ ] **Get Directions:** Opens Google Maps with correct address.
- [ ] **Request Quote from product page:** Pre-fills category/product on quote form.

## Products

- [ ] **Search** on `/products` filters by name/description/category.
- [ ] **Category filter** shows correct products.
- [ ] **Product detail** `/products/[slug]` shows specs, use cases, and quote/WhatsApp CTAs.
- [ ] **Featured products** on home match `featuredProductSlugs` in `content/products.ts`.

## SEO and technical

- [ ] **Metadata:** Each page has a sensible title and description (view source or use an SEO extension).
- [ ] **JSON-LD:** View source on home page; confirm `application/ld+json` with LocalBusiness is present.
- [ ] **Sitemap:** Open `/sitemap.xml` and confirm all important URLs are listed.
- [ ] **Robots:** Open `/robots.txt`; allow `/` and point to sitemap.
- [ ] **Canonical / OG:** Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph and canonical URLs are correct.

## Content and config

- [ ] **Phone, WhatsApp, address, hours** in `content/site.ts` are correct.
- [ ] **GSTIN:** If you use it, set in `content/site.ts`; if not, set to `""` to hide.
- [ ] **Product images:** Add files under `public/products/` and set paths in `content/products.ts`, or leave fallback.
- [ ] **Testimonials:** Replace placeholders in `content/testimonials.ts` with real ones (with permission).
- [ ] **Brands:** Update placeholder brands in `components/home/BrandsSection.tsx` if desired.

## Accessibility and mobile

- [ ] **Keyboard:** Tab through nav and forms; focus is visible and order is logical.
- [ ] **Mobile:** Sticky Call/WhatsApp bar at bottom; no horizontal scroll; buttons are tappable.
- [ ] **Contrast:** Text is readable against background (dark theme).

## After launch

- [ ] Connect custom domain in Vercel and set DNS.
- [ ] (Optional) Add Google Analytics and/or Google Search Console.
- [ ] Submit sitemap URL in Search Console.
- [ ] Create or update Google Business Profile with site link.
