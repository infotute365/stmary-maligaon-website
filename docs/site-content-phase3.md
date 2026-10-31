# Three-phase CMS completion and readiness report

Date: 2026-10-31. Feature branch: `codex/phase3-disclosure-documents`. This report describes local implementation and verification. No production deployment, school-database write, credential/session change, or infrastructure change was performed.

## A — Final architecture

The existing Next App Router adapter, React public application, MongoDB/Mongoose connection, cookie/JWT middleware, origin validation and upload/file-serving architecture remain in use. Phase 1/2 behavior was inspected and its 103-test baseline passed before disclosure work. The first 1,106 content definitions remain byte-for-value identical in the final registry.

`SiteContent` remains the sole text-override model. Its allowlisted registry now contains **1,427 fields in 30 groups**, including **321 disclosure values**. Public reads fetch global plus the active page group rather than individual fields or the entire site. Exact source defaults render before optional overrides; missing records/read failures retain default or last working content. Reset retains revision tombstones. There is no default seeding or business-data migration.

The one additional isolated collection, `disclosuredocuments`, stores only fixed/custom identities, additional titles/publication status, current/one previous version metadata, revisions, timestamps and updater references. It contains no PDF bytes and does not own disclosure text. Fixed names/original URLs live in trusted configuration. Additional UUID identities never reuse deleted identities; 50 unique sparse slots bound additional records even across instances. Public metadata is bounded to 12 fixed plus 50 additional documents and omits administrative filenames/updaters/revisions.

The disclosure page uses its original arrays, tables, expand/collapse state, animations, fee modal and PDF modal. Stable original row identities remain independent of editable teacher/class names. Additional documents append to the existing B table after its eight fixed rows. The four other fixed PDF links remain in their original results/academic locations.

## B — Files created or changed in Prompt 03

Paths below are relative to the repository. Earlier Phase 1/2 changes remain in the working tree; this list identifies Phase 3 work specifically.

| Area | Files and purpose |
|---|---|
| Trusted content/document configuration | `src/content/disclosureDocuments.js` (12 identities, original paths and custom-title validation); `disclosureRegistry.js` (321 exact defaults); `useDisclosureDocuments.js` (bounded optional metadata reads); existing `registry.js`, `pages.js`, `validation.js` extended |
| Public page | `src/site-pages/cbse/MandatoryPublicDisclosure.jsx`: existing values connected, document URLs resolved, extra rows appended, modal failure feedback |
| Admin | `src/admin/components/DisclosureDocumentsPanel.jsx`; `src/admin/utils/disclosureDocumentsApi.js`; existing `src/admin/pages/SiteContentPage.jsx`: text/fixed/additional views and dirty/busy navigation guards |
| Metadata | `src/server/models/DisclosureDocument.js`; `src/server/controllers/disclosureDocumentController.js` |
| File validation/access | `src/server/security/disclosurePdf.js`; `disclosureFileAccess.js`; existing `serveUpload.js` extends only the disclosure namespace; existing `src/server/config/localStorage.js` adds opt-in exclusive durable writes |
| API | `app/api/[...path]/route.js`: dedicated document-key matching, authenticated routes, bounded multipart, duplicate-field validation, mutation limiter; existing CRUD matchers remain |
| Dependencies/build | `package.json`, `package-lock.json`: exact `@cantoo/pdf-lib@2.11.1` server parser and compatible `follow-redirects@1.16.2` override; `next.config.mjs`: server-only parser and optional isolated verification output; `.gitignore`: ignore that output |
| Maintenance | `scripts/disclosureStorageAudit.js`: dry-run orphan count by default, optional approved reconciliation |
| Tests | `tests/disclosure-content.test.js`, `disclosure-documents.test.js`, `disclosure-security.test.js`, `cms-regression.test.js`, `dependency-security.test.js`; `tests/helpers/disclosure-pdf.js`; existing `tests/helpers/render-content-pages.js`, `tests/site-content-pages.test.js` extended |
| Immutable fixtures | `tests/fixtures/disclosure-original.json`, `content-before-phase3.json`; `verification/integrity-before-phase3.json` |
| Verification tools | `verification/disclosure-http-smoke.cjs`, `disclosure-inventory.cjs`, `disclosure-preview.cjs`; existing `verification/site-content-smoke.cjs` extended for Phase 3 |
| Evidence | `verification/disclosure-content-connections.json`; `site-content-phase3-baseline.txt`, `site-content-phase3-targeted.txt`, `site-content-phase3-document-tests.txt`, `site-content-phase3-tests.txt`, `site-content-phase3-build.txt`, `site-content-phase3-audit-before-patch.json`, `site-content-phase3-audit.json`, `site-content-phase3-inventory.json`, `site-content-phase3-document-http.json`, `site-content-phase3-http.json`, `site-content-phase3-integrity.json` |
| Documentation | This report; `docs/site-content-phase3-coverage.md`, `site-content-phase3-fields.md`; current status appended to `docs/site-content-inventory.md`; `README.md` updated |

