# PRD — FinalYear Labs (Final-Year Technical Project Marketplace)

Status: Draft v1 · Owner: Product · Last updated: 2026-10-07

## 1. Summary

FinalYear Labs is a marketplace where technical-degree students (BCA, MCA, BSc IT, MSc IT, B.Tech, M.Tech) discover final-year and semi-final-year projects, understand them (features, modules, stack, demo, screenshots), compare them, and contact the team on WhatsApp to buy or customize one.

The product is positioned as a **project solution, learning, customization and support platform**, not a code dump:

> "Don't just download code. Build a project you can understand, customize and confidently present."
>
> "GitHub gives you repositories. We give you a complete project experience."

We never disparage GitHub, and we never encourage students to submit work they don't understand. The academic-responsibility message sits in the footer, terms and disclaimer, not in every CTA.

## 2. Goals and non-goals

### Goals (MVP)
1. A student can go from landing → degree/category → project → understanding → WhatsApp with a pre-filled message in **≤ 3 taps on mobile**.
2. Every WhatsApp click is tracked with its context: project, category, degree, number type, page, CTA location, device, UTM and referrer. No personal data is stored.
3. Admins manage the whole catalog (projects, categories, degrees, testimonials, FAQs) without code changes.
4. Admins see which projects, categories, degrees, campaigns and CTAs generate WhatsApp leads, and can manage leads through a simple CRM pipeline.
5. Technical SEO from day one: unique metadata, canonicals, JSON-LD, sitemap, robots, useful degree/category content.
6. A mobile-first, premium UI in both light and dark mode, with Core Web Vitals in the "good" range.

### Non-goals (MVP), but the architecture must allow them
Online payments (Razorpay), student accounts, downloads, orders, subscriptions, AI recommendations, WhatsApp Cloud API automation, coupons, referrals, reviews, student dashboard, full blog CMS.

## 3. Users

| Persona | Need | Primary entry |
|---|---|---|
| Final-year student (BCA/MCA/…) | A complete project they can understand and present | Google search "BCA final year project", Instagram |
| Semi-final-year student | Mini/semester project | Degree page |
| Idea seeker | Inspiration and comparison | Home → categories, project finder |
| AI-focused student | Modern AI/RAG project | `/projects/ai` |
| Custom-requirement student | Something specific to their syllabus | `/custom-project` |
| Admin (owner/staff) | Catalog, leads, analytics | `/admin` |

## 4. Conversion funnel

DISCOVER → EXPLORE → UNDERSTAND → TRUST → CONTACT → PURCHASE

| Stage | Surfaces | Primary CTA |
|---|---|---|
| Discover | Home hero, degree cards, category cards, search, SEO pages | Explore Projects |
| Explore | `/projects`, degree/category hubs, filters, finder | View Project |
| Understand | Project detail: features, modules, how it works, stack, demo | Live Demo |
| Trust | What you get, documentation support, why us, real testimonials only, FAQ | — |
| Contact | WhatsApp CTAs (context-aware), custom project form | Get This Project |
| Purchase | Off-platform (WhatsApp) for MVP, tracked in CRM | — |

Emotional checkpoints the UI must deliver, in order: *"I found the exact type of project I need." → "I understand what this project does." → "I know exactly what I will receive." → "I trust this platform." → "I want to contact them."*

## 5. Functional requirements

### 5.1 Catalog (database-driven, nothing hardcoded)
- **Degrees**: initial BCA, MCA, BSc IT, MSc IT, B.Tech, M.Tech. Each has a slug, name, full name, short intro, SEO content sections and FAQs.
- **Categories**: initial Static Websites (from ₹2,000), Dynamic Websites (from ₹5,000), AI-Integrated Websites (from ₹10,000), E-Commerce (from ₹20,000). Each has a slug, name, description, starting price, example list, icon key, accent, WhatsApp route, SEO content and FAQs. New categories (Mobile, Flutter, ML, Data Science, IoT, …) are added from the admin panel.
- **Projects**: see the data model in TECHNICAL_ARCHITECTURE.md §5. A project has a primary category, optional extra categories, compatible degrees, technologies, difficulty, starting price, features, modules, "how it works" steps, what-you-get items, documentation info, customization options, FAQs, media, demo URL and SEO overrides.

