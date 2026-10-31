import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { contentFields } from '../src/content/registry.js'
import { fixedDisclosureDocuments } from '../src/content/disclosureDocuments.js'
import { pageRenderer } from './helpers/render-content-pages.js'

test('original bundled images, PDFs and business/authentication code remain unchanged in phase 3', () => {
  const baseline = JSON.parse(readFileSync(new URL('../verification/integrity-before-phase3.json', import.meta.url)))
  const extendedStorage = new Set(['src/server/config/localStorage.js', 'src/server/security/serveUpload.js'])
  for (const [file, hash] of Object.entries(baseline)) {
    // Runtime uploads belong to the deployment volume, not a fresh source checkout.
    if (file.startsWith('uploads/')) continue
    if (!extendedStorage.has(file)) assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), hash, file)
  }
  // Compare the business layer with the original checked-in, security-fixed project too.
  const unchanged = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', 'src/server/models', 'src/server/controllers', 'src/server/middleware', 'src/server/config/database.js'], { encoding: 'utf8' }).trim()
  assert.equal(unchanged, '')
})

test('disclosure editor has all sections; fixed names expose only PDF/recovery controls', () => {
  const render = pageRenderer()
  const fields = contentFields.filter(field => field.group === 'cbse.disclosure').map(field => ({ ...field, value: field.defaultValue }))
  const editor = render('src/admin/pages/SiteContentPage.jsx', {}, { 0: 'cbse.disclosure', 1: fields, 3: false }).html
  for (const label of ['Text &amp; values', 'Fixed PDFs', 'Additional Documents']) assert.ok(editor.includes(label), label)
  const fixed = fixedDisclosureDocuments.map(document => ({ ...document, type: 'fixed', revision: 0, active: true }))
  const html = render('src/admin/components/DisclosureDocumentsPanel.jsx', {}, { 0: { fixed, additional: [], maximumAdditional: 50 }, 1: false }, { mode: 'fixed', onDirtyChange() {}, onBusyChange() {} }).html
  assert.equal((html.match(/>Replace PDF<\/button>/g) || []).length, 12)
  assert.equal((html.match(/>Restore Original<\/button>/g) || []).length, 12)
  assert.ok(!html.includes('Save name')); assert.ok(!html.includes('Remove additional document'))
  assert.ok(!html.includes('type="text"'))
})

test('additional-document editor exposes publication controls and preserves useful failure feedback', () => {
  const render = pageRenderer()
  const document = { key: 'custom-12345678-1234-4123-8123-123456789abc', type: 'additional', name: 'Existing additional report', active: false, revision: 2 }
  const html = render('src/admin/components/DisclosureDocumentsPanel.jsx', {}, { 0: { fixed: [], additional: [document], maximumAdditional: 50 }, 1: false, 8: { [document.key]: { error: 'A newer replacement exists.', conflict: true } } }, { mode: 'additional', onDirtyChange() {}, onBusyChange() {} }).html
  for (const label of ['Document Name', 'PDF File', 'Publish document', 'Save name', 'Remove additional document', 'A newer replacement exists.', 'Reload latest documents']) assert.ok(html.includes(label), label)
  assert.ok(!html.includes(document.key)); assert.ok(!html.includes('Restore Original'))
})
