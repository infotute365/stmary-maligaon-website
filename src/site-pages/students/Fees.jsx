import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { 
  Wallet, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Banknote, 
  Info,
  Sparkles,
  Shield,
  Phone,
  Building,
  CreditCard
} from 'lucide-react'

const Fees = () => {
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
      transition: { staggerChildren: 0.08 }
    }
  }

  // Updated fee data from the image
  const feeData = [
    { contentId: "KG",
      class: c('students.fees.feeData.kg-88ed3209.class'),
      annualPerInstallment: c('students.fees.feeData.kg-88ed3209.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.kg-88ed3209.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.kg-88ed3209.installmentPeriod'),
      colour: 'purple'
    },
    { contentId: "I - III",
      class: c('students.fees.feeData.i-iii-10d135b2.class'),
      annualPerInstallment: c('students.fees.feeData.i-iii-10d135b2.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.i-iii-10d135b2.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.i-iii-10d135b2.installmentPeriod'),
      colour: 'blue'
    },
    { contentId: "IV - V",
      class: c('students.fees.feeData.iv-v-005e4ae7.class'),
      annualPerInstallment: c('students.fees.feeData.iv-v-005e4ae7.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.iv-v-005e4ae7.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.iv-v-005e4ae7.installmentPeriod'),
      colour: 'teal'
    },
    { contentId: "VI - VIII",
      class: c('students.fees.feeData.vi-viii-0091659b.class'),
      annualPerInstallment: c('students.fees.feeData.vi-viii-0091659b.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.vi-viii-0091659b.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.vi-viii-0091659b.installmentPeriod'),
      colour: 'green'
    },
    { contentId: "IX - X",
      class: c('students.fees.feeData.ix-x-f0c3b216.class'),
      annualPerInstallment: c('students.fees.feeData.ix-x-f0c3b216.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.ix-x-f0c3b216.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.ix-x-f0c3b216.installmentPeriod'),
      colour: 'amber'
    },
    { contentId: "XI - XII (Hum/Com)",
      class: c('students.fees.feeData.xi-xii-hum-com-baeaed42.class'),
      annualPerInstallment: c('students.fees.feeData.xi-xii-hum-com-baeaed42.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.xi-xii-hum-com-baeaed42.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.xi-xii-hum-com-baeaed42.installmentPeriod'),
      colour: 'orange'
    },
    { contentId: "XI - XII (Science)",
      class: c('students.fees.feeData.xi-xii-science-8c553a58.class'),
      annualPerInstallment: c('students.fees.feeData.xi-xii-science-8c553a58.annualPerInstallment'),
      tuitionPerInstallment: c('students.fees.feeData.xi-xii-science-8c553a58.tuitionPerInstallment'),
      installmentPeriod: c('students.fees.feeData.xi-xii-science-8c553a58.installmentPeriod'),
      colour: 'rose'
    }
  ]

  const installmentSchedule = [
    { contentId: "April", month: c('students.fees.installmentSchedule.april-4afe6ea1.month'), period: c('students.fees.installmentSchedule.april-4afe6ea1.period'), classes: c('students.fees.installmentSchedule.april-4afe6ea1.classes') },
    { contentId: "July", month: c('students.fees.installmentSchedule.july-e9cf7a1c.month'), period: c('students.fees.installmentSchedule.july-e9cf7a1c.period'), classes: c('students.fees.installmentSchedule.july-e9cf7a1c.classes') },
    { contentId: "October", month: c('students.fees.installmentSchedule.october-fdd79178.month'), period: c('students.fees.installmentSchedule.october-fdd79178.period'), classes: c('students.fees.installmentSchedule.october-fdd79178.classes') },
    { contentId: "January", month: c('students.fees.installmentSchedule.january-37082e68.month'), period: c('students.fees.installmentSchedule.january-37082e68.period'), classes: c('students.fees.installmentSchedule.january-37082e68.classes') },
  ]

  const seniorInstallmentSchedule = [
    { contentId: "June", month: c('students.fees.seniorInstallmentSchedule.june-d5808c0e.month'), classes: c('students.fees.seniorInstallmentSchedule.june-d5808c0e.classes') },
    { contentId: "September", month: c('students.fees.seniorInstallmentSchedule.september-cd559ea0.month'), classes: c('students.fees.seniorInstallmentSchedule.september-cd559ea0.classes') },
    { contentId: "December", month: c('students.fees.seniorInstallmentSchedule.december-8fb204ca.month'), classes: c('students.fees.seniorInstallmentSchedule.december-8fb204ca.classes') },
  ]

  const importantRules = [
    { contentId: "Fees cover twelve calendar months - no reduction for holidays or broken periods", text: c('students.fees.importantRules.fees-cover-twelve-calendar-months-no-9d609da5') },
    { contentId: "Students are liable to pay fees as long as their names are officially on rolls", text: c('students.fees.importantRules.students-are-liable-to-pay-fees-as-l-0c7b65d0') },
    { contentId: "Late payment fine of Rs. 100/- will be levied on all late payments", text: c('students.fees.importantRules.late-payment-fine-of-rs-100-will-be-3bbba47b') },
    { contentId: "Students leaving/joining during any term must pay tuition, annual and other fees for whole year", text: c('students.fees.importantRules.students-leaving-joining-during-any-308c213e') },
    { contentId: "Absence from examination does not mean exemption from examination fees", text: c('students.fees.importantRules.absence-from-examination-does-not-me-1a66888a') },
    { contentId: "Results will be withheld for students with outstanding dues", text: c('students.fees.importantRules.results-will-be-withheld-for-student-135880f0') },
    { contentId: "School fees and other dues are liable to be revised at any time", text: c('students.fees.importantRules.school-fees-and-other-dues-are-liabl-c6c889d5') }
  ]

  const getColorClasses = (color) => {
    const colors = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
      teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-500' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' }
    }
    return colors[color] || colors.blue
  }

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
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
              <Wallet size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{c('students.fees.copy.fee-structure.heading.fee-structure-dad7cf5c')}</h1>
              <p className="text-gold-300 text-sm mt-0.5">{c('students.fees.copy.fee-structure.paragraph.academic-year-2025-26-51a89bb2')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================================== */}
      <section ref={ref} className="py-8 md:py-10">
        <div className="container-custom max-w-5xl mx-auto">
          
          {/* Important Notice */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-xl p-4 mb-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 font-medium">{c('students.fees.copy.fee-structure.paragraph.fees-are-received-by-hdfc--b21a214e')}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c('students.fees.copy.fee-structure.paragraph.no-bills-are-issued-parent-51846d17')}</p>
              </div>
            </div>
          </motion.div>

          {/* Fee Table */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white">
                    <th className="px-4 py-3.5 text-left font-semibold text-sm">{c('students.fees.copy.fee-structure.text.class-bb6a385e')}</th>
                    <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('students.fees.copy.fee-structure.text.annual-fees-b25ed05c')}<br/><span className="text-xs font-normal text-gold-300">{c('students.fees.copy.fee-structure.text.per-installment-bf8712c5')}</span></th>
                    <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('students.fees.copy.fee-structure.text.tuition-fees-33206568')}<br/><span className="text-xs font-normal text-gold-300">{c('students.fees.copy.fee-structure.text.per-installment-bf8712c5.2')}</span></th>
                    <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('students.fees.copy.fee-structure.text.installment-03777de7')}<br/><span className="text-xs font-normal text-gold-300">{c('students.fees.copy.fee-structure.text.period-6e795d4d')}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {feeData.map((row, index) => {
                    const colors = getColorClasses(row.colour)
                    return (
                      <tr 
                        key={row.contentId}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-maroon-50/30 transition-colors duration-150`}
                      >
                        <td className="px-4 py-3 font-semibold text-maroon-900 border-b border-gray-100 text-sm">
                          <span className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}></span>
                            {row.class}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 border-b border-gray-100 text-sm font-medium">
                          {row.annualPerInstallment}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 border-b border-gray-100 text-sm font-medium">
                          {row.tuitionPerInstallment}
                        </td>
                        <td className="px-4 py-3 text-center border-b border-gray-100 text-sm">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-medium">
                            <Clock size={12} />
                            {row.installmentPeriod}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="bg-gray-50/80 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                <Info size={12} className="text-gold-500" />{c('students.fees.copy.fee-structure.paragraph.fees-cover-twelve-calendar-b7a2e5a6')}</p>
              <p className="text-[10px] text-gray-400">{c('students.fees.copy.fee-structure.paragraph.updated-2025-26-77984986')}</p>
            </div>
          </motion.div>

          {/* Installment Schedule */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6"
          >
            {/* KG - X Schedule */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:border-gold-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-maroon-900">{c('students.fees.copy.installment-schedule-k.heading.installment-schedule-501c42d9') + ' '}<span className="text-xs font-normal text-gray-500">{c('students.fees.copy.installment-schedule-k.text.kg-x-9ff5bd03')}</span></h3>
              </div>
              <div className="space-y-2">
                {installmentSchedule.map((item) => (
                  <div key={item.contentId} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <span className="font-semibold text-maroon-800 text-sm">{item.month}</span>
                    <span className="text-xs text-gray-600">{item.period}</span>
                    <span className="text-[10px] bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full font-medium">{item.classes}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                <span><span className="font-medium text-amber-800">{c('students.fees.copy.installment-schedule-k.text.late-fee-498464bb')}</span>{' ' + c('students.fees.copy.installment-schedule-k.text.100-on-all-late-payments-ecbece78')}</span>
              </div>
            </motion.div>

            {/* XI - XII Schedule */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:border-gold-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                <h3 className="text-sm font-bold text-maroon-900">{c('students.fees.copy.installment-schedule-x.heading.installment-schedule-501c42d9') + ' '}<span className="text-xs font-normal text-gray-500">{c('students.fees.copy.installment-schedule-x.text.xi-xii-93ca1fbc')}</span></h3>
              </div>
              <div className="space-y-2">
                {seniorInstallmentSchedule.map((item) => (
                  <div key={item.contentId} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-purple-50/50 transition-colors">
                    <span className="font-semibold text-maroon-800 text-sm">{item.month}</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">{item.classes}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-700 flex items-start gap-2">
                  <Sparkles size={14} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-purple-800">{c('students.fees.copy.installment-schedule-x.text.note-1150f054')}</span>{' ' + c('students.fees.copy.installment-schedule-x.text.science-stream-annual-fees-af0336cb')}</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Important Rules */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-gold-100">
                <Shield size={16} className="text-gold-600" />
              </div>
              <h3 className="text-sm font-bold text-maroon-900">{c('students.fees.copy.important-fee-rules-gu.heading.important-fee-rules-guidel-c45d8cf7')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {importantRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-xs text-gray-700 leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Information Cards */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 group"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2.5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Building size={20} className="text-blue-600" />
                </div>
              </div>
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{c('students.fees.copy.bank.heading.bank-676c471b')}</h4>
              <p className="text-sm font-medium text-gray-700 mt-1">{c('students.fees.copy.bank.paragraph.hdfc-bank-ltd-d8b55275')}</p>
              <p className="text-xs text-gray-500">{c('students.fees.copy.bank.paragraph.maligaon-branch-guwahati-fcedfea2')}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-300 group"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <CreditCard size={20} className="text-green-600" />
                </div>
              </div>
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{c('students.fees.copy.payment-mode.heading.payment-mode-f1441761')}</h4>
              <p className="text-sm font-medium text-gray-700 mt-1">{c('students.fees.copy.payment-mode.paragraph.bank-deposit-bf349e3e')}</p>
              <p className="text-xs text-gray-500">{c('students.fees.copy.payment-mode.paragraph.on-behalf-of-the-instituti-f476e2da')}</p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-red-300 group"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2.5 rounded-full bg-red-100 group-hover:bg-red-200 transition-colors">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
              </div>
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{c('students.fees.copy.late-fee.heading.late-fee-3792cbcc')}</h4>
              <p className="text-sm font-medium text-gray-700 mt-1">{c('students.fees.copy.late-fee.paragraph.100-26b6c5bc')}</p>
              <p className="text-xs text-gray-500">{c('students.fees.copy.late-fee.paragraph.levied-on-all-late-payment-50fa6a38')}</p>
            </motion.div>
          </motion.div>

          {/* Footer Notes */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="mt-6 text-center space-y-2"
          >
            <div className="inline-block bg-gradient-to-r from-gray-50 to-gold-50/30 rounded-full px-5 py-2 border border-gray-200">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Info size={14} className="text-gold-500" />
                <span>{c('students.fees.copy.late-fee.text.fees-are-subject-to-revisi-208d95ab')}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <Phone size={12} />
              <span>{c('students.fees.copy.late-fee.text.for-any-fee-related-querie-16114dee')}</span>
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

export default Fees
