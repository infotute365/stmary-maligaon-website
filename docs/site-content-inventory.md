# Site content inventory - Phases 1 and 2

Audited 31 October 2026. The active route map is `src/App.jsx`, mounted by `app/[[...slug]]/page.jsx`. `src/routes/AppRoutes.jsx` and `src/main.jsx` are legacy entry points and are not the active Next.js router. The inventory describes source content, not verified school facts.

## Phase 2 status

Phase 2 connects all 906 eligible fields on the 27 remaining non-disclosure page groups, while preserving all 200 Phase 1 definitions. See [route-by-route counts, exclusions, images and data sources](site-content-phase2-coverage.md), [all new fields](site-content-phase2-fields.md), and [the Phase 2 report](site-content-phase2.md). All six administration aliases share canonical keys. Mandatory Public Disclosure and its PDFs remain unmodified and reserved for Phase 3. The original route/asset/PDF inventory below is retained; its static-area descriptions now identify converted source content.

## Every existing public route and static text area

| Route | Component | Existing static areas / phase scope |
| --- | --- | --- |
| `/` | `src/site-pages/Home.jsx` | Phase 1: all visible static homepage text via its existing child components. |
| `/login` | `src/site-pages/Login.jsx` | Login heading, labels, descriptions, validation and status text; existing real auth flow stays fixed. |
| `/gallery` | `src/site-pages/Gallery.jsx` | Page title/subtitle, loading/empty text and modal controls; event content/images stay in Gallery. |
| `/downloads` | `src/site-pages/Downloads.jsx` | Page title/subtitle, filters, categories/presentation captions and empty/loading/download labels; file records stay in Download. |
| `/contact-us` | `src/site-pages/ContactUs.jsx` | Heading, contact cards, school details, hours, contact-form labels/messages and map title; current form behavior/map URL unchanged. |
| `/about/founder` | `src/site-pages/about/Founder.jsx` | Heading, St. John Bosco biography, educational principles, quotes and legacy copy. |
| `/about/co-founders` | `src/site-pages/about/CoFounders.jsx` | Heading, co-foundress identity/biography, life/mission, message, quotations and closing captions. |
| `/about/history` | `src/site-pages/about/History.jsx` | Heading, campus overlay text, journey/upgrading/history paragraphs, milestones and present-day sections. |
| `/about/mission-vision` | `src/site-pages/about/MissionVision.jsx` | Mission and vision headings, statements and supporting text. |
| `/about/educational-approach` | `src/site-pages/about/EducationalApproach.jsx` | Heading, introduction and Reason/Religion/Loving Kindness descriptions and quotations. |
| `/administration/management` | `src/site-pages/administration/Management.jsx` | Page title/subtitle, loading/empty/error states and presentation labels; names/designations/images stay in Management. |
| `/administration/managing-committee` | `src/site-pages/administration/ManagingCommittee.jsx` | Page title/subtitle, table headings, empty/loading text; member names/designations/address/tenure stay in ManagingCommittee. |
| `/administration/staff` | `src/site-pages/administration/Staff.jsx` | Page title/subtitle, Non-Teaching Staff/Faculty headings, table labels and empty/loading captions; staff records stay in Staff. |
| `/administration/teaching-staff` | `src/site-pages/administration/TeachingStaff.jsx` | Page title/subtitle, category captions, table/card labels and empty/loading text; educator records stay in TeachingStaff. |
| `/administration/management-committee` | `src/site-pages/administration/ManagingCommittee.jsx` | Page title/subtitle, table headings, empty/loading text; member names/designations/address/tenure stay in ManagingCommittee. |
| `/administrative/management` | `src/site-pages/administration/Management.jsx` | Page title/subtitle, loading/empty/error states and presentation labels; names/designations/images stay in Management. |
| `/administrative/managing-committee` | `src/site-pages/administration/ManagingCommittee.jsx` | Page title/subtitle, table headings, empty/loading text; member names/designations/address/tenure stay in ManagingCommittee. |
| `/administrative/management-committee` | `src/site-pages/administration/ManagingCommittee.jsx` | Page title/subtitle, table headings, empty/loading text; member names/designations/address/tenure stay in ManagingCommittee. |
| `/administrative/staff` | `src/site-pages/administration/Staff.jsx` | Page title/subtitle, Non-Teaching Staff/Faculty headings, table labels and empty/loading captions; staff records stay in Staff. |
| `/administrative/teaching-staff` | `src/site-pages/administration/TeachingStaff.jsx` | Page title/subtitle, category captions, table/card labels and empty/loading text; educator records stay in TeachingStaff. |
| `/cbse/mandatory-public-disclosure` | `src/site-pages/cbse/MandatoryPublicDisclosure.jsx` | General information, document labels, result/academics, teaching staff, infrastructure, class X/XII tables, modal captions, dates/numbers/links. PDF replacement is deferred. |
| `/cbse/school-info` | `src/site-pages/cbse/SchoolInfo.jsx` | Heading, schoolData identity/contact/affiliation, trust/management, campus/facilities, teaching/library counts, grievance/committee and academic-calendar details. |
| `/students/fees` | `src/site-pages/students/Fees.jsx` | Heading, fee/instalment tables, class labels, rules, bank/payment/late-fee information and supporting captions. |
| `/students/rules` | `src/site-pages/students/Rules.jsx` | Heading, general rules, admission/withdrawal policies, transfer-certificate and important notes. |
| `/students/leave` | `src/site-pages/students/Leave.jsx` | Heading, seven regulations, notes and application/approval/consequence guidance. |
| `/students/examination` | `src/site-pages/students/Examination.jsx` | Heading, promotion rules, assessment structure, unit tests, terminal exams and final-promotion details. |
| `/students/discipline` | `src/site-pages/students/Discipline.jsx` | Heading, conduct/discipline policy list, explanatory captions and emphasized notes. |
| `/students/uniform` | `src/site-pages/students/Uniform.jsx` | Heading, KG-X and XI-XII uniform lists, categories, reminders and supporting text. |
| `/students/parents-notice-enrollment` | `src/site-pages/students/ParentsNoticeEnrollment.jsx` | Parent notices, section-wise enrolment table, academic-year label and supporting policy text. |
| `/infrastructure/transport` | `src/site-pages/infrastructure/Transport.jsx` | Heading, transport/route details, contacts, route coverage, safety and punctuality cards. |
| `/activities/co-curricular` | `src/site-pages/activities/CoCurricular.jsx` | Heading, activities/groups, house names and descriptions, policies and supporting text. |
| `/activities/sports` | `src/site-pages/activities/Sports.jsx` | Heading, sports program, physical training, games-period and after-class coaching information. |
| `/activities/excursions` | `src/site-pages/activities/Excursions.jsx` | Heading, field-trip information, registration/organizer details, visit lists and guidance. |
| `/activities/clubs` | `src/site-pages/activities/Clubs.jsx` | Heading, all club/association names, member/detail/objective/activity data arrays and labels. |
| Unmatched public path | `src/site-pages/NotFound.jsx` | Existing not-found copy and navigation; remains static. |

