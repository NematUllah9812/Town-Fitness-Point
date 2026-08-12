# Town Fitness Point — Deployment & Handoff Guide

Production-ready handoff for **Town Fitness Point** (Next.js 15 + Supabase + Resend + Vercel).

---

## 1. One-time setup: Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run in order:
   - `supabase/migrations/0001_schema.sql` (schema + RLS + storage)
   - `supabase/migrations/0002_seed.sql` (structural content + settings placeholders)
   - `supabase/migrations/0003_fix_newsletter_rls.sql` (security fix; safe to run even on a fresh DB)
3. **Authentication → Users → Add user** → create your admin account (email/password).
4. Promote it (run once in SQL Editor):

   ```sql
   update public.profiles set role = 'admin' where id = '<YOUR-USER-UUID>';
   ```

5. **Project Settings → API** → copy the **URL** and **anon key** (public by design) and the **service_role key** (**server-only, never shared**).

## 2. One-time setup: email (Resend)

1. Create account at [resend.com](https://resend.com) + an API key.
2. Add your sending domain and verify DNS (SPF/DKIM) — required for reliable delivery.
3. Note the from address (e.g. `Town Fitness Point <noreply@your-domain.com>`).

## 3. One-time setup: Cloudflare Turnstile (optional)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → add a site (widget, non-interactive).
2. Copy **site key** + **secret key**.

## 4. Deploy to Vercel

1. Push this folder to a GitHub/GitLab repo.
2. **vercel.com → New Project → import repo** (framework auto-detected: Next.js).
3. Environment variables (from `.env.example` — never commit real ones):

   | Variable | Where from |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same |
   | `SUPABASE_SERVICE_ROLE_KEY` | same (server-only) |
   | `RESEND_API_KEY` | Resend |
   | `RESEND_FROM_EMAIL` | your verified sender |
   | `ADMIN_NOTIFY_EMAIL` | the inbox that receives form notifications |
   | `NEWSLETTER_SIGNING_SECRET` | `openssl rand -base64 32` (signs unsubscribe links) |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare (optional) |
   | `TURNSTILE_SECRET_KEY` | Cloudflare (optional) |
   | `TURNSTILE_REQUIRED` | `true`/`false` (default off when key present) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` (canonicals, sitemap, OG) |

4. Deploy. Then connect your domain in Vercel → Domains.
5. Post-deploy smoke test (see §7).

## 5. Filling in real business content

All content is managed without code:

- **Business facts** (phone, email, address, city, hours, socials, home-page stats, footer): **/admin/settings**.
  - The moment a field is filled, the `[ADD …]` placeholder disappears site-wide.
  - Stats bar shows real numbers only — leave blank if unsure.
- **Trainers, Classes, Schedule, Testimonials, Blog**: the matching admin sections.
- **Gallery**: `gallery_items` — either insert rows via SQL or wait for the Phase-4-ready upload UI; image URLs can point at Supabase Storage (`/storage/v1/object/public/media/...`) or any URL.
- **Real photos**: replace `public/images/*` concept imagery (hero + class cards) with real facility photos, keeping the same filenames (or update the image_url fields in admin).
- **City/local SEO**: set city in admin → Settings; update `addressLocality` placeholders in `lib/seo.ts` if you prefer hardcoding.

## 6. What still needs a real browser (can't be done in this sandbox)

- **Lighthouse run** (Performance/A11y/SEO/Best Practices). The static checks are already green (see audit summary in README); run to confirm on production:
  ```bash
  npx lighthouse https://your-domain.com --only-categories=performance,accessibility,best-practices,seo
  ```
- **Resend deliverability** — send a test form submission after deploy and confirm both the admin notification and the submitter confirmation land in inboxes (check spam once).
- **Supabase RLS verification** — in the Supabase dashboard, use **Table Editor → RLS policies** to eyeball the policy list, and try querying `newsletter_subscribers` / `free_trial_requests` with the anon key from a scratch client (should fail on everything except INSERT).
- **Google Search Console** — submit the sitemap once live; verify LocalBusiness rich-result eligibility.

## 7. Post-deploy smoke checklist (5 minutes)

- [ ] `/` loads, hero image renders, no console errors
- [ ] Sticky nav → transparent to solid; mobile menu opens/closes
- [ ] Free Trial modal: submit → admin notification email + confirmation email arrive
- [ ] Newsletter: subscribe → welcome email with working unsubscribe link (valid link → "You are unsubscribed", 7-day expiry)
- [ ] /admin/login → sign in → dashboard counts update after form submissions
- [ ] Change a trainer/class → public page reflects it within seconds
- [ ] /sitemap.xml and /robots.txt served; admin paths blocked in robots
- [ ] Mobile: schedule day-tabs, gallery lightbox swipe/keys, forms usable at 360px
- [ ] Headers: `X-Content-Type-Options: nosniff` present

## 8. Security model (recap, verified)

- RLS on every table (default deny). Public: SELECT on active/published content, INSERT into submission tables + newsletter. **No public UPDATE/DELETE anywhere** — unsubscribes go through `/api/unsubscribe` with a signed HMAC token (7-day expiry), executed server-side.
- Admin auth: Supabase Auth only; every admin action/page calls `requireAdmin()` server-side; `is_admin()` RLS policy backs it in the database.
- Service-role key is server-only; never imported by client code.
- Forms: zod validation server-side, honeypot, Postgres-backed rate limiting (5/day/IP + /email), optional Turnstile (`TURNSTILE_REQUIRED` to enforce).
- Email: user input HTML-escaped before entering email bodies (verified by test).
- JSON-LD: `<`, `>`, `&` escaped as `\u003c` etc. so admin-set strings cannot break out of script tags (verified by test).

## 9. Known limitations (honest list)

- **No image upload UI yet** — admin accepts URLs; the `media` storage bucket + policies exist and are ready for an upload UI (v2 candidate).
- **Blog editor is plain-text** (paragraphs separated by blank lines) — no rich text in v1; content is still fully editable.
- **Rate-limit insert is best-effort** — a race could undercount; acceptable at this scale, revisit if spam appears.
- **No X-Frame-Options/CSP** — intentionally omitted so the site can be embedded in preview iframes; add behind a WAF/CDN for production hardening if desired.
- **Turnstile default is optional** — honeypot + rate limiting are always on; flip `TURNSTILE_REQUIRED=true` to enforce a captcha on every form.
- **No member portal / payments** — this site is marketing + lead capture; billing is out of scope.
