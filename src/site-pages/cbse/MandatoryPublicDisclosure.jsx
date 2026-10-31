import { useSiteContent } from '@/content/SiteContentProvider.jsx'
import { useDisclosureDocuments } from '@/content/useDisclosureDocuments.js'
import { fixedDisclosureDocuments } from '@/content/disclosureDocuments.js'
import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { 
  ClipboardList, 
  FileText, 
  ExternalLink, 
  Download, 
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  Award,
  CheckCircle,
  FileCheck,
  ArrowRight,
  Sparkles,
  Wallet,
  Calendar,
  Clock,
  Info
} from 'lucide-react'

const MandatoryPublicDisclosure = () => {
  const c = useSiteContent()
  const disclosureDocuments = useDisclosureDocuments()
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [showFeeStructure, setShowFeeStructure] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    documents: true,
    result: false,
    staff: false,
    infrastructure: false
  })
  const [pdfError, setPdfError] = useState(false)

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Fee Structure Data - Exact match from image
  const feeData = [
    { contentId: "KG",
      class: c('cbse.disclosure.feeData.kg-88ed3209.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.kg-88ed3209.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.kg-88ed3209.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.kg-88ed3209.installmentPeriod')
    },
    { contentId: "I – III",
      class: c('cbse.disclosure.feeData.i-iii-2cbad711.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.i-iii-2cbad711.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.i-iii-2cbad711.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.i-iii-2cbad711.installmentPeriod')
    },
    { contentId: "IV – V",
      class: c('cbse.disclosure.feeData.iv-v-85edf8c5.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.iv-v-85edf8c5.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.iv-v-85edf8c5.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.iv-v-85edf8c5.installmentPeriod')
    },
    { contentId: "VI – VIII",
      class: c('cbse.disclosure.feeData.vi-viii-25461a9d.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.vi-viii-25461a9d.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.vi-viii-25461a9d.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.vi-viii-25461a9d.installmentPeriod')
    },
    { contentId: "IX – X",
      class: c('cbse.disclosure.feeData.ix-x-fa5a0ae1.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.ix-x-fa5a0ae1.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.ix-x-fa5a0ae1.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.ix-x-fa5a0ae1.installmentPeriod')
    },
    { contentId: "XI – XII (Hum/Com)",
      class: c('cbse.disclosure.feeData.xi-xii-hum-com-c8567a1a.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.xi-xii-hum-com-c8567a1a.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.xi-xii-hum-com-c8567a1a.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.xi-xii-hum-com-c8567a1a.installmentPeriod')
    },
    { contentId: "XI – XII (Science)",
      class: c('cbse.disclosure.feeData.xi-xii-science-30417878.class'),
      annualPerInstallment: c('cbse.disclosure.feeData.xi-xii-science-30417878.annualPerInstallment'),
      tuitionPerInstallment: c('cbse.disclosure.feeData.xi-xii-science-30417878.tuitionPerInstallment'),
      installmentPeriod: c('cbse.disclosure.feeData.xi-xii-science-30417878.installmentPeriod')
    }
  ]

  // PDF data with actual file paths
  const pdfData = Object.fromEntries([...fixedDisclosureDocuments.map(document => [document.key, { key: document.key, name: document.name, url: disclosureDocuments.fixed[document.key]?.url || document.url, description: c(`cbse.disclosure.pdf.${document.key}.description`) }]), ...disclosureDocuments.additional.map(document => [document.key, { ...document, description: '' }])])

  const shownPdf = selectedPdf?.key ? (pdfData[selectedPdf.key] || { ...selectedPdf, url: null }) : selectedPdf

  useEffect(() => {
    if (!shownPdf?.url) return
    const controller = new AbortController()
    setPdfError(false)
    fetch(shownPdf.url, { method: 'HEAD', cache: 'no-store', signal: controller.signal })
      .then(response => { if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) setPdfError(true) })
      .catch(error => { if (error.name !== 'AbortError') setPdfError(true) })
    return () => controller.abort()
  }, [shownPdf?.url])

  const generalInfo = [
    { label: 'Name of the School', value: c('cbse.disclosure.generalInfo.name-of-the-school-edc46f3d.value') },
    { label: 'Affiliation No.', value: c('cbse.disclosure.generalInfo.affiliation-no-ace32fb2.value') },
    { label: 'School Code', value: c('cbse.disclosure.generalInfo.school-code-9ac482e0.value') },
    { label: 'Complete Address with Pin Code', value: c('cbse.disclosure.generalInfo.complete-address-with-pin-code-4a1d3869.value') },
    { label: 'Principal Name', value: c('cbse.disclosure.generalInfo.principal-name-6da55b79.value') },
    { label: 'Principal Qualification', value: c('cbse.disclosure.generalInfo.principal-qualification-a66a2a7f.value') },
    { label: 'School Email ID', value: c('cbse.disclosure.generalInfo.school-email-id-c472d2ad.value') },
    { label: 'Contact Details (Landline/Mobile)', value: c('cbse.disclosure.generalInfo.contact-details-landline-mobile-131c7776.value') }
  ]

  const documentsInfo = [
    { label: 'Copies of Affiliation/Upgradation Letter and Recent Extension of Affiliation', key: 'affiliation', icon: Shield },
    { label: 'Copies of Societies/Trust/Company Registration/Renewal Certificate', key: 'society', icon: Building2 },
    { label: 'Copy of No Objection Certificate (NOC) issued by State Govt./UT', key: 'noc', icon: CheckCircle },
    { label: 'Copies of Recognition Certificate under RTE Act, 2009 and its Renewal', key: 'rte', icon: Award },
    { label: 'Copy of Valid Building Safety Certificate as per National Building Code', key: 'building', icon: Building2 },
    { label: 'Copy of Valid Fire Safety Certificate issued by Competent Authority', key: 'fire', icon: Shield },
    { label: 'Copy of DEO Certificate submitted for Affiliation/Upgradation/Extension', key: 'deo', icon: FileCheck },
    { label: 'Copies of Valid Water, Health and Sanitation Certificates', key: 'water', icon: CheckCircle }
  ]

  const resultInfo = [
    { label: 'Fee Structure of the School', key: 'fee', icon: Wallet },
    { label: 'Annual Academic Calendar', key: 'academic', icon: BookOpen },
    { label: 'List of School Management Committee (SMC)', key: 'smc', icon: Users },
    { label: 'List of Parents Teachers Association (PTA) Members', key: 'pta', icon: Users },
    { label: 'Last Three-Year Result of the Board Examination', key: 'results', icon: Award }
  ]

  const staffInfo = [
    { label: 'Principal', value: c('cbse.disclosure.staffInfo.principal-afc19f17.value') },
    { label: 'Total No. of Teachers', value: c('cbse.disclosure.staffInfo.total-no-of-teachers-570421ae.value') },
    { label: 'PGT', value: c('cbse.disclosure.staffInfo.pgt-b38bc0c1.value') },
    { label: 'TGT', value: c('cbse.disclosure.staffInfo.tgt-655caf7a.value') },
    { label: 'PRT', value: c('cbse.disclosure.staffInfo.prt-e4fd7627.value') },
    { label: 'Teachers Section Ratio', value: c('cbse.disclosure.staffInfo.teachers-section-ratio-db85e052.value') },
    { label: 'Special Educator', value: c('cbse.disclosure.staffInfo.special-educator-63512f39.value') },
    { label: 'Counsellor and Wellness Teacher', value: c('cbse.disclosure.staffInfo.counsellor-and-wellness-teacher-e968d490.value') }
  ]

  const infrastructureInfo = [
    { label: 'Total Campus Area of the School (in Sq Mtr)', value: c('cbse.disclosure.infrastructureInfo.total-campus-area-of-the-school-in-sq-mtr-f92c477c.value') },
    { label: 'No. and Size of the Class Rooms (in Sq Mtr)', value: c('cbse.disclosure.infrastructureInfo.no-and-size-of-the-class-rooms-in-sq-mtr-836e96f3.value') },
    { label: 'No. and Size of Laboratories including Computer Labs (in Sq Mtr)', value: c('cbse.disclosure.infrastructureInfo.no-and-size-of-laboratories-including-compute-a34dd9d4.value') },
    { label: 'Internet Facility', value: c('cbse.disclosure.infrastructureInfo.internet-facility-6c67ecd2.value') },
    { label: 'No. of Girls Toilets', value: c('cbse.disclosure.infrastructureInfo.no-of-girls-toilets-228b5391.value') },
    { label: 'No. of Boys Toilets', value: c('cbse.disclosure.infrastructureInfo.no-of-boys-toilets-200c7567.value') },
    { label: 'YouTube Video of School Inspection', value: c('cbse.disclosure.infrastructureInfo.youtube-video-of-school-inspection-8bbb3ac1.value') }
  ]

  const classXResult = [
    { contentId: "2025", year: c('cbse.disclosure.classXResult.2025-b2b2f104.year'), registered: c('cbse.disclosure.classXResult.2025-b2b2f104.registered'), passed: c('cbse.disclosure.classXResult.2025-b2b2f104.passed'), percentage: c('cbse.disclosure.classXResult.2025-b2b2f104.percentage'), remarks: c('cbse.disclosure.classXResult.2025-b2b2f104.remarks') }
  ]

  const classXIIResult = [
    { contentId: "2025", year: c('cbse.disclosure.classXIIResult.2025-b2b2f104.year'), registered: c('cbse.disclosure.classXIIResult.2025-b2b2f104.registered'), passed: c('cbse.disclosure.classXIIResult.2025-b2b2f104.passed'), percentage: c('cbse.disclosure.classXIIResult.2025-b2b2f104.percentage'), remarks: c('cbse.disclosure.classXIIResult.2025-b2b2f104.remarks') }
  ]

  const teacherDetails = [
    { contentId: "SR. PINKY TOPNO", name: c('cbse.disclosure.teacherDetails.sr-pinky-topno-0e85b6f2.name'), designation: c('cbse.disclosure.teacherDetails.sr-pinky-topno-0e85b6f2.designation'), designationStyle: "VICE-PRINCIPAL", qualification: c('cbse.disclosure.teacherDetails.sr-pinky-topno-0e85b6f2.qualification') },
    { contentId: "SR. MARTHA SOIGI", name: c('cbse.disclosure.teacherDetails.sr-martha-soigi-80c2bebc.name'), designation: c('cbse.disclosure.teacherDetails.sr-martha-soigi-80c2bebc.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.sr-martha-soigi-80c2bebc.qualification') },
    { contentId: "MRIGAKHEE PANDIT", name: c('cbse.disclosure.teacherDetails.mrigakhee-pandit-a35c2e37.name'), designation: c('cbse.disclosure.teacherDetails.mrigakhee-pandit-a35c2e37.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mrigakhee-pandit-a35c2e37.qualification') },
    { contentId: "SR. BISHANTIS MYRTHONG", name: c('cbse.disclosure.teacherDetails.sr-bishantis-myrthong-bedcf60f.name'), designation: c('cbse.disclosure.teacherDetails.sr-bishantis-myrthong-bedcf60f.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.sr-bishantis-myrthong-bedcf60f.qualification') },
    { contentId: "MRS. LIZA PAUL", name: c('cbse.disclosure.teacherDetails.mrs-liza-paul-8ce2161b.name'), designation: c('cbse.disclosure.teacherDetails.mrs-liza-paul-8ce2161b.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mrs-liza-paul-8ce2161b.qualification') },
    { contentId: "MRS. MOUSUMI DAS", name: c('cbse.disclosure.teacherDetails.mrs-mousumi-das-df4fd2fe.name'), designation: c('cbse.disclosure.teacherDetails.mrs-mousumi-das-df4fd2fe.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mrs-mousumi-das-df4fd2fe.qualification') },
    { contentId: "MISS SHYAMALI CHANDA", name: c('cbse.disclosure.teacherDetails.miss-shyamali-chanda-a9b35fe4.name'), designation: c('cbse.disclosure.teacherDetails.miss-shyamali-chanda-a9b35fe4.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.miss-shyamali-chanda-a9b35fe4.qualification') },
    { contentId: "TRUPTI DAS", name: c('cbse.disclosure.teacherDetails.trupti-das-5308f350.name'), designation: c('cbse.disclosure.teacherDetails.trupti-das-5308f350.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.trupti-das-5308f350.qualification') },
    { contentId: "MRS. HEMA TIWARI", name: c('cbse.disclosure.teacherDetails.mrs-hema-tiwari-d670bf1e.name'), designation: c('cbse.disclosure.teacherDetails.mrs-hema-tiwari-d670bf1e.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mrs-hema-tiwari-d670bf1e.qualification') },
    { contentId: "MR. INDRAJIT KALITA", name: c('cbse.disclosure.teacherDetails.mr-indrajit-kalita-02d55d35.name'), designation: c('cbse.disclosure.teacherDetails.mr-indrajit-kalita-02d55d35.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mr-indrajit-kalita-02d55d35.qualification') },
    { contentId: "MRS. DIPTI DEKA", name: c('cbse.disclosure.teacherDetails.mrs-dipti-deka-ca940eb6.name'), designation: c('cbse.disclosure.teacherDetails.mrs-dipti-deka-ca940eb6.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.mrs-dipti-deka-ca940eb6.qualification') },
    { contentId: "MRS. ANJANA MITRA", name: c('cbse.disclosure.teacherDetails.mrs-anjana-mitra-1654ac6f.name'), designation: c('cbse.disclosure.teacherDetails.mrs-anjana-mitra-1654ac6f.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-anjana-mitra-1654ac6f.qualification') },
    { contentId: "MRS. MINU MARTHA PANNA", name: c('cbse.disclosure.teacherDetails.mrs-minu-martha-panna-9aff041f.name'), designation: c('cbse.disclosure.teacherDetails.mrs-minu-martha-panna-9aff041f.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-minu-martha-panna-9aff041f.qualification') },
    { contentId: "MRS. ZEENAT ZAMAN", name: c('cbse.disclosure.teacherDetails.mrs-zeenat-zaman-a4a2d096.name'), designation: c('cbse.disclosure.teacherDetails.mrs-zeenat-zaman-a4a2d096.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-zeenat-zaman-a4a2d096.qualification') },
    { contentId: "MRS. BINFFA MAJUMDAR", name: c('cbse.disclosure.teacherDetails.mrs-binffa-majumdar-a29127cc.name'), designation: c('cbse.disclosure.teacherDetails.mrs-binffa-majumdar-a29127cc.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-binffa-majumdar-a29127cc.qualification') },
    { contentId: "MRS. ANURADHA KALITA", name: c('cbse.disclosure.teacherDetails.mrs-anuradha-kalita-631174e7.name'), designation: c('cbse.disclosure.teacherDetails.mrs-anuradha-kalita-631174e7.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-anuradha-kalita-631174e7.qualification') },
    { contentId: "MRS. SUVARTHA VANI DEKA", name: c('cbse.disclosure.teacherDetails.mrs-suvartha-vani-deka-17fe883b.name'), designation: c('cbse.disclosure.teacherDetails.mrs-suvartha-vani-deka-17fe883b.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-suvartha-vani-deka-17fe883b.qualification') },
    { contentId: "MRS. AJANTA B. CHOWDHURY", name: c('cbse.disclosure.teacherDetails.mrs-ajanta-b-chowdhury-516f453c.name'), designation: c('cbse.disclosure.teacherDetails.mrs-ajanta-b-chowdhury-516f453c.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-ajanta-b-chowdhury-516f453c.qualification') },
    { contentId: "BARSHA BUJAR BARUAH", name: c('cbse.disclosure.teacherDetails.barsha-bujar-baruah-c14a63f9.name'), designation: c('cbse.disclosure.teacherDetails.barsha-bujar-baruah-c14a63f9.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.barsha-bujar-baruah-c14a63f9.qualification') },
    { contentId: "MS. ROSELINE ANTHONY", name: c('cbse.disclosure.teacherDetails.ms-roseline-anthony-1d5fde16.name'), designation: c('cbse.disclosure.teacherDetails.ms-roseline-anthony-1d5fde16.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.ms-roseline-anthony-1d5fde16.qualification') },
    { contentId: "MRS. RAJLAXMI ROY", name: c('cbse.disclosure.teacherDetails.mrs-rajlaxmi-roy-d5b1688b.name'), designation: c('cbse.disclosure.teacherDetails.mrs-rajlaxmi-roy-d5b1688b.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-rajlaxmi-roy-d5b1688b.qualification') },
    { contentId: "MRS. SHYAMOBI R. NARZARY", name: c('cbse.disclosure.teacherDetails.mrs-shyamobi-r-narzary-e5927ee3.name'), designation: c('cbse.disclosure.teacherDetails.mrs-shyamobi-r-narzary-e5927ee3.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-shyamobi-r-narzary-e5927ee3.qualification') },
    { contentId: "MRS. MADHUMITA DAS", name: c('cbse.disclosure.teacherDetails.mrs-madhumita-das-48abe866.name'), designation: c('cbse.disclosure.teacherDetails.mrs-madhumita-das-48abe866.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-madhumita-das-48abe866.qualification') },
    { contentId: "MRS. SHONALI ROY", name: c('cbse.disclosure.teacherDetails.mrs-shonali-roy-5ecf839c.name'), designation: c('cbse.disclosure.teacherDetails.mrs-shonali-roy-5ecf839c.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-shonali-roy-5ecf839c.qualification') },
    { contentId: "MRS. NILANJANA SAMANTA", name: c('cbse.disclosure.teacherDetails.mrs-nilanjana-samanta-a6cee9f9.name'), designation: c('cbse.disclosure.teacherDetails.mrs-nilanjana-samanta-a6cee9f9.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-nilanjana-samanta-a6cee9f9.qualification') },
    { contentId: "MRS. PAYEL DAS", name: c('cbse.disclosure.teacherDetails.mrs-payel-das-b69aca0a.name'), designation: c('cbse.disclosure.teacherDetails.mrs-payel-das-b69aca0a.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-payel-das-b69aca0a.qualification') },
    { contentId: "MRS. ANAMIKA DAS", name: c('cbse.disclosure.teacherDetails.mrs-anamika-das-a85e9add.name'), designation: c('cbse.disclosure.teacherDetails.mrs-anamika-das-a85e9add.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-anamika-das-a85e9add.qualification') },
    { contentId: "MRS. JAHNABI BAISHYA", name: c('cbse.disclosure.teacherDetails.mrs-jahnabi-baishya-664f5269.name'), designation: c('cbse.disclosure.teacherDetails.mrs-jahnabi-baishya-664f5269.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.mrs-jahnabi-baishya-664f5269.qualification') },
    { contentId: "MISS. JULI DEVI", name: c('cbse.disclosure.teacherDetails.miss-juli-devi-6909e027.name'), designation: c('cbse.disclosure.teacherDetails.miss-juli-devi-6909e027.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.miss-juli-devi-6909e027.qualification') },
    { contentId: "MR. THOMAS NARZARY", name: c('cbse.disclosure.teacherDetails.mr-thomas-narzary-8716417e.name'), designation: c('cbse.disclosure.teacherDetails.mr-thomas-narzary-8716417e.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mr-thomas-narzary-8716417e.qualification') },
    { contentId: "MRS. BORNALI SAIKIA", name: c('cbse.disclosure.teacherDetails.mrs-bornali-saikia-e11e5a3f.name'), designation: c('cbse.disclosure.teacherDetails.mrs-bornali-saikia-e11e5a3f.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mrs-bornali-saikia-e11e5a3f.qualification') },
    { contentId: "MISS ALAKANANDA PATHAK", name: c('cbse.disclosure.teacherDetails.miss-alakananda-pathak-f57482a9.name'), designation: c('cbse.disclosure.teacherDetails.miss-alakananda-pathak-f57482a9.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.miss-alakananda-pathak-f57482a9.qualification') },
    { contentId: "MRS. NANDITA SENGUPTA", name: c('cbse.disclosure.teacherDetails.mrs-nandita-sengupta-4fb014c5.name'), designation: c('cbse.disclosure.teacherDetails.mrs-nandita-sengupta-4fb014c5.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mrs-nandita-sengupta-4fb014c5.qualification') },
    { contentId: "MRS. DEEPANWITA BOSE SAHA", name: c('cbse.disclosure.teacherDetails.mrs-deepanwita-bose-saha-d4326a59.name'), designation: c('cbse.disclosure.teacherDetails.mrs-deepanwita-bose-saha-d4326a59.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mrs-deepanwita-bose-saha-d4326a59.qualification') },
    { contentId: "MISS BASABI CHANDA", name: c('cbse.disclosure.teacherDetails.miss-basabi-chanda-c64c7a31.name'), designation: c('cbse.disclosure.teacherDetails.miss-basabi-chanda-c64c7a31.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.miss-basabi-chanda-c64c7a31.qualification') },
    { contentId: "MISS KAKOLI PATWARI", name: c('cbse.disclosure.teacherDetails.miss-kakoli-patwari-701ad15a.name'), designation: c('cbse.disclosure.teacherDetails.miss-kakoli-patwari-701ad15a.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.miss-kakoli-patwari-701ad15a.qualification') },
    { contentId: "MISS TANAYA BARUAH", name: c('cbse.disclosure.teacherDetails.miss-tanaya-baruah-04e731fe.name'), designation: c('cbse.disclosure.teacherDetails.miss-tanaya-baruah-04e731fe.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.miss-tanaya-baruah-04e731fe.qualification') },
    { contentId: "MRS. NIZARA KALITA", name: c('cbse.disclosure.teacherDetails.mrs-nizara-kalita-2ab03e13.name'), designation: c('cbse.disclosure.teacherDetails.mrs-nizara-kalita-2ab03e13.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mrs-nizara-kalita-2ab03e13.qualification') },
    { contentId: "MRS. NABAMITA BORAL", name: c('cbse.disclosure.teacherDetails.mrs-nabamita-boral-44a59793.name'), designation: c('cbse.disclosure.teacherDetails.mrs-nabamita-boral-44a59793.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.mrs-nabamita-boral-44a59793.qualification') },
    { contentId: "MRS. NILOTPALA SARMA", name: c('cbse.disclosure.teacherDetails.mrs-nilotpala-sarma-95a4a68a.name'), designation: c('cbse.disclosure.teacherDetails.mrs-nilotpala-sarma-95a4a68a.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.mrs-nilotpala-sarma-95a4a68a.qualification') },
    { contentId: "MR. BHOGIRAM KUJUR", name: c('cbse.disclosure.teacherDetails.mr-bhogiram-kujur-b2caf7c2.name'), designation: c('cbse.disclosure.teacherDetails.mr-bhogiram-kujur-b2caf7c2.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.mr-bhogiram-kujur-b2caf7c2.qualification') },
    { contentId: "MRS. SUNITA CHETTRI", name: c('cbse.disclosure.teacherDetails.mrs-sunita-chettri-d145d643.name'), designation: c('cbse.disclosure.teacherDetails.mrs-sunita-chettri-d145d643.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.mrs-sunita-chettri-d145d643.qualification') },
    { contentId: "MR. STEPHEN BAGLARY", name: c('cbse.disclosure.teacherDetails.mr-stephen-baglary-c48f96f7.name'), designation: c('cbse.disclosure.teacherDetails.mr-stephen-baglary-c48f96f7.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.mr-stephen-baglary-c48f96f7.qualification') },
    { contentId: "MRS. FLORA MARAK", name: c('cbse.disclosure.teacherDetails.mrs-flora-marak-51d6b9a0.name'), designation: c('cbse.disclosure.teacherDetails.mrs-flora-marak-51d6b9a0.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.mrs-flora-marak-51d6b9a0.qualification') },
    { contentId: "JABA KUMARI DAS", name: c('cbse.disclosure.teacherDetails.jaba-kumari-das-c805a850.name'), designation: c('cbse.disclosure.teacherDetails.jaba-kumari-das-c805a850.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.jaba-kumari-das-c805a850.qualification') },
    { contentId: "VALSAMMA JOSEPH", name: c('cbse.disclosure.teacherDetails.valsamma-joseph-f0cdab7e.name'), designation: c('cbse.disclosure.teacherDetails.valsamma-joseph-f0cdab7e.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.valsamma-joseph-f0cdab7e.qualification') },
    { contentId: "CHAYANIKA SARMA", name: c('cbse.disclosure.teacherDetails.chayanika-sarma-65c56d0e.name'), designation: c('cbse.disclosure.teacherDetails.chayanika-sarma-65c56d0e.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.chayanika-sarma-65c56d0e.qualification') },
    { contentId: "DHRITI DAS", name: c('cbse.disclosure.teacherDetails.dhriti-das-e0094ddd.name'), designation: c('cbse.disclosure.teacherDetails.dhriti-das-e0094ddd.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.dhriti-das-e0094ddd.qualification') },
    { contentId: "PANCHALI DAS", name: c('cbse.disclosure.teacherDetails.panchali-das-837b348d.name'), designation: c('cbse.disclosure.teacherDetails.panchali-das-837b348d.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.panchali-das-837b348d.qualification') },
    { contentId: "SR. KUNNEL ELIZABETH", name: c('cbse.disclosure.teacherDetails.sr-kunnel-elizabeth-c9eb3c88.name'), designation: c('cbse.disclosure.teacherDetails.sr-kunnel-elizabeth-c9eb3c88.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.sr-kunnel-elizabeth-c9eb3c88.qualification') },
    { contentId: "DUITHOILIU PONGNINGMEI", name: c('cbse.disclosure.teacherDetails.duithoiliu-pongningmei-5394afbb.name'), designation: c('cbse.disclosure.teacherDetails.duithoiliu-pongningmei-5394afbb.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.duithoiliu-pongningmei-5394afbb.qualification') },
    { contentId: "SR. CAROLINE CHONGLOI", name: c('cbse.disclosure.teacherDetails.sr-caroline-chongloi-23f8b27f.name'), designation: c('cbse.disclosure.teacherDetails.sr-caroline-chongloi-23f8b27f.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.sr-caroline-chongloi-23f8b27f.qualification') },
    { contentId: "JAYEETA KAR", name: c('cbse.disclosure.teacherDetails.jayeeta-kar-05890aa3.name'), designation: c('cbse.disclosure.teacherDetails.jayeeta-kar-05890aa3.designation'), designationStyle: "TGT", qualification: c('cbse.disclosure.teacherDetails.jayeeta-kar-05890aa3.qualification') },
    { contentId: "PRANJITA KALITA", name: c('cbse.disclosure.teacherDetails.pranjita-kalita-0a73978e.name'), designation: c('cbse.disclosure.teacherDetails.pranjita-kalita-0a73978e.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.pranjita-kalita-0a73978e.qualification') },
    { contentId: "BIPANCHI CHOUDHURY", name: c('cbse.disclosure.teacherDetails.bipanchi-choudhury-b46f2bb1.name'), designation: c('cbse.disclosure.teacherDetails.bipanchi-choudhury-b46f2bb1.designation'), designationStyle: "WELLNESS TEACHER", qualification: c('cbse.disclosure.teacherDetails.bipanchi-choudhury-b46f2bb1.qualification') },
    { contentId: "SR. YAMCHINGNAO RIYAO GRACE PEMMILA", name: c('cbse.disclosure.teacherDetails.sr-yamchingnao-riyao-grace-pemmila-e7529adb.name'), designation: c('cbse.disclosure.teacherDetails.sr-yamchingnao-riyao-grace-pemmila-e7529adb.designation'), designationStyle: "PRINCIPAL", qualification: c('cbse.disclosure.teacherDetails.sr-yamchingnao-riyao-grace-pemmila-e7529adb.qualification') },
    { contentId: "RIMPI SARKAR", name: c('cbse.disclosure.teacherDetails.rimpi-sarkar-543714cb.name'), designation: c('cbse.disclosure.teacherDetails.rimpi-sarkar-543714cb.designation'), designationStyle: "PRT", qualification: c('cbse.disclosure.teacherDetails.rimpi-sarkar-543714cb.qualification') },
    { contentId: "KAMAL JYOTI NATH", name: c('cbse.disclosure.teacherDetails.kamal-jyoti-nath-db5cdbc7.name'), designation: c('cbse.disclosure.teacherDetails.kamal-jyoti-nath-db5cdbc7.designation'), designationStyle: "PET", qualification: c('cbse.disclosure.teacherDetails.kamal-jyoti-nath-db5cdbc7.qualification') },
    { contentId: "RAJA BISWAS", name: c('cbse.disclosure.teacherDetails.raja-biswas-cbd473e7.name'), designation: c('cbse.disclosure.teacherDetails.raja-biswas-cbd473e7.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.raja-biswas-cbd473e7.qualification') },
    { contentId: "SHAHNAZ RAHMAN", name: c('cbse.disclosure.teacherDetails.shahnaz-rahman-0bcbdb77.name'), designation: c('cbse.disclosure.teacherDetails.shahnaz-rahman-0bcbdb77.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.shahnaz-rahman-0bcbdb77.qualification') },
    { contentId: "BAISHALI PHOOKUN", name: c('cbse.disclosure.teacherDetails.baishali-phookun-b2e91311.name'), designation: c('cbse.disclosure.teacherDetails.baishali-phookun-b2e91311.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.baishali-phookun-b2e91311.qualification') },
    { contentId: "SR. LISSY MATHEW", name: c('cbse.disclosure.teacherDetails.sr-lissy-mathew-7ed6d8ff.name'), designation: c('cbse.disclosure.teacherDetails.sr-lissy-mathew-7ed6d8ff.designation'), designationStyle: "OTHER", qualification: c('cbse.disclosure.teacherDetails.sr-lissy-mathew-7ed6d8ff.qualification') },
    { contentId: "SANJANA RAAJ", name: c('cbse.disclosure.teacherDetails.sanjana-raaj-359d05a2.name'), designation: c('cbse.disclosure.teacherDetails.sanjana-raaj-359d05a2.designation'), designationStyle: "PGT", qualification: c('cbse.disclosure.teacherDetails.sanjana-raaj-359d05a2.qualification') },
    { contentId: "SR. THEKUVELU RHAKHO", name: c('cbse.disclosure.teacherDetails.sr-thekuvelu-rhakho-823b3a0a.name'), designation: c('cbse.disclosure.teacherDetails.sr-thekuvelu-rhakho-823b3a0a.designation'), designationStyle: "SPECIAL EDUCATOR", qualification: c('cbse.disclosure.teacherDetails.sr-thekuvelu-rhakho-823b3a0a.qualification') }
  ]

  const handleViewPdf = (key) => {
    setPdfError(false)
    console.log('View PDF clicked for key:', key)
    
    if (key === 'fee') {
      console.log('Opening Fee Structure modal')
      setShowFeeStructure(true)
      return
    }
    
    const pdf = pdfData[key]
    if (pdf && pdf.url) {
      console.log('Opening PDF:', pdf.name)
      setSelectedPdf(pdf)
    } else {
      console.log('PDF not found for key:', key)
    }
  }

  const handleClosePdf = () => {
    setSelectedPdf(null)
  }

  const handleCloseFeeStructure = () => {
    console.log('Closing Fee Structure modal')
    setShowFeeStructure(false)
  }

  const SectionHeader = ({ title, icon: Icon, section, children }) => {
    const isExpanded = expandedSections[section]
    return (
      <div className="mb-5">
        <div 
          className="bg-gradient-to-r from-maroon-800 to-maroon-700 px-5 py-3 rounded-t-xl flex items-center justify-between cursor-pointer hover:from-maroon-700 hover:to-maroon-600 transition-all duration-300 group"
          onClick={() => toggleSection(section)}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gold-500/20 rounded-lg group-hover:bg-gold-500/30 transition-colors">
              <Icon size={16} className="text-gold-300" />
            </div>
            <h2 className="text-white font-bold text-sm tracking-wide">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gold-300/50 font-medium hidden sm:inline">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronUp size={18} className="text-gold-300 group-hover:text-gold-200 transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-gold-300 group-hover:text-gold-200 transition-colors" />
            )}
          </div>
        </div>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-white to-[#FBF6EC] min-h-screen">
      
      {/* ========================================================== */}
      {/* COMPACT HERO HEADER */}
      {/* ========================================================== */}
      <div className="bg-maroon-900 text-white py-8 px-4">
        <div className="container-custom mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <ClipboardList size={20} className="text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{c('cbse.disclosure.copy.page-headings-and-explana.mandatory-public-disclosure-e77d6d18')}</h1>
              <p className="text-gold-300 text-sm mt-0.5">{c('cbse.disclosure.copy.page-headings-and-explana.appendix-ix-as-required-by-cbse-aff-8297a153')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================================== */}
      <section ref={ref} className="py-8 md:py-10">
        <div className="container-custom max-w-5xl mx-auto">
          
          {/* Important Note */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-xl p-4 mb-6 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">{c('cbse.disclosure.copy.page-headings-and-explana.note-1150f054')}</span>{' ' + c('cbse.disclosure.copy.page-headings-and-explana.the-school-needs-to-upload-the-self-38eceb93')}</p>
            </div>
          </motion.div>

          {/* A: GENERAL INFORMATION */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <SectionHeader title={c('cbse.disclosure.heading.a-general-information')} icon={ClipboardList} section="general">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">SL</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[42%] text-xs tracking-wider">INFORMATION</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[50%] text-xs tracking-wider">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generalInfo.map((item, index) => (
                      <tr key={item.additional ? item.key : item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                        <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                        <td className="px-4 py-2.5 font-medium text-maroon-900 border-b border-gray-100 text-xs">{item.label}</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100 text-xs">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionHeader>
          </motion.div>

          {/* B: DOCUMENTS AND INFORMATION */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <SectionHeader title={c('cbse.disclosure.heading.b-documents-and-information')} icon={FileText} section="documents">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">SL</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[62%] text-xs tracking-wider">DOCUMENTS/INFORMATION</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[30%] text-xs tracking-wider">LINKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...documentsInfo, ...disclosureDocuments.additional.map(document => ({ key: document.key, label: document.name, icon: FileText, additional: true }))].map((item, index) => {
                      const pdf = pdfData[item.key]
                      const Icon = item.icon
                      return (
                        <tr key={item.additional ? item.key : item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                          <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                          <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100 text-xs flex items-center gap-2">
                            <Icon size={14} className="text-maroon-600 flex-shrink-0" />
                            {item.label}
                          </td>
                          <td className="px-4 py-2.5 border-b border-gray-100">
                            {pdf ? (
                              <button
                                onClick={() => handleViewPdf(item.key)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 hover:bg-gold-100 text-gold-700 text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md group"
                              >
                                <Eye size={13} className="group-hover:scale-110 transition-transform" />{c('cbse.disclosure.copy.page-headings-and-explana.view-more-15435b31')}</button>
                            ) : (
                              <span className="text-gray-400 text-xs">Not Available</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </SectionHeader>
          </motion.div>

          {/* C: RESULT AND ACADEMICS */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <SectionHeader title={c('cbse.disclosure.heading.c-result-and-academics')} icon={BookOpen} section="result">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">SL</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[62%] text-xs tracking-wider">DOCUMENTS/INFORMATION</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[30%] text-xs tracking-wider">LINKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultInfo.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <tr key={item.additional ? item.key : item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                          <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                          <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100 text-xs flex items-center gap-2">
                            <Icon size={14} className="text-maroon-600 flex-shrink-0" />
                            {item.label}
                          </td>
                          <td className="px-4 py-2.5 border-b border-gray-100">
                            <button
                              onClick={() => handleViewPdf(item.key)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 hover:bg-gold-100 text-gold-700 text-xs font-medium rounded-lg transition-all duration-300 hover:shadow-md group"
                            >
                              <Eye size={13} className="group-hover:scale-110 transition-transform" />{c('cbse.disclosure.copy.page-headings-and-explana.view-more-15435b31.2')}</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </SectionHeader>
          </motion.div>

          {/* D: STAFF (TEACHING) */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <SectionHeader title={c('cbse.disclosure.heading.d-staff-teaching')} icon={Users} section="staff">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">SL</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[37%] text-xs tracking-wider">INFORMATION</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[55%] text-xs tracking-wider">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffInfo.map((item, index) => (
                      <tr key={item.additional ? item.key : item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                        <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                        <td className="px-4 py-2.5 font-medium text-maroon-900 border-b border-gray-100 text-xs">{item.label}</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100 text-xs">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionHeader>
          </motion.div>

          {/* E: SCHOOL INFRASTRUCTURE */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <SectionHeader title={c('cbse.disclosure.heading.e-school-infrastructure')} icon={Building2} section="infrastructure">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">SL</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[47%] text-xs tracking-wider">INFORMATION</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[45%] text-xs tracking-wider">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infrastructureInfo.map((item, index) => (
                      <tr key={item.additional ? item.key : item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                        <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                        <td className="px-4 py-2.5 font-medium text-maroon-900 border-b border-gray-100 text-xs">{item.label}</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100 text-xs">
                          {item.label === 'YouTube Video of School Inspection' ? (
                            <a href={item.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline transition-colors">{c('cbse.disclosure.copy.page-headings-and-explana.view-video-a384a35a') + ' '}<ExternalLink size={12} />
                            </a>
                          ) : (
                            item.value
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionHeader>
          </motion.div>

          {/* F: TEACHER DETAILS */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="mb-5"
          >
            <div className="bg-gradient-to-r from-maroon-800 to-maroon-700 px-5 py-3 rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-gold-500/20 rounded-lg">
                  <GraduationCap size={16} className="text-gold-300" />
                </div>
                <h2 className="text-white font-bold text-sm tracking-wide">{c('cbse.disclosure.copy.page-headings-and-explana.f-teacher-details-26d732c9')}</h2>
              </div>
            </div>
            <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0 overflow-hidden">
              <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gold-50 to-gold-100/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[8%] text-xs tracking-wider">No.</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[32%] text-xs tracking-wider">Name</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[30%] text-xs tracking-wider">Designation</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-maroon-800 w-[30%] text-xs tracking-wider">Qualification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherDetails.map((teacher, index) => (
                      <tr key={teacher.contentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-100/50 transition-colors'}>
                        <td className="px-4 py-2 text-gray-500 text-xs border-b border-gray-100">{index + 1}</td>
                        <td className="px-4 py-2 text-gray-700 border-b border-gray-100 text-xs font-medium">{teacher.name}</td>
                        <td className="px-4 py-2 text-gray-700 border-b border-gray-100 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                            teacher.designationStyle === 'PRINCIPAL' ? 'bg-maroon-100 text-maroon-800' :
                            teacher.designationStyle === 'VICE-PRINCIPAL' ? 'bg-purple-100 text-purple-800' :
                            teacher.designationStyle === 'PGT' ? 'bg-blue-100 text-blue-800' :
                            teacher.designationStyle === 'TGT' ? 'bg-green-100 text-green-800' :
                            teacher.designationStyle === 'PRT' ? 'bg-amber-100 text-amber-800' :
                            teacher.designationStyle === 'SPECIAL EDUCATOR' ? 'bg-rose-100 text-rose-800' :
                            teacher.designationStyle === 'WELLNESS TEACHER' ? 'bg-teal-100 text-teal-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {teacher.designation}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-700 border-b border-gray-100 text-xs">{teacher.qualification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">{c('cbse.disclosure.copy.page-headings-and-explana.total-teachers-204e02c7') + ' '}<span className="font-semibold text-maroon-800">{teacherDetails.length}</span></p>
                <p className="text-[9px] text-gray-400">{c('cbse.disclosure.copy.page-headings-and-explana.last-updated-2025-80c80181')}</p>
              </div>
            </div>
          </motion.div>

          {/* RESULTS SECTION - Class X & XII */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <div className="bg-gradient-to-r from-maroon-800 to-maroon-700 px-5 py-3 rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-gold-500/20 rounded-lg">
                  <Award size={16} className="text-gold-300" />
                </div>
                <h2 className="text-white font-bold text-sm tracking-wide">{c('cbse.disclosure.copy.page-headings-and-explana.board-examination-results-6a9ddf32')}</h2>
              </div>
            </div>
            <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0 overflow-hidden p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Class X Result */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{c('cbse.disclosure.copy.page-headings-and-explana.x-4b68ab38')}</div>
                    <h3 className="text-sm font-bold text-maroon-900">{c('cbse.disclosure.copy.page-headings-and-explana.class-x-result-f1ecf86c')}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-maroon-800 text-white">
                        <tr>
                          <th className="px-2.5 py-1.5 text-left font-semibold">SL</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">YEAR</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">REG</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">PASS</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">%</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classXResult.map((row, index) => (
                          <tr key={row.contentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className="px-2.5 py-1.5 text-gray-500 border-b">{index + 1}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b font-medium">{row.year}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b">{row.registered}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b">{row.passed}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b font-bold text-green-600">{row.percentage}%</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b text-xs">{row.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Class XII Result */}
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">{c('cbse.disclosure.copy.page-headings-and-explana.xii-89e979f6')}</div>
                    <h3 className="text-sm font-bold text-maroon-900">{c('cbse.disclosure.copy.page-headings-and-explana.class-xii-result-5295d6c8')}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-maroon-800 text-white">
                        <tr>
                          <th className="px-2.5 py-1.5 text-left font-semibold">SL</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">YEAR</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">REG</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">PASS</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">%</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold">REMARKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classXIIResult.map((row, index) => (
                          <tr key={row.contentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className="px-2.5 py-1.5 text-gray-500 border-b">{index + 1}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b font-medium">{row.year}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b">{row.registered}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b">{row.passed}</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b font-bold text-green-600">{row.percentage}%</td>
                            <td className="px-2.5 py-1.5 text-gray-700 border-b text-xs">{row.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Counsellor Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            className="mt-5"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Sparkles size={16} className="text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-800">{c('cbse.disclosure.copy.page-headings-and-explana.students-of-counsellor-and-wellness-d4c3e39c')}</span>
                  </p>
                  <p className="text-sm text-purple-700 font-medium mt-0.5">{c('cbse.disclosure.copy.page-headings-and-explana.ms-bipanchi-choudhury-706e4bd4')}<span className="text-gray-600 font-normal">{' ' + c('cbse.disclosure.copy.page-headings-and-explana.msc-psychology-specialisation-in-co-7bff23fe')}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-maroon-50 to-gold-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-maroon-900 text-base">{shownPdf.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{shownPdf.description}</p>
              </div>
              <button onClick={handleClosePdf} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden bg-gray-50">
              {pdfError || !shownPdf.url ? <p role="alert" className="text-sm text-gray-700">This PDF could not be previewed. Close this window, refresh the page and try again, or use Open in New Tab.</p> : <iframe src={shownPdf.url} className="w-full h-full rounded-lg border border-gray-200 shadow-inner" title={shownPdf.name} onError={() => setPdfError(true)} />}
            </div>
            <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-2xl">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <FileCheck size={14} className="text-green-600" />{c('cbse.disclosure.copy.pdf-preview-captions.pdf-document-0cbeb39b')}</span>
              <div className="flex gap-3">
                <a href={shownPdf.url || undefined} aria-disabled={!shownPdf.url || undefined} download className="px-4 py-2 bg-maroon-800 text-white rounded-lg text-sm font-medium hover:bg-maroon-700 transition-all duration-300 flex items-center gap-2 hover:shadow-lg">
                  <Download size={15} />{' ' + c('cbse.disclosure.copy.pdf-preview-captions.download-d6eafe82')}</a>
                <a href={shownPdf.url || undefined} aria-disabled={!shownPdf.url || undefined} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gold-600 text-white rounded-lg text-sm font-medium hover:bg-gold-700 transition-all duration-300 flex items-center gap-2 hover:shadow-lg">
                  <ExternalLink size={15} />{' ' + c('cbse.disclosure.copy.pdf-preview-captions.open-in-new-tab-35e74c3a')}</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================== */}
      {/* FEE STRUCTURE MODAL */}
      {/* ========================================================== */}
      {showFeeStructure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-maroon-800 to-maroon-700 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Wallet size={20} className="text-gold-400" />{c('cbse.disclosure.copy.fee-structure-labels-and-.fee-structure-2026-27-38df3d32')}</h3>
                <p className="text-xs text-gold-300/80 mt-0.5">{c('cbse.disclosure.copy.fee-structure-labels-and-.st-mary-s-sr-secondary-school-malig-25fd5643')}</p>
              </div>
              <button
                onClick={handleCloseFeeStructure}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Fee Table - Exact match from image */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-maroon-900 to-maroon-700 text-white">
                        <th className="px-4 py-3.5 text-left font-semibold text-sm">{c('cbse.disclosure.copy.fee-structure-labels-and-.class-bb6a385e')}</th>
                        <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('cbse.disclosure.copy.fee-structure-labels-and-.annual-fees-b25ed05c')}<br/><span className="text-xs font-normal text-gold-300">{c('cbse.disclosure.copy.fee-structure-labels-and-.per-installment-bf8712c5')}</span></th>
                        <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('cbse.disclosure.copy.fee-structure-labels-and-.tuition-fees-33206568')}<br/><span className="text-xs font-normal text-gold-300">{c('cbse.disclosure.copy.fee-structure-labels-and-.per-installment-bf8712c5.2')}</span></th>
                        <th className="px-4 py-3.5 text-center font-semibold text-sm">{c('cbse.disclosure.copy.fee-structure-labels-and-.installment-03777de7')}<br/><span className="text-xs font-normal text-gold-300">{c('cbse.disclosure.copy.fee-structure-labels-and-.period-6e795d4d')}</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeData.map((row, index) => (
                        <tr key={row.contentId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-maroon-50/30 transition-colors'}>
                          <td className="px-4 py-3.5 font-semibold text-maroon-900 border-b border-gray-100 text-sm">{row.class}</td>
                          <td className="px-4 py-3.5 text-center text-gray-700 border-b border-gray-100 text-sm font-medium">{row.annualPerInstallment}</td>
                          <td className="px-4 py-3.5 text-center text-gray-700 border-b border-gray-100 text-sm font-medium">{row.tuitionPerInstallment}</td>
                          <td className="px-4 py-3.5 text-center border-b border-gray-100 text-sm">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-medium">
                              <Clock size={12} />
                              {row.installmentPeriod}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Important Notice */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 p-3 m-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">{c('cbse.disclosure.copy.fee-structure-labels-and-.note-1150f054')}</span>{' ' + c('cbse.disclosure.copy.fee-structure-labels-and-.fees-are-received-by-hdfc-bank-ltd--76340e41')}</p>
                  </div>
                </div>

                {/* Installment Schedules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-xs font-bold text-maroon-900 mb-2 flex items-center gap-2">
                      <Calendar size={14} className="text-blue-600" />{c('cbse.disclosure.copy.fee-structure-labels-and-.installment-schedule-kg-x-227c9fa0')}</h4>
                    <div className="space-y-1.5">
                      {[{ contentId: "April", text: c('cbse.disclosure.feeMonths.april') }, { contentId: "July", text: c('cbse.disclosure.feeMonths.july') }, { contentId: "October", text: c('cbse.disclosure.feeMonths.october') }, { contentId: "January", text: c('cbse.disclosure.feeMonths.january') }].map((month) => (
                        <div key={month.contentId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                          <span className="font-semibold text-maroon-800">{month.text}</span>
                          <span className="text-gray-600">{c('cbse.disclosure.copy.fee-structure-labels-and-.10th-20th-e1c6369d')}</span>
                          <span className="text-[10px] bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full">{c('cbse.disclosure.copy.fee-structure-labels-and-.kg-x-94dba5bb')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-2">
                      <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                      <span><span className="font-medium text-amber-800">{c('cbse.disclosure.copy.fee-structure-labels-and-.late-fee-498464bb')}</span>{' ' + c('cbse.disclosure.copy.fee-structure-labels-and-.100-on-all-late-payments-ecbece78')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-maroon-900 mb-2 flex items-center gap-2">
                      <Calendar size={14} className="text-purple-600" />{c('cbse.disclosure.copy.fee-structure-labels-and-.installment-schedule-xi-xii-e57c2b96')}</h4>
                    <div className="space-y-1.5">
                      {[{ contentId: "June", text: c('cbse.disclosure.feeMonths.june') }, { contentId: "September", text: c('cbse.disclosure.feeMonths.september') }, { contentId: "December", text: c('cbse.disclosure.feeMonths.december') }].map((month) => (
                        <div key={month.contentId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                          <span className="font-semibold text-maroon-800">{month.text}</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">{c('cbse.disclosure.copy.fee-structure-labels-and-.xi-xii-616d68a7')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <p className="text-[10px] text-gray-700 flex items-start gap-1.5">
                        <Sparkles size={12} className="text-purple-600 flex-shrink-0 mt-0.5" />
                        <span><span className="font-semibold text-purple-800">{c('cbse.disclosure.copy.fee-structure-labels-and-.note-1150f054.2')}</span>{' ' + c('cbse.disclosure.copy.fee-structure-labels-and-.science-stream-annual-fees-are-high-3626df23')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                    <Info size={12} className="text-gold-500" />{c('cbse.disclosure.copy.fee-structure-labels-and-.fees-cover-twelve-calendar-months-b7a2e5a6')}</p>
                  <p className="text-[10px] text-gray-400">{c('cbse.disclosure.copy.fee-structure-labels-and-.updated-2025-26-77984986')}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseFeeStructure}
                className="px-5 py-2 bg-maroon-800 text-white rounded-lg text-sm font-medium hover:bg-maroon-700 transition-all duration-300 hover:shadow-lg"
              >{c('cbse.disclosure.copy.fee-structure-labels-and-.close-7d9eb7ac')}</button>
            </div>
          </motion.div>
        </div>
      )}

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

export default MandatoryPublicDisclosure
