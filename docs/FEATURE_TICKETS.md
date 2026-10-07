# Feature Tickets — FinalYear Labs

Priority: **P0** = MVP launch blocker · **P1** = MVP, should ship · **P2** = post-MVP (architecture-ready).
Status: ☐ todo · ◐ in progress · ☑ done. Each ticket lists acceptance criteria (AC).

## Phase 1 — Foundation

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0101 | Repository inspection + planning docs | P0 | 5 docs in `/docs` |
| FT-0102 | Tooling: TS strict, ESLint, Vitest, scripts, `.env.example`, `.gitignore` | P0 | `npm run lint`, `typecheck`, `test`, `build` pass |
| FT-0103 | Env validation (`lib/env.ts`, `lib/site.ts`) | P0 | Server env parsed with Zod; no secrets in `NEXT_PUBLIC_*` |
| FT-0104 | Mongo connection + all models + indexes | P0 | Models compile; indexes declared; `sanitizeFilter` on |
| FT-0105 | Seed script (categories, degrees with SEO content; `--demo` sample projects clearly marked) | P0 | `npm run seed` idempotent (upsert by slug) |
| FT-0106 | Design system tokens + shadcn primitives | P0 | Light/dark tokens; Button/Card/Badge/Input/etc. |
| FT-0107 | Local MongoDB via docker-compose | P1 | `docker compose up -d` |

## Phase 2 — Application shell

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0201 | Root layout: fonts, theme provider, metadataBase, skip link, Toaster | P0 | No theme flash; skip link works |
| FT-0202 | Navbar (desktop mega-menu, mobile sheet, search trigger, theme toggle, WhatsApp CTA `navbar`) | P0 | Keyboard accessible; works at 320px |
| FT-0203 | Footer (DB-driven categories/degrees, legal, responsible-use note, WhatsApp `footer`) | P0 | |
| FT-0204 | Motion utilities (Reveal, Stagger, Counter) with reduced motion | P1 | Reduced motion disables animation |
| FT-0205 | Global error, not-found, loading skeletons | P0 | 404 page has search + links |

## Phase 3 — Catalog pages

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0301 | Cached data layer (`lib/data/*`) with tags + DTOs | P0 | All public reads are `'use cache'` + tagged |
| FT-0302 | Home page (all sections per FRONTEND_SPEC §4.1) | P0 | Real counts only; testimonials conditional |
| FT-0303 | `/projects/[slug]` resolver (degree → category → project) | P0 | Unknown slug → 404 status |
| FT-0304 | Degree hub page | P0 | Unique content + metadata + breadcrumbs + projects |
| FT-0305 | Category hub page | P0 | Same as above |
| FT-0306 | Project detail page (all sections) | P0 | Sticky mobile CTA never covers content |
| FT-0307 | ProjectCard + generated cover fallback | P0 | |
| FT-0308 | Related projects (same degree / category / similar tech) | P1 | |
| FT-0309 | Trust/legal pages: about, contact, privacy, terms, refund, disclaimer | P0 | Placeholders clearly marked |
| FT-0310 | Documentation support page | P1 | No acceptance guarantees |

## Phase 4 — Discovery & conversion

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0401 | `/projects` search + filters + sort + pagination (URL state) | P0 | Filters work without JS (GET form); canonical strips params |
| FT-0402 | Search dialog (recent, popular, suggestions, results, no-results) + `/api/search` | P1 | ⌘K / tap opens; debounced; accessible |
| FT-0403 | Compare tray + `/compare` (table desktop / stacked mobile) | P1 | Max 3; persists on device; noindex |
| FT-0404 | Custom project request form + action + Lead creation | P0 | Validated, rate-limited, honeypot, stored, WhatsApp continue |
| FT-0405 | WhatsApp service: config, resolver, templates, link builder | P0 | No numbers in client bundle; unit tests |
| FT-0406 | `/api/wa` tracked redirect + `WhatsAppButton` + `WhatsAppStickyBar` | P0 | Event stored with full context; 302 to wa.me |
| FT-0407 | Project finder (rule-based Recommender) | P1 | Ranked results with reasons |

## Phase 5 — Analytics & admin

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0501 | Attribution cookie in `proxy.ts` (UTM, referrer, landing, session id) | P0 | UTM attached to events/leads |
| FT-0502 | Event system: `trackEvent` client, `/api/events`, `recordEvent` server, GA4 bridge | P0 | Single module; schema-validated |
| FT-0503 | Admin auth: login, logout, session, proxy gate, DAL, RBAC, create-admin script | P0 | Unauthenticated → redirect; actions reject |
| FT-0504 | Admin layout + dashboard KPIs | P0 | |
| FT-0505 | Project CMS (create/edit/publish/feature/archive/delete, all fields, SEO) | P0 | Slug conflicts rejected; cache tags updated |
| FT-0506 | Categories, Degrees CMS | P0 | |
| FT-0507 | Testimonials, FAQs CMS | P1 | Consent required to publish testimonial |
| FT-0508 | Leads CRM (list, filters, status, notes, manual create) | P0 | |
| FT-0509 | Custom requests inbox (convert to lead) | P0 | |
| FT-0510 | WhatsApp analytics dashboard with filters | P0 | All §21/§56 dimensions |
| FT-0511 | SEO dashboard | P1 | Missing-field audits, noindex list, sitemap URL count |
| FT-0512 | Admin users management (owner) | P1 | |

## Phase 6 — SEO

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0601 | Metadata builders + per-page unique metadata | P0 | Unique title/description/canonical/OG/Twitter |
| FT-0602 | JSON-LD: Organization, WebSite, BreadcrumbList, Product/Offer, ItemList, FAQPage (visible only) | P0 | Valid JSON; no fake ratings |
| FT-0603 | `sitemap.ts`, `robots.ts`, `manifest.ts` | P0 | Excludes admin/api/noindex |
| FT-0604 | Dynamic OG images (`opengraph-image.tsx`) | P1 | |
| FT-0605 | Internal linking blocks | P1 | |
| FT-0606 | Blog architecture (`BlogPost` model, `/blog`, `/blog/[slug]`) | P2 | Index noindex until posts exist |
| FT-0607 | Technology pages `/technologies/[slug]` (only for ≥ 3 projects) | P2 | |

## Phase 7 — Hardening

| ID | Ticket | P | AC |
|---|---|---|---|
| FT-0701 | Security headers + CSP | P0 | Verified via `curl -I` |
| FT-0702 | S3/R2 presigned upload adapter for admin media | P2 | MIME/size allowlist |
| FT-0703 | Unit tests (WhatsApp, SEO builders, recommender, validation, slugs, utm) | P0 | `npm test` green |
| FT-0704 | Responsive/a11y pass (360–1440, both themes, keyboard) | P0 | |
| FT-0705 | Performance pass (bundle analysis, image sizes, LCP) | P1 | |
| FT-0706 | README: setup, env, seed, admin bootstrap, deploy | P0 | |

## Post-MVP backlog (P2)
Razorpay checkout + `Order` flow · Student accounts + dashboard + downloads (`Document`, signed URLs) · Coupons/referrals · Reviews with verified purchase · AI recommender (embeddings) · WhatsApp Cloud API (auto-replies, click→lead linking) · Lead auto-creation from WhatsApp webhooks · Blog CMS editor · Multi-language (Hindi) · Playwright E2E suite.
