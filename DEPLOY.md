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

3. **Set environment variables** (in Vercel: Project → Settings → Environment Variables):
   - `RESEND_API_KEY` – from [resend.com](https://resend.com) (for quote/contact forms and catalog email)
   - `RESEND_FROM_EMAIL` – verified sender email (e.g. `noreply@yourdomain.com`)
   - `QUOTE_FROM_EMAIL` – Gmail address that sends the catalog (default: `younusali6030@gmail.com`)
   - `GMAIL_APP_PASSWORD` – Gmail App Password for that account (create at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))
   - `NEXT_PUBLIC_SITE_URL` – your live URL (e.g. `https://hmibrahimco.com`)
   - Optional: `QUOTE_TO_EMAIL`, `CONTACT_TO_EMAIL` if different from `content/site.ts`
   - Optional (for live tentative rates in catalog): `SERPER_API_KEY` ([serper.dev](https://serper.dev)), `OPENAI_API_KEY`

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

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain (sitemap, OG, canonicals use this).
- [ ] Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` so quote and contact forms send email.
- [ ] Replace `site.googleReview.profileUrl` in `content/site.ts` with your real Google Business profile URL.
- [ ] Add `public/favicon.ico` if you want a custom favicon.
