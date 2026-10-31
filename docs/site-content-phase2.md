# Phase 2 completion report — 31 October 2026

## A. Phase 1 verification and scope

The Phase 1 registry, isolated SiteContent model, existing API adapter/controller, JWT/session authentication, origin checks, input/body validation, shared MongoDB rate limiting, public provider, protected editor, homepage and shared-component integration were inspected before implementation. The initial supported-runtime test run passed **36 tests, with two opt-in database suites skipped**. The foundation was functional; a second CMS was not created.

Work was performed on the requested dedicated branch, `codex/phase2-public-content`. Existing uncommitted Phase 1 work was retained. No environment file was read for secrets, edited or committed. No production deployment, restart, account change, data migration, package update or asset replacement was performed.

Phase 2 adds **906 editable fields across 27 page groups**, including the audited descriptive portions of Login and NotFound. Together with the unchanged **200 Phase 1 fields**, the existing editor now manages **1,106 fields in 29 groups**. Mandatory Public Disclosure remains outside the conversion.

## B. Implementation

The existing `SiteContent` / `sitecontents` collection stores the new keys using its original document shape, primary-key uniqueness, revision checks, update metadata and reset tombstones. The only schema change is extending this isolated model's group enum from the same central allowlist. Existing global/home records stay valid; no migration or default insertion is needed. None of the seven existing business models or controllers was changed for Phase 2.

`src/content/pageRegistry.js` holds the additional original defaults and field metadata; `registry.js` combines them with the original definitions. A regression fixture verifies all 200 original definitions remain identical. `pages.js` defines the editor hierarchy and canonical route/group mapping. All six administration aliases share their canonical group's keys and records.

The existing provider requests global overrides and exactly one active-page group, with the original pending-request deduplication, timeout, default-first rendering, last-successful-value retention, focus/visibility refresh and stale-result protection. The disclosure route requests global content only. This remains the same read-only public API and authenticated editor API; no endpoints, storage providers or state frameworks were added.

Structured content keeps fixed item counts, order, numbering, icons and colors. Registry keys are permanent source-defined identifiers based on existing IDs/numbering or original fixed entry identities. Plain-text list entries gain separate immutable content identities; their displayed text can change while their React keys stay stable. Existing club IDs and accordion toggles remain unchanged. Editable rule category/status captions are separated from the fixed metadata used to choose color classes. Enrolment's existing numeric totals continue to use the original reducers and numeric field types.

Shared PageHeader receives editable captions from each owning page through props. Its markup/classes and default Home caption stay intact. Public pages render CMS text as ordinary React text; styled spans, superscripts, tables, paragraphs and all animation structures remain in place.

## C. Changed files

The [coverage table](site-content-phase2-coverage.md) lists all 27 changed public page source files individually. Each connects existing eligible text, informational values and captions, without changing public layout or business requests. Those pages are:

- `src/site-pages/about/{Founder,CoFounders,History,MissionVision,EducationalApproach}.jsx`
- `src/site-pages/administration/{Management,ManagingCommittee,Staff,TeachingStaff}.jsx`
- `src/site-pages/cbse/SchoolInfo.jsx`
- `src/site-pages/students/{Fees,Rules,Leave,Examination,Discipline,Uniform,ParentsNoticeEnrollment}.jsx`
- `src/site-pages/activities/{CoCurricular,Sports,Excursions,Clubs}.jsx`
- `src/site-pages/infrastructure/Transport.jsx`
- `src/site-pages/{Gallery,Downloads,ContactUs,Login,NotFound}.jsx`

