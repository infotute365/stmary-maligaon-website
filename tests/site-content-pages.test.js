import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { contentFields, contentRegistry, contentGroups } from '../src/content/registry.js'
import { contentPages, contentGroupForPath, publicContentGroups } from '../src/content/pages.js'
import { contentValueError } from '../src/content/validation.js'
import { pageRenderer, originalPages, exampleRecords } from './helpers/render-content-pages.js'

const before = pageRenderer({ before: true })
const after = pageRenderer()
const phase2 = contentPages.filter(page => page.source && page.group !== 'cbse.disclosure')
const statesFor = page => {
  const name = page.source.split('/').at(-1).replace('.jsx', '')
  const result = [{}]
  if (exampleRecords[name]) result.push({ 0: [], 1: false }, { 0: exampleRecords[name], 1: false })
  if (name === 'Management') result.push({ 0: [], 1: false, 2: 'Fixed existing error' })
  if (name === 'Clubs') result.push(...['guides', 'vides', 'media', 'eco', 'literature', 'band', 'vocal', 'instrumental', 'dance', 'karate'].map(id => ({ 0: id })))
  if (name === 'ContactUs') result.push({ 1: true }, { 2: true })
  return result
}

test('all original Phase 1 field definitions and defaults remain unchanged', () => {
  const saved = JSON.parse(readFileSync(new URL('./fixtures/site-content-phase1-registry-original.json', import.meta.url)))
  assert.deepEqual(contentFields.filter(field => ['global', 'home'].includes(field.group)), saved)
})
test('every registered page has valid unique keys, valid defaults and a single canonical route group', () => {
  assert.equal(new Set(contentFields.map(field => field.key)).size, contentFields.length)
  for (const page of phase2) {
    const fields = contentFields.filter(field => field.group === page.group)
    assert.ok(fields.length > 0, page.group)
    assert.ok(Object.hasOwn(contentGroups, page.group))
    for (const field of fields) assert.equal(contentValueError(field, field.defaultValue), '', field.key)
    if (page.group !== 'pages.notFound') assert.equal(contentGroupForPath(page.path), page.group)
    for (const alias of page.aliases || []) assert.equal(contentGroupForPath(alias), page.group)
    assert.deepEqual(publicContentGroups(page.group), ['global', page.group])
  }
  assert.equal(contentGroupForPath('/cbse/mandatory-public-disclosure'), 'cbse.disclosure')
  assert.deepEqual(publicContentGroups(null), ['global'])
})

for (const page of phase2) {
  const file = 'src/site-pages/' + page.source
  test(`original DOM, classes, images, links, tables and keys: ${page.label}`, () => {
    for (const state of statesFor(page)) assert.deepEqual(after(file, {}, state), before(file, {}, state))
  })
  test(`every editable field has a visible rendering location: ${page.label}`, () => {
    for (const field of contentFields.filter(field => field.group === page.group)) {
      const marker = field.type === 'number' ? 918273 : '__CMS_FIELD_RENDERED__'
      assert.ok(statesFor(page).some(state => after(file, { [field.key]: marker }, state).html.includes(String(marker))), `Unrendered field: ${field.key}`)
    }
  })
}

test('editing labels and list entries preserves React keys and fixed club accordion identity', () => {
  for (const page of phase2) {
    const fields = contentFields.filter(field => field.group === page.group)
    const overrides = Object.fromEntries(fields.map(field => [field.key, field.type === 'number' ? 42 : 'Edited text']))
    const file = 'src/site-pages/' + page.source
    for (const state of statesFor(page)) assert.deepEqual(after(file, overrides, state).keys, after(file, {}, state).keys, page.group)
  }
  const clubs = readFileSync('src/site-pages/activities/Clubs.jsx', 'utf8')
  assert.ok(clubs.includes('expandedClub === club.id'))
  assert.ok(clubs.includes('toggleClub(club.id)'))
})

test('Phase 2 text remains escaped; informational numeric values remain bounded and typed', () => {
  const page = phase2.find(page => page.group === 'about.founder')
  const field = contentFields.find(field => field.group === page.group)
  const html = after('src/site-pages/' + page.source, { [field.key]: '<script>alert(1)</script>' }).html
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>alert(1)</script>'))
  for (const type of ['integerText', 'year', 'yearRange', 'currency', 'choice', 'webAddress']) {
    const field = contentFields.find(field => field.type === type)
    assert.ok(field, type)
    assert.ok(contentValueError(field, 'javascript:alert(1)'), type)
    assert.ok(contentValueError(field, {}), type)
  }
})
