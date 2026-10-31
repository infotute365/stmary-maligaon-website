import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { mkdtemp, mkdir, rm, readdir, readFile, writeFile, utimes, symlink, unlink } from 'node:fs/promises'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { handleApiRequest } from '../app/api/[...path]/route.js'
import { serveUpload } from '../src/server/security/serveUpload.js'
import { storeDisclosurePdf } from '../src/server/security/disclosurePdf.js'
import { pruneDisclosureOrphans } from '../src/server/controllers/disclosureDocumentController.js'
import DisclosureDocument from '../src/server/models/DisclosureDocument.js'
import Admin from '../src/server/models/Admin.js'
import RateLimit from '../src/server/models/RateLimit.js'
import { contentFields } from '../src/content/registry.js'
import { plainPdf } from './helpers/disclosure-pdf.js'
import { fixedDisclosureDocuments } from '../src/content/disclosureDocuments.js'

const origin = 'http://disclosure.test'
process.env.APP_ORIGIN = origin
process.env.JWT_SECRET = randomBytes(48).toString('hex')
const adminId = '0123456789abcdef01234567'
const token = jwt.sign({ id: adminId, version: 0 }, process.env.JWT_SECRET, { algorithm: 'HS256' })
// Reuse the real JWT/session middleware without creating another real admin account.
mock.method(Admin, 'findById', () => ({ select: async () => ({ _id: adminId, sessionVersion: 0 }) }))
async function call(method, route, body, authenticated = false, extraHeaders = {}) {
  const headers = { origin, ...(authenticated ? { cookie: `adminToken=${token}` } : {}), ...extraHeaders }
  const [pathname, search = ''] = route.split('?')
  if (body && !(body instanceof FormData) && typeof body !== 'string') { headers['content-type'] = 'application/json'; body = JSON.stringify(body) }
  return handleApiRequest(new Request(`${origin}/api/${route}`, { method, headers, ...(body ? { body } : {}) }), { params: Promise.resolve({ path: pathname.split('/') }) })
}
const data = async response => (await response.json()).data
const upload = (bytes, fields = {}, filename = 'test.pdf', mime = 'application/pdf') => {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) form.append(key, String(value))
  form.append('pdf', new Blob([bytes], { type: mime }), filename)
  return form
}
const serve = (url, authenticated = false, method = 'GET') => serveUpload(new Request(origin + url, { method, headers: authenticated ? { cookie: `adminToken=${token}` } : {} }), { params: Promise.resolve({ path: url.replace('/api/files/', '').split('/') }) })

test('disclosure anonymous mutations and wrong-origin requests are rejected before file parsing or DB access', async () => {
  for (const [method, route] of [['POST','disclosure-documents'],['PUT','disclosure-documents/fire'],['PATCH','disclosure-documents/fire'],['DELETE','disclosure-documents/fire'],['POST','disclosure-documents/fire/restore']]) {
    assert.equal((await call(method, route, {})).status, 401)
    assert.equal((await call(method, route, {}, false, { origin: 'https://evil.test' })).status, 403)
  }
  assert.equal((await call('GET','disclosure-documents/all')).status, 401)
  assert.equal((await call('PUT','disclosure-documents/unknown', {})).status, 404)
  assert.equal((await call('PUT','disclosure-documents/../../.env.local', {})).status, 404)
})