### 5.2 Public pages
| Route | Purpose | Indexable |
|---|---|---|
| `/` | Home: hero, degree picker, categories, featured projects, how it works, why us, documentation, finder teaser, testimonials (only if real ones exist), FAQ, CTA | Yes |
| `/projects` | All projects with search, filters, sort, compare | Yes (canonical strips filter params) |
| `/projects/[degree]` (e.g. `/projects/bca`) | Degree hub: useful content plus filtered listing | Yes |
| `/projects/[category]` (e.g. `/projects/ai`) | Category hub: useful content plus filtered listing | Yes |
| `/projects/[project]` | Project detail | Yes, unless an admin sets noindex |
| `/compare` | Side-by-side comparison of 2–3 projects | No (noindex) |
| `/project-finder` | Rule-based "Not sure which project to choose?" | Yes |
| `/custom-project` | Custom project request form | Yes |
| `/documentation-support` | Project-book/documentation resources explained | Yes |
| `/blog`, `/blog/[slug]` | Guides (architecture ready; index is noindex until posts exist) | Conditional |
| `/about`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`, `/disclaimer` | Trust and legal | Yes |

Degrees, categories and projects share the `/projects/[slug]` namespace. Slugs are unique across all three, and the admin CMS enforces this.

### 5.3 Discovery
- Full-text search across name, short description, technologies and tags.
- Filters: category, degree, technology, price range, difficulty, AI / non-AI, featured. Sort by recommended (default), newest, price low→high, price high→low.
- The search dialog (⌘K / tap) shows recent searches (stored on the device), popular searches (from search events, with a sensible fallback), suggested categories and degrees, live project results, and no-result suggestions.
- Filter state lives in the URL query string so views are shareable. Filtered variants canonicalize to the clean path.

### 5.4 Project finder
Answers: degree, year (final/semi-final), preferred technology, category, budget, difficulty, AI requirement, web/mobile. A **rule-based scorer** returns ranked projects with a short "why this matches" explanation. It sits behind a `Recommender` interface so an AI recommender can replace it later.

### 5.5 Comparison
Students select 2–3 projects (a compare tray persists on the device). `/compare?p=a,b,c` shows category, technologies, degrees, difficulty, AI, admin panel, authentication, documentation, customization and price. Desktop shows a table; mobile shows stacked cards with a project switcher.

### 5.6 WhatsApp contact (core conversion)
- Numbers come **only** from environment variables. They are resolved server-side by a single service, `getWhatsAppTarget({ purpose, category, project })`.
- Each category stores a `whatsappRoute` (e.g. `ai`, `web`, `ecommerce`, `sales`), so routing new categories needs no code change.
- Pre-filled message templates per intent: project, AI project, custom project, general, support, pricing. The degree is inserted when known.
- Every CTA links to an internal tracked redirect (`/api/wa?...`). The server logs the event, then sends a 302 redirect to `https://wa.me/<number>?text=<encoded>`. This keeps tracking reliable even when ad blockers stop client analytics, and keeps all WhatsApp logic in one place.
- CTA locations: `navbar`, `hero`, `project_card`, `project_detail`, `pricing`, `custom_project`, `mobile_sticky`, `footer`, `compare`, `finder`, `category_page`, `degree_page`, `contact_page`, `faq`, `cta_band`.

### 5.7 Tracking and analytics
- Internal event store with a consistent schema. Events: `project_view`, `project_demo_click`, `whatsapp_click`, `project_compare`, `search`, `filter_used`, `custom_project_submit`, `degree_selected`, `category_selected`, `cta_click`, `finder_submit`.
- UTM parameters (`utm_source/medium/campaign/term/content`) and the external referrer are captured on landing in a first-party attribution cookie (last-touch, 30 days). They are attached to events and leads.
- GA4 is loaded only when a measurement ID is configured. Search Console verification is set through metadata.
- **Privacy**: no IP addresses (rate limiting uses a salted hash with a short TTL), no names or phone numbers on events, and no WhatsApp conversation content.
- A WhatsApp click is labelled **"WhatsApp Lead / CTA Click"**, never a "sale".

### 5.8 Custom project request
A form at `/custom-project` collects name, email, phone, WhatsApp number, degree, year, category, preferred technology, features, AI requirement, budget, deadline and notes. On submit it is Zod-validated, rate-limited, protected by a honeypot, and stored as a `ProjectRequest` plus a linked `Lead` (status NEW, source `custom_form`, UTM attached). The success state offers "Continue on WhatsApp" with the requirements pre-filled.