Aliases in the table intentionally resolve to the same components. `/admin/login` is the separate existing admin sign-in surface; existing protected screens are Dashboard, Management, Committee, Staff, Teaching Staff, Circulars, Gallery and Downloads. Phase 1 adds only `/admin/site-content`.

## Existing dynamically managed collections

| Model / collection | Existing content | Phase 1 treatment |
| --- | --- | --- |
| Management / `managements` | Name, designation, image, order, active status | Existing CRUD unchanged |
| ManagingCommittee / `managingcommittees` | Name, designation, image, address, tenure, order/status | Existing CRUD unchanged |
| Staff / `staffs` | Identity, designation, image, DOB, qualification, experience, appointment details, order/status | Existing CRUD unchanged |
| TeachingStaff / `teachingstaffs` | Staff details and PRT/TGT/PGT category | Existing CRUD unchanged |
| Gallery / `galleries` | Event, description, date, images/captions, status | Existing CRUD unchanged |
| Circular / `circulars` | Title, description, date/time, PDF metadata, active/order | Existing API feeds homepage; never duplicated in CMS |
| Download / `downloads` | Title, category, file, active/order | Existing CRUD unchanged |
| Admin / `admins` | Existing auth identities, hashes and session versions | Unchanged; no seeding/reset |
| RateLimit / `authratelimits` | Existing shared atomic rate counters/expiry | Existing behavior retained; new content-write bucket uses it |

One new isolated collection: SiteContent / `sitecontents`. No migrations or default insertion. It stores overrides and revision tombstones only on intentional authenticated edits/resets.

## Phase 1 conversion and static areas that remain

