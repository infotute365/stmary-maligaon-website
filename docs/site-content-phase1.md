# Phase 1 implementation report — 31 October 2026

## Architecture and scope

The existing App Router catch-all, client-side `src/App.jsx` route map, API adapter, auth provider, JWT/session checks, secure cookie handling, origin checks, flat-body validation, MongoDB connection and seven CRUD resources remain in place. No production deployment, database access, seeding, credential reset, asset replacement or upload changes were performed.

`src/content/registry.js` defines 200 approved fields, exact original defaults, labels, sections, types and maximum lengths. The registry is shared by the server and public fallback renderer; the browser receiving the registry does not grant write access. All registered content was already public. Defaults are never seeded.

The only new business collection is Mongoose `SiteContent` → `sitecontents`, using the existing database connection. `_id` is the stable field key, enforcing uniqueness through MongoDB's primary index without a migration. Records contain key, group, value, revision, updatedBy and timestamps. Existing collections and relationships are unchanged. The existing shared limiter collection also tracks the new update bucket, as it does for other secured resources.

Writes use one atomic `findOneAndUpdate` conditioned on `_id` and the last saved revision. Revision 0 means no saved record. Competing initial upserts collide on `_id`; later stale writes match no document. Both return 409. Reset removes the override value but retains a null-valued revision tombstone. This prevents a stale pre-reset editor from recreating old content. Resetting an absent field is a no-op and never inserts a default. Failed writes return errors.

`SiteContentProvider` renders original defaults immediately, requests global content on public pages and homepage content only on `/`, shares pending group requests, validates overrides defensively, and retains defaults/last successful content during failures. Requests expire after 15 seconds. Effects ignore results after unmount or navigation. Mounts, homepage transitions, tab visibility/focus and a local update event refresh data. There is no persistent public-content cache; refreshing a page loads current overrides without redeployment. An already open unfocused tab updates when focused/refreshed.

The protected `/admin/site-content` section uses the existing `adminApi` client. It provides grouped controls, per-field saves and confirmed resets, validation, progress, success/error feedback and explicit conflict recovery. Inputs show unsaved state. Link navigation and browser unload warn about drafts; drafts also survive client-side Back navigation through tab-scoped session storage. Group switches keep drafts. Browser storage can be disabled, in which case recovery is unavailable. Internal keys, IDs and raw JSON are not displayed in the editor.

The editor starts with the existing compact sidebar so controls fit on small screens. `AdminLayout` gains an optional initial-sidebar prop; its original default remains unchanged for all existing screens.

## File changes

| File | Purpose |
| --- | --- |
| `src/content/registry.js` (new) | Exact defaults and the approved field metadata |
| `src/content/validation.js` (new) | Shared value validation and public record allowlisting |
| `src/content/SiteContentProvider.jsx` (new) | Group fetching, fallbacks, deduplication and refresh lifecycle |
| `src/server/models/SiteContent.js` (new) | Isolated override/revision collection |
| `src/server/controllers/siteContentController.js` (new) | Public/editor reads, atomic saves and revision-safe resets |
| `app/api/[...path]/route.js` | Add resource matching, key params and update limiter; no-store on origin rejection |
| `src/admin/pages/SiteContentPage.jsx` (new) | Grouped editor, feedback, conflicts, reset and draft recovery |
| `src/admin/utils/siteContentApi.js` (new) | Content calls through the existing authenticated API client |
| `src/admin/components/AdminSidebar.jsx` | One Website Content navigation entry |
| `src/admin/components/AdminLayout.jsx` | Optional initial compact sidebar for the new editor |
| `src/App.jsx` | Protected editor route and public provider wrapper without an extra DOM element |
| `src/components/layout/TopBar.jsx` | Connect original top-bar text |
| `src/components/layout/Navbar.jsx` | Connect identity and shared desktop/mobile labels |
| `src/components/layout/Footer.jsx` | Connect footer wording, contact and validated social URLs |
| `src/site-pages/Home.jsx` | Connect heading fragments and admissions strip |
| `src/components/home/HeroCarousel.jsx` | Connect slide text/alt text and CTA captions |
| `src/components/home/WelcomeSection.jsx` | Connect welcome copy, identity, highlights and caption/button |
| `src/components/home/AboutUs.jsx` | Connect headings, cards, visible statistics and discovery captions |
| `src/components/home/FeatureCard.jsx` | Connect six existing card titles/descriptions/badges and CTA label |
| `src/components/home/PrincipalMessage.jsx` | Connect message fragments, identity, quotes, footer and mail destination |
| `src/components/home/Sister.jsx` | Connect manager/founder/co-foundress messages and captions |
| `src/components/home/CircularsPanel.jsx` | Connect static labels while retaining existing record/PDF loading |
| `tests/site-content.test.js` (new) | Actual API adapter/security checks with isolated model doubles |
| `tests/site-content-render.test.js` (new) | Before/after fallback DOM, mobile labels, injection escaping and coverage |
| `tests/site-content-db.test.js` (new) | Opt-in isolated actual MongoDB atomicity/reconnect/reset checks |
| `tests/fixtures/site-content-original.json` (new) | Pre-change public source fixture for regression comparisons |
| `verification/site-content-smoke.cjs` (new) | Local production HTTP checks with deliberately unavailable loopback MongoDB |
| `verification/site-content-http.json` (new) | Actual HTTP smoke results |
| `verification/site-content-tests.txt` (new) | Actual final test output |
| `verification/site-content-build.txt` (new) | Actual final build output |
| `verification/site-content-audit.json` (new) | Actual production dependency audit |
| `docs/site-content-inventory.md` (new) | Route/static content/assets/PDF audit and deferred component list |
| `docs/site-content-fields.md` (new) | Exhaustive field coverage |
| `docs/site-content-phase1.md` (new) | This implementation, API, security, verification and release report |
| `README.md` | Entry point for the new editor/report/rollback and additive-upgrade instructions |

