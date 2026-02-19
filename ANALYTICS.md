# Website analytics — full report guide

This site uses **Google Analytics 4 (GA4)** so you get full reports: how many people opened the site, which pages and products they viewed, and when they requested a quote, contacted you, or clicked Call/WhatsApp.

---

## 1. Set up Google Analytics (one-time)

1. Go to **[analytics.google.com](https://analytics.google.com)** and sign in with a Google account.
2. Click **Admin** (gear icon, bottom left) → **Create property**.
3. Enter property name (e.g. **HM Ibrahim Website**) and time zone (India).
4. After the property is created, go to **Admin** → **Data streams** → **Add stream** → **Web**.
5. Enter your website URL (e.g. `https://hmibrahim.net` or `https://hmibrahimco.com`).
6. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).
7. In your project, create or edit `.env.local` and add:
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
8. Redeploy the site (or restart `npm run dev` locally). Analytics will start collecting data.

---

## 2. What you get in GA4 (reports)

Once the Measurement ID is set and the site is live, GA4 will show:

### **Realtime**
- How many people are on the site **right now** and which page they’re on.

### **Acquisition → Traffic acquisition**
- Where visitors come from: Google search, direct, social, etc.
- How many sessions and users from each source.

### **Engagement → Pages and screens**
- **Which pages were opened and how many times** (home, about, products, contact, quote, etc.).
- Page path (e.g. `/products`, `/products/clutch-wire`, `/quote`).
- Views per page so you can see your most viewed content.

### **Engagement → Events**
- **Custom events we send:**
  - **page_view** — every page visit (including product pages).
  - **view_item** — when someone opens a **product page** (includes product name and category).
  - **quote_request** — when someone submits **Request a Quote**.
  - **contact_submit** — when someone submits the **Contact** form.
  - **click_call** — when someone clicks **Call** (source: navbar, navbar_mobile, mobile_sticky).
  - **click_whatsapp** — when someone clicks **WhatsApp** (source: hero, navbar, navbar_mobile, mobile_sticky).

So you can see:
- How many times the site was opened (sessions / page views).
- Which product pages were viewed and how often.
- How many quote requests and contact form submissions.
- How many people clicked Call or WhatsApp and from where.

### **Engagement → Conversions** (optional)
- In GA4 Admin you can mark **quote_request** and **contact_submit** as conversions to see conversion counts and value in reports.

### **User attributes**
- Device (mobile / desktop), location (country, city), and similar breakdowns.

---

## 3. Where to look for answers

| Question | Where in GA4 |
|----------|----------------|
| How many people visited the site? | **Reports → Engagement → Pages and screens** (total views) or **Reports → Acquisition → User acquisition** (users/sessions). |
| Which pages are opened most? | **Reports → Engagement → Pages and screens** — sort by “Views” or “Engaged sessions”. |
| Which product was viewed? | **Reports → Engagement → Events** — filter by event name **view_item**; use **item_name** / **item_id** in the event details. |
| How many quote requests? | **Reports → Engagement → Events** — filter by **quote_request**. |
| How many contact form submissions? | **Reports → Engagement → Events** — filter by **contact_submit**. |
| How many clicked Call or WhatsApp? | **Reports → Engagement → Events** — filter by **click_call** or **click_whatsapp**; use **source** to see navbar vs hero vs mobile bar. |

---

## 4. Google Search Console (optional, for search traffic)

- Go to **[search.google.com/search-console](https://search.google.com/search-console)**.
- Add your site and verify (e.g. via DNS or HTML tag).
- You’ll see which **search queries** brought people to your site and which **pages** get clicks in Google. This complements GA4 (which shows behaviour on the site).

---

## 5. Summary

- Set **NEXT_PUBLIC_GA_ID** in `.env.local` (and in Vercel env vars for production).
- In GA4 you get: **site opened how many times**, **which product pages**, **quote/contact submissions**, and **Call/WhatsApp clicks**, plus device and location.
- Use **Engagement → Pages and screens** and **Engagement → Events** for the full picture.
