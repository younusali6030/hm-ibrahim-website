# Analytics verification (conversion layer)

Events reaching GA4 through `lib/analytics.ts`: `click_call`, `click_whatsapp`, `click_directions`, `quote_request`, `contact_submit`.

## How tracking works
- `components/conversion/ClickTracker.tsx` is one delegated click listener, mounted from the Footer. Any anchor whose href starts `tel:`, is `wa.me/<number>` or `api.whatsapp.com/send?phone=`, or opens Google Maps fires the matching event.
- `source` is the nearest `data-track` attribute, else `window.location.pathname`.
- WhatsApp share links with no shop number (`wa.me/?text=`, used by the blog share button) are deliberately not counted.
- Components that already call `trackCallClick` / `trackWhatsAppClick` in `onClick` are not double counted: `trackEvent` drops a same-name event inside 600 ms.
- Quote form: `quote_request` when a list was sent, `contact_submit` when only name and number were sent (a call-back request).

## Verified locally (Playwright, dev server on :3013, `NEXT_PUBLIC_GA_ID` set to a dummy value, `window.gtag` stubbed, GTM script blocked)
| Click | Event | source |
|---|---|---|
| Footer visit strip, Call | click_call | footer_visit_call |
| /contact details phone | click_call | contact_details |
| Quote form, WhatsApp fallback | click_whatsapp | quote_form_whatsapp |
| /contact map link | click_directions | contact_visit_map |
| /brands WhatsApp link (file not owned, no data-track) | click_whatsapp | /brands |
| Quote submit with list | quote_request | quote_form |

Result: same at 390 and 1440 px.

## Enable it
`NEXT_PUBLIC_GA_ID` is not set locally, so `trackEvent` is a no-op and no GA script loads. Set it to the real `G-XXXXXXXXXX` in `.env.local` for a local check and in Vercel Project Settings > Environment Variables for production (it is read at build time, so redeploy). In GA4 DebugView or the Realtime report the events appear within seconds. Mark `quote_request`, `contact_submit`, `click_call`, `click_whatsapp` as key events in GA4 Admin.