The pre-existing untracked archive and three untracked upload files were left untouched. `NavDropdown.jsx`, `StatsCounter.jsx`, `seedData.js`, Next configuration, dependencies, existing models/controllers/auth/middleware and static assets are unchanged.

## Content coverage

The exhaustive 200-field list is in [site-content-fields.md](site-content-fields.md). The registry contains every exact fallback value.

- Header/top bar: school name, short name, branch, city/state, year, affiliation, address, phone, email, compact mobile address/email labels, affiliation wording, full and compact admin-login labels.
- Navigation: Home, all five dropdown captions, every existing dropdown and direct-link label, and mobile Login. Desktop/mobile links share field values, destinations stay fixed. `NavDropdown.jsx` already consumes labels through props and needs no edit.
- Footer: school title, both description paragraphs, column captions, all nine link labels, contact address/phone/email, three social URLs, copyright wording and credit prefix/name. The current year and copyright symbol stay generated/fixed.
- Hero: five independent titles/subtitles and both CTA captions; original image imports, controls, slide count/order and animation code remain in place.
- Welcome: eyebrow, school identity, established value/caption, paragraph, four highlights and story button.
- About: eyebrow, split heading preserving its emphasized span, subtitle, four displayed statistic values/labels, four card titles/descriptions, shared Read More caption and closing discovery captions.
- School highlights: split section heading, eyebrow/subtitle, six card titles/descriptions/badges, shared Learn More caption.
- Principal: heading fragments, name shared between photograph/signature, designations, welcome caption, opening quotation, each message paragraph and emphasized school-name fragment, highlighted quotation, displayed email and separate original mail destination, closing motto and establishment caption.
- Sisters: heading fragments, manager badge/name/designations, message caption, all message paragraphs/quotations and closing text, founder/co-foundress badges/names/designations/headings/biographies, shared Read More caption and split Salesian-spirit caption. Existing photographs remain fixed.
- Circulars: panel title/subtitle, loading/empty states, singular/plural count words, View, modal caption and Download PDF. Counts, dates, record titles/descriptions and PDF URLs continue to come from existing application behavior and the Circular API.
- Closing admissions strip: badge, both heading fragments around the existing `<br>`, paragraph and both buttons.

Fixed technical accessibility labels (menu/carousel/modal controls, image descriptions) and decorative arrows are intentionally excluded. Hero image alt text follows its edited slide title. `StatsCounter.jsx` is not rendered by the actual homepage; it remains unchanged and is not exposed in this editor. The homepage's visible statistics are in `AboutUs.jsx` and are editable.