| Supporting file | Change / purpose |
| --- | --- |
| `src/content/pages.js` — new | Page hierarchy, view links, canonical/alias groups and active-group selection |
| `src/content/pageRegistry.js` — new | 906 approved fields with exact original defaults and human-readable sections/labels |
| `src/content/registry.js` | Combine new fields/groups while preserving the original 200 definitions |
| `src/content/validation.js` | Add bounded string-number, year/range, currency, measurement, choice and website-display validation |
| `src/content/SiteContentProvider.jsx` | Extend the existing lifecycle to one active page group; encode group parameters |
| `src/server/models/SiteContent.js` | Extend only its group enum; document/collection shape unchanged |
| `src/App.jsx` | Pass the active route's group to the existing provider; routes and page components unchanged |
| `src/components/common/PageHeader.jsx` | Optional Home breadcrumb prop; content still owned by each page |
| `src/admin/pages/SiteContentPage.jsx` | Categorized page/section selection, field search, 30-field initial limit, public-page links and choice controls; retain saves/resets/conflicts/drafts |
| `tests/site-content-pages.test.js` — new | Page/group coverage, exact fallback DOM/keys, every-field visibility, alias mapping, text escaping and field validity |
| `tests/site-content-admin.test.js` — new | Editor navigation, search, bounded controls, saved/unsaved/conflict/loading/error display and model-group compatibility |
| `tests/helpers/render-content-pages.js` — new | Shared source-fixture render harness with deterministic animations and isolated dynamic record examples |
| `tests/fixtures/site-content-pages-original.json` — new | Pre-Phase 2 public sources for before/after comparisons |
| `tests/fixtures/site-content-phase1-registry-original.json` — new | Exact pre-Phase 2 registry definitions |
| `tests/site-content.test.js` | Extend existing API/security doubles to every new group and formatted value type |
| `tests/site-content-render.test.js` | Retain its Phase 1-only connected-field check after registry expansion |
| `tests/site-content-db.test.js` | Verify a new CBSE group through real MongoDB reconnect/reset as well as the existing homepage group |
| `verification/audit-content-pages.cjs` — new | Repeatable read-only remaining-literal classification |
| `verification/site-content-pages-connections.json` — new | Registered field locations in pre-conversion source and explicit exclusions |
| `verification/site-content-pages-literal-audit.json` — new | Remaining technical/ignored literals, with file, line and reason |
| `verification/site-content-smoke.cjs` | Optional Phase 2 checks and separate report, retaining the Phase 1 mode |
| `verification/site-content-phase2-{tests,db-tests,persistence,build}.txt` — new | Actual command outputs, including skipped/default and real-database runs |
| `verification/site-content-phase2-{audit,http}.json` — new | Actual audit and production HTTP checks |
| `docs/site-content-phase2.md` — new | This implementation, security, verification, operating and handoff report |
| `docs/site-content-phase2-coverage.md` — new | Every public route, counts, data sources, images and intentional exclusions |
| `docs/site-content-phase2-fields.md` — new | Exhaustive new field list |
| `docs/site-content-inventory.md` | Update current conversion status while retaining the original asset/PDF inventory |
| `README.md` | Document Phase 2 editor coverage and link these reports |

Phase 1 changes still present in the working tree are not new Phase 2 changes. The existing untracked archive and three upload files remain untouched. The API adapter/controller, auth middleware/providers, seven CRUD models/controllers, file serving, image files, dependency manifests, Next configuration and MandatoryPublicDisclosure source were not changed in this phase.

## D. Coverage and exclusions

See [page-by-page coverage](site-content-phase2-coverage.md) and [the exhaustive 906-field list](site-content-phase2-fields.md). All registered new fields have a tested rendering location, including loading/populated/empty dynamic-page states and expanded club sections. Counts refer to distinct owned fields; repeated PageHeader branches and aliases reuse fields rather than duplicating storage.

Intentional exclusions are explicit:

- Existing MongoDB member/teacher/gallery/download/circular records stay in their original modules. Their public presentation copy is editable separately.
- Fixed routes, URLs used for requests/images/maps, icons, CSS/animation metadata, existing item IDs, table/list numbering, padding/date formats, generated counts/totals, form identities, validation rules and technical accessibility labels remain code. There are no structural add/delete/reorder controls.
- Login keeps Email/Password controls/placeholders, Sign In/Signing in status, actual auth errors, auth requests and destinations fixed. Only its four descriptive labels are editable. NotFound keeps the 404 status label fixed and exposes its two descriptive/navigation captions.
- Contact keeps its existing form fields, required validation, state, submit handler, fixed success/submitting messages and map URL/title. Its descriptive text, form labels/placeholders and safe action captions are editable. **The existing contact form only simulates submission with a timeout; it has no actual message backend or storage.** This pre-existing limitation was documented, not replaced with a new feature.
- SchoolInfo's `InfoCard` does not render `children`. Consequently `schoolData.nocDate`, `affiliationSince`, `trustAddress`, `areaSqm`, `grievanceEmail`, `grievancePhone`, `sexualHarassmentContact`, `sexualHarassmentEmail` and the associated child-only captions remain invisible and unexposed. Making them visible would add public content/layout; Phase 2 preserves the original output. The overlapping affiliation end year is editable because it is already shown in Quick Facts. All 97 genuinely displayed eligible SchoolInfo fields are connected.
- Download's existing `General` grouping fallback and Management's avatar initial fallback remain technical identities; record-owned category/name content remains in its original CRUD module.
- Every Mandatory Public Disclosure field/document remains Phase 3 content and is unchanged.