No Phase 1/2 data correction was made. The earlier phase's deliberate disclosure exclusion is now replaced by the disclosure group. README historical reset guidance was clarified: **this CMS upgrade requires no seeder, password reset, new administrator, JWT rotation or session invalidation**. A one-use conversion generator was removed after fixtures and connections were recorded.

## C — Full website content coverage

See the generated [page-by-page coverage and explicit exceptions](site-content-phase3-coverage.md), the [321-field disclosure list](site-content-phase3-fields.md), and the earlier [Phase 2 route/literal audit](site-content-phase2-coverage.md). These enumerate shared header/footer, homepage, About, Administration, CBSE, student pages, activities, transport, Gallery, Downloads, Contact and login/not-found presentation.

Official document names/full row labels, numbering, structural row counts, technical controls, images, layouts and ordinary route destinations remain fixed. Existing business records remain managed through their original CRUD screens. SchoolInfo has eight pre-existing child values that its InfoCard never renders; exposing them would add public content. Contact submission remains its original simulated submission. Inconsistent original school facts remain independent and unchanged rather than being invented, corrected or synchronized.

## D — Mandatory disclosure and original PDFs

All 12 trusted identities remain in this order: affiliation, society, noc, rte, building, fire, deo, water, academic, smc, pta, results. Names and full associated table labels are protected by the server configuration, public component and request allowlists. Neither SiteContent nor document mutation APIs can rename, reorder, delete or reassign fixed identities.

The original files under `public/wp-content/uploads/2026/05/` remain physically unchanged. The SMC fallback reference alone was corrected from nonexistent `Managing-Committee.pdf` to existing **`Managing-Commitee.pdf`**. Local HTTP checks verify the real asset is PDF; the former missing URL still receives the pre-existing catch-all 200/HTML shell. No live deployment was inspected or changed.

Fixed documents use originals with no saved replacement, after Restore Original, when a stored replacement is unavailable, or when overrides are disabled. Missing additional-file records are omitted from public metadata and flagged to the administrator. There are zero seeded additional documents.

Uploaded replacements use generated `uploads/disclosures/<UUID>.pdf` files and existing `/api/files/disclosures/<UUID>.pdf` serving. Current published files are public; previous versions and hidden additional files require the existing administrator authentication. Uncommitted/orphan filenames are inaccessible even to authenticated requests. Original static PDF URLs remain public.

Replacement validates identity/revision before storing; validates and writes a unique new file; atomically commits revisioned metadata; then releases discarded versions. The old active file is never removed before commit. Storage, validation, stale revision and DB failures retain the working version and remove the request's newly created files. Cleanup failures after commit are logged and deferred without converting success into a destructive rollback. Current plus one previous uploaded version are retained. Restore Original retains the last uploaded version for recovery; recovering previous swaps retained versions.

## E — Administrator workflows

Open **Admin Panel → Website Content → Mandatory Public Disclosure**.

