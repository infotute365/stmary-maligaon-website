import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pageRenderer } from './helpers/render-content-pages.js'

const render = pageRenderer({ realMotion: true })
const file = 'src/site-pages/cbse/SchoolInfo.jsx'

test('School Information defaults are visible before animation or CMS requests complete', () => {
  const { html } = render(file)
  for (const text of ["St. Mary&#x27;s Senior Secondary School Maligaon", '230105', 'GIS/NOC/11/2009/155', '0361 2670489', 'Library Resources']) assert.ok(html.includes(text), text)
  assert.doesNotMatch(html, /style="[^"]*(?:opacity:\s*0(?:[;\"]|$)|visibility:\s*hidden|display:\s*none)/)
})

test('saved school information renders visibly with the existing layout and card values', () => {
  const { html } = render(file, {
    'cbse.schoolInfo.schoolData.name': 'Updated school name',
    'cbse.schoolInfo.schoolData.phone': '0361 2670000',
    'cbse.schoolInfo.schoolData.librarySize': '50X25 Sq. Feet',
  })
  for (const text of ['Updated school name', '0361 2670000', '50X25 Sq. Feet']) assert.ok(html.includes(text), text)
  assert.doesNotMatch(html, /style="[^"]*opacity:\s*0(?:[;\"]|$)/)
})
