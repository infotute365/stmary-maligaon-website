// Trusted identities, names and original assets. These are never editable CMS fields.
export const fixedDisclosureDocuments = Object.freeze([
  { key: 'affiliation', name: 'Affiliation/Upgradation Letter', url: '/wp-content/uploads/2026/05/Affiliation_Certificate.pdf', rowLabel: 'Copies of Affiliation/Upgradation Letter and Recent Extension of Affiliation' },
  { key: 'society', name: 'Society/Trust Registration', url: '/wp-content/uploads/2026/05/Society_Certificate.pdf', rowLabel: 'Copies of Societies/Trust/Company Registration/Renewal Certificate' },
  { key: 'noc', name: 'NOC Certificate', url: '/wp-content/uploads/2026/05/NOC.pdf', rowLabel: 'Copy of No Objection Certificate (NOC) issued by State Govt./UT' },
  { key: 'rte', name: 'RTE Recognition Certificate', url: '/wp-content/uploads/2026/05/Recognition_Certificate_10.pdf', rowLabel: 'Copies of Recognition Certificate under RTE Act, 2009 and its Renewal' },
  { key: 'building', name: 'Building Safety Certificate', url: '/wp-content/uploads/2026/05/Building_Safety_Certificate.pdf', rowLabel: 'Copy of Valid Building Safety Certificate as per National Building Code' },
  { key: 'fire', name: 'Fire Safety Certificate', url: '/wp-content/uploads/2026/05/Fire_Safety_Certificate.pdf', rowLabel: 'Copy of Valid Fire Safety Certificate issued by Competent Authority' },
  { key: 'deo', name: 'DEO Certificate', url: '/wp-content/uploads/2026/05/Self_Certification.pdf', rowLabel: 'Copy of DEO Certificate submitted for Affiliation/Upgradation/Extension' },
  { key: 'water', name: 'Water, Health & Sanitation Certificate', url: '/wp-content/uploads/2026/05/Health_Hygiene_Certificate.pdf', rowLabel: 'Copies of Valid Water, Health and Sanitation Certificates' },
  { key: 'academic', name: 'Annual Academic Calendar', url: '/wp-content/uploads/2026/05/Academic_Calendar_2025-26.pdf', rowLabel: 'Annual Academic Calendar' },
  { key: 'smc', name: 'List of School Management Committee', url: '/wp-content/uploads/2026/05/Managing-Commitee.pdf', rowLabel: 'List of School Management Committee (SMC)' },
  { key: 'pta', name: 'List of Parents Teachers Association', url: '/wp-content/uploads/2026/05/Parent-Teacher-Association.pdf', rowLabel: 'List of Parents Teachers Association (PTA) Members' },
  { key: 'results', name: 'Last Three-Year Board Results', url: '/wp-content/uploads/2026/05/Board_Result.pdf', rowLabel: 'Last Three-Year Result of the Board Examination' },
].map(document => Object.freeze(document)))

export const fixedDisclosureByKey = Object.freeze(Object.fromEntries(fixedDisclosureDocuments.map(document => [document.key, document])))
export const customDisclosureKey = /^custom-[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/
export const disclosureFilePath = /^disclosures\/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.pdf$/
export const disclosureUrl = path => disclosureFilePath.test(path) ? `/api/files/${path}` : null
export const disclosureOriginals = () => ({ fixed: Object.fromEntries(fixedDisclosureDocuments.map(document => [document.key, { key: document.key, name: document.name, url: document.url }])), additional: [] })

export function normalizeDocumentTitle(title) {
  return title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
}
export function documentTitleError(title) {
  if (typeof title !== 'string' || title.trim().length < 3 || title.length > 160 || /[\u0000-\u001f\u007f]/.test(title)) return 'Enter a document name between 3 and 160 characters.'
  const normalized = normalizeDocumentTitle(title)
  if (normalized.length < 3) return 'Enter a meaningful document name.'
  const reserved = fixedDisclosureDocuments.flatMap(document => [document.name, document.rowLabel, document.key]).concat('Fee Structure of the School')
  if (reserved.some(name => {
    const protectedName = normalizeDocumentTitle(name)
    return normalized === protectedName || (protectedName.length > 7 && normalized.includes(protectedName))
  })) return 'Choose a distinct additional-document name; fixed disclosure names are reserved.'
  return ''
}