1. **Text & values:** choose a human-readable section or search. Edit and Save each value. Reset to original uses the exact original value. Conflicts keep drafts and offer loading the latest saved value. Unsaved text drafts are retained in that browser tab where storage is available.
2. **Fixed PDFs:** view the named current PDF, select a nonempty plain PDF up to 10 MiB, choose Replace PDF and confirm that it becomes public for that fixed identity. Use Recover Previous or Restore Original with confirmation. There are no fixed-name/delete/reorder controls.
3. **Additional Documents:** enter a distinct Document Name, choose a PDF and confirm Publish document. The row appears after the original B-section rows. Use Save name, Hide/Publish document, Replace PDF, Recover Previous or confirmed Remove additional document. Fixed entries cannot be removed through this API.
4. Upload/rename/publication success appears only after confirmed backend success. Failures retain applicable file/name edits. Independent selected-file/name drafts survive unrelated metadata saves. Reloading latest metadata after a conflict requires confirmation before discarding selections. Navigation/reload warnings cover document selections; browser File objects cannot be restored after leaving the panel.

Labels, ordinary buttons and native confirmation dialogs are keyboard operable. Controls wrap at small widths. Real mobile usability, focus behavior and native PDF viewing still require the browser checks in Section I.

## F — API documentation

All paths use the existing API adapter. Public metadata needs no authentication. Every administrative endpoint requires the existing valid `adminToken` cookie or supported Bearer token; every write also requires the exact configured trusted Origin and existing CSRF/fetch-metadata rules. No credentials are shown here.

| Method | Endpoint | Request | Result |
|---|---|---|---|
| GET | `/api/disclosure-documents` | No query/body | `{success:true,data:{fixed:{fire:{key:"fire",name:"Fire Safety Certificate",url:"..."},...},additional:[]}}` |
| GET | `/api/disclosure-documents/all` | Admin; no query | `{success:true,overridesEnabled:true,data:{fixed:[...],additional:[...],maximumAdditional:50}}` |
| POST | `/api/disclosure-documents` | Admin; multipart `title` + one `pdf` | 201 with new additional document metadata; published immediately |
| PUT | `/api/disclosure-documents/:key` | Admin; multipart `revision` + one `pdf` | 200 with committed metadata and incremented revision |
| PATCH | `/api/disclosure-documents/:customKey` | Admin; JSON `{revision:1,title:"Distinct title",active:false}`; title/status individually optional | 200 with saved custom metadata |
| DELETE | `/api/disclosure-documents/:customKey` | Admin; JSON `{revision:2}` | 200 `{success:true,message:"Additional document removed."}` |
| POST | `/api/disclosure-documents/:key/restore` | Admin; JSON `{revision:2,version:"previous"}` or fixed-only `"original"` | 200 with committed version metadata; unavailable previous returns 409 |
| GET/HEAD | `/api/files/disclosures/:generated.pdf` | Published current public; previous/hidden admin only | Streamed PDF with existing range/HEAD support; no-store, nosniff, inline disposition and sandbox/frame restrictions |

Fixed keys come from configuration; custom keys are `custom-<v4 UUID>`. They use `params.documentKey`; the existing business `params.id` ObjectId rule is unchanged. Clients cannot submit stored paths, URLs, names for fixed records, PDF ownership/type or MongoDB operators. JSON is flat/bounded and duplicate keys (including escaped duplicates) are rejected on these writes. Multipart rejects duplicate/unexpected fields and more than one file. Metadata-only requests accept no uploads.

Example replacement, starting from the revision returned by the admin read:

```js
const body = new FormData()
body.append('revision', String(document.revision))
body.append('pdf', selectedFile)
await fetch('/api/disclosure-documents/fire', {
  method: 'PUT', credentials: 'same-origin', body,
}) // Browser supplies its Origin and multipart boundary.
```

Typical saved record: `{key:"fire",type:"fixed",name:"Fire Safety Certificate",url:"/api/files/disclosures/<generated>.pdf",revision:1,active:true,hasReplacement:true,current:{url,originalName,size,uploadedAt},previous:null,updatedAt,missingFile:false}`. Public projection returns only approved key/name/URL information.

Text continues through GET `/api/site-content?group=cbse.disclosure`, admin GET `/api/site-content/all?group=cbse.disclosure`, PUT `/api/site-content/:approvedKey` with `{value,revision}`, and DELETE that key with `{revision}`. Nothing is stored in disclosure metadata for text edits.

