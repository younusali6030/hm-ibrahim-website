# Handoff C (conversion layer)

## Links I could not edit (tel / WhatsApp, not in my file set)
They are still counted by the delegated ClickTracker with source = pathname. To get a named source, add `data-track="..."` on the link or a parent.
- app/catalog/page.tsx:148 (WhatsApp)
- app/brands/page.tsx:178, 269 (WhatsApp), 280 (tel)
- app/indore/[slug]/page.tsx:60 (WhatsApp)
- app/categories/[category]/page.tsx:168 (WhatsApp)
- app/blog/[slug]/page.tsx:240 (WhatsApp ask), 288 (tel); 285 is a share link and is intentionally not tracked
- components/SpecificBrandBlock.tsx:25, 31
- components/CTASection.tsx:55 (story agent)
- components/product/ProductDetailClient.tsx:108
- components/ProductSeoContent.tsx:177
- components/LookingForMoreSection.tsx:20, 27, 55, 61

## Needs elsewhere
- Quote links on product and category pages can now add `&qty=` (also `quantity`) to prefill the Quantity field, next to the existing `product`, `category`, `brand`.
- `components/home/LocationPreview.tsx` now renders `<VisitUs />` but is not mounted anywhere (app/page.tsx is not mine). Mount it on home if wanted.
- README.md and DEPLOY.md still reference a personal Gmail default (docs, not mine).
- `npx tsc --noEmit` currently reports one error outside my files: components/product/ProductDetailClient.tsx(116) passes `productSlug` to a component that does not accept it.
- The contact page hero previously said "usually the same working day". I removed that promise; restore only if the shop confirms it.