Converted: `TopBar.jsx`, `Navbar.jsx`, `Footer.jsx`, `Home.jsx`, `HeroCarousel.jsx`, `WelcomeSection.jsx`, `AboutUs.jsx`, `FeatureCard.jsx`, `PrincipalMessage.jsx`, `Sister.jsx`, and static labels in `CircularsPanel.jsx`. `NavDropdown.jsx` has no independent hardcoded content; existing label/items props now receive editable values. All public classes, element wrappers, icon choices, image references and internal links remain fixed. See [the complete field inventory](site-content-fields.md).

The active homepage does **not** mount `StatsCounter.jsx`; its unused seed counters (58/1500/85/98) remain static, unexposed and unchanged. The visible `AboutUs.jsx` values (1966/60+/1500+/55+) are editable as originally shown. Fixed generated counts/dates/year, decorative arrows and technical control/image accessibility labels remain application behavior.

Phase 2 has now converted eligible copy in all listed non-disclosure public components. PageHeader accepts page-owned breadcrumb text through props; SectionWrapper and StaffCard retain their presentation-only behavior. Login and NotFound descriptive text is connected with technical/auth exclusions documented in the coverage table. Unused StatsCounter and legacy sample exports remain unchanged and unexposed. Auth behavior and original admin CRUD business fields remain outside generic site text.

Phase 3: disclosure PDF replacement and any further media/data structures, whole-site acceptance and release work are reserved until those prompts are supplied. No PDF replacement, new sections, route corrections or content structures are implemented in Phase 1.

## Static image imports and references

All files under `src/assets/` remain byte-for-byte untouched:

- `src/assets/background/imageFive.png`
- `src/assets/background/imageFour.png`
- `src/assets/background/imageOne.png`
- `src/assets/background/imageThree.png`
- `src/assets/background/imageTwo.png`
- `src/assets/bosco.png`
- `src/assets/coFounder.png`
- `src/assets/principal.png`
- `src/assets/principal.webp`
- `src/assets/School_Logo.jpeg`
- `src/assets/sister.png`

The five hero slides still use the five original imports in `src/data/seedData.js`, in the original order. Navbar uses `School_Logo.jpeg`; PrincipalMessage uses `principal.png`; Sister uses `sister.png`, `bosco.png`, `coFounder.png`; Founder and CoFounders retain their own matching imports. `principal.webp` is an existing sibling asset, not substituted.

External/static URL literals and fallback patterns (all retained):

- `src/components/home/WelcomeSection.jsx`: `src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80"`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1461896836934-bd09ba8b1782?w=800&q=80",`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",`
- `src/data/seedData.js`: `url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",`
- `src/data/seedData.js`: `"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",`
- `src/data/seedData.js`: `"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",`
- `src/data/seedData.js`: `"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",`
- `src/data/seedData.js`: `"https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400&q=80",`
- `src/site-pages/about/History.jsx`: `src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"`
- `src/site-pages/administration/Management.jsx`: `e.target.src = https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=200&background=7A0C1E&color=ffffff`
- `src/site-pages/administration/ManagingCommittee.jsx`: `src={getMediaUrl(m.image) || https://ui-avatars.com/api/?name=${m.name}&background=7A0C1E&color=fff&size=48}`
- `src/site-pages/administration/Staff.jsx`: `src={getMediaUrl(s.image) || https://ui-avatars.com/api/?name=${s.name}&background=7A0C1E&color=fff&size=40}`
- `src/site-pages/ContactUs.jsx`: `src="https://www.google.com/maps?q=Maligaon,Guwahati,Assam&output=embed"`
- `src/site-pages/Gallery.jsx`: `e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'`
- `src/site-pages/Gallery.jsx`: `e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'`

The seedData gallery/staff/circular/download examples are legacy exports; public Gallery/Staff/Committee/TeachingStaff/Downloads and homepage Circulars currently load the existing APIs, not these sample exports. Do not seed or promote unused samples into actual records. Existing dynamic images/PDFs use existing upload/media helpers and are outside SiteContent.

## Static PDFs and discrepancies

Disclosure references live in `src/site-pages/cbse/MandatoryPublicDisclosure.jsx`. No PDF content was edited or replaced. These are source-path existence checks, not validation that the certificate contents are current.