| Status | Meaning |
|---|---|
| 400 | Invalid fields/types/key content/revision/file structure/title/query, missing PDF, unsupported PDF extension/MIME, or 10 MiB file limit exceeded |
| 401 | Missing/invalid/expired administrator authentication |
| 403 | Foreign/missing Origin or fixed-name/delete action; invalid file-path shape |
| 404 | Unknown route/document, removed custom record, unavailable or unauthorized private file |
| 409 | Stale revision, duplicate additional title, no retained version, 50-document limit or storage retention review required |
| 413 | Bounded HTTP body limit exceeded (11 MiB disclosure multipart envelope; existing JSON 64 KiB) |
| 415 | Unsupported request content type, using the existing adapter convention |
| 429 | Disclosure mutation or existing upload rate limit; Retry-After supplied |
| 500 | Safe generic storage/DB/processing failure; working metadata/file remains |
| 503 | Public metadata/file-access DB unavailable; public metadata response includes original-document fallback data |

Disclosure changes are limited to 60 per administrator per 15-minute window, plus the existing upload bucket. Counters remain in the existing shared MongoDB limiter collection. Published PDF bytes are fetched only when opening/previewing/downloading, never as part of metadata loading. The modal checks headers while open and shows usable failure feedback; browser embedding support varies.

## G — Security audit