const testUri = process.env.TEST_MONGODB_URI
test('isolated disclosure API, atomic versions, secure files, failures, additional documents and rollback', { skip: !testUri }, async t => {
  assert.match(testUri, /^mongodb:\/\/127\.0\.0\.1:\d+\/stmarys_test_[a-zA-Z0-9_-]+(?:\?|$)/)
  const configured = new URL(testUri)
  configured.pathname = '/stmarys_test_disclosure_' + randomUUID().replaceAll('-', '')
  process.env.MONGODB_URI = configured.href
  const directory = await mkdtemp(path.join(os.tmpdir(), 'stmarys-disclosure-test-'))
  const previousCwd = process.cwd()
  const { bytes } = await plainPdf()
  let custom
  try {
    process.chdir(directory)
    await t.test('empty metadata uses all 12 original files without seeding; public metadata is safe', async () => {
      const response = await call('GET','disclosure-documents')
      assert.equal(response.status, 200)
      const payload = await data(response)
      assert.equal(Object.keys(payload.fixed).length, 12)
      assert.deepEqual(payload.additional, [])
      assert.equal(payload.fixed.smc.url, '/wp-content/uploads/2026/05/Managing-Commitee.pdf')
      assert.equal(await DisclosureDocument.countDocuments(), 0)
      const editor = await data(await call('GET','disclosure-documents/all', null, true))
      assert.deepEqual(editor.fixed.map(document => document.name), fixedDisclosureDocuments.map(document => document.name))
      assert.ok(editor.fixed.every(document => document.revision === 0))
      assert.equal((await call('POST','disclosure-documents/noc/restore', { revision: 0, version: 'previous' }, true)).status, 409)
      assert.equal((await call('GET','disclosure-documents?path=anything')).status, 400)
    })
    await t.test('fixed names, keys, delete and unsafe/duplicate bodies are protected', async () => {
      assert.equal((await call('PATCH','disclosure-documents/fire', { revision: 0, title: 'Renamed' }, true)).status, 403)
      assert.equal((await call('DELETE','disclosure-documents/fire', { revision: 0 }, true)).status, 403)
      for (const body of [{ revision: 0, url: '/etc/passwd' }, { revision: 0, name: 'Renamed' }, { revision: { $ne: null } }, { revision: -1 }]) assert.equal((await call('PUT','disclosure-documents/fire', body, true)).status, 400)
      assert.equal((await call('POST','disclosure-documents/fire/restore', '{"revision":0,"revision":1,"version":"original"}', true, { 'content-type': 'application/json' })).status, 400)
      assert.equal((await call('POST','disclosure-documents/fire/restore', '{"revision":0,"revis\\u0069on":1,"version":"original"}', true, { 'content-type': 'application/json' })).status, 400)
    })
    await t.test('missing/fake/wrong-format/extra/duplicate/oversized files cannot create metadata or overwrite PDFs', async () => {
      assert.equal((await call('PUT','disclosure-documents/fire', { revision: 0 }, true)).status, 400)
      for (const form of [upload(Buffer.from('%PDF-1.4\nfake'), { revision: 0 }), upload(bytes, { revision: 0 }, 'wrong.txt'), upload(bytes, { revision: 0 }, 'test.pdf', 'text/plain'), upload(Buffer.alloc(0), { revision: 0 })]) assert.equal((await call('PUT','disclosure-documents/fire', form, true)).status, 400)
      const extra = upload(bytes, { revision: 0 }); extra.append('unexpected', new Blob([bytes], { type: 'application/pdf' }), 'extra.pdf')
      assert.equal((await call('PUT','disclosure-documents/fire', extra, true)).status, 400)
      const duplicate = upload(bytes, { revision: 0 }); duplicate.append('revision', '0')
      assert.equal((await call('PUT','disclosure-documents/fire', duplicate, true)).status, 400)
      const duplicateFile = upload(bytes, { revision: 0 }); duplicateFile.append('pdf', new Blob([bytes], { type: 'application/pdf' }), 'second.pdf')
      assert.equal((await call('PUT','disclosure-documents/fire', duplicateFile, true)).status, 400)
      assert.equal((await call('PUT','disclosure-documents/fire', 'x', true, { 'content-type': 'multipart/form-data; boundary=x', 'content-length': String(12 * 1024 * 1024) })).status, 413)
      assert.equal(await DisclosureDocument.countDocuments(), 0)
    })
    let first, second
    await t.test('fixed replacement persists and is publicly streamed with PDF/security headers', async () => {
      const response = await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 0 }), true)
      assert.equal(response.status, 200, await response.clone().text())
      first = await data(response)
      assert.equal(first.name, 'Fire Safety Certificate'); assert.equal(first.revision, 1)
      assert.match(first.url, /^\/api\/files\/disclosures\/[a-f0-9-]+\.pdf$/)
      const publicData = await data(await call('GET','disclosure-documents'))
      assert.equal(publicData.fixed.fire.url, first.url)
      assert.ok(!JSON.stringify(publicData).includes('updatedBy'))
      assert.ok(!JSON.stringify(publicData).includes('originalName'))
      const served = await serve(first.url)
      assert.equal(served.status, 200)
      assert.equal(served.headers.get('content-type'), 'application/pdf')
      assert.equal(served.headers.get('x-content-type-options'), 'nosniff')
      assert.match(served.headers.get('content-security-policy'), /sandbox/)
      assert.deepEqual(Buffer.from(await served.arrayBuffer()), bytes)
      assert.equal((await serve(first.url, false, 'HEAD')).status, 200)
    })
    await t.test('stale replacements and failed DB/storage writes preserve the working file and clean new files', async () => {
      const beforeFiles = await readdir('uploads/disclosures')
      assert.equal((await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 0 }), true)).status, 409)
      const patch = mock.method(DisclosureDocument, 'findOneAndUpdate', async () => { throw new Error('Simulated database failure') })
      assert.equal((await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 1 }), true)).status, 500)
      patch.mock.restore()
      assert.deepEqual(await readdir('uploads/disclosures'), beforeFiles)
      assert.equal((await DisclosureDocument.findById('fire')).revision, 1)
      const preservedPdf = await serve(first.url); assert.equal(preservedPdf.status, 200); await preservedPdf.arrayBuffer()
      assert.deepEqual(await readFile(path.join('uploads/disclosures', path.basename(first.url))), bytes)
      const storageFailure = mock.method(fs, 'open', async () => { throw new Error('Simulated storage failure') })
      try { assert.equal((await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 1 }), true)).status, 500) }
      finally { storageFailure.mock.restore() }
      assert.deepEqual(await readdir('uploads/disclosures'), beforeFiles)
    })
    await t.test('versions remain bounded; previous is admin-only and restore/original are revision-aware', async () => {
      second = await data(await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 1 }, 'second.pdf'), true))
      assert.equal(second.revision, 2); assert.equal(second.previous.url, first.url)
      assert.equal((await serve(first.url)).status, 404)
      const previousPdf = await serve(first.url, true)
      assert.equal(previousPdf.status, 200); await previousPdf.arrayBuffer()
      assert.equal((await call('POST','disclosure-documents/fire/restore', { revision: 1, version: 'previous' }, true)).status, 409)
      const restored = await data(await call('POST','disclosure-documents/fire/restore', { revision: 2, version: 'previous' }, true))
      assert.equal(restored.url, first.url); assert.equal(restored.revision, 3)
      const original = await data(await call('POST','disclosure-documents/fire/restore', { revision: 3, version: 'original' }, true))
      assert.equal(original.url, fixedDisclosureDocuments.find(document => document.key === 'fire').url)
      assert.equal(original.revision, 4)
      assert.equal((await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 0 }), true)).status, 409)
      assert.deepEqual((await readdir('uploads/disclosures')).sort(), [path.basename(first.url)])
    })
    await t.test('additional documents create, reject protected/duplicate names, update, hide, replace and remove safely', async () => {
      for (const title of ['', 'Fire Safety Certificate', 'x'.repeat(161)]) assert.equal((await call('POST','disclosure-documents', upload(bytes, { title }), true)).status, 400)
      const response = await call('POST','disclosure-documents', upload(bytes, { title: 'A distinct official report' }), true)
      assert.equal(response.status, 201, await response.clone().text())
      custom = await data(response)
      assert.match(custom.key, /^custom-/); assert.equal(custom.type, 'additional')
      assert.equal((await call('POST','disclosure-documents', upload(bytes, { title: 'A DISTINCT official report' }), true)).status, 409)
      assert.equal((await data(await call('GET','disclosure-documents'))).additional[0].name, custom.name)
      const hidden = await data(await call('PATCH',`disclosure-documents/${custom.key}`, { revision: 1, active: false }, true))
      assert.equal(hidden.active, false)
      assert.deepEqual((await data(await call('GET','disclosure-documents'))).additional, [])
      assert.equal((await serve(custom.url)).status, 404)
      const hiddenPdf = await serve(custom.url, true); assert.equal(hiddenPdf.status, 200); await hiddenPdf.arrayBuffer()
      const renamed = await data(await call('PATCH',`disclosure-documents/${custom.key}`, { revision: 2, title: 'A renamed distinct report', active: true }, true))
      assert.equal(renamed.name, 'A renamed distinct report')
      const replaced = await data(await call('PUT',`disclosure-documents/${custom.key}`, upload(bytes, { revision: 3 }, 'new.pdf'), true))
      assert.equal(replaced.revision, 4)
      assert.equal((await call('DELETE',`disclosure-documents/${custom.key}`, { revision: 3 }, true)).status, 409)
      assert.equal((await call('DELETE',`disclosure-documents/${custom.key}`, { revision: 4 }, true)).status, 200)
      assert.equal((await serve(replaced.url)).status, 404)
      assert.equal((await DisclosureDocument.findById('fire')).revision, 4)
      assert.ok(!await DisclosureDocument.findById(custom.key))
    })
    await t.test('uncommitted/orphan paths and symlink escapes are blocked; only old owned orphans are pruned', async () => {
      const orphan = `disclosures/${randomUUID()}.pdf`
      await writeFile('uploads/' + orphan, bytes)
      assert.equal((await serve('/api/files/' + orphan)).status, 404)
      assert.equal((await serveUpload(new Request(origin), { params: Promise.resolve({ path: ['disclosures', '..', '..', '.env.local'] }) })).status, 403)
      const old = new Date(Date.now() - 25 * 60 * 60 * 1000)
      await utimes('uploads/' + orphan, old, old)
      await utimes('uploads/disclosures/' + path.basename(first.url), old, old)
      assert.equal((await pruneDisclosureOrphans({ dryRun: true })).candidates, 1)
      await pruneDisclosureOrphans({ dryRun: false })
      assert.deepEqual(await readdir('uploads/disclosures'), [path.basename(first.url)])
      const symlinkTest = path.join(directory, 'symlink-test')
      await mkdir(path.join(symlinkTest, 'uploads'), { recursive: true }); await mkdir(path.join(symlinkTest, 'outside'))
      await symlink(path.join(symlinkTest, 'outside'), path.join(symlinkTest, 'uploads/disclosures'), process.platform === 'win32' ? 'junction' : 'dir')
      process.chdir(symlinkTest)
      try {
        await assert.rejects(storeDisclosurePdf(new File([bytes], 'test.pdf', { type: 'application/pdf' }), { newUploads: [] }), /Unsafe disclosure storage/)
        // Even a committed metadata reference cannot serve through a symlinked
        // disclosure directory. The general upload root still contains this target.
        const name = path.basename(first.url)
        await writeFile(path.join(symlinkTest, 'outside', name), bytes)
        assert.equal((await serve(first.url, true)).status, 404)
        await unlink(path.join(symlinkTest, 'outside', name))
      }
      finally { process.chdir(directory) }
      assert.deepEqual(await readdir(path.join(symlinkTest, 'outside')), [])
    })
    await t.test('public rollback uses originals and hides additions without deleting retained metadata/files', async () => {
      process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED = 'false'
      const payload = await data(await call('GET','disclosure-documents'))
      assert.equal(payload.fixed.fire.url, fixedDisclosureDocuments.find(document => document.key === 'fire').url)
      assert.deepEqual(payload.additional, [])
      delete process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED
      assert.equal(await DisclosureDocument.countDocuments(), 1)
    })
    await t.test('concurrent replacements allow one commit and clean the losing upload', async () => {
      const results = await Promise.all([call('PUT','disclosure-documents/fire', upload(bytes, { revision: 4 }), true), call('PUT','disclosure-documents/fire', upload(bytes, { revision: 4 }), true)])
      assert.deepEqual(results.map(response => response.status).sort(), [200, 409])
      const record = await DisclosureDocument.findById('fire').lean()
      assert.equal(record.revision, 5)
      assert.equal((await readdir('uploads/disclosures')).length, 2)
      const publicData = await data(await call('GET','disclosure-documents'))
      assert.equal(path.basename(publicData.fixed.fire.url), path.basename(record.current.path))
    })
    await t.test('metadata and file associations survive a database reconnect', async () => {
      const previous = (await data(await call('GET','disclosure-documents'))).fixed.fire.url
      await mongoose.disconnect(); delete globalThis.__maligaonMongoPromise
      const current = (await data(await call('GET','disclosure-documents'))).fixed.fire.url
      assert.equal(current, previous)
      const response = await serve(current); assert.equal(response.status, 200); await response.arrayBuffer()
    })
    await t.test('disclosure values use the existing text API, persist, validate, conflict and reset', async () => {
      const field = contentFields.find(field => field.group === 'cbse.disclosure' && field.type === 'percentageText')
      const saved = await call('PUT', 'site-content/' + field.key, { revision: 0, value: '98.75' }, true)
      assert.equal(saved.status, 200, await saved.clone().text())
      assert.equal((await data(await call('GET','site-content?group=cbse.disclosure')))[field.key], '98.75')
      assert.equal((await call('PUT', 'site-content/' + field.key, { revision: 0, value: '99' }, true)).status, 409)
      assert.equal((await call('PUT', 'site-content/' + field.key, { revision: 1, value: '101' }, true)).status, 400)
      assert.equal((await call('DELETE', 'site-content/' + field.key, { revision: 1 }, true)).status, 200)
      assert.ok(!Object.hasOwn(await data(await call('GET','site-content?group=cbse.disclosure')), field.key))
      assert.equal((await call('PUT', 'site-content/cbse.disclosure.pdf.fire.name', { revision: 0, value: 'Renamed' }, true)).status, 400)
    })
    await t.test('missing replacements fall back to originals and metadata outages return safe defaults', async () => {
      const response = await call('PUT','disclosure-documents/noc', upload(bytes, { revision: 0 }), true)
      assert.equal(response.status, 200, await response.clone().text())
      const saved = await data(response)
      await unlink('uploads/disclosures/' + path.basename(saved.url))
      assert.equal((await data(await call('GET','disclosure-documents'))).fixed.noc.url, fixedDisclosureDocuments.find(document => document.key === 'noc').url)
      const editor = await data(await call('GET','disclosure-documents/all', null, true))
      assert.equal(editor.fixed.find(document => document.key === 'noc').missingFile, true)
      const unavailable = mock.method(DisclosureDocument, 'find', () => { throw new Error('Simulated metadata outage') })
      try {
        const response = await call('GET','disclosure-documents')
        assert.equal(response.status, 503)
        assert.equal((await data(response)).fixed.fire.url, fixedDisclosureDocuments.find(document => document.key === 'fire').url)
      } finally { unavailable.mock.restore() }
    })
    await t.test('document mutation rate limit returns 429 before parsing or storing uploads', async () => {
      const before = await readdir('uploads/disclosures')
      const limit = mock.method(RateLimit, 'findOneAndUpdate', async () => ({ count: 1000 }))
      try {
        const response = await call('PUT','disclosure-documents/fire', upload(bytes, { revision: 5 }), true)
        assert.equal(response.status, 429); assert.ok(Number(response.headers.get('retry-after')) > 0)
      } finally { limit.mock.restore() }
      assert.deepEqual(await readdir('uploads/disclosures'), before)
    })
  } finally {
    await mongoose.disconnect(); delete globalThis.__maligaonMongoPromise
    process.chdir(previousCwd)
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(directory).startsWith('stmarys-disclosure-test-'))
    await rm(directory, { recursive: true, force: true })
  }
})