## API

All responses are JSON. Success responses use `{ "success": true, "data": ... }`; failures use `{ "success": false, "message": "..." }`. Public failure can additionally contain `data: {}`. Public and admin content responses use `Cache-Control: no-store`.

| Method and endpoint | Permission | Result |
| --- | --- | --- |
| `GET /api/site-content?group=global` | Public | Approved global overrides only; no defaults, revisions or update identities |
| `GET /api/site-content?group=home` | Public | Approved homepage overrides only |
| `GET /api/site-content/all?group=home` | Existing authenticated admin | Field metadata, effective values, defaults, revisions, override state and timestamps |
| `GET /api/site-content/all?group=global` | Existing authenticated admin | Global editor data |
| `PUT /api/site-content/:key` | Existing authenticated admin + trusted Origin | Save exactly one value with its expected revision |
| `DELETE /api/site-content/:key` | Existing authenticated admin + trusted Origin | Restore fallback with its expected revision |

Example public response before any save:

```json
{"success":true,"data":{}}
```

Example save from a same-origin authenticated browser (do not put credentials in source code):

```js
fetch('/api/site-content/home.hero.slide1.title', {
  method: 'PUT', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 'School-approved replacement title', revision: 0 })
})
```

The browser sends its Origin automatically. Non-browser callers must explicitly provide the configured `APP_ORIGIN` and existing authentication.

Example save response (timestamp abbreviated here):

```json
{"success":true,"data":{"key":"home.hero.slide1.title","value":"School-approved replacement title","revision":1,"hasOverride":true,"updatedAt":"2026-10-31T00:00:00.000Z"}}
```

Example public read after saving:

```json
{"success":true,"data":{"home.hero.slide1.title":"School-approved replacement title"}}
```

Example editor field, within the returned data array:

```json
{"key":"home.hero.slide1.title","group":"home","section":"Hero Carousel → Slide 1","label":"Slide title","type":"text","maxLength":500,"defaultValue":"Nurturing Minds, Building Character","enabled":true,"value":"School-approved replacement title","revision":1,"hasOverride":true,"updatedAt":"2026-10-31T00:00:00.000Z"}
```

Reset request:

```js
fetch('/api/site-content/home.hero.slide1.title', {
  method: 'DELETE', credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ revision: 1 })
})
```

It returns the exact default value, revision 2, and `hasOverride: false`. Subsequent public reads omit that key.

Statuses: 200 success; 400 invalid group/key/fields/value/revision or nested input; 401 missing/invalid/expired admin session; 403 untrusted/missing Origin or cross-site metadata for writes; 404 unsupported routes/methods or malformed key paths; 409 stale revision/competing initial creation; 413 excessive body; 415 incorrect body media type; 429 update limit exceeded with Retry-After; 500 authenticated operation/database failure; 503 failed public content read. Existing middleware can also return 408 for body timeout. Origin rejection precedes authentication, preserving the existing adapter's order.

## Security review

Authentication uses the unchanged `protect` middleware, HS256 JWT checks and stored admin session version. Existing cookie and logout/password logic is unchanged. New writes use the adapter's exact origin/CSRF verification, bounded 64 KiB JSON reader, 30-field flat scalar validation, deadline and safe error handling; files are not accepted. Only `value` and `revision` are permitted on PUT, only `revision` on DELETE. The server chooses keys, groups, update operator fields and updater identity. New content keys use `params.key`, avoiding ObjectId validation for existing CRUD IDs.

The existing MongoDB-backed limiter allows 120 save/reset attempts per admin per 15-minute window across instances/restarts. Existing auth/upload limits are unchanged. Short fields have a 500-character cap and long paragraphs 8,000; numerical values must be safe integers 0–1,000,000. Visible formatted statistics accept bounded decimal digits and an optional plus. Email, telephone and social URL fields have separate validation. Social URLs accept `#` as the exact original default or HTTPS on an explicit provider-host allowlist, without credentials or custom ports. Internal destinations and static images have no editor fields.

CMS values render as escaped React text, never HTML/JSX/CSS. The only edited URL destinations are validated social links and the existing principal mail link. Public responses revalidate records against the registry and omit unapproved, wrong-group or invalid values. Editor responses exclude updater IDs, MongoDB IDs and all authentication records. Error logging contains error names/codes, not submitted content or credentials.

