# Visual audit and media log

## Findings (one pass, reuse; do not repeat)
- Site: Next.js 14, 53 products / 9 categories, 24 blog posts (3 images each), already served via next/image (AVIF first).
- `HM pictures` (304 files) was already mined: nearly every file is in use. Remaining gaps were TMT (326px), MS/aluminium wiremesh and MS I-beam/channel (no photo), MS pipes and sponge (wrong or missing image), services (no imagery).
- Wikimedia Commons search yielded one usable CC photo; Unsplash/Pexels/Pixabay need API keys not available here. Canva image generation returned only a 199px preview, so no AI images are used.
- Many files in the client folder are web-scraped supplier images with unverified rights. Left as is; replace with own photography when possible.

## Changes
| Area | Change |
|---|---|
| Products | New photos: TMT x3, MS flats x2, MS channels, aluminium wiremesh x3, MS wiremesh x2, MS wire rope x2, MS pipes (CC BY 2.0, credited on the page) |
| No-photo products | I-beam and channel get labelled section-profile drawings ("Drawing: not a photograph"); sponge shows a "Photo on request" plate |
| Components | `PhotoPlate` (blur-up, tilt/sheen hover, second-view crossfade, reduced-motion safe) in catalogue rows, cards; gallery gets loupe zoom, blur placeholder, credit line |
| Blog | Blur placeholders, tilt hover on cards, in-article images now sit inside the text (after sections 2 and 4) |
| Services | Photo-led alternating rows with real shop photos |

## Pipeline
- `content/media/manifest.json`: source, destination, alt, licence, credit per image.
- `scripts/media/build-images.mjs`: manifest -> `public/products/v2/*.webp` (max 1600px) + blur placeholders. Needs `sharp` (`SHARP_PATH`).
- `scripts/media/profile-plates.mjs`: generates the drawings.
- `scripts/media/blur-dir.mjs`: regenerates `content/media/blur.json` and `blur-blog.json`.
- Responsive AVIF/WebP sizes are produced at request time by next/image (`next.config.mjs`).

## Not done
- No FFmpeg frame extraction: existing reel posters already cover product videos.
- Brands and Indore pages were left unchanged (recently reworked, real photography).