The final literal audit classified 2,355 remaining literal occurrences, with **zero unclassified occurrences**. The report includes technical string duplication in fixed content identities. Existing record-driven values are separately identified in the coverage inventory; they were not converted to CMS fields.

## E. Guide for a school administrator

1. Sign in at `/admin/login` using the existing account.
2. Select **Website Content** in the existing sidebar.
3. Choose the page under About Us, Administration, CBSE, Student Information, Activities, Infrastructure or Other Pages. Homepage and Header & Footer remain available.
4. Choose a section, or search the page's labels/current text. Initially at most 30 matching fields are shown; use Show more where needed. Page switching retains drafts after confirmation.
5. Edit an individual heading, paragraph or value. Numeric enrolment fields use whole numbers; school-information string counts keep their string type. Formatted years, currency, measurements, email/phone and facility choices receive validation.
6. Select **Save** for that field. Wait for confirmation; an error preserves the draft. A conflict means someone saved a newer revision: select **Load latest saved text** deliberately before editing again.
7. Use **View Public Page** and refresh that page to see the saved change. Returning to a public tab also refreshes overrides. There is no deployment step for content edits.
8. Select **Reset to original**, review the confirmation and confirm. Only that field's override is cleared; its original source value returns and its revision history remains safe against stale saves.

Browser unload and link navigation warn about current-page unsaved edits; tab session storage also recovers drafts after client-side Back navigation. If browser storage is blocked, this optional recovery is unavailable. Internal field IDs and JSON are not shown as editor labels.

## F. Database preservation and actual integration verification

The inspected existing models remain `Admin`, `RateLimit`, `Management`, `ManagingCommittee`, `Staff`, `TeachingStaff`, `Gallery`, `Circular` and `Download`. Their fields, collection names, controllers, sorting, image/file handling, account/session behavior and database connection logic are unchanged in Phase 2. The isolated SiteContent group enum is the explicit additive exception; its fields and collection identity are unchanged. No defaults or business records are migrated into SiteContent.

Real database checks used **only** the explicitly configured disposable loopback database `stmarys_test_phase2_20261031_b4fed6625eb2404a8b1cc27bbac6ef1a` on `127.0.0.1:27017`. The school's URI, existing local-development database and credentials were not used. The existing test suite creates/resets a test-only admin within that disposable database to verify authentication; it does not run those operations on the school's account. Upload tests use temporary directories, not the project's uploads folder.

The full integration run passed **103 tests, no failures or skips**. It exercised successful/failed login, JWT/cookie checks, authenticated/unauthenticated access, create/list/update/delete for all seven resources, active-state behavior, invalid files, old-file preservation, shared limiter concurrency, password/session revocation and logout. A separate targeted persistence check passed after extending the existing database suite: a new CBSE group and homepage override survived actual Mongoose disconnect/reconnect, reset returned exact defaults, and stale recreation conflicted. These checks establish database reconnect persistence, not a browser screenshot or a full operating-system/server restart test.

The database suite removes only its own SiteContent records and temporary upload files. Existing test behavior deliberately does not drop databases; the separately named disposable database may retain its test admin/limiter records. No production or user-owned business database was cleaned up or modified.

## G. Static images and visual preservation

All original `src/assets/`, `public/` and upload files remain unchanged. Founder keeps `bosco.png`; Co-Founders keeps `coFounder.png`; History keeps its original Unsplash URL. The header/homepage assets, gallery image handlers and every existing external reference are preserved. Contact's map remains its fixed original iframe source.

Source-fixture render checks passed for all 27 converted pages, including all ten club states, relevant loading/empty/populated/error states, and numeric tables. They compare original text, DOM, CSS classes, image URLs, fixed links and React keys. Every exposed field was individually overridden and confirmed visible in an existing rendering location. All five homepage hero slides and the original 200 definitions still pass Phase 1 regression checks.

Browser discovery returned **“The browser access host is unavailable.”** No screenshots at 375/768/1440px, actual hover/click interactions, browser-based save/reset flow or pixel-perfect comparison were performed. The manual checklist below remains necessary; SSR tests use animation adapters and do not establish actual animation timing.

