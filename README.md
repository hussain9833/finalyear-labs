# FinalYear Labs

A mobile-first, SEO-first marketplace where BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech students discover final-year projects. They can understand each project, compare them, and contact the team on WhatsApp. Every WhatsApp click is tracked with its full context.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui (Base UI) · Motion · MongoDB + Mongoose · Zod · jose + bcrypt · Vitest.

Planning documents live in [`docs/`](docs/): [PRD](docs/PRD.md) · [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md) · [Security & access](docs/SECURITY_ACCESS.md) · [Frontend spec](docs/FRONTEND_SPEC.md) · [Feature tickets](docs/FEATURE_TICKETS.md).

## Quick start

```bash
npm install
cp .env.example .env.local        # then fill in values (see below)

# A MongoDB instance — any of:
npm run db:local                  # no Docker: downloads mongod once, data in ./.data (dev only)
npm run db:up                     # Docker: mongo:8 via docker-compose
# …or set MONGODB_URI to MongoDB Atlas

npm run seed                      # categories, degrees (with hub content), home FAQs
npm run seed -- --demo            # + SAMPLE projects (flagged "Sample listing") for review

ADMIN_BOOTSTRAP_EMAIL=you@example.com ADMIN_BOOTSTRAP_PASSWORD='a-long-password' npm run create-admin

npm run dev                       # http://localhost:3000 · admin at /admin
```

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` · `npm run typecheck` · `npm test` | Quality gates |
| `npm run seed [-- --demo]` | Idempotent seed (upserts by slug; never overwrites your edits) |
| `npm run create-admin` | Create or reset an **owner** account (revokes its sessions) |
| `npm run db:local` / `db:up` | Local MongoDB without / with Docker |

## Environment

See [`.env.example`](.env.example). Key points:

- **`MONGODB_URI`** must be reachable during `next build`. Public pages prerender from the database, and the cached catalog is invalidated whenever an admin saves something.
- **`AUTH_SECRET`** and **`RATE_LIMIT_SALT`** must be at least 32 characters in production. Generate them with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- **WhatsApp numbers** (`WHATSAPP_DEFAULT_NUMBER`, `_SALES_`, `_AI_`, `_WEB_`, `_ECOMMERCE_`, `_SUPPORT_`, `_CUSTOM_`) are server-only.
  - Each category picks a route (`ai`, `web`, `ecommerce`, …) in the admin panel.
  - A missing number falls back to sales, then default.
  - `NEXT_PUBLIC_WHATSAPP_ENABLED=false` hides every WhatsApp CTA.
- **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** enables GA4. GA measurement IDs are public by design, so the variable has the `NEXT_PUBLIC_` prefix.
- **`GOOGLE_SITE_VERIFICATION`** adds the Search Console meta tag.
- **`NEXT_PUBLIC_ASSET_HOSTS`** whitelists your R2 or CDN host for `next/image`.

## How WhatsApp tracking works

Every WhatsApp button renders `<a href="/api/wa?i=<intent>&c=<cta>&p=<project>&d=<degree>&s=<page>">`. The server then:

1. Resolves the number from env.
2. Builds the pre-filled message from trusted database data.
3. Records a `WhatsAppEvent` (project, category, degree, number type, page, CTA location, device, UTM, referrer, session). It stores no personal data, and skips bots.
4. Sends a 302 redirect to `wa.me`.

UTM parameters and the external referrer are captured on landing by [`src/proxy.ts`](src/proxy.ts) into a first-party cookie (last-touch, 30 days).

View the results at **/admin/analytics**. Filters cover date range, project, category, degree, number, CTA, device, UTM source and campaign.

A click is **lead intent, not a sale**. Track actual outcomes in **/admin/leads** (NEW → CONTACTED → INTERESTED → FOLLOW_UP → PURCHASED → COMPLETED / LOST).

## Admin

`/admin` is protected twice:

- **Proxy:** an optimistic JWT check.
- **Data-access layer:** an authoritative check on every page and server action, covering account active status, session version and role.

| Role | Can do |
|---|---|
| `owner` | Everything, including user management and hard deletes |
| `admin` | Publish catalog changes, manage leads and requests |
| `editor` | Draft projects and content |
| `viewer` | Read-only; phone numbers and emails are masked |

The CMS covers:

- Projects: every field, SEO overrides, publish, feature and archive.
- Categories and degrees: hub content, FAQs, SEO and WhatsApp route.
- Testimonials (published only with the student's consent) and FAQs.
- Leads CRM and the custom requests inbox.
- WhatsApp analytics and the SEO health dashboard.

## Content rules baked in

- No fake reviews, ratings, users or statistics. Testimonials and ratings render only from real, consented entries, and the homepage counters are real database counts.
- Seeded demo projects carry `isSample` and show a visible **Sample listing** badge. Replace them before launch; the SEO dashboard lists any that remain.
- Legal pages ([`src/lib/legal.ts`](src/lib/legal.ts)) contain **[bracketed placeholders]** (legal entity, refund windows, support period). Confirm these and have them reviewed before launch.

## Deploying

The app works on Vercel or any Node host (`npm run build && npm start`). Before going live:

- [ ] Set production env vars (`NEXT_PUBLIC_SITE_URL` must be the final https origin).
- [ ] Run `npm run seed`, then create the owner account.
- [ ] Replace sample projects, fill legal placeholders, and add real WhatsApp numbers.
- [ ] Submit `/sitemap.xml` in Google Search Console.
- [ ] Check headers with `curl -I https://your-domain`.
- [ ] Go through the release checklist in [docs/SECURITY_ACCESS.md](docs/SECURITY_ACCESS.md#11-security-checklist-release-gate).
