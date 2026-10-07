# Security & Access — FinalYear Labs

Status: Draft v1 · Last updated: 2026-10-07

## 1. Threat model (MVP)

| Asset | Threat | Control |
|---|---|---|
| Admin panel and CMS | Credential stuffing, session theft, privilege misuse | bcrypt (cost 12), login rate limit + lockout, httpOnly/Secure/SameSite=Strict cookie, short-lived JWT + `sessionVersion` revocation, RBAC per action |
| Lead PII (custom requests, CRM) | Unauthorized read, exfiltration through APIs | Admin-only Server Components/Actions, no public API exposes leads, field projection |
| Public forms | Spam, flooding, injection | Zod validation, honeypot, Mongo-backed rate limit, length caps, `sanitizeFilter` |
| Event endpoints (`/api/events`, `/api/wa`) | Metric inflation, payload abuse | Zod schema with enums, payload size cap (4 KB), rate limit, bot UA filtering, same-origin check on POST |
| Secrets (DB URI, auth secret, WhatsApp numbers, Razorpay) | Leakage to the client | Read only in `server-only` modules through `lib/env.ts`, never `NEXT_PUBLIC_*`, `.env*` git-ignored |
| Rendering | XSS | React escaping, no `dangerouslySetInnerHTML` except JSON-LD (serialized with `<` → `<`), CSP, admin rich text stored as plain text/structured blocks (no HTML) |
| Uploads (future S3/R2) | Malicious files | Presigned PUT with MIME allowlist, size limit, random keys, served from a separate domain |

## 2. Authentication (admin)

- **Accounts**: the `Admin` collection. The first owner is created with `npm run create-admin` (reads `ADMIN_BOOTSTRAP_EMAIL`/`ADMIN_BOOTSTRAP_PASSWORD` or prompts). There is no public sign-up route.
- **Passwords**: `bcryptjs`, cost 12, minimum 8 characters (NIST SP 800-63B); rate limiting + lockout mitigate guessing. Hashes are never returned from any function that crosses to the client.
- **Login** (`/admin/login`, Server Action):
  1. Rate limit: 5 attempts / 15 min per IP-hash + email.
  2. Constant-time-ish path: bcrypt-compare against a dummy hash when the user is not found.
  3. After 10 consecutive failures, `lockedUntil = now + 30 min`.
  4. On success: `jose` HS256 JWT `{ sub, role, sv (sessionVersion) }`, `exp` 8h, cookie `fyl_admin`: `httpOnly`, `secure` (prod), `sameSite: 'strict'`, `path: '/'`.
  5. Generic error message ("Invalid email or password").
- **Logout**: deletes the cookie. "Sign out everywhere" increments `sessionVersion`.
- **`AUTH_SECRET`**: ≥ 32 random bytes, required at runtime (`lib/env.ts` throws if missing in production).

## 3. Authorization (RBAC)

| Role | Capabilities |
|---|---|
| `owner` | Everything, including admin users and hard delete |
| `admin` | Catalog CRUD, publish, leads, requests, analytics, SEO |
| `editor` | Catalog create/edit (no publish/delete), FAQs, testimonials (no publish), read analytics |
| `viewer` | Read-only dashboard, analytics and leads (phone/email masked) |

Enforcement layers (defense in depth):
1. **`proxy.ts`** (optimistic): `/admin/*` (except `/admin/login`) requires a cookie with a valid JWT signature and expiry. Otherwise it redirects to `/admin/login?next=…`. No DB access.
2. **Data Access Layer** (`lib/auth/dal.ts`, authoritative): `requireAdmin(minRole?)` verifies the JWT, loads the admin, checks `active`, `sessionVersion` and role rank, and is wrapped in `React.cache` per request. **Every** admin page, Server Action and admin Route Handler calls it first. The Next.js docs warn that Server Functions are POSTs to the page route, so proxy coverage alone isn't relied on.
3. **Permission helpers**: `can(role, 'project.publish')` maps actions to minimum roles in a single table (`lib/auth/rbac.ts`).

## 4. Input validation and data safety

