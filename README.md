# HM Ibrahim & Co — Website

Modern, SEO-friendly website for HM Ibrahim & Co, legacy iron and hardware trading in Siyaganj, Indore.

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn-style components (Radix UI)
- **Framer Motion** for animations
- **Resend** for email (quote & contact forms)
- Content in **local JSON/TS** files (no CMS)

## Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and deploy (Vercel)

```bash
npm run build
npm start
```

To deploy on Vercel:

1. Push the repo to GitHub and import the project in Vercel.
2. Add environment variables (see below).
3. Deploy. Vercel will run `next build` and serve the app.

## Environment variables

Create a `.env.local` file (and add the same in Vercel → Project → Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your [Resend](https://resend.com) API key (required for quote & contact forms) |
| `RESEND_FROM_EMAIL` | Sender email for Resend (e.g. `noreply@yourdomain.com`). If not set, Resend default is used. |
| `QUOTE_FROM_EMAIL` | Gmail address that sends the catalog to the customer (default: `younusali6030@gmail.com`). |
| `GMAIL_APP_PASSWORD` | [Gmail App Password](https://myaccount.google.com/apppasswords) for the account above (required to send catalog). |
| `SERPER_API_KEY` | Optional. [Serper](https://serper.dev) API key to search for product rates in Indore/Siyaganj (free tier: 2500 queries). |
| `OPENAI_API_KEY` | Optional. Used with Serper to extract tentative supplier/rates from search results (gpt-4o-mini). |
| `QUOTE_TO_EMAIL` | Email where quote requests are sent (default: value from `content/site.ts`) |
| `CONTACT_TO_EMAIL` | Email where contact form messages are sent (default: value from `content/site.ts`) |
| `NEXT_PUBLIC_SITE_URL` | Full site URL for sitemap, robots, and metadata (e.g. `https://hmibrahimco.com`) |

**Resend setup:** Verify your domain in Resend and use a from-address on that domain for production. Without `RESEND_API_KEY`, form submissions will fail with a server error.

## Where to change content

All editable content is in a single place so you don’t need to touch components.

| What | File |
|------|------|
| **Company info, address, phone, WhatsApp, hours, GSTIN, social links** | `content/site.ts` |
| **Product categories and products** | `content/products.ts` |
| **Testimonials** | `content/testimonials.ts` |
| **FAQs** | `content/faqs.ts` |
| **Services** | `content/services.ts` |

- **Phones / address / hours:** Edit `content/site.ts` (e.g. `phone`, `whatsapp`, `address`, `hours`).
- **Products:** Edit `content/products.ts` — add or change categories and products (slug, name, shortDesc, specs, image path).
- **Images:** Put product/category images in `public/products/` and reference as `/products/filename.jpg` in content.

## Placeholders

- **Logo:** Replace `public/logo.svg` with your logo (navbar uses text; you can add an `<Image>` in `components/layout/Navbar.tsx` if needed).
- **Product images:** Add images under `public/products/` and set the `image` field in `content/products.ts`. If an image is missing, the UI shows a “No image” fallback.
- **Catalog:** Add `public/catalog.pdf` for the “Download Catalog” link in the footer.
- **Brands:** Edit the placeholder list in `components/home/BrandsSection.tsx` or replace with real brand names.

## Connect your domain (Vercel)

1. In Vercel: Project → Settings → Domains.
2. Add your domain (e.g. `hmibrahimco.com`).
3. Follow Vercel’s instructions to add the suggested DNS records at your registrar.
4. Set `NEXT_PUBLIC_SITE_URL=https://hmibrahimco.com` (or your domain) in environment variables.

## Google Analytics (optional)

1. Create a GA4 property and get the measurement ID (e.g. `G-XXXXXXXXXX`).
2. Add the gtag script in `app/layout.tsx` (e.g. in `<head>` or a dedicated analytics component), or use a package like `@next/third-parties/google`.
3. No env var is strictly required if you hardcode the ID; for a configurable ID you can use `NEXT_PUBLIC_GA_ID`.

## Testing checklist

Before launch, verify:

- [ ] **Forms:** Submit quote and contact forms; check that emails arrive (business + user confirmation for quote).
- [ ] **Links:** All nav and footer links work; “Request Quote”, “WhatsApp”, “Call”, “Get Directions”.
- [ ] **Products:** Search and filter on `/products`; open product detail pages; quote link pre-fills category/product where expected.
- [ ] **Mobile:** Sticky Call/WhatsApp bar appears; layout is readable and tap targets are fine.
- [ ] **SEO:** View page source for meta tags and JSON-LD; open `/sitemap.xml` and `/robots.txt`; check `NEXT_PUBLIC_SITE_URL` is set in production.
- [ ] **Content:** Update `content/site.ts` with real phone, WhatsApp, address, hours, and (if desired) GSTIN.

## Next improvements

- Add real product/category images and replace placeholders.
- Verify Resend domain and from-address for production email deliverability.
- Add optional rate limiting for quote/contact forms (e.g. in-memory or Redis) if you see abuse.
- Consider Google Business Profile and backlinks to improve local SEO.
- Add `catalog.pdf` and optional PDF generation for “Download Catalog”.
- Replace placeholder testimonials with real ones and (with permission) names/companies.
- Optional: blog or news section for updates and SEO.

## License

Private. All rights reserved.
