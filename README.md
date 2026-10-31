# St. Mary's School website

The supplied React/Next.js design, school content, assets, and admin layouts are preserved. See `SECURITY_REVIEW.md` for the findings, verification and remaining limits.

## Website Content — additive Phase 1 update

Existing admins can edit shared/header/footer and homepage text at `/admin/site-content`. No data migration, default seeding, credential reset or new service is needed for this additive feature. Preserve the existing working production configuration/account; the historical first-security-rollout setup instructions below are not a reason to reset it for Phase 1. Static assets and existing CRUD collections are unchanged.

See [the Phase 1 report](docs/site-content-phase1.md) for API examples, verification limits, backups and rollback, [the content inventory](docs/site-content-inventory.md) for remaining work, and [the complete field list](docs/site-content-fields.md). To temporarily restore original public text without deleting saved edits, set server-only `SITE_CONTENT_OVERRIDES_ENABLED=false` and restart the existing app; remove it or set `true` to resume overrides. The setting defaults to enabled. Refresh public pages after changing it.

Phase 2 extends the same editor to the remaining public pages, excluding Mandatory Public Disclosure. Choose a page and section, search fields, save individual edits and use View Public Page. See [the Phase 2 report](docs/site-content-phase2.md), [route-by-route coverage](docs/site-content-phase2-coverage.md) and [new field list](docs/site-content-phase2-fields.md). Its 906 new fields preserve the existing 200 global/home definitions. No business-model migration, default seeding, account change or deployment step is required for editing. The rollback flag applies to every content group. The contact page retains its existing simulated submission behavior; it does not send messages to a backend.

## Requirements

- Node.js 22.15+ or Node.js 24, npm, and MongoDB.
- A persistent writable `uploads/` directory. Deploy to a VPS/container with persistent storage, or mount a durable volume. An ephemeral serverless filesystem can lose uploaded files or be read-only.
- In production, HTTPS and a reverse proxy/CDN. Keep the Next.js port private.

## First setup / historical security rollout

