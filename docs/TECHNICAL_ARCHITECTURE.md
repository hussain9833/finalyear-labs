# Technical Architecture — FinalYear Labs

Status: Draft v1 · Last updated: 2026-10-07

## 1. Repository inspection (baseline)

| Item | Finding |
|---|---|
| Repository state | Empty (greenfield). No existing code, auth, DB config, env or deployment config to preserve. |
| Scaffold | `create-next-app@latest` → **Next.js 16.4.0**, React 19.3, TypeScript (strict), Tailwind CSS v4, ESLint 9 flat config, `src/` dir, `@/*` alias. |
| Next defaults | `cacheComponents: true`, `partialPrefetching: true` (Cache Components / PPR model). `middleware` is renamed to **`proxy.ts`**. `params`/`searchParams` are Promises. |
| Runtime | Node 24, npm 11. Docker is available for a local MongoDB. |
| Deployment | None present. The target is Vercel or any Node host (`next start`). A `docker-compose.yml` is provided for local MongoDB only. |

## 2. Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router (full-stack) | SSR/PPR for SEO, Route Handlers, Server Actions, metadata APIs |
| Language | TypeScript strict | Required |
| Styling | Tailwind v4 + CSS variables (design tokens) | Light/dark theming via tokens |
| Components | shadcn/ui (Radix primitives, copied into `src/components/ui`) | Accessible primitives we own and can restyle |
| Animation | `motion` (Framer Motion's current package name) via `LazyMotion` + `m` | Small initial bundle; `domAnimation` features are loaded lazily |
| GSAP | **Not used** | No animation in scope needs it. Avoids an extra 30–60 KB. Can be added per page later. |
| Icons | lucide-react | Required |
| Theme | next-themes (`class` strategy) | No flash of the wrong theme; respects the system setting |
| DB | **MongoDB + Mongoose 9** | Schemas, validation, indexes and middleware in one place; cleaner than the hand-rolled native driver for this domain |
| Validation | Zod 4 | Shared client/server schemas |
| Auth | Custom: bcrypt hash + `jose` signed JWT in an httpOnly cookie, verified in `proxy.ts` (optimistic) **and** in the server data-access layer (authoritative) | Admin-only for MVP; no third-party dependency; Auth.js can be swapped in later for student accounts |
| Toasts | sonner | Required by the design system |
| Tests | Vitest (unit: WhatsApp, SEO, recommender, validators, slug rules) | Fast; Playwright can be added for E2E |
| Storage | `StorageProvider` interface. MVP: URL-based (admin pastes R2/S3/CDN URLs). S3/R2 presigned-upload adapter behind env flags (ticket FT-0702) | Assets never live in Mongo |
| Analytics | Internal event store (Mongo) + optional GA4 | Owner controls first-party lead data |

## 3. Folder structure

```
src/
  app/
    (site)/                      # public site route group (navbar/footer layout)
      page.tsx                   # home
      projects/page.tsx          # all projects (search/filter)
      projects/[slug]/           # degree | category | project resolver
        page.tsx
        opengraph-image.tsx
      compare/ project-finder/ custom-project/ documentation-support/
      blog/ about/ contact/ privacy-policy/ terms/ refund-policy/ disclaimer/
    admin/
      login/page.tsx             # public
      (panel)/                   # protected panel layout
        page.tsx                 # dashboard
        projects/ categories/ degrees/ testimonials/ faqs/
        leads/ requests/ analytics/ seo/ users/
    api/
      wa/route.ts                # tracked WhatsApp redirect
      events/route.ts            # first-party event beacon
      search/route.ts            # typeahead suggestions
      compare/route.ts           # compare tray hydration
    sitemap.ts  robots.ts  manifest.ts  not-found.tsx  error.tsx  global-error.tsx
  components/
    ui/                          # shadcn primitives
    layout/                      # Navbar, Footer, MobileNav, ThemeToggle
    marketing/                   # Hero, DegreeGrid, CategoryGrid, TrustSection, HowItWorks, DocsSection, CtaBand
    projects/                    # ProjectCard, ProjectGrid, ProjectFilters, SearchDialog, ProjectDetails, ComparisonTable, CompareTray
    whatsapp/                    # WhatsAppButton, WhatsAppStickyBar
    forms/                       # CustomProjectForm, LeadForm
    seo/                         # JsonLd, Breadcrumbs
    analytics/                   # AnalyticsProvider, GoogleAnalytics
    admin/                       # admin-only components
    motion/                      # Reveal, Stagger, Counter (reduced-motion aware)
  lib/
    db/connect.ts                # cached mongoose connection
    db/models/*.ts               # Mongoose models
    data/*.ts                    # 'use cache' read functions → DTOs (public)
    services/*.ts                # mutations, business rules (server-only)
    whatsapp/                    # config (server-only), templates, link builder
    analytics/                   # event schema, client trackEvent, server recorder, aggregations
    seo/                         # metadata builders, JSON-LD builders, site config
    auth/                        # session (jose), password, DAL (requireAdmin), rbac
    security/                    # rate limit, origin check, sanitize, ip hash
    recommend/                   # Recommender interface + rule-based impl
    storage/                     # StorageProvider interface + url/s3 adapters
    validation/                  # zod schemas shared by forms and actions
    env.ts                       # zod-validated server env (server-only)
    site.ts                      # public site config (NEXT_PUBLIC_*)
    utils.ts
  proxy.ts                       # attribution cookie + admin gate + security
scripts/
  seed.ts                        # categories + degrees (+ --demo sample projects)
  create-admin.ts                # bootstrap owner account
docs/                            # PRD, architecture, security, frontend spec, tickets
```

Rules: `lib/db`, `lib/services`, `lib/auth`, `lib/whatsapp/config.ts` and `lib/env.ts` import `server-only`. Client components never import Mongoose models.

## 4. Rendering and caching (Cache Components)

- **Public catalog reads** live in `lib/data/*.ts` as `'use cache'` functions with `cacheLife('hours')` and **tags**:
  - `catalog` (everything public), `projects`, `project:<slug>`, `categories`, `degrees`, `testimonials`, `faqs`, `blog`.
- **Admin mutations** (Server Actions) call `updateTag(...)` for read-your-own-writes, and route handlers call `revalidateTag(tag, 'max')`.
- **Returned values are plain DTOs** (`.lean()` + mapper: `_id` → `id: string`, dates → ISO strings) so they serialize across the cache boundary.
- **`/projects/[slug]`**: `generateStaticParams` returns every published project, degree and category slug, so they are prerendered. If the DB is empty or unreachable at build, a placeholder param is returned (Cache Components requires ≥ 1) and resolves to `notFound()`. New slugs added after the build render on demand and are then cached (ISR).
- **Request-bound UI** (admin session, search params on `/projects`) sits inside `<Suspense>` with skeleton fallbacks.
- **Admin pages** read cookies and are fully dynamic. Admin data is never cached with `'use cache'`.
- **Build requirement**: `MONGODB_URI` must be reachable during `next build` so pages prerender with real content. This is documented in the README.

## 5. Data model (Mongoose)

Shared conventions: `timestamps: true`; slugs are lowercase kebab-case and unique; soft archive via `status`; every list query has a supporting index.

### Category
`name, slug (unique), shortName, description, longDescription, priceFrom (int, INR paise-free rupees), currency ('INR'), examples[string], icon (lucide key), accent (token key), whatsappRoute ('sales'|'web'|'ai'|'ecommerce'|'support'|'custom'|'default'), isAI (bool), order, published, seo { title, description, ogImage, noindex }, content { intro, sections[{heading, body}] }, faqs[{question, answer}]`
Indexes: `slug` unique, `{published, order}`.

### Degree
`name ("BCA"), slug ("bca"), fullName ("Bachelor of Computer Applications"), shortIntro, order, published, seo{...}, content{ intro, sections[] }, faqs[]`
Indexes: `slug` unique, `{published, order}`.

### Project
```
name, slug (unique), shortDescription, description,
category (ObjectId → Category, primary), categories [ObjectId] (all, incl. primary),
degrees [ObjectId], technologies [string], tags [string],
priceFrom (number), currency ('INR'), difficulty ('beginner'|'intermediate'|'advanced'),
level ('final'|'semi-final'|'both'), platform ('web'|'mobile'|'desktop'|'cross'),
isAI (bool), hasAdminPanel (bool), hasAuth (bool),
features [{ title, description }], modules [{ name, description, items[string] }],
howItWorks [{ title, description }], whatYouGet [{ title, description, included: bool }],
documentation { included: bool, items[string], note },
customization { available: bool, options[string], note },
faqs [{ question, answer }],
thumbnail { url, alt, width, height }, screenshots [{ url, alt, width, height, caption }],
demoUrl, videoUrl, repoUrl (private; never sent to the public DTO unless showRepo=true), showRepo,
featured, status ('draft'|'published'|'archived'), publishedAt, sortWeight,
seo { title, description, keywords[string], ogImage, canonical, noindex, structuredData: bool }
```
Indexes: `slug` unique, `{status, featured, sortWeight}`, `{status, category}`, `{status, degrees}`, `{status, categories}`, `{status, createdAt}`, `{status, priceFrom}`, text index `{name: 10, technologies: 5, tags: 5, shortDescription: 2}`.

### Lead
`name, phone, email, degree (slug), project (slug), projectId, category (slug), whatsappType, source ('whatsapp'|'custom_form'|'contact'|'manual'|'other'), utm{source,medium,campaign,term,content}, referrer, landingPage, status (NEW|CONTACTED|INTERESTED|FOLLOW_UP|PURCHASED|COMPLETED|LOST), notes [{ body, author, at }], requestId, lastContactedAt, assignedTo`
Indexes: `{status, createdAt}`, `{createdAt}`, `{source}`, `{project}`.

### WhatsAppEvent (lead-intent click, not a sale)
`projectId, projectSlug, projectName, category, degree, intent, whatsappNumberType, sourcePage, ctaLocation, deviceType ('mobile'|'tablet'|'desktop'|'unknown'), referrer (host only), utm{...}, sessionId (random, cookie-scoped, non-PII), createdAt`
Indexes: `{createdAt}`, `{projectSlug, createdAt}`, `{category, createdAt}`, `{degree, createdAt}`, `{ctaLocation, createdAt}`, `{whatsappNumberType, createdAt}`, `{'utm.source', createdAt}`, `{'utm.campaign', createdAt}`.

### AnalyticsEvent (generic)
`name (enum), props (validated small object), path, deviceType, utm{...}, referrer, sessionId, createdAt`. Index `{name, createdAt}`, TTL optional (`ANALYTICS_RETENTION_DAYS`).

### ProjectRequest (custom project)
All form fields + `status ('new'|'reviewed'|'converted'|'closed')`, `leadId`, utm, landingPage. Indexes `{status, createdAt}`.

### Testimonial
`name, degree, college (optional), quote, rating (optional, 1–5, real only), projectSlug, avatarUrl, consent (bool, required true to publish), published, order`.

### FAQ (global/home)
`question, answer, scope ('home'|'global'|'custom-project'|'documentation'), order, published`.

### Admin
`email (unique), name, passwordHash, role ('owner'|'admin'|'editor'|'viewer'), active, sessionVersion (int), lastLoginAt, failedLogins, lockedUntil`.

### Future-ready (defined, minimal, unused in MVP)
`User` (student account), `Order` (projectId, amount, provider, providerOrderId, status), `Coupon` (code, type, value, validity, usageLimit), `Document` (asset metadata for PDFs/PPTs: storageKey, mime, size, projectId, access), `BlogPost` (title, slug, excerpt, body (structured blocks), cover, author, tags, status, publishedAt, seo).

`RateLimit` (internal): `key (hashed), count, expiresAt (TTL)`.

## 6. Slug namespace

`/projects/[slug]` resolves in this order: **degree → category → project**. Slugs must be unique across the three collections and must not use reserved words (`compare`, `search`, `page`, `all`, `new`, `admin`, `api`). `lib/services/slugs.ts#assertSlugAvailable(slug, {except})` enforces this in every create/update action. The admin UI shows the conflict inline.

## 7. WhatsApp system

```
lib/whatsapp/
  types.ts        WhatsAppIntent = 'project'|'ai_project'|'custom'|'general'|'support'|'pricing'
                  WhatsAppNumberType = 'default'|'sales'|'ai'|'web'|'ecommerce'|'support'|'custom'
                  CtaLocation = 'navbar'|'hero'|'project_card'|...
  config.ts       (server-only) reads env → Record<NumberType, string|undefined>; normalizes digits
  resolve.ts      (server-only) getWhatsAppTarget({ intent, category?, project? }) → { number, numberType }
  templates.ts    buildMessage(intent, ctx) → string   (pure, unit-tested)
  link.ts         buildWaHref(params) → "/api/wa?i=project&p=slug&d=bca&c=project_card&s=/projects/bca"  (client-safe; no numbers)
```

Number resolution:
1. `intent=support` → `support`
2. `intent=custom` → `custom` → `sales`
3. Project (or explicit category) → the category's `whatsappRoute` → that number type
4. `intent=general|pricing` → `sales`
5. Any type without an env value falls back to `default`. If `default` is missing too, the CTA is hidden and `/api/wa` redirects to `/contact`.

`GET /api/wa` flow: validate the query with Zod → load the project/category through cached data functions (names come from the DB, not the URL) → resolve the number → build the message → record a `WhatsAppEvent` (skipped for bots, `next/after` so the redirect isn't delayed) → `302 https://wa.me/<digits>?text=<encodeURIComponent(msg)>` with `Cache-Control: no-store` and `X-Robots-Tag: noindex`.

`NEXT_PUBLIC_WHATSAPP_ENABLED=false` hides every WhatsApp CTA site-wide (kill switch).

Future: a `WhatsAppProvider` interface (`sendTemplate`, `webhook`) for the Cloud API. Click → lead linking happens through the `sessionId` once automated replies exist.

## 8. Analytics and attribution

- `proxy.ts` (page requests only): when `utm_*` is present, it writes the `fyl_attr` cookie (httpOnly, SameSite=Lax, Secure in prod, 30d) as JSON `{s,m,c,t,ct,ref,lp,ts}` (last-touch). Without UTMs but with an external `Referer` and no existing cookie, it stores `ref` (host only) and `lp`. It also issues `fyl_sid` (random session id, 30 min sliding, non-PII).
- Client: `trackEvent(name, props)` → validated against the event schema → `navigator.sendBeacon('/api/events')`, plus a GA4 `gtag('event')` when GA is enabled. A single module (`lib/analytics/client.ts`) is the only place that knows about either.
- Server: `recordEvent()` and `recordWhatsAppClick()` read the attribution cookie, derive the device type from the UA, and drop bots.
- Aggregations (`lib/analytics/whatsapp-stats.ts`): one `$facet` pipeline per dashboard load, with filters → `$match`. Totals (all/today/7d/30d), top-N by project/category/degree/numberType/cta/device/utm source/campaign, and a daily series filled for gaps. "Today" uses the `Asia/Kolkata` timezone (`ANALYTICS_TZ`).

## 9. SEO architecture

- `lib/seo/metadata.ts`: `buildMetadata({ title, description, path, image, noindex, type })` → full `Metadata` (canonical via `alternates.canonical`, OG, Twitter, robots). Root layout sets `metadataBase` from `NEXT_PUBLIC_SITE_URL` and a title template `%s | FinalYear Labs`.
- Dynamic defaults:
  - Project: `"{name} Project for {DEGREES} | Final Year Project"`, where DEGREES lists the first 2 compatible degrees or "BCA, MCA & B.Tech", trimmed to ≤ 60 chars. The description is composed from the short description, stack, degrees and availability, trimmed to ≤ 160 chars. Admin overrides win.
  - Degree: `"{Degree} Final Year Projects with Source Code & Documentation"`.
  - Category: `"{Category} Final Year Projects"`.
- Canonicals: absolute, no trailing slash (`trailingSlash: false`), and query params are stripped on hubs and `/projects`. Paginated `/projects?page=n` self-canonicalizes with only `page`. `/compare` is noindex.
- JSON-LD (`lib/seo/jsonld.ts`, rendered by `<JsonLd>` with `<` escaped): `Organization` + `WebSite` (with `SearchAction` → `/projects?q=`) on home; `BreadcrumbList` on hubs and projects; `Product` with `Offer` (price, INR, availability) on project pages when `seo.structuredData !== false`; `ItemList` on hubs; `FAQPage` **only** when FAQs are visibly rendered; **no** `AggregateRating`/`Review` unless real testimonials with ratings exist for that project.
- `sitemap.ts`: home, static trust pages, `/projects`, published degrees/categories/projects (excluding noindex and custom-canonical pages), and blog posts. `lastModified` comes from `updatedAt`.
- `robots.ts`: allow `/`; disallow `/admin`, `/api/`, `/compare`. `/_next/` is not blocked.
- Per-project `opengraph-image.tsx` (next/og) generates a branded 1200×630 card when no OG image is set.
- Internal linking: degree hubs link to categories and projects, categories to degrees, and projects to the same-degree, same-category and similar projects. Breadcrumbs everywhere.

## 10. Security summary
See SECURITY_ACCESS.md. Key points: the proxy gates `/admin/*`; every admin Server Action/Route Handler calls `requireAdmin(role)`; Zod validates all input; Mongoose `sanitizeFilter` plus strict schemas block query injection; Mongo-backed rate limits are keyed by a salted IP hash; security headers and a CSP are set in `next.config.ts`; secrets are only read in `server-only` modules.

## 11. Environment variables
See `.env.example`. Server-only: `MONGODB_URI`, `MONGODB_DB`, `AUTH_SECRET`, `WHATSAPP_*_NUMBER`, `RATE_LIMIT_SALT`, `ADMIN_BOOTSTRAP_EMAIL/PASSWORD` (scripts only), `S3_*`/`R2_*`, `RAZORPAY_*` (future). Public: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_WHATSAPP_ENABLED`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_ASSET_HOSTS`, `GOOGLE_SITE_VERIFICATION`.

## 12. Extensibility hooks
| Future feature | Hook in MVP |
|---|---|
| Payments (Razorpay) | `Order` model, `PaymentProvider` interface in `lib/payments/` (no implementation), `priceFrom` already numeric |
| Student accounts/dashboard | `User` model; auth module separated (`lib/auth/session.ts` is role-agnostic) |
| Downloads | `Document` model + `StorageProvider.getSignedDownloadUrl` |
| AI recommendations | `Recommender` interface; `/project-finder` calls `getRecommender()` |
| WhatsApp automation | `WhatsAppProvider` interface; events have `sessionId` for correlation |
| Blog | `BlogPost` model, `/blog` routes, structured-block renderer |
| Coupons/referrals/reviews | `Coupon` model; Testimonial has rating + consent |

## 13. Key decisions log
1. **Mongoose over the native driver**: schema + index declarations colocated, less boilerplate.
2. **Tracked server redirect for WhatsApp** instead of client-only analytics: ad-blocker-proof, one source of truth, numbers never in JS bundles. Trade-off: one extra hop (~50–150 ms), acceptable for an outbound action.
3. **Mongo-backed rate limiting** instead of in-memory: correct across serverless instances, with no new infrastructure (Redis can be swapped in later).
4. **CSP without nonces**: nonce-based CSP forces every page to render dynamically, which defeats PPR static shells. We ship a strict non-script CSP (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, explicit `connect-src`/`img-src`) and allow `'unsafe-inline'` scripts for Next's inline bootstrap. Documented risk; revisit with SRI/hashes when Next supports it for PPR.
5. **No GSAP**: motion covers every planned interaction.
6. **Shared `/projects/[slug]` namespace** for degree/category/project URLs, as requested (`/projects/bca`, `/projects/ai`, `/projects/ai-resume-analyzer`), with cross-collection slug uniqueness enforced.
