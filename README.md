# H M Ibrahim & Co: website

hmibrahim.net. Iron, wire and mesh from 60 Siyaganj Main Road, Indore, since 1939.
One goal: a call, a WhatsApp, a quote request or a walk-in.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion (light use). Content lives in `content/*.ts` and
`content/blog/posts/*.md`. No CMS. Quote requests go through a server action in `app/contact/actions.ts`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # type check
```

`next lint` has no ESLint config yet and will prompt. Type checking and `next build` are the gates.
To build or serve beside a running dev server: `NEXT_DIST_DIR=.next-build npm run build` and
`NEXT_DIST_DIR=.next-build npx next start -p 3001`.

## Environment

Copy `.env.example` to `.env.local`. Nothing is sent anywhere until these are set. Never commit `.env.local`.

| Variable | Used for |
|---|---|
| `QUOTE_FROM_EMAIL`, `GMAIL_APP_PASSWORD` | Sends the catalog to the customer |
| `QUOTE_NOTIFY_EMAIL` | Where quote requests are emailed |
| `CONTACT_TO_EMAIL` | Contact form messages |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Optional Resend path |
| `SERPER_API_KEY`, `OPENAI_API_KEY` | Optional indicative-rate lookup |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID. Without it no analytics runs |

## Where things are

| What | File |
|---|---|
| Address, phone, hours, social, Google rating | `content/site.ts`, `lib/site.ts` |
| Products and categories | `content/products.ts`, copy in `content/productCopy.ts` |
| Brands | `content/brands.ts`, `content/brandPages.ts` |
| Indore landing pages | `content/indorePages.ts` |
| Reviews (verbatim from Google) | `content/reviews.ts` |
| Reels (video sitemap) | `content/reels.ts` |
| Page titles and descriptions | `lib/seo.ts`, overrides in `content/seoOverrides.ts` |
| JSON-LD builders | `lib/schema.ts` |
| Design system and motifs | `docs/design/SYSTEM.md`, `components/motif/Motif.tsx` |
| English / Hindi text | `lib/i18n.tsx` (`<T en hi>`) |
| Quote flow, visit block, click tracking | `app/contact/`, `components/visit/`, `components/conversion/` |

## Media

Product photos: `public/products`. Reels and videos have a `.jpg` poster beside each `.mp4`.
Effects: `components/fx` (steel sheen shader, liquid wordmark, rendered coil loop in `public/fx`).
Open Graph cards: `public/og/<type>.png`, 1200 x 630, one per page type.

## Docs

`docs/seo/REPORT.md` (audit and backlog), `docs/design/*` (system, handoffs, security notes, analytics check),
`DEPLOY.md` (Vercel). Older notes are in `docs/archive`.