| Severity/status | Finding and disposition |
|---|---|
| High, fixed | Existing `follow-redirects` 1.16.1 advisory [GHSA-mrwp-f3q8-3g9p](https://github.com/advisories/GHSA-mrwp-f3q8-3g9p). Updated only its existing override to compatible 1.16.2, as identified in the [upstream release](https://github.com/follow-redirects/follow-redirects/releases/tag/v1.16.2). Pre-patch tests passed; a loopback cross-realm sensitive-header regression test plus the full post-patch suite/build verify compatibility. No major dependency upgrade. |
| Fixed in implementation | Fixed-name/path injection, arbitrary uploads, stale replacements, fake/truncated/encrypted PDFs, compressed JavaScript/attachments/actions, public orphan/private-version access, and symlink escape are rejected. These are protections of the new flow, not claims of prior exploitation. |
| Fixed during testing | Disclosure index initialization now runs once per driver client after connection; this avoids a cached Mongoose automatic-init rejection after explicit reconnect. Concurrent first/replacement writes use unique constraints and atomic revision filters. |
| Deployment prerequisite | VPS upload persistence, shared volume across instances, filesystem ownership/quota, edge body/time/connection limits, backups and least-privilege collection/index permissions cannot be established from this repository. No Docker/proxy configuration was changed. |
| Residual validation limit | Parsing does not guarantee malware-free PDFs or rule out all viewer/parser vulnerabilities. No antivirus service was verified. Resource bounds reduce work but do not replace OS process/container memory limits, disk quotas or ingress controls. |
| Existing behavior, unchanged | Contact form has no delivery backend; unknown paths return the existing 200/HTML shell; SSR initially exposes defaults before optional content hydration; existing non-disclosure upload URLs remain public under their original policy. |

The exact new parser dependency is the maintained [Cantoo pdf-lib fork](https://github.com/cantoo-scribe/pdf-lib), used only on the server. The validator checks MIME/extension, nonempty size, signature, final trailer/xref, parser acceptance, non-encryption, page/object limits, resolved references, stream lengths/decoding and all parsed dictionaries/arrays, including compressed objects. It rejects embedded-file structures, XFA, action types, JavaScript, remote/URI actions and media. Parser work runs in a worker with an 8-second timeout, V8 heap/stack limits, maximum 500 pages/50,000 indirect objects/200,000 visited objects, and decoded-stream limits. Some otherwise valid interactive PDFs are intentionally unsupported; provide an approved plain PDF instead. Bytes are not evaluated as JavaScript.

Uploads are exclusively generated UUID `.pdf` files with durable writes and restrictive requested permissions (0700 directory/0600 file on supporting filesystems). Both metadata and direct serving check containment, symlink status and expected size. Responses use the existing sandbox/frame/nosniff headers. Only approved metadata can make a new file accessible. Administrative filenames are rendered as React text and never used for storage paths or response headers.

If the VPS has a malware scanner, integrate its bounded local buffer scan or private quarantine scan **after structural validation and before committing metadata**; fail closed on scan errors/timeouts and keep the prior public file. Keep quarantine outside public assets/direct proxy aliases, restrict its permissions, and avoid sending school documents to an unapproved third party. This integration has not been implemented or claimed as available.

No secret values were added to code, logs, docs or artifacts; `.env.local` was not edited. Existing authentication middleware, hashing, JWT algorithms/version checks, cookie settings, CSRF and business schemas/controllers were preserved. Real production privileges and secret rotation policies were not inspected.

## H — Executed tests and results

Windows verification used `npx.cmd --yes --package=node@24 -- ...` (Node 24.22.2), because the system Node 22.14 is below the project's 22.15 minimum. Dependency installation initially emitted that engine warning; final tests/build use supported Node. MongoDB suites used fresh loopback `stmarys_test_*` databases and owned temporary files only. No live data was queried. Tests create synthetic test fixtures only; no school administrator was created/reset. The production HTTP document harness uses a synthetic Admin lookup with real JWT/origin middleware, not a real account.

| Command/check actually executed | Result |
|---|---|
| Baseline `npm test` with fresh test URI | 103 passed, 0 failed, 0 skipped; `site-content-phase3-baseline.txt` |
| Initial disclosure tests | 20 passed, 1 failed: unreachable Not Available field. Removed that unused editor field; retained original technical fallback text. Rendering recheck confirmed it was the only missing field. |
| First complete expanded suite | 129 passed, 0 failed, 0 skipped |
| Suite after dependency patch/new reconnect scenarios | 131 passed, 2 reported failures (one failed nested test and its parent): cached automatic index initialization after reconnect. Fixed, then dedicated document suite passed 16/16. |
| Final complete `npm test` with fresh test URI | **133 passed, 0 failed, 0 skipped**; `site-content-phase3-tests.txt` |
| `npm run build` | Passed; final isolated verification build uses `CMS_VERIFY_BUILD=true`; `site-content-phase3-build.txt` |
| `npm audit --omit=dev` | Before targeted patch: 1 high. After patch: **0 vulnerabilities reported**; both JSON reports retained. This is an advisory snapshot, not a guarantee of zero vulnerabilities. |
| `node verification/disclosure-http-smoke.cjs` | Built production document workflow: 18 HTTP checks passed; exact PDF bytes, HEAD/range responses, protected writes, hidden/private access, additional create/delete and fixed restore. Test-owned uploaded files cleaned. |
| `CMS_VERIFY_BUILD=true NODE_ENV=production node verification/site-content-smoke.cjs --phase3` | **Passed: 45 page shells, 11 compiled assets, 28 API/static-document checks**; `site-content-phase3-http.json`. Includes original PDFs, aliases, unavailable-DB fallbacks and both rollback settings. |
| Registry inventory generator | 1,427 fields, 30 groups, 321 disclosure fields |
| Integrity / whitespace review | See `site-content-phase3-integrity.json`; original assets/business/auth files checked against the pre-phase snapshot and original Git business layer. |
| Interactive browser attempt | Browser host unavailable; native capture timed out, and recovery stopped because the current browser URL could not be determined confidently. No screenshots/viewport checks claimed. |

Earlier HTTP harness attempts encountered development-overwritten `.next` manifests and returned 404 before reaching the feature. Those were failed verification attempts, not passes. Isolating the production output resolved the conflict without stopping the user's dev server. The parser's new package was installed with scripts disabled. No breaking audit fix or seed/reset command was run.

The full suite covers existing login/check/logout and session revocation, origin/CSRF, cookie flags, malformed bodies, injection, all seven resource CRUD/upload flows, failure preservation, old file streaming, Phase 1 original DOM/classes, all Phase 2 pages and visible fields, original image paths, new disclosure defaults/values/modals/keys, fixed identities, custom documents, invalid PDF structures, revision conflicts, concurrency, retention, DB/storage failures, missing-file fallbacks, committed and uncommitted access, symlink rejection, reconnect persistence and mutation rate limits. Simulated server rendering does not execute browser effects, animations or native PDF viewers.

The final catch-all page bundle is 191 kB / 317 kB first load, versus Phase 2's 176 kB / 301 kB. The app retains its existing eager page architecture; no throughput target is claimed. The PDF parser is externalized on the server, not added to the public bundle. No PDF bytes are prefetched by document metadata reads.

## I — Visual regression and remaining browser work

Automated comparison against captured original disclosure source confirms identical default DOM, class strings and React keys for collapsed/expanded sections, both result tables, teacher details, fee modal and PDF modal. The original Phase 1/2 comparisons remain passing. Extra documents use the original B-row JSX/classes. The intentional public changes are the corrected SMC URL, optional appended document rows and failure feedback when a PDF cannot be loaded. Editable content can naturally wrap when an administrator changes it.

**Screenshot equivalence and interactive behavior at 375/768/1440 px remain unverified.** The Windows helper stopped without navigating or changing the user's browser. Do not treat HTTP shells or markup comparisons as a visual pass. On staging compare identical default data at all three widths, then repeat after representative edits:

- Header, homepage carousel/cards, navigation dropdowns and footer; all About/Administration/student/activity/CBSE pages; Gallery/Downloads/Contact.
- Disclosure section order/spacing, eight B-table fixed rows, academic/results links, overflow/scrolling of wide tables, teacher list and additional rows.
- Expand/collapse and animations; PDF modal dimensions, native preview, download/new-tab actions and an unavailable-file error; fee modal table/month schedules/notes and close controls.
- Admin page/section search, all three disclosure views, native file chooser, confirmations, loading/error/conflict states, retained drafts, keyboard focus, mobile wrapping and successful login/logout with an existing staging administrator.

## J — Database and original-file integrity

Original model definitions and controllers for Admin, Management, ManagingCommittee, Staff, TeachingStaff, Circular, Gallery and Download remain unchanged from the security-fixed Git baseline. The existing RateLimit (`authratelimits`) model and connection/auth/CSRF/upload middleware remain unchanged. Original collections and relationships were not migrated or repurposed.

Only the already-added `sitecontents` and new `disclosuredocuments` collections own CMS data. Disclosure updater references do not write Admin records. The seven original CRUD flows passed in a disposable database. Hash comparison covers all 81 pre-phase asset/upload/security/business files; only the two explicitly extended storage/serving utilities differ. Every original PDF/image and all three pre-existing uploaded files retain their original bytes.

No staging/production MongoDB collection counts, records, indexes or credentials were inspected. Existing-account login on the real deployment is pending staging validation, not inferred from test fixtures. The test databases were not dropped by a destructive command; they can be reviewed/removed later by the local owner.

## K — Controlled VPS deployment and rollback guide

### Before a deployment is authorized

- [ ] Obtain recoverable MongoDB and complete `uploads/` backups plus the existing application release, static PDFs and private environment configuration. Perform a restore rehearsal in isolation; do not paste secret values into logs/docs.
- [ ] Confirm the actual VPS process working directory and that **the entire existing `uploads/` directory** is on durable storage surviving process restart, container replacement and redeployment. All instances need the same volume. No compose/Docker mount definition was found in the repository; production persistence is not verified. DevOps must supply/confirm the existing mount. Do not copy runtime PDFs into `public/`.
- [ ] Confirm owner-only write access to `uploads/disclosures`, suitable read access for the serving process, non-executable storage, sufficient space/inodes, disk quota and monitoring. Keep the proxy from serving this directory directly: it must pass through the controlled Next file routes so hidden/previous/orphan checks are enforced.
- [ ] Verify least-privilege read/write/create-collection/create-index access for the two isolated CMS collections and existing limiter operations. Permit the additional unique sparse slot/title indexes. Do not change existing business schemas or clear collections.
- [ ] Keep existing `MONGODB_URI`, `JWT_SECRET`, `APP_ORIGIN`, proxy trust and account/session data. Use HTTPS and exact browser Origin; keep the Next port private. Do not run either administrator seeder or rotate credentials as part of this CMS upgrade.
- [ ] Enforce ingress connection/request limits, short body timeout and the existing global 21 MiB envelope; optionally use the narrower 11 MiB disclosure envelope at this route. The app independently enforces its own sizes, mutation/upload limits and parser timeout. Apply host/container memory limits; no infrastructure edits were made here.
- [ ] Use Node 22.15+ within the declared supported range or Node 24. Install locked dependencies with `npm ci`, including build dependencies; build with `npm run build`. Run `npm test` only with an isolated disposable test database, and `npm audit --omit=dev`. Recheck advisories at release time. Do not use `npm audit fix --force`.

### Staging acceptance (not yet executed)

Use isolated school-approved staging records/storage and an **existing staging administrator**. Verify login; home/About/student/disclosure edits; save/refresh/reset; fixed-PDF replacement with name/order unchanged; native view/download/HEAD/ranges; previous/original recovery; additional create/rename/hide/publish/replace/remove; unauthorized/invalid/stale requests; all seven original CRUD screens and public records. Repeat critical text/PDF reads after an actual app/process restart and a container/release replacement using the same volume. Complete every visual/keyboard/mobile check in Section I. Verify no staging file paths point at production storage.

### Retention, backups and cleanup

Keep current plus one previous uploaded version per document, and all original static PDFs. At maximum published metadata this is at most 124 retained uploaded files (62 × 2), each up to 10 MiB. Additional hidden records count toward the 50 limit. Immediate cleanup follows a successful commit/deletion; a process crash can leave an inaccessible orphan. Before each upload, reconciliation removes at most 100 unreferenced generated regular files older than 24 hours from the dedicated directory only. Recent in-flight files, referenced files, nonmatching names, symlinks and all other upload directories survive. A 200-entry guard stops further uploads until storage is reviewed; that guard is best effort under concurrency, so an OS quota remains necessary.

For operator review, `node scripts/disclosureStorageAudit.js` prints a dry-run candidate count using the securely configured application environment (and can initialize the dedicated directory if absent). It deletes no files without `--apply`. It does not print paths or credentials. After reviewing backups and authorizing cleanup, the operator can add `--apply`; it uses exactly the same conservative reconciliation. **Neither maintenance command was executed against a school database here.** Do not delete files by broad directory sweeps. Back up metadata and upload volume as a consistent pair; test restoring both, including prior versions. Monitor safe cleanup errors and disk/inode usage.

### Release verification and rollback

After an approved release, check liveness/readiness, DB connection, existing static images/PDFs, all page routes, existing-account authentication, saved text, fixed/additional links, logs and disk usage. Confirm PDFs retain their associations after restart. Do not mark production verified solely from a successful build.

To suppress new public overrides without losing edits, set server-only `SITE_CONTENT_OVERRIDES_ENABLED=false` for text and/or `DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED=false` for document metadata, then restart the existing service and refresh public pages. The document flag shows original fixed PDFs and hides additional rows; it is not a revocation of already-known published document URLs. Use Restore Original/Hide when changing active metadata. Private retained versions remain authenticated.

For application rollback, restore the prior application release while retaining both CMS collections and the entire shared upload volume. Original PDFs and defaults remain available to old code. Older releases may lack the new direct-file access checks, so review that policy before rollback; do not expose hidden or retained files through a direct static proxy alias. Prefer the rollout flags for presentation rollback while retaining the current serving protections. Restore DB/upload backups only for a verified data incident, as a matched isolated restore first, with an explicit plan for edits made since backup. Do not delete CMS records, uploaded files, existing school records or accounts merely to roll back code.

## L — Final readiness decision

**READY FOR STAGING VALIDATION**

The complete CMS and secure disclosure flow are implemented within the existing architecture. Automated registry/rendering/security/CRUD/persistence tests, production compilation, targeted dependency remediation and local built-server checks support staging review. No known critical implementation regression remains from those checks. This is not production sign-off: actual existing-account staging workflows, browser screenshots/interactions, native PDF preview, durable VPS mount/redeployment behavior, backup restoration and deployment permissions remain to be verified by the operator. Production has not been deployed or declared verified.
