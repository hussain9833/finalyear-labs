# Frontend Spec — FinalYear Labs

Status: Draft v1 · Last updated: 2026-10-07

## 1. Design principles
1. **Product, not brochure.** The site should look like a modern developer-tool or SaaS marketplace (think Linear/Vercel catalog pages), not a college site.
2. **Clarity before flourish.** Every section answers one student question. Animation reinforces hierarchy and never decorates for its own sake.
3. **Mobile-first, thumb-first.** Design at 360px, then scale up. Primary actions sit in the thumb zone.
4. **Honest trust.** Real counts, real testimonials only, plain-language "what you get".
5. **One accent for conversion.** WhatsApp green appears **only** on contact CTAs, so it always means "talk to us".

## 2. Design tokens (CSS variables, `globals.css`, Tailwind v4 `@theme inline`)

### Color (OKLCH; light / dark)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `oklch(0.99 0.002 270)` | `oklch(0.15 0.01 270)` | Page |
| `--foreground` | `oklch(0.2 0.02 270)` | `oklch(0.96 0.005 270)` | Text |
| `--card` | `oklch(1 0 0)` | `oklch(0.19 0.012 270)` | Surfaces |
| `--muted` / `--muted-foreground` | `oklch(0.96 0.006 270)` / `oklch(0.47 0.02 270)` | `oklch(0.24 0.014 270)` / `oklch(0.72 0.015 270)` | Secondary text ≥ 4.5:1 |
| `--border` | `oklch(0.91 0.008 270)` | `oklch(0.29 0.015 270)` | Hairlines |
| `--primary` | `oklch(0.52 0.22 275)` (iris) | `oklch(0.68 0.18 275)` | Brand actions, links, focus |
| `--primary-foreground` | white | `oklch(0.15 0.02 275)` | |
| `--accent-2` | `oklch(0.7 0.15 195)` (cyan) | same, brighter | Gradient partner, data viz |
| `--whatsapp` | `oklch(0.62 0.17 150)` | `oklch(0.7 0.17 150)` | WhatsApp CTAs only |
| `--success` / `--warning` / `--destructive` | standard | standard | States (always paired with icon + text) |

Category accents are token keys (`iris`, `cyan`, `amber`, `rose`, `emerald`, `violet`) stored on the Category document, so admins pick from a palette instead of entering raw hex.

### Typography
- **Geist Sans** (UI, body) and **Geist Mono** (tech chips, code, numbers), via `next/font` with `display: swap`.
- Scale (mobile → desktop): `display` 36→60/1.05 −0.03em · `h1` 30→48 · `h2` 24→36 · `h3` 20→24 · `body` 16/1.6 · `small` 14 · `xs` 12 (badges only).
- Max line length is 68ch for prose.

### Spacing, radius and elevation
- 4px base. Section padding `py-16 md:py-24`. Container `max-w-7xl px-4 sm:px-6 lg:px-8` (16px gutter on mobile).
- Radius: `--radius: 0.875rem`. Buttons and inputs use `rounded-xl`, cards `rounded-2xl`, chips `rounded-full`.
- Shadows: `shadow-xs` (resting card), `shadow-lg` with a primary tint on hover (light). In dark mode, elevation comes from a lighter surface plus a ring border, not from shadows.

### Motion
- Durations: 150ms (micro), 250ms (UI), 500–700ms (reveals). Easing `[0.22, 1, 0.36, 1]`.
- Only `transform` and `opacity` are animated. Nothing animates layout properties on scroll.
- `prefers-reduced-motion: reduce` → reveals render immediately, counters show their final value, and hero auto-rotation stops (`MotionConfig reducedMotion="user"` plus CSS fallbacks).

## 3. Component inventory

