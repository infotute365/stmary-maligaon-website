import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Building, 
  Users, 
  BookOpen, 
  Bus, 
  Clock, 
  Home,
  Sparkles,
  Shield,
  GraduationCap,
  Library,
  Heart
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const SectionTitle = ({ icon: Icon, title }) => (
  <motion.div
    variants={fadeInUp}
    className="flex items-center gap-3 mb-4"
  >
    <div className="p-2 bg-gold-100 rounded-lg">
      <Icon size={18} className="text-maroon-700" />
    </div>
    <h3 className="text-lg font-serif font-bold text-maroon-900">{title}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-gold-300/50 to-transparent" />
  </motion.div>
)

const InfoCard = ({ icon: Icon, label, value, className = '' }) => (
  <motion.div
    variants={fadeInUp}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 hover:border-gold-300 ${className}`}
  >
    <div className="flex items-center gap-2 text-gold-600 mb-1">
      <Icon size={16} />
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
    <p className="text-maroon-900 font-medium text-sm">{value}</p>
  </motion.div>
)

const StatCard = ({ label, value }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-all duration-300 hover:border-gold-300"
  >
    <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-wide">{label}</p>
    <p className="text-maroon-900 font-bold text-lg">{value}</p>
  </motion.div>
)

const FacilityBadge = ({ label, value }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${value === 'Yes' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
    <span className="text-xs text-gray-600">{label}</span>
    <span className={`text-xs font-semibold ${value === 'Yes' ? 'text-green-600' : 'text-red-500'}`}>
      {value}
    </span>
  </div>
)

// Keep information visible before hydration and when saved CMS values arrive.
const SchoolInfo = () => {
  const c = useSiteContent()

  const schoolData = {
    name: c('cbse.schoolInfo.schoolData.name'),
    address: c('cbse.schoolInfo.schoolData.address'),
    district: c('cbse.schoolInfo.schoolData.district'),
    email: c('cbse.schoolInfo.schoolData.email'),
    phone: c('cbse.schoolInfo.schoolData.phone'),
    mobile: c('cbse.schoolInfo.schoolData.mobile'),
    establishment: c('cbse.schoolInfo.schoolData.establishment'),
    noc: c('cbse.schoolInfo.schoolData.noc'),
    nocDate: "29/06/2010",
    affiliation: c('cbse.schoolInfo.schoolData.affiliation'),
    status: c('cbse.schoolInfo.schoolData.status'),
    affiliationNo: c('cbse.schoolInfo.schoolData.affiliationNo'),
    affiliationSince: "2011",
    affiliationUpto: c('cbse.schoolInfo.schoolData.affiliationUpto'),
    trust: c('cbse.schoolInfo.schoolData.trust'),
    trustAddress: "Maligaon, Guwahati - 781011",
    manager: c('cbse.schoolInfo.schoolData.manager'),
    area: c('cbse.schoolInfo.schoolData.area'),
    areaSqm: "4395.5 Sq. Meter",
    builtUp: c('cbse.schoolInfo.schoolData.builtUp'),
    playground: c('cbse.schoolInfo.schoolData.playground'),
    indoorGames: c('cbse.schoolInfo.schoolData.indoorGames'),
    danceRooms: c('cbse.schoolInfo.schoolData.danceRooms'),
    musicRooms: c('cbse.schoolInfo.schoolData.musicRooms'),
    hostels: c('cbse.schoolInfo.schoolData.hostels'),
    swimmingPool: c('cbse.schoolInfo.schoolData.swimmingPool'),
    gymnasium: c('cbse.schoolInfo.schoolData.gymnasium'),
    healthCheckup: c('cbse.schoolInfo.schoolData.healthCheckup'),
    transport: c('cbse.schoolInfo.schoolData.transport'),
    principal: c('cbse.schoolInfo.schoolData.principal'),
    vicePrincipal: c('cbse.schoolInfo.schoolData.vicePrincipal'),
    primaryIncharge: c('cbse.schoolInfo.schoolData.primaryIncharge'),
    pgt: c('cbse.schoolInfo.schoolData.pgt'),
    tgt: c('cbse.schoolInfo.schoolData.tgt'),
    prt: c('cbse.schoolInfo.schoolData.prt'),
    healthWellnessTeacher: c('cbse.schoolInfo.schoolData.healthWellnessTeacher'),
    librarian: c('cbse.schoolInfo.schoolData.librarian'),
    specialEducator: c('cbse.schoolInfo.schoolData.specialEducator'),
    others: c('cbse.schoolInfo.schoolData.others'),
    bank: c('cbse.schoolInfo.schoolData.bank'),
    librarySize: c('cbse.schoolInfo.schoolData.librarySize'),
    periodicals: c('cbse.schoolInfo.schoolData.periodicals'),
    dailies: c('cbse.schoolInfo.schoolData.dailies'),
    referenceBooks: c('cbse.schoolInfo.schoolData.referenceBooks'),
    magazines: c('cbse.schoolInfo.schoolData.magazines'),
    otherBooks: c('cbse.schoolInfo.schoolData.otherBooks'),
    grievanceOfficer: c('cbse.schoolInfo.schoolData.grievanceOfficer'),
    grievanceEmail: "srelizabeth@gmail.com",
    grievancePhone: "6001128485",
    sexualHarassmentHead: c('cbse.schoolInfo.schoolData.sexualHarassmentHead'),
    sexualHarassmentContact: "9435707179",
    sexualHarassmentEmail: "paulliza77@gmail.com",
    academicSession: c('cbse.schoolInfo.schoolData.academicSession'),
    vacationPeriod: c('cbse.schoolInfo.schoolData.vacationPeriod'),
    admissionPeriod: c('cbse.schoolInfo.schoolData.admissionPeriod')
  }

  const quickFacts = [
    { contentId: "Board", label: c('cbse.schoolInfo.quickFacts.board-4816cbfd.label'), value: schoolData.affiliation, icon: Award },
    { contentId: "Affiliation Status", label: c('cbse.schoolInfo.quickFacts.affiliation-status-26c89b43.label'), value: `${schoolData.status} ${c('cbse.schoolInfo.quickFacts.affiliation-status-26c89b43.value.caption2')} ${schoolData.affiliationUpto})`, icon: Clock },
    { contentId: "Establishment", label: c('cbse.schoolInfo.quickFacts.establishment-d4565839.label'), value: schoolData.establishment, icon: Calendar },
    { contentId: "Campus Area", label: c('cbse.schoolInfo.quickFacts.campus-area-800b2b37.label'), value: schoolData.area, icon: Building },
    { contentId: "Academic Session", label: c('cbse.schoolInfo.quickFacts.academic-session-302e8da9.label'), value: schoolData.academicSession, icon: Calendar },
    { contentId: "Admission Period", label: c('cbse.schoolInfo.quickFacts.admission-period-17d106d3.label'), value: schoolData.admissionPeriod, icon: Clock }
  ]

  const contactInfo = [
    { contentId: "Address", label: c('cbse.schoolInfo.contactInfo.address-56ef8f20.label'), value: `${schoolData.address}, ${schoolData.district}`, icon: MapPin },
    { contentId: "Phone", label: c('cbse.schoolInfo.contactInfo.phone-63dceb88.label'), value: schoolData.phone, icon: Phone },
    { contentId: "Mobile", label: c('cbse.schoolInfo.contactInfo.mobile-cbaad3cf.label'), value: schoolData.mobile, icon: Phone },
    { contentId: "Email", label: c('cbse.schoolInfo.contactInfo.email-969ccbd3.label'), value: schoolData.email, icon: Mail }
  ]

  const staffStrength = [
    { contentId: "Principal", label: c('cbse.schoolInfo.staffStrength.principal-afc19f17.label'), value: schoolData.principal },
    { contentId: "Vice Principal", label: c('cbse.schoolInfo.staffStrength.vice-principal-f59921ca.label'), value: schoolData.vicePrincipal },
    { contentId: "Primary Incharge", label: c('cbse.schoolInfo.staffStrength.primary-incharge-c7a673eb.label'), value: schoolData.primaryIncharge },
    { contentId: "PGT", label: c('cbse.schoolInfo.staffStrength.pgt-b38bc0c1.label'), value: schoolData.pgt },
    { contentId: "TGT", label: c('cbse.schoolInfo.staffStrength.tgt-655caf7a.label'), value: schoolData.tgt },
    { contentId: "PRT", label: c('cbse.schoolInfo.staffStrength.prt-e4fd7627.label'), value: schoolData.prt },
    { contentId: "Health Wellness Teacher", label: c('cbse.schoolInfo.staffStrength.health-wellness-teacher-0002e7ac.label'), value: schoolData.healthWellnessTeacher },
    { contentId: "Librarian", label: c('cbse.schoolInfo.staffStrength.librarian-24f57581.label'), value: schoolData.librarian },
    { contentId: "Special Educator", label: c('cbse.schoolInfo.staffStrength.special-educator-63512f39.label'), value: schoolData.specialEducator },
    { contentId: "Others", label: c('cbse.schoolInfo.staffStrength.others-ebdad9ba.label'), value: schoolData.others }
  ]

  const facilities = [
    { contentId: "Indoor Games", label: c('cbse.schoolInfo.facilities.indoor-games-d3e3755e.label'), value: schoolData.indoorGames },
    { contentId: "Dance Rooms", label: c('cbse.schoolInfo.facilities.dance-rooms-1de9ccea.label'), value: schoolData.danceRooms },
    { contentId: "Music Rooms", label: c('cbse.schoolInfo.facilities.music-rooms-54d0d48e.label'), value: schoolData.musicRooms },
    { contentId: "Swimming Pool", label: c('cbse.schoolInfo.facilities.swimming-pool-3afdc970.label'), value: schoolData.swimmingPool },
    { contentId: "Gymnasium", label: c('cbse.schoolInfo.facilities.gymnasium-15c3b67e.label'), value: schoolData.gymnasium },
    { contentId: "Hostels", label: c('cbse.schoolInfo.facilities.hostels-3c14c0bd.label'), value: schoolData.hostels },
    { contentId: "Health Checkup", label: c('cbse.schoolInfo.facilities.health-checkup-789d6892.label'), value: schoolData.healthCheckup },
    { contentId: "Transport", label: c('cbse.schoolInfo.facilities.transport-aaead4ab.label'), value: schoolData.transport }
  ]

  const libraryDetails = [
    { contentId: "Library Size", label: c('cbse.schoolInfo.libraryDetails.library-size-4eb24447.label'), value: schoolData.librarySize },
    { contentId: "Periodicals", label: c('cbse.schoolInfo.libraryDetails.periodicals-17f7879c.label'), value: schoolData.periodicals },
    { contentId: "Dailies", label: c('cbse.schoolInfo.libraryDetails.dailies-bae8227e.label'), value: schoolData.dailies },
    { contentId: "Reference Books", label: c('cbse.schoolInfo.libraryDetails.reference-books-22b1d114.label'), value: schoolData.referenceBooks },
    { contentId: "Magazines", label: c('cbse.schoolInfo.libraryDetails.magazines-32f3d8e8.label'), value: schoolData.magazines },
    { contentId: "Other Books", label: c('cbse.schoolInfo.libraryDetails.other-books-28bbf46c.label'), value: schoolData.otherBooks }
  ]

  return (
    <div className="bg-gradient-to-b from-white to-[#FBF6EC] min-h-screen">
      
      {/* ========================================================== */}
      {/* COMPACT HERO HEADER - Same style as Co-Founders */}
      {/* ========================================================== */}
      <div className="bg-maroon-900 text-white py-8 px-4">
        <div className="container-custom mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Info size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{c('cbse.schoolInfo.copy.school-information.heading.school-information-e723085f')}</h1>
              <p className="text-gold-300 text-sm mt-0.5">{c('cbse.schoolInfo.copy.school-information.paragraph.complete-institutional-pro-f60b150b')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================================== */}
      <section className="py-8 md:py-10">
        <div className="container-custom max-w-5xl mx-auto">
          
          {/* School Name Header */}
          <motion.div
            variants={fadeInUp}
            initial={false}
            animate="visible"
            className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white rounded-xl p-5 mb-6 shadow-lg"
          >
            <h2 className="text-lg md:text-xl font-bold text-center">{schoolData.name}</h2>
            <p className="text-center text-gold-300 text-sm mt-1">{schoolData.address}</p>
          </motion.div>

          {/* Quick Facts Grid */}
          <SectionTitle icon={Sparkles} title={c('cbse.schoolInfo.copy.school-information.title.quick-facts-7d338e4a')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
          >
            {quickFacts.map((item) => (
              <InfoCard 
                key={item.contentId}
                icon={item.icon} 
                label={item.label} 
                value={item.value} 
              />
            ))}
          </motion.div>

          {/* Contact Information */}
          <SectionTitle icon={Phone} title={c('cbse.schoolInfo.copy.school-information.title.contact-information-7c01aec3')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
          >
            {contactInfo.map((item) => (
              <InfoCard 
                key={item.contentId}
                icon={item.icon} 
                label={item.label} 
                value={item.value} 
              />
            ))}
          </motion.div>

          {/* Affiliation Details */}
          <SectionTitle icon={Award} title={c('cbse.schoolInfo.copy.school-information.title.affiliation-details-00743d92')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
          >
            <InfoCard 
              icon={Shield} 
              label="NOC No." 
              value={schoolData.noc}
              className="sm:col-span-1"
            >
              <p className="text-[10px] text-gray-400">Date: {schoolData.nocDate}</p>
            </InfoCard>
            <InfoCard 
              icon={Award} 
              label="Affiliation No." 
              value={schoolData.affiliationNo}
            >
              <p className="text-[10px] text-gray-400">Since: {schoolData.affiliationSince}</p>
            </InfoCard>
            <InfoCard 
              icon={Clock} 
              label="Status" 
              value={schoolData.status}
            >
              <p className="text-[10px] text-gray-400">Valid up to: {schoolData.affiliationUpto}</p>
            </InfoCard>
          </motion.div>

          {/* Trust & Management */}
          <SectionTitle icon={Building} title={c('cbse.schoolInfo.copy.school-information.title.trust-management-31452517')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
          >
            <InfoCard 
              icon={Building} 
              label="Trust/Society" 
              value={schoolData.trust}
            >
              <p className="text-[10px] text-gray-400">{schoolData.trustAddress}</p>
            </InfoCard>
            <InfoCard 
              icon={Users} 
              label="Manager/Correspondent" 
              value={schoolData.manager}
            />
          </motion.div>

          {/* Campus & Facilities */}
          <SectionTitle icon={Building} title={c('cbse.schoolInfo.copy.school-information.title.campus-facilities-ade7f025')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          >
            <InfoCard icon={Building} label="Total Area" value={schoolData.area}>
              <p className="text-[10px] text-gray-400">{schoolData.areaSqm}</p>
            </InfoCard>
            <InfoCard icon={Building} label="Built-up Area" value={schoolData.builtUp} />
            <InfoCard icon={Home} label="Playground" value={schoolData.playground} />
            <InfoCard icon={Bus} label="Transport" value={schoolData.transport} />
          </motion.div>

          {/* Facilities Grid */}
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6"
          >
            {facilities.map((item) => (
              <motion.div key={item.contentId} variants={fadeInUp}>
                <FacilityBadge label={item.label} value={item.value} />
              </motion.div>
            ))}
          </motion.div>

          {/* Teaching Staff */}
          <SectionTitle icon={Users} title={c('cbse.schoolInfo.copy.school-information.title.teaching-staff-842be9d2')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
          >
            {staffStrength.map((item) => (
              <StatCard key={item.contentId} label={item.label} value={item.value} />
            ))}
          </motion.div>

          {/* Library Resources */}
          <SectionTitle icon={Library} title={c('cbse.schoolInfo.copy.school-information.title.library-resources-8df05693')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
          >
            {libraryDetails.map((item) => (
              <StatCard key={item.contentId} label={item.label} value={item.value} />
            ))}
          </motion.div>

          {/* Grievance & Sexual Harassment */}
          <SectionTitle icon={Shield} title={c('cbse.schoolInfo.copy.school-information.title.grievance-committees-50a63dbd')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
          >
            <InfoCard 
              icon={Users} 
              label="Grievance Redressal Officer" 
              value={schoolData.grievanceOfficer}
            >
              <p className="text-[10px] text-gray-400">{schoolData.grievanceEmail}</p>
              <p className="text-[10px] text-gray-400">Phone: {schoolData.grievancePhone}</p>
            </InfoCard>
            <InfoCard 
              icon={Heart} 
              label="Sexual Harassment Committee" 
              value={schoolData.sexualHarassmentHead}
            >
              <p className="text-[10px] text-gray-400">{schoolData.sexualHarassmentEmail}</p>
              <p className="text-[10px] text-gray-400">Contact: {schoolData.sexualHarassmentContact}</p>
            </InfoCard>
          </motion.div>

          {/* Academic Calendar */}
          <SectionTitle icon={Calendar} title={c('cbse.schoolInfo.copy.school-information.title.academic-calendar-3426c640')} />
          <motion.div 
            variants={staggerChildren}
            initial={false}
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
          >
            <InfoCard icon={Calendar} label="Academic Session" value={schoolData.academicSession} />
            <InfoCard icon={Clock} label="Vacation Period" value={schoolData.vacationPeriod} />
            <InfoCard icon={Calendar} label="Admission Period" value={schoolData.admissionPeriod} />
          </motion.div>

          {/* Bank Details */}
          <motion.div 
            variants={fadeInUp}
            initial={false}
            animate="visible"
            className="p-4 bg-gradient-to-r from-gray-50 to-gold-50/30 rounded-xl border border-gray-200"
          >
            <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-wide text-center">{c('cbse.schoolInfo.copy.school-information.paragraph.salary-processing-0b87e0c6')}</p>
            <p className="text-center text-maroon-900 font-medium text-sm">{c('cbse.schoolInfo.copy.school-information.paragraph.bank-4be33ffe') + ' '}<span className="font-bold">{schoolData.bank}</span>{' ' + c('cbse.schoolInfo.copy.school-information.paragraph.single-cheque-transfer-6c3d1e44') + ' '}<span className="text-green-600 font-semibold">{c('cbse.schoolInfo.copy.school-information.text.yes-85a39ab3')}</span>
            </p>
          </motion.div>

        </div>
      </section>

      <style>{`
        .container-custom {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .container-custom {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .container-custom {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default SchoolInfo