## H. Security, performance and SEO

The new groups reuse the exact Phase 1 authenticated API, JWT/session verification, origin/CSRF checks, bounded flat JSON parser, safe errors, no-store responses, per-admin update limiter, strict key allowlist and revision/reset logic. No arbitrary object, database field, document path or query is accepted. New string-number values, year ranges, rupee amounts, measurements and choices have server-side validation; numeric values remain bounded safe integers. Email/telephone and website-display values are validated. Phase 2 changes no external-link destinations; the existing validated Phase 1 social/mail destinations remain available.

CMS content is escaped React text. No HTML, JSX, JavaScript, CSS or icon/component names are interpreted from stored text. Structural keys, club IDs and color metadata are code-defined. Content reads still fall back safely during missing records, malformed overrides or temporary database failures; writes report actual errors. The Phase 1 failure and rollback tests remain green.

`npm audit --omit=dev` still reports **one high advisory** in the unchanged `follow-redirects` 1.16.1 dependency (GHSA-mrwp-f3q8-3g9p, cross-realm sensitive-header handling on redirects). No dependency upgrade or `audit fix` was performed. Review that advisory in a separate dependency patch. Existing infrastructure/storage protections in README and SECURITY_REVIEW remain applicable; this report does not assert complete security or release readiness.

No new dependency was added. The production build reports a 176 kB catch-all route and 301 kB first-load JS, versus Phase 1's 133 kB and 259 kB. The approximately 42 kB first-load increase covers page registry metadata and the expanded existing editor. One group request is made per active page plus global content, rather than per field. No browser speed/Lighthouse measurement was performed.

The existing client-side App/provider renders original fallbacks into initial HTML and loads saved overrides after hydration. Saved overrides therefore are **not guaranteed in initial HTML for crawlers that do not run JavaScript**. Unknown public paths also retain the existing HTTP-200 not-found shell behavior. Fixing those SEO/status concerns needs a deliberate rendering/routing change, which the request explicitly excludes. No risky SSR/router rewrite was made.

## I. Commands and verification

The system Node 22.14 is below the repository's required minimum; verification used the already obtained temporary Node 24.22.2 runtime. PowerShell's `npm.ps1` policy was not changed; npm.cmd/npx.cmd were used. Neither dependency manifests nor lockfile changed. There is no configured lint script; Next build's existing checks were run.

| Check | Actual result |
| --- | --- |
| Phase 1 baseline `npm test` under Node 24 | 36 passed, 0 failed, 2 database suites skipped |
| Expanded default `npm test` | 101 passed, 0 failed, 2 opt-in database suites skipped |
| Full `npm test` with dedicated `TEST_MONGODB_URI` | **103 passed, 0 failed, 0 skipped** |
| Targeted new-group real-MongoDB reconnect/reset check | **1 passed, 0 failed, 0 skipped** |
| `npm run build` | **Passed** compilation, checks, page generation and build tracing |
| Remaining-literal audit | 2,355 classified remaining occurrences; 0 unclassified |
| Phase 2 local production HTTP smoke | **Passed**: 45 page shells, 11 local assets, 11 API/document checks |
| `npm audit --omit=dev` | **Exit 1**, existing single high `follow-redirects` finding |
| `git diff --check` | Passed |
| Browser screenshots/interactions | Not executed: browser access unavailable |

The local HTTP server used a random test-only secret and a deliberately unavailable loopback database URI, configured before Next loaded environment files; it stopped after verification. Checks include canonical/alias page shells, an unknown-page shell, protected editor reads/writes, invalid groups, safe public read failures and rollback returning an empty override map. A shell's HTTP 200 is not proof of client hydration or browser authentication. The first smoke attempt expected 404 for the missing disclosure filename and failed that assertion; inspection established the pre-existing 200/HTML catch-all behavior. The corrected smoke explicitly checks content types: the real file returns PDF; the mismatched URL returns HTML. No application behavior was changed to make that check pass.

Actual outputs are retained under `verification/site-content-phase2-*`. Expected invalid-input/failure tests produce existing safe error-name-only logs.

## Rollback and staging comparison

Before a deliberate release, back up the complete MongoDB database (including SiteContent), persistent uploads with names/permissions, and current code/configuration. Verify a restore in separate staging storage. Preserve the existing account, valid environment values, origin/proxy/port, persistent volumes and deployment architecture. Do not seed/reset the current account for this additive update.

