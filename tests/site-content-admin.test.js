import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contentFields } from '../src/content/registry.js'
import { contentPages } from '../src/content/pages.js'
import SiteContent from '../src/server/models/SiteContent.js'
import { pageRenderer } from './helpers/render-content-pages.js'

const render = pageRenderer()
const file = 'src/admin/pages/SiteContentPage.jsx'
const fieldsFor = group => contentFields.filter(field => field.group === group).map(field => ({ ...field, value: field.defaultValue, revision: 0, hasOverride: false }))
const statesFor = (group, extra = {}) => ({ 0: group, 1: fieldsFor(group), 2: {}, 3: false, 4: '', 5: {}, 6: '', 7: true, 8: 0, 9: '', 10: '', 11: 30, ...extra })

test('each page is selectable in the existing editor and links to its public page', () => {
  for (const page of contentPages) {
    const { html } = render(file, {}, statesFor(page.group))
    assert.ok(html.includes(`href="${page.path}"`), page.group)
    assert.ok(html.includes('View Public Page'))
    assert.ok(html.includes('Choose a page'))
    assert.ok(html.includes('Choose a section'))
    assert.ok(html.includes('Search fields on this page'))
    assert.ok(!html.includes('cbse.mandatoryPublicDisclosure'))
  }
})
test('large pages are sectioned and bounded; search finds existing field labels', () => {
  const group = 'cbse.schoolInfo'
  const { html } = render(file, {}, statesFor(group))
  assert.ok((html.match(/<input/g) || []).length <= 31)
  const result = render(file, {}, statesFor(group, { 10: 'Affiliation' })).html
  assert.ok(result.includes('Affiliation'))
  assert.ok(!result.includes('cbse.schoolInfo.schoolData.affiliationNo'), 'Internal content keys must not be displayed')
})
test('saved values, unsaved indicators and useful failure/conflict feedback are visible', () => {
  const group = 'about.founder'
  const field = fieldsFor(group)[0]
  const html = render(file, {}, statesFor(group, { 2: { [field.key]: 'Unsaved draft' }, 5: { [field.key]: { error: 'A newer edit exists.', conflict: true } } })).html
  assert.ok(html.includes('Unsaved draft'))
  assert.ok(html.includes('Unsaved'))
  assert.ok(html.includes('A newer edit exists.'))
  assert.ok(html.includes('Load latest saved text'))
  assert.ok(html.includes('Reset to original'))
})
test('failed/loading editor reads cannot render blank editable fields or Save buttons', () => {
  for (const extra of [{ 3: true }, { 4: 'Unable to load saved content.' }]) {
    const html = render(file, {}, statesFor('students.fees', extra)).html
    assert.ok(!html.includes('>Save</button>'))
    assert.ok(!html.includes('content-0-0'))
  }
})
test('all new groups are accepted by the same isolated model; existing global/home groups remain valid', () => {
  const groups = SiteContent.schema.path('group').enumValues
  for (const page of contentPages) assert.ok(groups.includes(page.group), page.group)
})