Limits: authorized admins can publish inaccurate or excessively wordy text, so school review remains appropriate. Very long edits can naturally wrap differently within the preserved layout. There is no audit-history/undo collection or role expansion in Phase 1. Existing ingress limits and MongoDB restrictions documented in README remain necessary. The new collection must be writable by the application's existing database identity.

## Verification results

Verification was performed locally on 31 October 2026. The installed Node 22.14.0 is below the project's documented `>=22.15.0 <25` requirement. The initial `npm test` attempt also hit PowerShell's disabled `npm.ps1`; `npm.cmd test` then failed because Node 22.14 lacks the existing runner's `registerHooks`. These were environment failures, not newly introduced application failures. Verification used a temporary npm-distributed Node **24.22.2** runtime through `npx --package=node@24`; no project dependency/lockfile was changed, and no system execution policy was changed.

| Check | Actual result |
| --- | --- |
| `npm test` under Node 24 | **36 passed, 0 failed, 2 skipped** (38 tests including nested subtests) |
| Existing non-database security/file suite | Passed; auth/origin/input/body/upload/file-serving behavior checked |
| New API adapter tests | Passed with isolated model doubles: anonymous/public reads, auth, origin, allowlisting, reserved fields, invalid input/revisions/URLs, persistence across requests, competing saves, reset tombstones, failure preservation, rate limits and rollback |
| New fallback render tests | Passed for all 11 converted components, expanded mobile navigation and all five hero slides; exact DOM comparison with original fixtures, plus escaped text and connected-field checks |
| Existing real-MongoDB auth/seeder/seven-resource CRUD suite | **Skipped**: no disposable `TEST_MONGODB_URI` configured |
| New real-MongoDB atomicity/reconnect/persistence suite | **Skipped** for the same reason; actual restart persistence is implemented using MongoDB but not claimed as executed integration verification |
| `npm run build` under Node 24 | **Passed**: compilation, checks, page generation and build traces |
| Local production HTTP smoke | **Passed**: 44 page shells returned 200, all 11 checked local asset URLs returned 200 (including every emitted static image/all five backgrounds); five API statuses matched expectations |
| `npm audit --omit=dev` | **Failed with exit 1**: one high finding in existing `follow-redirects` 1.16.1, advisory GHSA-mrwp-f3q8-3g9p; dependencies are unchanged |
| `git diff --check` | Passed |
| Browser screenshots / interactive desktop/mobile checks | **Not performed**: browser access host unavailable; manual checklist below |

HTTP smoke used an ephemeral loopback port and deliberately unavailable loopback MongoDB URI, with a random test-only JWT secret configured before Next loaded environment files. It sent no authenticated writes and stopped its local server afterward. It verified liveness 200, editor GET/write 401, invalid-group 400 and failed-public-read 503. A page shell returning 200 does not establish successful client hydration, login, animation, live circular loading or CRUD interactions. All real school records and credentials were left untouched.

The audit finding predates this work's unchanged dependency tree. It concerns cross-realm sensitive-header handling on redirects. It is recorded for a separately authorized dependency patch; this request explicitly prohibits unrelated upgrades. The older `SECURITY_REVIEW.md` zero-finding result describes its earlier audit date, not the current audit. No `audit fix` was run.

Full outputs are in `verification/site-content-tests.txt`, `site-content-build.txt`, `site-content-audit.json` and `site-content-http.json`. Intentional invalid-input and failure tests produce safe error-name-only server logs. The original source fixture is used only by tests and contains public component source, never environment configuration.

## Deployment, backups and rollback

This is an additive update to the existing deployment. Preserve current environment meanings, valid credentials, admin account, port, proxy, persistent upload volume and hosting architecture. Do not repeat historical first-security-rollout credential-reset instructions solely for this feature. No seed or migration is required.

Before a deliberate release:

