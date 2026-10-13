# 08 Conversion & analytics

Primary conversions: quote form submit, click-to-call, WhatsApp, directions, walk-in. Events defined in `lib/analytics.ts`: view_item, quote_request, contact_submit, click_quote_cta, click_call, click_whatsapp, click_directions. Leads carry landing page + source to the Sheet.

| ID | Finding | Type |
|---|---|---|
| AUD-020 | Whether GA4 receives these events correctly, and whether they are marked as key events, is UNVERIFIED (`docs/design/analytics-verification.md` exists; not re-run) | Unknown |
| AUD-031 | gtag loads after first input or 8 s; visits with no input inside 8 s are uncounted (documented trade-off) | Code |
| AUD-032 | Walk-in and phone conversions have no offline attribution | Limitation |
Hypotheses (need experiments, not claims): showing "Call back" as first CTA on mobile product pages; shorter form (already name + phone only required). Do not run until baseline conversion counts exist (TASK-012).
