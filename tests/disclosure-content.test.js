import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { contentFields, contentRegistry } from '../src/content/registry.js'
import { contentValueError } from '../src/content/validation.js'
import { fixedDisclosureDocuments, disclosureOriginals } from '../src/content/disclosureDocuments.js'
import { pageRenderer } from './helpers/render-content-pages.js'

const file = 'src/site-pages/cbse/MandatoryPublicDisclosure.jsx'
const original = JSON.parse(readFileSync(new URL('./fixtures/disclosure-original.json', import.meta.url)))
const before = pageRenderer({ before: true, originalOverride: original })
const after = pageRenderer()
const fields = contentFields.filter(field => field.group === 'cbse.disclosure')
const sections = { general: true, documents: true, result: true, staff: true, infrastructure: true }
const states = [{}, { 2: sections }, { 1: true, 2: sections }, { 0: { name: 'Fire Safety Certificate', description: 'Valid Fire Safety Certificate from Competent Authority', url: '/wp-content/uploads/2026/05/Fire_Safety_Certificate.pdf' }, 2: sections }]

test('all previous content definitions remain unchanged and new disclosure defaults are valid', () => {
  const old = JSON.parse(readFileSync(new URL('./fixtures/content-before-phase3.json', import.meta.url)))
  assert.deepEqual(contentFields.filter(field => field.group !== 'cbse.disclosure'), old)
  assert.ok(fields.length > 300)
  for (const field of fields) assert.equal(contentValueError(field, field.defaultValue), '', field.key)
})
test('original disclosure sections, tables, fee/PDF modals, classes and keys are preserved', () => {
  for (const state of states) assert.deepEqual(after(file, {}, state), before(file, {}, state))
})
test('every registered disclosure field has an existing visible rendering location', () => {
  const missing = []
  for (const field of fields) {
    const pdfKey = field.key.match(/^cbse\.disclosure\.pdf\.([^.]+)\.description$/)?.[1]
    const locations = pdfKey ? [{ 0: { key: pdfKey }, 2: sections }] : states
    if (!locations.some(state => after(file, { [field.key]: '__DISCLOSURE_EDIT__' }, state).html.includes('__DISCLOSURE_EDIT__'))) missing.push(field.key)
  }
  assert.deepEqual(missing, [])
})
test('fixed names, original row descriptions and stable identities cannot be edited through content fields', () => {
  assert.equal(fixedDisclosureDocuments.length, 12)
  const keys = fixedDisclosureDocuments.map(document => document.key)
  assert.deepEqual(keys, ['affiliation','society','noc','rte','building','fire','deo','water','academic','smc','pta','results'])
  const overrides = Object.fromEntries(fields.map(field => [field.key, 'Edited display text']))
  const beforeResult = after(file, {}, { 2: sections })
  const changed = after(file, overrides, { 2: sections })
  assert.deepEqual(changed.keys, beforeResult.keys)
  for (const document of fixedDisclosureDocuments) {
    assert.ok(existsSync('public' + document.url), document.key)
    assert.ok(!contentRegistry[`cbse.disclosure.pdf.${document.key}.name`])
    assert.ok(!contentRegistry[`cbse.disclosure.pdf.${document.key}.url`])
    assert.ok(changed.html.includes(document.rowLabel.replaceAll('&', '&amp;')), document.key)
  }
})
test('additional documents append after fixed rows and reuse the original row and modal behavior', () => {
  const documents = disclosureOriginals()
  documents.additional.push({ key: 'custom-12345678-1234-4123-8123-123456789abc', name: 'A distinct appended document', url: '/api/files/disclosures/12345678-1234-4123-8123-123456789abc.pdf' })
  const render = pageRenderer({ documents })
  const html = render(file, {}, { 2: sections }).html
  assert.ok(html.indexOf('A distinct appended document') > html.indexOf(fixedDisclosureDocuments[7].rowLabel))
  const modal = render(file, {}, { 0: { name: documents.additional[0].name, url: documents.additional[0].url, description: '' }, 2: sections }).html
  assert.ok(modal.includes(`src="${documents.additional[0].url}"`))
  assert.ok(modal.includes(`href="${documents.additional[0].url}" download`))
})
test('result percentages, periods and inspection URLs are validated without changing supplied values', () => {
  for (const type of ['percentageText', 'installmentPeriod', 'academicYearCaption', 'inspectionUrl']) {
    const field = fields.find(field => field.type === type)
    assert.ok(field, type)
    assert.ok(contentValueError(field, 'javascript:alert(1)'))
  }
  const percent = fields.find(field => field.type === 'percentageText')
  for (const value of ['101', '-1', 'NaN', '99.999', '1e2']) assert.ok(contentValueError(percent, value))
})