1. Back up the existing entire MongoDB database, including `sitecontents` if already present. Store the backup privately with its time and release identifier. Test a restore into a separate isolated database; never test restore over production.
2. Back up the entire persistent `uploads/` folder, preserve file names/permissions and verify representative image/PDF checksums. Coordinate DB and volume snapshots if existing editors are active.
3. Retain the current application release, deployment configuration and dependency lockfile. Keep real secrets in the existing secure hosting configuration, outside source and reports.
4. Use the project's supported Node version. Install/build in a release directory with `npm ci`, run tests and the production build, and review audit findings. No dependency changes are included here.
5. Complete the staging/manual checklist before a controlled release. Preserve existing mounted uploads and database. Do not seed or reset accounts. Verify current public routes, auth, seven CRUD modules and new text editing, including a reload/restart and a concurrent-edit conflict on staging.

Fast content rollback: set the **server-only** `SITE_CONTENT_OVERRIDES_ENABLED=false` in hosting configuration and restart the existing app process. This new optional setting defaults to enabled; it changes no existing setting. Public group reads then return an empty override map without touching MongoDB, and a public reload/focus refresh restores original text. Editor records remain accessible and intact, and the editor shows a rollback notice. Re-enable by removing the variable or setting it to `true` and restarting. This requires no rebuild, collection deletion or new credentials.

Full code rollback: restore the prior application release and restart using the existing deployment procedure and same persistent DB/uploads. The prior code ignores the isolated `sitecontents` collection. Leave it intact for later recovery; do not drop or migrate existing collections. The original public assets remain compatible.

## Manual browser/staging regression checklist

Browser access reported “The browser access host is unavailable”; no desktop/mobile screenshots or interactive visual comparison were performed. The tests compare rendered DOM with animation adapters; they do not prove pixel-perfect CSS or interactive animation behavior.

At desktop 1440px and mobile 390px, compare the prior release and this release using the same viewport/browser, scroll positions, carousel slide and animation settling time:

- [ ] Homepage first paint with empty `sitecontents` matches original text and layout; logo, five backgrounds, principal, sister and founder photographs load with original crop/size.
- [ ] Full-page sections retain order, spacing, typography, colors, styled spans, waves, cards, hover/parallax/reveal animations and responsive breakpoints.
- [ ] Desktop dropdown hover/click/outside dismissal and every navbar destination work; mobile menu opens/closes, scrolls and shares edited labels.
- [ ] Hero autoplay, arrows, keyboard, dots, transitions and hover pause work for all five slides.
- [ ] Principal/manager message scrolling and existing mail link work. Check all four visible About statistics; no extra counter section appears.
- [ ] Existing circular records load through `/api/circulars`; date/time/count, modal, PDF and download behavior remain correct; empty/loading states are readable.
- [ ] Footer columns/contact/social links and current year render correctly.
- [ ] Sign out and visit `/admin/site-content`; it redirects to login and editor API returns 401. Existing login/logout still work.
- [ ] Sign in on staging, open Website Content; fields have readable labels and mobile controls remain usable within the existing admin shell.
- [ ] Save a global and a homepage field. Refresh the public page; restart staging Next.js; values remain saved. Record exact expected/actual results.
- [ ] Enter invalid email, phone, URL, number and overlength values; observe useful validation. Simulate failed API/DB writes; no success message and prior saved text remains.
- [ ] Open two editors; save in one and verify the second gets 409 without silently losing its draft. Explicitly load latest and retry.
- [ ] Cancel then confirm Reset to original; only the chosen field returns to its exact original. Stale pre-reset edits still conflict.
- [ ] Try leaving with unsaved drafts via sidebar, reload, close, group switch and browser Back. Check warnings and tab draft recovery.
- [ ] Temporarily fail public content reads: original text/last successful text remains; no blank homepage. Check rollback flag then re-enable overrides.
- [ ] Existing Management, Committee, Staff, Teaching Staff, Gallery, Downloads, Circulars and Dashboard workflows remain usable, including images, active flags, uploads and PDFs. Use staging test data only.
- [ ] Run disposable real-MongoDB suites with an explicitly configured fresh `TEST_MONGODB_URI` on `127.0.0.1:<port>/stmarys_test_<unique-name>`. Never supply the school database. No database suite was run during this implementation.

## Readiness for Prompt 02

Phase 1 foundations and connected fields are implemented. Prompt 02 can use the inventory's exact remaining component list. No secondary-page content or disclosure-PDF replacement was implemented. Prompt 03 requirements were not supplied; PDF replacement, additional media/content structures and final whole-site acceptance are reserved pending those instructions.