| Component | Notes |
|---|---|
| `Navbar` | Sticky, blurred surface after scroll. Desktop: logo, Projects (mega-menu: categories + degrees), How It Works, Why Us, Custom Project, Blog, Contact, search button (⌘K), theme toggle, WhatsApp CTA. Mobile: logo, search icon, menu button → `Sheet` with large tap rows, categories/degrees chips and a WhatsApp CTA. |
| `Footer` | Columns: Projects (categories), Degrees, Company, Legal, the responsible-use note and a WhatsApp CTA (`footer`). |
| `Hero` | Headline, subhead, two CTAs, degree ribbon, and an interactive showcase: a stack of featured-project "browser window" cards that rotate (auto, pause on hover/focus, keyboard tabs). Static LCP text, so the showcase never blocks LCP. |
| `DegreeCard` / `DegreeGrid` | 6 cards (2-col mobile, 3-col tablet, 6-col desktop) with abbreviation, full name and project count. Link → `/projects/{slug}`. |
| `CategoryCard` / `CategoryGrid` | Icon, name, "From ₹X", 3 examples, project count. Hover: lift plus accent glow. |
| `ProjectCard` | Thumbnail (or generated cover) 16:10, AI/Featured badges, category, name, short description (2 lines), tech chips (max 3 + "+n"), degree chips, difficulty meter (icon + text), "From ₹X". Actions: **View Project** (primary link covering the card), **Live Demo** (if any), **Get This Project** (WhatsApp, `project_card`). Compare checkbox (top-right) with a label. |
| `ProjectGrid` | Responsive 1/2/3 columns; staggered reveal; skeleton variant. |
| `ProjectFilters` | Desktop: left sidebar. Mobile: "Filters (n)" button → bottom `Sheet` with Apply/Reset. Writes to the URL (`router.replace`, scroll preserved). Active filter chips are removable. |
| `SearchBar` / `SearchDialog` | Command palette: recent (localStorage), popular, categories, degrees, live results (debounced 200ms, `/api/search`), no-result suggestions. |
| `ProjectDetails` | Sections listed in §5.4. |
| `FeatureList`, `ModuleAccordion`, `HowItWorksSteps`, `TechnologyList`, `WhatYouGet`, `DocumentationBlock`, `CustomizationBlock` | Detail page building blocks. |
| `PricingCard` | Sticky on desktop (right rail): "Starting from ₹X", what's included summary, WhatsApp CTA (`pricing`), Live Demo, Compare. |
| `WhatsAppButton` | Single component for every WhatsApp CTA. Props: `intent`, `ctaLocation`, `projectSlug?`, `categorySlug?`, `degreeSlug?`, `variant`, `size`. Renders `<a href="/api/wa?..." target="_blank" rel="nofollow noopener">` with the WhatsApp icon. Hidden when disabled. |
| `WhatsAppStickyBar` | Mobile-only (`md:hidden`), fixed bottom, safe-area padding, shows price + "Get This Project". The page adds matching bottom padding so content is never covered. Hides when the in-page pricing CTA is visible (IntersectionObserver) to avoid duplicate buttons. |
| `TrustSection` | "Why Choose Us?" with the GitHub comparison framed as complementary ("Repository" vs "Complete project journey" columns). |
| `TestimonialCard` | Rendered only if published testimonials with consent exist. |
| `FAQ` | Radix Accordion; emits FAQPage JSON-LD only where rendered. |
| `ComparisonTable` / `CompareTray` | Tray floats above the mobile sticky bar; max 3; "Compare (n)". |
| `CustomProjectForm` | Multi-section form with clear labels, inline errors, pending state, success state + WhatsApp continue. |
| `Breadcrumbs` | Visible + BreadcrumbList JSON-LD. |
| `JsonLd` | Safe serializer. |
| `AnalyticsProvider` | Fires `project_view` etc. through `useTrack()`; loads GA4 lazily when configured. |
| `Reveal`, `Stagger`, `Counter` | Motion utilities, reduced-motion aware. |
| States | `Skeleton*`, `EmptyState` (icon, title, body, action), `ErrorState` (retry). |

## 4. Page specs

### 4.1 Home `/`
1. **Hero**: H1 "Your Final-Year Project Starts Here." Subhead (per brief). CTAs: Explore Projects (→ `/projects`), Talk to Us on WhatsApp (`hero`, general). Degree ribbon "BCA • MCA • BSc IT • MSc IT • B.Tech • M.Tech" (from DB). Showcase of featured projects on the right/below.
2. **Real stats strip**: published projects, categories, degrees supported (DB counts, animated counters). It is hidden if counts are 0.
3. **What's Your Degree?**: DegreeGrid.
4. **Browse by category**: CategoryGrid with "From ₹X".
5. **Featured projects**: ProjectGrid (6) + "View all".
6. **How it works**: 4 steps: Choose → Understand (demo, modules, docs) → Talk to us on WhatsApp → Customize & learn.
7. **Why Choose Us?**: TrustSection.
8. **Documentation support**: summary of project-book sections + link to `/documentation-support`.
9. **Not sure which project to choose?**: finder teaser (3 quick selects → `/project-finder?…`).
10. **Testimonials** (conditional).
11. **FAQ** (home scope).
12. **CTA band**: Custom project + WhatsApp.