The existing runtime rollback remains `SITE_CONTENT_OVERRIDES_ENABLED=false` on the server followed by the normal process restart. This is an operator procedure only; it was not applied to production. It suppresses **all** public content overrides, including global/home, without deleting records. Refresh public pages or refocus their tab. Remove the flag or set it to true and restart to restore saved overrides.

For a code rollback to Phase 1, retain this feature branch/worktree as a checkpoint and restore a verified prior Phase 1 release. Leave `sitecontents` intact: Phase 1 still reads global/home overrides and ignores new page groups. New secondary-page text reverts to original source. No other collection or asset restoration is required solely for CMS rollback. Do not reset this working tree indiscriminately: it also contains pre-existing uncommitted Phase 1 work and user upload files.

Manual staging comparison at **375px, 768px and 1440px**, using original defaults and matching browser/scroll/animation positions:

- [ ] Compare every public route and administration alias to the previous release: section order, heading hierarchy, text wrapping, cards, tables, backgrounds, icons, imagery, header/footer and responsive behavior.
- [ ] Verify all club expand/collapse states before and after renaming; verify fixed IDs, child counts, colors and list order. Verify history tables, policy numbering, uniform lists, fee table and enrolment totals after valid edits.
- [ ] Check actual Framer Motion reveal/hover/parallax behavior and all five hero slides; unit render adapters do not animate.
- [ ] Verify existing admin login/logout, each CRUD screen, uploads, active flags, public dynamic records, Gallery lightbox, Downloads and homepage circular/PDF behavior using staging data.
- [ ] Select each editor page/section, use search on mobile, save and reset, refresh the public view, restart staging Next.js, exercise competing editors and failed reads/writes. Confirm warnings/draft recovery with navigation and Back.
- [ ] Confirm Contact's required fields and existing simulated success flow are unchanged; do not mistake this for message delivery.
- [ ] Check rollback/re-enable and network failures. Confirm original fallbacks and previously saved text remain safe.
- [ ] Review the documented disclosure filename/status issue and remaining SEO limitation without treating either as fixed in this phase.

## J. Prompt 03 handoff

`src/site-pages/cbse/MandatoryPublicDisclosure.jsx` and every file under `public/wp-content/uploads/2026/05/` remain unchanged. Phase 3 still needs disclosure text/tables, existing fixed-name documents, authorized secure PDF replacement and validation, additional named documents, cross-page reconciliation and final deployment/rollback review. No PDF replacement API or document upload UI was added here.

The exact existing PDF references and their file-existence discrepancies remain in [the inventory](site-content-inventory.md). In particular, source references `Managing-Committee.pdf`, while storage contains `Managing-Commitee.pdf`; the missing URL currently returns a 200/HTML not-found shell. `AdmissionNotice.pdf` exists without a current source literal reference. The fee item opens the existing fee modal, not a new PDF.

Overlaps to reconcile deliberately without silently sharing keys or rewriting facts:

| Fact | SchoolInfo / other current source | Disclosure source |
| --- | --- | --- |
| Affiliation | `230105`, with provisional status and end year `2026` | `230105`; additional affiliation document/table wording |
| Identity/address | Original mixed-case school name and Maligaon/Guwahati address | Uppercase name/address and its distinct punctuation/pincode wording |
| Email | `st.marysschool66@yahoo.com` | Same source email; independently stored until deliberate reconciliation |
| Phone | SchoolInfo `0361 2670489` / `87520 16092` | Disclosure `9435199806` |
| Primary teachers | SchoolInfo PRT `19` | Disclosure PRT `20`, total teachers `53`; detailed teacher list is a separate static dataset |
| PGT / TGT | SchoolInfo `19` / `14` | Disclosure `19` / `14` |
| Area | SchoolInfo `4.5 Acres`, built-up `1300.6 Sq. Meter`, playground `5574.2 Sq. Meter`; hidden source area `4395.5 Sq. Meter` | Disclosure total campus `8510` Sq Mtr |
| Fee values | Editable Fees page, original seven rows | Independent original fee-modal rows; range separators differ in source |
| Principal/management/history | Existing homepage and historical names/periods remain independent | Disclosure principal `SR. YAMCHINGNAO RIYAO GRACE PEMMILA` and its own teacher/management information |

Do not merge these sources merely because labels look alike. Preserve each original value until an authorized school edit or explicit Phase 3 instruction resolves the discrepancy. Phase 2 stops here.
