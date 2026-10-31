import { contentRegistry, contentGroups } from './registry.js'

export function validContentGroup(group) {
  return typeof group === 'string' && Object.hasOwn(contentGroups, group)
}

export function contentValueError(field, value) {
  if (!field?.enabled) return 'This field is not editable.'
  if (field.type === 'number') {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 1000000
      ? '' : 'Enter a whole number between 0 and 1,000,000.'
  }
  if (typeof value !== 'string') return 'Enter text for this field.'
  if (!value.trim()) return 'This field cannot be empty. Use Reset to original to restore it.'
  if (value.length > field.maxLength) return `Use no more than ${field.maxLength} characters.`
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return 'Remove unsupported control characters.'
  if (field.type === 'email' && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) return 'Enter a valid email address.'
  if (field.type === 'tel' && (!/^\+?[\d ()-]{5,40}$/.test(value) || value.replace(/\D/g, '').length < 5)) return 'Enter a valid telephone number.'
  if (field.type === 'statistic' && !/^\d{1,7}\+?$/.test(value)) return 'Enter a whole number, optionally followed by +.'
  if (field.type === 'integerText' && !/^\d{1,7}$/.test(value)) return 'Enter a whole number using digits only.'
  if (field.type === 'year' && !/^\d{4}$/.test(value)) return 'Enter a four-digit year.'
  if (field.type === 'yearRange' && !/^\d{4}\s*[-\u2013\u2014]\s*(?:\d{4}|Present)$/i.test(value)) return 'Enter a year range, for example 1969 - 1973 or 2020 - Present.'
  if (field.type === 'currency' && !/^(?:\u2014|\u20b9\s*(?:\d+|\d{1,3}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?)$/.test(value)) return 'Enter a rupee amount, for example ₹ 9,150, or — for the original absent amount.'
  if (field.type === 'measurement' && !/^\d+(?:\.\d+)?(?:[xX\u00d7]\d+(?:\.\d+)?)?\s+(?:Acres?|Sq\.\s*(?:Meters?|Feet|Foot))$/i.test(value)) return 'Enter a measurement with its existing unit, for example 4.5 Acres or 45X21 Sq. Feet.'
  if (field.type === 'choice' && !field.options?.includes(value)) return 'Choose one of the listed values.'
  if (field.type === 'percentageText' && (!/^\d{1,3}(?:\.\d{1,2})?$/.test(value) || Number(value) > 100)) return 'Enter a percentage from 0 to 100, with at most two decimal places.'
  if (field.type === 'installmentPeriod' && !/^[1-9]\d?\s+Months?$/i.test(value)) return 'Enter an installment period such as 3 Months.'
  if (field.type === 'academicYearCaption' && !/\b\d{4}[-\u2013]\d{2}(?:\d{2})?\b/.test(value)) return 'Include an academic year such as 2026-27 in this caption.'
  if (field.type === 'inspectionUrl') {
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' || url.username || url.password || url.port || !['youtu.be', 'youtube.com', 'www.youtube.com'].includes(url.hostname)) return 'Use an HTTPS YouTube inspection-video URL.'
    } catch { return 'Enter a valid HTTPS inspection-video URL.' }
  }
  if (field.type === 'webAddress') {
    if (value.startsWith('//') || (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value))) return 'Use a website domain or an HTTP/HTTPS address.'
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value)
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port || !/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(url.hostname) || /[\s<>]/.test(value)) return 'Enter a website domain or HTTP/HTTPS address without credentials.'
    } catch { return 'Enter a valid website address.' }
  }
  if (field.type === 'url' && value !== '#') {
    const providers = {
      'global.footer.facebookUrl': ['facebook.com', 'www.facebook.com'],
      'global.footer.instagramUrl': ['instagram.com', 'www.instagram.com'],
      'global.footer.youtubeUrl': ['youtube.com', 'www.youtube.com', 'youtu.be'],
    }
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' || url.username || url.password || url.port || !providers[field.key]?.includes(url.hostname)) return 'Use an HTTPS URL on the selected social network, or # for the original link.'
    } catch { return 'Enter a valid HTTPS URL, or # for the original link.' }
  }
  return ''
}

export function approvedOverrides(group, records) {
  const values = {}
  for (const record of records) {
    const field = contentRegistry[record.key]
    if (field?.group === group && record.value !== null && !contentValueError(field, record.value)) values[field.key] = record.value
  }
  return values
}