### 4.2 Projects `/projects`
H1 "Final-Year Projects". Search input, filters, sort, result count, grid, pagination ("Load more" progressively enhanced over `?page=`). Empty state suggests clearing filters and browsing popular categories, plus a custom-project CTA.

### 4.3 Degree hub `/projects/bca`
Breadcrumbs → H1 "BCA Final Year Projects" → intro → quick links to categories (with counts for this degree) → project grid (filtered by degree, with filters) → content sections (what BCA projects are, types, technologies, how to choose, documentation, presentation prep) → FAQs → related degrees → CTA band.

### 4.4 Category hub `/projects/ai`
Breadcrumbs → H1 → "From ₹X" + examples → grid → content sections → degree links → FAQs → CTA (category-routed WhatsApp).

### 4.5 Project detail `/projects/[slug]`
Mobile order:
1. Breadcrumbs
2. Title, badges (AI/Featured/category), short description
3. Price row ("Starting from ₹X") + primary CTA + Live Demo + Compare
4. Gallery (thumbnail + screenshots, swipeable, lightbox `Dialog`)
5. Quick facts (degrees, difficulty, level, platform, admin panel, auth)
6. Technologies
7. Features
8. Modules (accordion)
9. How it works (steps)
10. Tech stack detail
11. What you get (with the templates disclaimer)
12. Documentation included
13. Customization options
14. FAQ
15. Testimonials (project-specific, conditional)
16. Related projects (same degree / same category / similar)
17. Custom project CTA

Desktop: 2-column layout with the content left and a sticky `PricingCard` on the right.

### 4.6 Compare `/compare`
Table on ≥ md with a sticky first column and sticky project headers. Rows: Category, Technologies, Degrees, Difficulty, AI, Admin panel, Authentication, Documentation, Customization, Price. Boolean cells use icon + text ("Yes"/"No"). Mobile: segmented project switcher + stacked cards; horizontal scroll fallback.

### 4.7 Project finder `/project-finder`
A 1-question-per-step wizard on mobile (progress bar, back/next) and a single form on desktop. Results page: ranked cards with "Why it matches" bullets and a WhatsApp CTA (`finder`).

### 4.8 Custom project `/custom-project`
Value props + form + "Prefer to chat? WhatsApp us" (`custom_project`). On success: confirmation + "Continue on WhatsApp" with the summary pre-filled.

### 4.9 Admin
shadcn dashboard pattern: sidebar (collapsible to icons; Sheet on mobile), topbar with user menu. Tables use responsive cards on mobile. Forms are sectioned with sticky save bars. KPI cards and simple, accessible bar/line charts (pure SVG, no chart library) with table fallbacks.

## 5. Responsive breakpoints
`sm 640 · md 768 · lg 1024 · xl 1280`. Test widths: 360, 390, 414, 768, 1024, 1280, 1440. No horizontal scroll at 320px.

## 6. Accessibility checklist
- Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`; skip link "Skip to content".
- One `h1` per page and a logical heading order.
- Focus ring: `outline-2 outline-offset-2 outline-[--ring]` on all interactive elements.
- Dialog/Sheet: focus trap, `Esc` closes, focus returns to the trigger (Radix).
- Form fields have a `<label>`, `aria-describedby` for errors, `aria-invalid`, and an error summary on submit.
- Icon-only buttons have `aria-label`.
- Contrast ≥ 4.5:1 for text and ≥ 3:1 for UI components in both themes.
- Status uses icon + text, never colour alone.
- Images have meaningful `alt`. Decorative images use `alt=""`.
- Carousel/showcase has pause control, keyboard tabs, and `aria-live="off"` while auto-rotating.

## 7. Performance budget
- Home JS (first load) ≤ 170 KB gz. Project page ≤ 180 KB gz.
- Motion is loaded through `LazyMotion` (`domAnimation` async). The search dialog and lightbox are `next/dynamic`.
- Only the hero/first-card image uses `priority`. Everything else is lazy with `sizes`.
- Fonts: 2 variable files, `display: swap`, preloaded by next/font.
- No layout shift: images have intrinsic sizes or aspect-ratio boxes, and skeletons match final dimensions.

## 8. Content voice
Confident, student-friendly, specific. Avoid hype and superlatives. Prefer "you" and "your project". The prices shown are always "Starting from".
