# Publishing HM Ibrahim & Co Website

The app builds successfully. Here’s how to publish it.

---

## Pushing updates (Vercel already connected)

If Vercel is already connected to GitHub and you just need to push local changes:

1. **Get your GitHub repo URL**  
   In [Vercel](https://vercel.com) → your project → **Settings** → **Git**: note the connected repo (e.g. `yourusername/HM`).

2. **Set the remote** (use your actual username and repo name):
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```
   Example: `git remote set-url origin https://github.com/younusali/HM.git`

3. **Push** (Git will ask for credentials):
   ```bash
   git push origin main
   ```
   - **Username:** your GitHub username  
   - **Password:** use a **Personal Access Token**, not your GitHub password  
   - Create a token: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**, enable `repo`, then paste the token when prompted for password.

4. **Done.** Vercel will auto-deploy from `main`; your domain will update after the build finishes.

---

## Option 1: Vercel (recommended for Next.js)

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
   - Click **Add New** → **Project** and import your GitHub repo.
   - Leave **Framework Preset** as Next.js and **Root Directory** as `.`
   - Click **Deploy**. Vercel will build and give you a URL like `your-project.vercel.app`.

3. **Set environment variables** (in Vercel: Project → **Settings** → **Environment Variables**). Add each name/value, then **Save**. Redeploy after adding or changing variables.

   **Required for quote catalog (catalog email to customer):**
   | Variable | Value | Notes |
   |----------|--------|------|
   | `QUOTE_FROM_EMAIL` | `younusali6030@gmail.com` | Gmail that sends the catalog |
   | `GMAIL_APP_PASSWORD` | Your 16-char Gmail App Password | [Create one](https://myaccount.google.com/apppasswords) for this Gmail account |
   | `NEXT_PUBLIC_SITE_URL` | `https://hmibrahimco.com` (or your Vercel domain) | **Required** so product images in the email load (use your real domain, not `*.vercel.app`) |

   **Required for contact form (Resend):**
   | Variable | Value |
   |----------|--------|
   | `RESEND_API_KEY` | From [resend.com](https://resend.com) |
   | `RESEND_FROM_EMAIL` | Verified sender (e.g. `noreply@yourdomain.com`) |

   **Optional:** `QUOTE_TO_EMAIL`, `CONTACT_TO_EMAIL` (defaults in `content/site.ts`). For live tentative rates in catalog: `SERPER_API_KEY`, `OPENAI_API_KEY`.

4. **Use your own domain** (optional):
   - In Vercel: Project → Settings → Domains → Add `hmibrahimco.com`
   - Add the CNAME or A record your registrar shows (Vercel will tell you what to add).

---

## Option 2: Run locally / on your own server

1. **Build**:
   ```bash
   npm run build
   ```

2. **Run**:
   ```bash
   npm start
   ```
   The app will be at `http://localhost:3000`.

3. **On a server**: Use a process manager (e.g. PM2) and a reverse proxy (e.g. Nginx) in front of `npm start`. Set the same env vars as above (e.g. in `.env.production` or your hosting panel).

---

## Before going live

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain (sitemap, OG, canonicals, **and catalog email images**).
- [ ] Add `QUOTE_FROM_EMAIL` and `GMAIL_APP_PASSWORD` so the quote catalog email is sent from your Gmail.
- [ ] Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` so the contact form sends email.
- [ ] Replace `site.googleReview.profileUrl` in `content/site.ts` with your real Google Business profile URL.
- [ ] Add `public/favicon.ico` if you want a custom favicon.