- All Server Actions and Route Handlers parse input with Zod schemas from `lib/validation/*`. Unknown keys are stripped, and strings are trimmed and length-capped.
- Mongoose: `mongoose.set('sanitizeFilter', true)` (strips `$`-prefixed operators from user-provided filters), `strictQuery: true`, strict schemas. Query values are built from validated primitives only, and regexes from user search text are escaped.
- ObjectIds are validated with `isValidObjectId` before queries.
- Slugs are validated with `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- URLs (demo, video, images) are validated as `https:` (or relative `/`). `javascript:` and `data:` are rejected.
- Output: public DTO mappers whitelist fields (`repoUrl` is excluded unless `showRepo`; admin fields are excluded).

## 5. CSRF

- Server Actions: Next.js compares `Origin` with `Host`/`X-Forwarded-Host` and rejects mismatches. Admin cookies are also `SameSite=Strict`.
- POST Route Handlers (`/api/events`): `assertSameOrigin(request)` checks `Origin` (or `Referer`) against `NEXT_PUBLIC_SITE_URL`/host. `sendBeacon` sends `Origin`.
- `GET /api/wa` is side-effect-light (logs one analytics event). It is protected from crawler inflation with `rel="nofollow"`, a robots disallow, a bot UA filter and a rate limit.

## 6. Rate limiting

`lib/security/rate-limit.ts`: fixed window, stored in the `ratelimits` collection with a TTL index on `expiresAt`. Key = `bucket:sha256(ip + RATE_LIMIT_SALT)` (raw IPs are never stored). Atomic `findOneAndUpdate` with `$inc` and upsert.

| Bucket | Limit |
|---|---|
| `login` | 5 / 15 min (per IP) and 10 / 15 min (per email) |
| `custom_request` | 5 / hour |
| `contact` | 5 / hour |
| `events` | 120 / min |
| `wa` | 30 / min |
| `search` | 60 / min |

On limit: HTTP 429 / action error "Too many requests, please try again shortly."

## 7. HTTP security headers (`next.config.ts` → `headers()`)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload   (prod only)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self';
  connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com;
  frame-src https://www.youtube-nocookie.com https://player.vimeo.com; frame-ancestors 'none'; object-src 'none';
  base-uri 'self'; form-action 'self' https://wa.me https://api.whatsapp.com; upgrade-insecure-requests
```
`/admin/*` additionally gets `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`. The `'unsafe-inline'` trade-off is documented in TECHNICAL_ARCHITECTURE.md §13.

## 8. Secrets and environment

- `lib/env.ts` (`import 'server-only'`) validates server env with Zod. Missing optional values degrade gracefully (e.g. no WhatsApp number → CTA hidden). Missing required values in production throw at first use.
- Public config is limited to `NEXT_PUBLIC_*` values that are safe by design (site URL, name, GA measurement ID, feature flags, asset hosts).
- WhatsApp numbers are server-only. The browser only sees `/api/wa?...` links. The destination `wa.me` URL is revealed only in the redirect response, after the click.
- `.env`, `.env.local` and `.env.*.local` are git-ignored. `.env.example` contains placeholders only.

## 9. Privacy

- Event records contain no names, phones, emails or IPs. Referrer is stored as host only, and the session id is random.
- PII exists only in `ProjectRequest`/`Lead` (submitted voluntarily, with a consent checkbox linking to the privacy policy).
- Viewers see masked PII (`98•••••210`).
- Retention: analytics events expire after `ANALYTICS_RETENTION_DAYS` (default 730). Leads are kept until deleted by an owner/admin.

## 10. Logging and errors

- Server errors are logged with a request id and no PII. Clients receive generic messages.
- `error.tsx` boundaries never render stack traces in production.

## 11. Security checklist (release gate)
- [ ] `AUTH_SECRET`, `RATE_LIMIT_SALT` set (≥ 32 bytes) in production
- [ ] Owner account created; bootstrap password rotated
- [ ] `/admin` returns a redirect without a cookie; admin actions return an error without a session (tested)
- [ ] No `NEXT_PUBLIC_` variable contains a secret (`grep`)
- [ ] Headers verified with `curl -I`
- [ ] Rate limits verified (429)
- [ ] `npm audit --omit=dev` reviewed
