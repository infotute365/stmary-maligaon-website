# Final website content coverage

There are 1,427 registered fields in 30 groups. Phase 3 adds 321 disclosure fields; all 1,106 previous definitions are unchanged.

| Public page / shared area | Group | Fields |
|---|---|---:|
| / (Header & Footer) | `global` | 72 |
| / (Homepage) | `home` | 128 |
| /about/founder (Founder) | `about.founder` | 25 |
| /about/co-founders (Co-Founders) | `about.coFounders` | 57 |
| /about/history (History) | `about.history` | 89 |
| /about/mission-vision (Mission & Vision) | `about.missionVision` | 19 |
| /about/educational-approach (Educational Approach) | `about.educationalApproach` | 29 |
| /administration/management (Management Page) | `administration.management` | 8 |
| /administration/managing-committee (Managing Committee Page) | `administration.managingCommittee` | 4 |
| /administration/staff (Staff Page) | `administration.staff` | 7 |
| /administration/teaching-staff (Teaching Staff Page) | `administration.teachingStaff` | 7 |
| /cbse/school-info (School Information) | `cbse.schoolInfo` | 97 |
| /cbse/mandatory-public-disclosure (Mandatory Public Disclosure) | `cbse.disclosure` | 321 |
| /students/fees (Fees) | `students.fees` | 86 |
| /students/rules (School Rules) | `students.rules` | 60 |
| /students/leave (Leave Rules) | `students.leave` | 40 |
| /students/examination (Examination) | `students.examination` | 40 |
| /students/discipline (Discipline) | `students.discipline` | 27 |
| /students/uniform (School Uniform) | `students.uniform` | 37 |
| /students/parents-notice-enrollment (Parents' Notice & Enrollment) | `students.parentsNoticeEnrollment` | 31 |
| /activities/co-curricular (Co-Curricular) | `activities.coCurricular` | 42 |
| /activities/sports (Sports) | `activities.sports` | 19 |
| /activities/excursions (Excursions) | `activities.excursions` | 25 |
| /activities/clubs (Clubs) | `activities.clubs` | 89 |
| /infrastructure/transport (Transport) | `infrastructure.transport` | 26 |
| /gallery (Gallery Page) | `pages.gallery` | 4 |
| /downloads (Downloads Page) | `pages.downloads` | 4 |
| /contact-us (Contact Us) | `pages.contactUs` | 28 |
| /login (Public Login - presentation) | `pages.login` | 4 |
| /page-not-found (Page Not Found - presentation) | `pages.notFound` | 2 |

Aliases listed in `src/content/pages.js` share their canonical group. The pre-existing unknown-page HTTP 200 behavior remains unchanged.

## Editable information

Global/home: existing header, navigation captions, footer, homepage headings, paragraphs, card captions, principal/welcome information and original statistics. Phase 2: existing About narratives; Administration page presentation; School Information values; student rules, leave, examination, discipline, fees, uniform and parent notices; activity/transport information; Gallery, Downloads, Contact and login/not-found presentation. Existing record data continues through its original seven CRUD modules.

Mandatory Public Disclosure: original general/staff/infrastructure detail values; HTTPS inspection-video reference; all existing Class X/XII result values; teacher names/designations/qualifications with stable row identities; headings/notes/PDF descriptions; every original fee-table cell, modal heading, installment/month label and explanatory note. No calculation or automatic synchronization was introduced.

## Intentional exceptions and existing limits

- The 12 fixed PDF names, associated full row descriptions/keys/order, official table labels, numbering and disclosure structure remain code. The fee row still opens the existing modal.
- Original images, logo, ordinary link destinations, CSS/classes/icons/animations, form/control identities, technical accessibility messages and structural row counts remain fixed. The existing approved social, telephone/email and inspection-video destinations have their narrow validators.
- Eight SchoolInfo child values are not rendered by its original InfoCard implementation; they remain outside CMS. No hidden school facts were turned into new public content.
- Dynamic administration/media records remain editable through their existing CRUD screens; they are not duplicated into SiteContent.
- Contact submission remains the original simulated form with no backend delivery. No new school workflows or facts were introduced.
- Overrides hydrate after default server HTML; original information remains in initial HTML. Search engines that do not execute JavaScript may index defaults. No SSR/routing rewrite was performed.
- The original unreachable Not Available document fallback is a technical message, not an editable field.
- Fixed PDFs have original/current/one-previous recovery; up to 50 additional PDFs append after the eight existing B-section rows. Additional rows start empty.

See [the final A-L report](site-content-phase3.md) for verification limits and operational prerequisites.