| Referenced URL | Repository file exists |
| --- | --- |
| `/wp-content/uploads/2026/05/Affiliation_Certificate.pdf` | Yes |
| `/wp-content/uploads/2026/05/Society_Certificate.pdf` | Yes |
| `/wp-content/uploads/2026/05/NOC.pdf` | Yes |
| `/wp-content/uploads/2026/05/Recognition_Certificate_10.pdf` | Yes |
| `/wp-content/uploads/2026/05/Building_Safety_Certificate.pdf` | Yes |
| `/wp-content/uploads/2026/05/Fire_Safety_Certificate.pdf` | Yes |
| `/wp-content/uploads/2026/05/Self_Certification.pdf` | Yes |
| `/wp-content/uploads/2026/05/Health_Hygiene_Certificate.pdf` | Yes |
| `/wp-content/uploads/2026/05/Academic_Calendar_2025-26.pdf` | Yes |
| `/wp-content/uploads/2026/05/Managing-Committee.pdf` | **No** |
| `/wp-content/uploads/2026/05/Parent-Teacher-Association.pdf` | Yes |
| `/wp-content/uploads/2026/05/Board_Result.pdf` | Yes |

Existing public PDF files:

- `/wp-content/uploads/2026/05/Academic_Calendar_2025-26.pdf`
- `/wp-content/uploads/2026/05/AdmissionNotice.pdf`
- `/wp-content/uploads/2026/05/Affiliation_Certificate.pdf`
- `/wp-content/uploads/2026/05/Board_Result.pdf`
- `/wp-content/uploads/2026/05/Building_Safety_Certificate.pdf`
- `/wp-content/uploads/2026/05/Fire_Safety_Certificate.pdf`
- `/wp-content/uploads/2026/05/Health_Hygiene_Certificate.pdf`
- `/wp-content/uploads/2026/05/Managing-Commitee.pdf`
- `/wp-content/uploads/2026/05/NOC.pdf`
- `/wp-content/uploads/2026/05/Parent-Teacher-Association.pdf`
- `/wp-content/uploads/2026/05/Recognition_Certificate_10.pdf`
- `/wp-content/uploads/2026/05/Self_Certification.pdf`
- `/wp-content/uploads/2026/05/Society_Certificate.pdf`

**Pre-existing filename mismatch:** the disclosure references `Managing-Committee.pdf`, while the file is `Managing-Commitee.pdf` (one t in the last word). This was documented only, as requested. HTTP verification shows the missing URL currently returns the existing not-found HTML shell with status 200; the correctly spelled-on-disk file returns application/pdf. `AdmissionNotice.pdf` exists in public storage but has no literal reference in current source. Runtime circular/download PDFs come from existing MongoDB records; no production records were queried.

## Compatibility concerns and preserved source discrepancies

- Several About homepage card destinations are absent from the active route map: `/about/school`, `/about/vision-mission`, `/academics/curriculum`, `/admissions/enquiry`. All existing destinations are preserved; editorial text changes do not fix routes.
- Source ages/counts vary: established 1966; welcome says "over three decades"; principal says "over 35 years"; About displays 60+ years and 55+ teaching staff, while the unused seed counter says 58 and 85. No factual correction was invented.
- Principal display email is `st.marysschool66@yahoo.com`; original mail link goes to `principal@stmarysmaligaon.edu.in`. Both defaults are preserved and independently editable. The editor labels the destination discrepancy. Header/footer and school-name spelling variants are also retained.
- `schoolInfo.principal` is the unused legacy value "Dr. Meera Sharma", whereas the actual homepage displays "GRACE PEMMILA". Only the actual visible principal fields were registered.
- Original footer social destinations are `#`; they remain that way until a valid admin change. Existing compact mobile contact labels have separate fields because their wording intentionally differs.
- Longer approved text can wrap within the existing fixed styles; no layout/typography changes were made to compensate. Paragraph fragments around styled spans remain separate fields.
- No collection needs a migration. Existing documents remain valid; absent/unavailable overrides use exact source defaults. No existing upload directory, asset, model, controller, credential or deployment setting was modified.
- Historical README/security-review credential-reset recommendations describe the earlier security rollout. This isolated additive CMS update does not require or authorize repeating those operations.
- Phase 2 real-MongoDB and HTTP checks passed on isolated test configuration; screenshot/interactive comparisons remain manual because browser access was unavailable. See [the Phase 2 report](site-content-phase2.md).

## Phase 3 completion (2026-10-31)

The earlier phase-specific status and missing-SMC notes above are historical. Mandatory Public Disclosure is now connected to 321 eligible existing text/value fields in the same SiteContent registry. There are 1,427 fields across 30 groups overall. Its 12 fixed document identities, names, official row labels and order remain protected; additional PDFs start empty. The original SMC fallback URL now points to the existing `Managing-Commitee.pdf` asset; the asset itself is unchanged. See [the final report](site-content-phase3.md), [final page coverage](site-content-phase3-coverage.md) and [disclosure fields](site-content-phase3-fields.md).