1. Back up the current MongoDB database and the entire `uploads/` directory. Keep the existing database and existing media; this archive is source code, not a database backup.
2. Install dependencies with `npm ci`. Development dependencies are needed to build the site's Tailwind styles. Do not run `npm audit fix --force`: it proposes a Tailwind major upgrade which requires visual regression work.
3. Copy `.env.example` to `.env.local` (PowerShell: `Copy-Item .env.example .env.local`). Put your MongoDB URI in `MONGODB_URI` and your exact public origin in `APP_ORIGIN`, for example `https://www.stmarysmaligaon.in`. Do not add a trailing slash or path. For local work use `http://localhost:3000`.
4. Generate a fresh JWT secret: `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. Put the result in `JWT_SECRET`. Do not use any old secret from the uploaded archive. Remove `ADMIN_EMAIL` and `ADMIN_PASSWORD` from hosting settings and any other `.env` files. Rotate the MongoDB password supplied in the original archive too, then update the URI on the server. Keep server secrets private; never use `NEXT_PUBLIC_` for them.
5. For a **new** database, run `npm run seed:admin`. Enter the admin email, display name, password and password confirmation. Password input is hidden. Use at least 12 characters with uppercase, lowercase and a number, within bcrypt's 72-byte limit. The account is stored in MongoDB with a bcrypt hash; no login password is written to an environment file or source file.
6. For this CMS upgrade, keep the existing administrator, JWT secret and sessions. Do not run either seeder. The reset command belongs only to a separately authorized credential reset; it is not a deployment prerequisite.
7. Run `npm test`, then `npm run build`, then `npm start`. Build with development dependencies installed. A production image can prune them with `npm prune --omit=dev` after building; verify the resulting image before release.
8. Sign in at `/admin/login`, test each admin form, and verify existing images/PDFs on the public pages. The CMS upgrade preserves existing authentication and sessions. Password changes and logout revoke all sessions for that admin.

For local development use `npm run dev`. Next.js sets `NODE_ENV`; do not put it in `.env.local`.

## Proxy and origin settings

`APP_ORIGIN` is the browser-facing origin, even if Next.js runs behind an HTTP reverse proxy. Redirect alternate www/apex domains to that origin. Writes from other origins, missing origins, or cross-site browser requests return 403. Non-browser API clients must explicitly send the trusted `Origin` header as well as valid authentication. No CORS access is enabled.

`TRUST_PROXY_IP=false` is the safe default: auth requests share a 60-request/15-minute bucket, plus login has a 10-request/15-minute per-account bucket. Set it to `true` only if the proxy overwrites `X-Forwarded-For` with a trustworthy client address and direct access to the app port is blocked. Incorrect proxy trust allows IP spoofing. At the edge, enforce connection/request rate limits and a body limit of **21 MiB**, plus a short request-body timeout. The app independently bounds streamed API bodies (64 KiB JSON; 21 MiB multipart) and file sizes (5 MiB images, 10 MiB circular PDFs, 20 MiB downloads).

Rate limits use a shared MongoDB collection, `authratelimits`, with atomic counters and a TTL expiry index. The seeder initializes the admin uniqueness and limiter TTL indexes. Allow those index operations during setup. An upload limit of 60 requests/15 minutes applies per admin. Authentication limits remain enforced across app restarts and instances; ingress controls are also necessary against connection floods and database overload.

## Verification

- `npm test`: security and file-serving tests. The database suite is explicitly skipped unless a dedicated local database URI is supplied.
- To run that suite, provide `TEST_MONGODB_URI` pointing to a **fresh, disposable** MongoDB on `127.0.0.1` with an explicit port, and run `npm test`. It creates test records; never point it at your school database. The suite does not drop databases. A temporary MongoDB was used for the verification recorded in `SECURITY_REVIEW.md`.
- `npm audit --omit=dev`: production dependency checks.
- `npm audit`: includes the documented Tailwind build-tool advisories.
- `GET /api/health`: process liveness without a MongoDB dependency.
- `GET /api/health/ready`: database readiness; returns an error if connection fails.

## Operational requirements

Use process restart supervision, HTTPS, a firewall, database access restrictions, log rotation, disk-space monitoring, uptime checks and daily database/upload backups with a tested restore. All instances must share the same upload volume. File deletion is deferred until the database operation succeeds; failed requests clean up new files. A process crash between disk and DB operations can still leave orphan files because these systems do not share an atomic transaction. Cleanup failures are logged without removing a valid DB record's previous file before a failed update.

Downloads are signature checked, not antivirus scanned; Office/archive uploads must still come from a trusted admin. Deactivating content hides it from public metadata APIs, but a known direct upload URL remains public. This matches a public school-media website, not private document storage.

## Automated seed input

For a secure deployment pipeline, run `node scripts/seedAdmin.js --stdin-json` with a JSON object containing `email`, `password` and optional `name` delivered over stdin from a secret manager. Add `--reset` only for a deliberate password reset. Do not embed real passwords in shell commands, checked-in JSON, seed code, logs or environment files. The interactive command is recommended for manual setup.

## Phase 3 disclosure CMS

Website Content now includes Mandatory Public Disclosure: editable values, Fixed PDFs, and Additional Documents. Fixed names/order remain protected; original files remain fallbacks. See [the complete A-L implementation and readiness report](docs/site-content-phase3.md), [final content coverage](docs/site-content-phase3-coverage.md), and [disclosure fields](docs/site-content-phase3-fields.md). New PDF metadata uses only `disclosuredocuments`; existing business collections remain unchanged. No account creation/reset, migration or deployment was performed.

Runtime PDFs use the existing persistent `uploads/disclosures/` directory and controlled file routes. Do not serve that directory directly through the proxy. `DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED=false` temporarily shows original fixed PDFs and hides additional rows while retaining saved metadata/files. Text overrides have the independent existing flag. Neither flag revokes already-known published PDF links; they are public school documents.

Local production verification may use `CMS_VERIFY_BUILD=true npm run build` and the same flag at startup to isolate `.next-cms-verification` from a running dev server; normal deployment continues to use `.next`. On Windows set the environment variable in PowerShell before running the command. Never set verification database/session doubles on a real deployment.