### 5.9 Admin (`/admin`, authenticated, RBAC)
- **Dashboard**: total, published and draft projects; WhatsApp clicks (today/7d/30d); leads by status; popular projects, categories and degrees; recent enquiries.
- **Projects CMS**: create, edit, archive, delete (owner only), publish/unpublish, feature; media (thumbnail, screenshots, OG image, demo, video); price; categories; degrees; technologies; features; modules; how it works; what you get; documentation; customization; FAQs; SEO overrides (title, description, canonical, noindex, OG image); structured-data toggle.
- **Categories / Degrees / Testimonials / FAQs**: CRUD and ordering.
- **Leads CRM**: list, filters, status pipeline NEW → CONTACTED → INTERESTED → FOLLOW_UP → PURCHASED → COMPLETED / LOST; notes; manual lead creation (e.g. after a WhatsApp chat).
- **Custom requests**: list and detail, convertible to a lead.
- **WhatsApp analytics**: totals, today/week/month, top projects, categories, degrees, number types, CTA locations, device split, traffic sources, UTM campaigns, daily trend. Filterable by date range, project, category, degree, number type, CTA location, device, UTM source and UTM campaign.
- **SEO dashboard**: published count, projects missing SEO title, description, OG image or thumbnail, custom canonicals, noindex pages, sitemap status and URL count.
- **Admin users** (owner): invite/create, set role, deactivate.

## 6. Content and trust rules
- No fake reviews, ratings, users, sales numbers or statistics. Testimonials render only when real, admin-entered testimonials exist. Counters show real catalog counts (projects, categories, degrees) from the database.
- No unsupported claims ("No. 1", "Best in India", "100% guaranteed").
- Documentation/project-book templates are described as **resources the student adapts**. Acceptance by any institution is never guaranteed.
- The responsible-use line appears in the footer, terms and disclaimer: *"Use our projects as a learning, development and customization starting point. Understand the implementation, adapt it to your requirements and ensure your final submission follows your institution's academic policies."*
- Seed/demo projects are **clearly marked as sample data** and are excluded from production seeding unless explicitly requested.

## 7. Non-functional requirements
- **Mobile-first**: designed at 360px first; tap targets ≥ 44px; body text ≥ 16px; no horizontal overflow; sticky bottom WhatsApp CTA on project pages that never covers content (the page reserves bottom padding).
- **Performance**: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-range mobile. Static shells via Cache Components, `next/image`, `next/font`, lazily loaded motion features.
- **Accessibility**: WCAG 2.2 AA intent. Semantic landmarks, keyboard navigation, visible focus, accessible dialogs, forms with labels and error text, reduced-motion support, and state never shown by colour alone.
- **Security**: see SECURITY_ACCESS.md.
- **SEO**: see TECHNICAL_ARCHITECTURE.md §9.

## 8. Success metrics
- WhatsApp CTA click-through rate per project view (primary).
- Custom-request submissions per week.
- Lead → PURCHASED conversion (tracked manually in CRM).
- Organic sessions and impressions on degree/category queries (Search Console).
- Core Web Vitals pass rate.

## 9. Open questions / assumptions (documented decisions)
| # | Question | Assumption taken |
|---|---|---|
| 1 | Brand name | "FinalYear Labs" (from the repository name), configurable via `NEXT_PUBLIC_SITE_NAME`. |
| 2 | Exact WhatsApp env names | `WHATSAPP_DEFAULT_NUMBER`, `WHATSAPP_SALES_NUMBER`, `WHATSAPP_AI_NUMBER`, `WHATSAPP_WEB_NUMBER`, `WHATSAPP_ECOMMERCE_NUMBER`, `WHATSAPP_SUPPORT_NUMBER`, `WHATSAPP_CUSTOM_NUMBER`. A missing value falls back to DEFAULT. |
| 3 | GA env var | GA measurement IDs are public by design, so the client uses `NEXT_PUBLIC_GA_MEASUREMENT_ID`. |
| 4 | Payments | Out of scope for MVP. `Order`/`Coupon` models and a payment-provider interface are defined but unused. |
| 5 | Refund policy specifics | Generic, professional draft with clearly marked placeholders for the owner to confirm. |
| 6 | Real testimonials / screenshots | None are provided. Testimonials stay hidden until real ones exist, and projects without a thumbnail render a generated branded cover. |
