# Open Graph image plan

Metadata is wired. `lib/seo.ts` `ogImage(type)` points at `/og/<type>.png` when the file exists in `public/og/`,
otherwise at `/og/default.png`, otherwise at `/logo-dark.png`. No tag can ever point at a missing file.

Size 1200 x 630 px, PNG, under 300 KB each. Safe zone: keep text 80 px from every edge (WhatsApp crops).

| File | Used by | What it shows | Notes |
|---|---|---|---|
| `public/og/default.png` | Any page with no better template, root layout | Shopfront or logo, "H M Ibrahim & Co, Siyaganj, Indore, since 1939" | Required first: every other type falls back to it |
| `public/og/home.png` | `/` | Shopfront, name, "Iron, wire and mesh since 1939" | |
| `public/og/product.png` | Product pages without their own photo | Neutral product frame, name slot not needed | Pages with a product photo use that photo |
| `public/og/category.png` | `/categories/*` | Stack of coils and mesh, "Range at Siyaganj, Indore" | |
| `public/og/indore.png` | `/indore`, `/indore/*` | Siyaganj Main Road shopfront, "Indore" | |
| `public/og/blog.png` | `/blog` and posts without a hero image | "Buying guides from the counter" | Posts with a hero image use the hero |
| `public/og/brand.png` | `/brands` and `/brands/*` | CM and Border logos side by side | Brand pages pass their hero image; this is the fallback |
| `public/og/about.png` | `/about` | Storefront and 1939 | |
| `public/og/contact.png` | `/contact` | Address, hours, phone as plain text | Must match NAP exactly |

Rules: no prices, no ratings badge, no "100+" claims. Text in English only so it reads on WhatsApp previews.
Check the result in the WhatsApp and Facebook link debuggers after deploy.
