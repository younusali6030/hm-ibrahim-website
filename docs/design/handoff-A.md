# Handoff from catalog work (A)

- `content/trust.ts` still lists "Bulk Stock / Wholesale Pricing / Fast Dispatch / Quality Checked". `TrustBadges` no longer reads it (it prints shop facts from `content/site.ts`), so the file can be deleted or trimmed by whoever owns content/**.
- `content/products.ts`: 17 image paths pointed at missing `/blog/*.jpg` files; they now point at the real posters in `/videos/*.jpg`. Several products now show a poster that is also their video thumbnail.
- `lib/schema.ts` / seo owner: Product JSON-LD still asserts `availability: InStock`; not touched.
- `next dev` with NEXT_DIST_DIR rewrites `tsconfig.json` include; revert before committing.
