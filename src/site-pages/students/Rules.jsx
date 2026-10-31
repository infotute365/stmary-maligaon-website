import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { 
  BookMarked, 
  Clock, 
  Shield, 
  AlertCircle, 
  Phone, 
  BookOpen, 
  Users, 
  GraduationCap,
  Building,
  Calendar,
  Award,
  ChevronRight,
  XCircle,
  CheckCircle,
  Info,
  Sparkles,
  Flag,
  Target
} from 'lucide-react'

const Rules = () => {
  const c = useSiteContent()
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [controls, isInView])

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
      transition: { staggerChildren: 0.06 }
    }
  }

  const generalRules = [
    { contentId: "Every student must possess a school calendar which should be brought to school daily.",
      text: c('students.rules.generalRules.every-student-must-possess-a-school-7bbe3c6c.text'),
      icon: Calendar,
      category: 'Essential', categoryText: c('students.rules.generalRules.every-student-must-possess-a-school-7bbe3c6c.categoryText'),
      color: 'red'
    },
    { contentId: "The school hours are from 7:45 AM to 2:00 PM. Students must be on the school campus at 7:30 AM.",
      text: c('students.rules.generalRules.the-school-hours-are-from-7-45-am-to-64cba3a1.text'),
      icon: Clock,
      category: 'Timing', categoryText: c('students.rules.generalRules.the-school-hours-are-from-7-45-am-to-64cba3a1.categoryText'),
      color: 'blue'
    },
    { contentId: "To acquire greater communication facility only English should be spoken in the school campus.",
      text: c('students.rules.generalRules.to-acquire-greater-communication-fac-1cb9c70f.text'),
      icon: BookOpen,
      category: 'Communication', categoryText: c('students.rules.generalRules.to-acquire-greater-communication-fac-1cb9c70f.categoryText'),
      color: 'green'
    },
    { contentId: "Irregular attendance, habitual want of application, insubordination, any kind of cheating or serious misconduct, even outside the school campus or any habit or behaviour objectionable to the good name of the school are sufficient reasons to take disciplinary actions against the students.",
      text: c('students.rules.generalRules.irregular-attendance-habitual-want-o-26da65ad.text'),
      icon: Shield,
      category: 'Discipline', categoryText: c('students.rules.generalRules.irregular-attendance-habitual-want-o-26da65ad.categoryText'),
      color: 'purple'
    },
    { contentId: "No books, periodicals, newspapers or any other item of objectionable nature shall be brought to the school. Parcels and letters addressed to the students are subjected to inspection before handing them over to the students.",
      text: c('students.rules.generalRules.no-books-periodicals-newspapers-or-a-fe62ca6a.text'),
      icon: BookMarked,
      category: 'Restrictions', categoryText: c('students.rules.generalRules.no-books-periodicals-newspapers-or-a-fe62ca6a.categoryText'),
      color: 'orange'
    },
    { contentId: "Students are responsible for the safe custody of their books and belongings. Mobile phones, pen drives, CDs and any other electronic gadgets of objectionable nature as well as ornaments and jewellery of any kind are not allowed in the school.",
      text: c('students.rules.generalRules.students-are-responsible-for-the-saf-b7f37b6d.text'),
      icon: XCircle,
      category: 'Prohibited Items', categoryText: c('students.rules.generalRules.students-are-responsible-for-the-saf-b7f37b6d.categoryText'),
      color: 'rose'
    },
    { contentId: "Any damage done to the school property should be made good by the student concerned.",
      text: c('students.rules.generalRules.any-damage-done-to-the-school-proper-6adf7668.text'),
      icon: AlertCircle,
      category: 'Responsibility', categoryText: c('students.rules.generalRules.any-damage-done-to-the-school-proper-6adf7668.categoryText'),
      color: 'amber'
    },
    { contentId: "No present or any demonstration to the teachers is allowed without the previous consent of the school authorities. Collection for any purpose whatsoever requires the Principal's sanction.",
      text: c('students.rules.generalRules.no-present-or-any-demonstration-to-t-869d2d72.text'),
      icon: Users,
      category: 'Protocol', categoryText: c('students.rules.generalRules.no-present-or-any-demonstration-to-t-869d2d72.categoryText'),
      color: 'indigo'
    },
    { contentId: "Every student attending the school is obliged to take part in all the extra-curricular activities of the school as part of their integral training and no one will be excused except for valid reasons. No student will abstain from physical exercise without the doctor's certificate.",
      text: c('students.rules.generalRules.every-student-attending-the-school-i-0adf9270.text'),
      icon: Award,
      category: 'Activities', categoryText: c('students.rules.generalRules.every-student-attending-the-school-i-0adf9270.categoryText'),
      color: 'pink'
    },
    { contentId: "Parents/ Guardians are not allowed to see their children or interview teachers during the school hours.",
      text: c('students.rules.generalRules.parents-guardians-are-not-allowed-to-c217146a.text'),
      icon: Phone,
      category: 'Parent Guidelines', categoryText: c('students.rules.generalRules.parents-guardians-are-not-allowed-to-c217146a.categoryText'),
      color: 'teal'
    },
    { contentId: "Certificate, concession forms, recommendation letters etc. will be issued only two days after the application has been submitted in the office.",
      text: c('students.rules.generalRules.certificate-concession-forms-recomme-d953767b.text'),
      icon: GraduationCap,
      category: 'Administrative', categoryText: c('students.rules.generalRules.certificate-concession-forms-recomme-d953767b.categoryText'),
      color: 'cyan'
    },
    { contentId: "Being a Catholic institution, only Christian festivals are celebrated within the school campus. No disrespect will be shown to articles and images of religion and worship proper to Christian faith. Besides, every student is required to show respect for all religions and faiths.",
      text: c('students.rules.generalRules.being-a-catholic-institution-only-ch-bfbecd59.text'),
      icon: Building,
      category: 'Religious Policy', categoryText: c('students.rules.generalRules.being-a-catholic-institution-only-ch-bfbecd59.categoryText'),
      color: 'violet'
    }
  ]

  const admissionRules = [
    { contentId: "New admissions are made only to K.G. Other admissions if any, will depend on the availability of seats and on the competence of the student.",
      text: c('students.rules.admissionRules.new-admissions-are-made-only-to-k-g-0aca0480.text'),
      icon: GraduationCap,
      color: 'blue'
    },
    { contentId: "Students coming from other school are required to bring a School Leaving Certificate from the last school they attended and the mark sheet of the last Annual Examination.",
      text: c('students.rules.admissionRules.students-coming-from-other-school-ar-45debb2d.text'),
      icon: BookOpen,
      color: 'green'
    },
    { contentId: "New students must be introduced personally by their parents or guardians who will be responsible for their regularity, conduct and fees.",
      text: c('students.rules.admissionRules.new-students-must-be-introduced-pers-2f189f22.text'),
      icon: Users,
      color: 'purple'
    },
    { contentId: "If the school authorities think it convenient, they will examine the new applicants and place them in the class they are found fit for.",
      text: c('students.rules.admissionRules.if-the-school-authorities-think-it-c-19ec8b0e.text'),
      icon: Award,
      color: 'amber'
    },
    { contentId: "When admitted at any part of the year, they pay an entrance fee, the annual fee and the school fee of the whole year.",
      text: c('students.rules.admissionRules.when-admitted-at-any-part-of-the-yea-379091b2.text'),
      icon: AlertCircle,
      color: 'red'
    },
    { contentId: "No transfer certificate will be issued until all dues to the school have been paid in full and that too only on receipt of written application from the parents or guardians.",
      text: c('students.rules.admissionRules.no-transfer-certificate-will-be-issu-5d8a5082.text'),
      icon: Shield,
      color: 'orange'
    },
    { contentId: "A fee of Rs. 100/- will be charged whenever an application for transfer certificate or a duplicate of the same is made. A fee Rs. 50/- will be charged for any extra from the register.",
      text: c('students.rules.admissionRules.a-fee-of-rs-100-will-be-charged-when-def0df34.text'),
      icon: AlertCircle,
      color: 'rose'
    }
  ]

  const quickHighlights = [
    { contentId: "School Hours", label: c('students.rules.quickHighlights.school-hours-0a692ab9.label'), value: c('students.rules.quickHighlights.school-hours-0a692ab9.value'), icon: Clock },
    { contentId: "Reporting Time", label: c('students.rules.quickHighlights.reporting-time-eac5781e.label'), value: c('students.rules.quickHighlights.reporting-time-eac5781e.value'), icon: Clock },
    { contentId: "Language Policy", label: c('students.rules.quickHighlights.language-policy-4a1228be.label'), value: c('students.rules.quickHighlights.language-policy-4a1228be.value'), icon: BookOpen },
    { contentId: "TC Fee", label: c('students.rules.quickHighlights.tc-fee-cb2dab14.label'), value: c('students.rules.quickHighlights.tc-fee-cb2dab14.value'), icon: AlertCircle },
  ]

  const getColorClasses = (color) => {
    const colors = {
      red: { bg: 'bg-red-50', border: 'border-red-200', tag: 'bg-red-100 text-red-700', iconBg: 'bg-red-100', iconText: 'text-red-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', tag: 'bg-blue-100 text-blue-700', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', tag: 'bg-green-100 text-green-700', iconBg: 'bg-green-100', iconText: 'text-green-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', tag: 'bg-purple-100 text-purple-700', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', tag: 'bg-orange-100 text-orange-700', iconBg: 'bg-orange-100', iconText: 'text-orange-600' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', tag: 'bg-rose-100 text-rose-700', iconBg: 'bg-rose-100', iconText: 'text-rose-600' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-700', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', tag: 'bg-indigo-100 text-indigo-700', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200', tag: 'bg-pink-100 text-pink-700', iconBg: 'bg-pink-100', iconText: 'text-pink-600' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', tag: 'bg-teal-100 text-teal-700', iconBg: 'bg-teal-100', iconText: 'text-teal-600' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', tag: 'bg-cyan-100 text-cyan-700', iconBg: 'bg-cyan-100', iconText: 'text-cyan-600' },
      violet: { bg: 'bg-violet-50', border: 'border-violet-200', tag: 'bg-violet-100 text-violet-700', iconBg: 'bg-violet-100', iconText: 'text-violet-600' }
    }
    return colors[color] || colors.blue
  }

  const getCategoryColor = (category) => {
    const map = {
      'Essential': 'bg-red-100 text-red-700',
      'Timing': 'bg-blue-100 text-blue-700',
      'Communication': 'bg-green-100 text-green-700',
      'Discipline': 'bg-purple-100 text-purple-700',
      'Restrictions': 'bg-orange-100 text-orange-700',
      'Prohibited Items': 'bg-rose-100 text-rose-700',
      'Responsibility': 'bg-amber-100 text-amber-700',
      'Protocol': 'bg-indigo-100 text-indigo-700',
      'Activities': 'bg-pink-100 text-pink-700',
      'Parent Guidelines': 'bg-teal-100 text-teal-700',
      'Administrative': 'bg-cyan-100 text-cyan-700',
      'Religious Policy': 'bg-violet-100 text-violet-700'
    }
    return map[category] || 'bg-gray-100 text-gray-700'
  }

  const SectionTitle = ({ icon: Icon, title, subtitle, count }) => (
    <motion.div 
      variants={fadeInUp}
      className="flex items-center gap-3 mb-5"
    >
      <div className="p-2 bg-gold-100 rounded-lg">
        <Icon size={18} className="text-maroon-700" />
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {count && <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">{count}{' ' + c('students.rules.copy.page-header.text.rules-4228aeb0')}</span>}
      <div className="flex-1 h-px bg-gradient-to-r from-gold-300/50 to-transparent" />
    </motion.div>
  )

  return (
    <div className="bg-gradient-to-b from-white to-[#FBF6EC] min-h-screen">
      
      {/* ========================================================== */}
      {/* COMPACT HERO HEADER */}
      {/* ========================================================== */}
      <div className="bg-maroon-900 text-white py-8 px-4">
        <div className="container-custom mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <BookMarked size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{c('students.rules.copy.rules-regulations.heading.rules-regulations-f8695ef9')}</h1>
              <p className="text-gold-300 text-sm mt-0.5">{c('students.rules.copy.rules-regulations.paragraph.guidelines-for-a-disciplin-716b7dae')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================================== */}
      <section ref={ref} className="py-8 md:py-10">
        <div className="container-custom max-w-5xl mx-auto">

          {/* Quick Highlights */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {quickHighlights.map((item) => {
              const Icon = item.icon
              return (
                <motion.div 
                  key={item.contentId}
                  variants={fadeInUp}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 group"
                >
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <div className="p-1 rounded-lg bg-gold-50 group-hover:bg-gold-100 transition-colors">
                      <Icon size={14} className="text-gold-600" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{item.label}</span>
                  </div>
                  <p className="text-maroon-900 font-bold text-sm">{item.value}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* General Rules */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="mb-6"
          >
            <SectionTitle 
              icon={Flag} 
              title={c('students.rules.copy.rules-regulations.title.general-rules-3a189765')}
              count="12" 
            />
            
            <motion.div 
              variants={staggerChildren}
              initial="hidden"
              animate={controls}
              className="space-y-2.5"
            >
              {generalRules.map((rule, index) => {
                const colors = getColorClasses(rule.color)
                const Icon = rule.icon
                const categoryColor = getCategoryColor(rule.category)
                return (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    className={`${colors.bg} rounded-xl border ${colors.border} p-4 hover:shadow-md transition-all duration-300 group hover:border-gold-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${colors.iconBg} rounded-full p-1.5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={16} className={colors.iconText} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start flex-wrap gap-2">
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{rule.text}</p>
                          <span className={`flex-shrink-0 text-[10px] font-medium px-2.5 py-0.5 rounded-full ${categoryColor}`}>
                            {rule.categoryText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Admission & Withdrawal Rules */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="mb-6"
          >
            <SectionTitle 
              icon={GraduationCap} 
              title={c('students.rules.copy.rules-regulations.title.admission-withdrawal-52ed78fd')}
              count="7" 
            />

            <div className="bg-gradient-to-br from-maroon-50 to-white rounded-xl border border-maroon-100 p-5 shadow-sm">
              <motion.div 
                variants={staggerChildren}
                initial="hidden"
                animate={controls}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {admissionRules.map((rule, index) => {
                  const colors = getColorClasses(rule.color)
                  const Icon = rule.icon
                  return (
                    <motion.div 
                      key={index} 
                      variants={fadeInUp}
                      className={`${colors.bg} rounded-xl border ${colors.border} p-3.5 hover:shadow-md transition-all duration-300 group hover:border-gold-300`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`flex-shrink-0 mt-0.5 ${colors.iconBg} rounded-full p-1.5 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={14} className={colors.iconText} />
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed flex-1">{rule.text}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.div>

          {/* Fee Information Cards */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-100 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={18} className="text-blue-700" />
                </div>
                <h4 className="font-bold text-blue-900 text-sm">{c('students.rules.copy.transfer-certificate-t.heading.transfer-certificate-tc-25a1b26c')}</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.transfer-certificate-t.text.tc-issued-only-after-all-d-f3f095e6')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.transfer-certificate-t.text.written-application-requir-ec67b445')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.transfer-certificate-t.text.tc-fee-f63c95ee') + ' '}<span className="font-semibold">{c('students.rules.copy.transfer-certificate-t.text.100-b56956eb')}</span>{' ' + c('students.rules.copy.transfer-certificate-t.text.per-application-7c6f99ae')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.transfer-certificate-t.text.extra-copies-from-register-0b95dd27') + ' '}<span className="font-semibold">{c('students.rules.copy.transfer-certificate-t.text.50-d83d1e69')}</span>{' ' + c('students.rules.copy.transfer-certificate-t.text.each-bec16879')}</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-orange-200 p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-orange-100 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle size={18} className="text-orange-700" />
                </div>
                <h4 className="font-bold text-orange-900 text-sm">{c('students.rules.copy.important-notes.heading.important-notes-b6c16d2b')}</h4>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.important-notes.text.new-admissions-primarily-f-c958f0e2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.important-notes.text.admission-based-on-seat-av-ce069eb4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.important-notes.text.full-year-fees-applicable--5a13814a')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{c('students.rules.copy.important-notes.text.parents-responsible-for-st-fade5c24')}</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="text-center p-4 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-gold-600" />
              <p className="text-xs text-gray-600">
                <span className="font-medium text-maroon-700">{c('students.rules.copy.important-notes.text.these-rules-5d2d7583')}</span>{' ' + c('students.rules.copy.important-notes.paragraph.are-designed-to-create-a-d-f10207d4')}</p>
              <Sparkles size={16} className="text-gold-600" />
            </div>
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

export default Rules
