# Handoff from story/trust agent (B)

Files I do not own that need a change:

1. `components/catalog/PrintCatalogButton.tsx`: button is 36px tall, `rounded-lg`, `text-sm`. On /catalog I resize it from outside with a `[&>button]` wrapper. Better: use `btnMain` classes from `components/site/PageHero.tsx` with `min-h-[52px]`.
2. `components/home/ReelsSection.tsx` (used on /about): check 44px targets on the play and CTA links, and that each reel `<video>` has an accessible name.
3. `app/globals.css`: `.blog-prose .blog-table-wrap` is now unused (tables use `.blog-table-scroll`, styled in `components/story/story.css`). The old rules can go. Also `.rounded-sm` is globally 14px; the story pages use explicit `rounded-[14px]`/`[10px]`/`[6px]` so they do not depend on it.
4. `components/ui/accordion.tsx`: `AccordionContent` is `text-sm` and the chevron is 16px with no 44px hit area on the trigger unless the caller sets `min-h`. FAQAccordion now sets `min-h-[56px]`; other callers do not.
5. `tsconfig.json` is modified by `next dev` with distDir overrides (`.next-B/types`). Not mine, not committed; revert before merge.

Shared pieces I added (in `components/story/`): `SectionHead`, `ContactStrip` (Visit/Call/Quote, carries `pb-28 md:pb-16`), `story.css` (`.st-*` ledger classes, `.blog-article` reading column). Other agents may reuse them.
