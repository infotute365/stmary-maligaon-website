// Route aliases deliberately share their canonical page's content group.
export const contentPages = Object.freeze([
  { group: 'global', label: 'Header & Footer', category: 'Shared website', path: '/' },
  { group: 'home', label: 'Homepage', category: 'Shared website', path: '/' },
  { group: 'about.founder', label: 'Founder', category: 'About Us', path: '/about/founder', source: 'about/Founder.jsx' },
  { group: 'about.coFounders', label: 'Co-Founders', category: 'About Us', path: '/about/co-founders', source: 'about/CoFounders.jsx' },
  { group: 'about.history', label: 'History', category: 'About Us', path: '/about/history', source: 'about/History.jsx' },
  { group: 'about.missionVision', label: 'Mission & Vision', category: 'About Us', path: '/about/mission-vision', source: 'about/MissionVision.jsx' },
  { group: 'about.educationalApproach', label: 'Educational Approach', category: 'About Us', path: '/about/educational-approach', source: 'about/EducationalApproach.jsx' },
  { group: 'administration.management', label: 'Management Page', category: 'Administration', path: '/administration/management', source: 'administration/Management.jsx', aliases: ['/administrative/management'] },
  { group: 'administration.managingCommittee', label: 'Managing Committee Page', category: 'Administration', path: '/administration/managing-committee', source: 'administration/ManagingCommittee.jsx', aliases: ['/administration/management-committee', '/administrative/managing-committee', '/administrative/management-committee'] },
  { group: 'administration.staff', label: 'Staff Page', category: 'Administration', path: '/administration/staff', source: 'administration/Staff.jsx', aliases: ['/administrative/staff'] },
  { group: 'administration.teachingStaff', label: 'Teaching Staff Page', category: 'Administration', path: '/administration/teaching-staff', source: 'administration/TeachingStaff.jsx', aliases: ['/administrative/teaching-staff'] },
  { group: 'cbse.schoolInfo', label: 'School Information', category: 'CBSE', path: '/cbse/school-info', source: 'cbse/SchoolInfo.jsx' },
  { group: 'cbse.disclosure', label: 'Mandatory Public Disclosure', category: 'CBSE', path: '/cbse/mandatory-public-disclosure', source: 'cbse/MandatoryPublicDisclosure.jsx' },
  { group: 'students.fees', label: 'Fees', category: 'Student Information', path: '/students/fees', source: 'students/Fees.jsx' },
  { group: 'students.rules', label: 'School Rules', category: 'Student Information', path: '/students/rules', source: 'students/Rules.jsx' },
  { group: 'students.leave', label: 'Leave Rules', category: 'Student Information', path: '/students/leave', source: 'students/Leave.jsx' },
  { group: 'students.examination', label: 'Examination', category: 'Student Information', path: '/students/examination', source: 'students/Examination.jsx' },
  { group: 'students.discipline', label: 'Discipline', category: 'Student Information', path: '/students/discipline', source: 'students/Discipline.jsx' },
  { group: 'students.uniform', label: 'School Uniform', category: 'Student Information', path: '/students/uniform', source: 'students/Uniform.jsx' },
  { group: 'students.parentsNoticeEnrollment', label: "Parents' Notice & Enrollment", category: 'Student Information', path: '/students/parents-notice-enrollment', source: 'students/ParentsNoticeEnrollment.jsx' },
  { group: 'activities.coCurricular', label: 'Co-Curricular', category: 'Activities', path: '/activities/co-curricular', source: 'activities/CoCurricular.jsx' },
  { group: 'activities.sports', label: 'Sports', category: 'Activities', path: '/activities/sports', source: 'activities/Sports.jsx' },
  { group: 'activities.excursions', label: 'Excursions', category: 'Activities', path: '/activities/excursions', source: 'activities/Excursions.jsx' },
  { group: 'activities.clubs', label: 'Clubs', category: 'Activities', path: '/activities/clubs', source: 'activities/Clubs.jsx' },
  { group: 'infrastructure.transport', label: 'Transport', category: 'Infrastructure', path: '/infrastructure/transport', source: 'infrastructure/Transport.jsx' },
  { group: 'pages.gallery', label: 'Gallery Page', category: 'Other Pages', path: '/gallery', source: 'Gallery.jsx' },
  { group: 'pages.downloads', label: 'Downloads Page', category: 'Other Pages', path: '/downloads', source: 'Downloads.jsx' },
  { group: 'pages.contactUs', label: 'Contact Us', category: 'Other Pages', path: '/contact-us', source: 'ContactUs.jsx' },
  { group: 'pages.login', label: 'Public Login - presentation', category: 'Other Pages', path: '/login', source: 'Login.jsx' },
  { group: 'pages.notFound', label: 'Page Not Found - presentation', category: 'Other Pages', path: '/page-not-found', source: 'NotFound.jsx' },
].map(page => Object.freeze(page)))

const routeGroups = Object.fromEntries(contentPages.filter(page => page.group !== 'global' && page.group !== 'pages.notFound').flatMap(page => [page.path, ...(page.aliases || [])].map(path => [path, page.group])))
export function contentGroupForPath(pathname) {
  return routeGroups[pathname] || 'pages.notFound'
}
export function publicContentGroups(pageGroup) {
  return pageGroup && pageGroup !== 'global' ? ['global', pageGroup] : ['global']
}
