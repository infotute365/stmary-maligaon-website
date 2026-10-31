// Local production-build checks. No school database or real administrator is used.
const assert = require('node:assert/strict')
const { randomBytes, randomUUID } = require('node:crypto')
const { createServer } = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')
const root = process.cwd()
process.env.NODE_ENV = 'production'
process.env.CMS_VERIFY_BUILD = 'true'
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/stmarys_test_http_' + randomUUID().replaceAll('-', '')
process.env.JWT_SECRET = randomBytes(48).toString('hex')
process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'true'
process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED = 'true'
const report = { checks: [] }

async function main() {
  const mongoose = require('mongoose')
  const { default: Admin } = await import('../src/server/models/Admin.js')
  const originalLookup = Admin.findById
  const adminId = '0123456789abcdef01234567'
  // Exercise real JWT/origin middleware with an isolated session double; create no account.
  Admin.findById = () => ({ select: async () => ({ _id: adminId, sessionVersion: 0 }) })
  const token = require('jsonwebtoken').sign({ id: adminId, version: 0 }, process.env.JWT_SECRET)
  const app = require('next')({ dev: false, dir: root, hostname: '127.0.0.1' })
  const ownedPaths = new Set()
  let server
  try {
    await app.prepare()
    server = createServer(app.getRequestHandler())
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    const base = `http://127.0.0.1:${server.address().port}`
    process.env.APP_ORIGIN = base
    const request = async (method, route, body, auth = false, expected = 200, extra = {}) => {
      const headers = { origin: base, ...(auth ? { cookie: `adminToken=${token}` } : {}), ...extra }
      if (body && !(body instanceof FormData)) { headers['content-type'] = 'application/json'; body = JSON.stringify(body) }
      const response = await fetch(base + route, { method, headers, ...(body ? { body } : {}) })
      report.checks.push({ method, route, status: response.status, expected })
      assert.equal(response.status, expected, await response.clone().text())
      return response
    }
    const empty = await (await request('GET', '/api/disclosure-documents')).json()
    assert.equal(Object.keys(empty.data.fixed).length, 12); assert.deepEqual(empty.data.additional, [])
    await request('GET', '/api/disclosure-documents/all', null, false, 401)
    await request('PUT', '/api/disclosure-documents/fire', {}, false, 401)
    await request('POST', '/api/disclosure-documents/noc/restore', { revision: 0, version: 'previous' }, true, 409)
    const { PDFDocument } = require('@cantoo/pdf-lib')
    const pdf = await PDFDocument.create(); pdf.addPage([200,200]); const bytes = await pdf.save()
    const form = (fields) => { const body = new FormData(); for (const [key,value] of Object.entries(fields)) body.append(key, String(value)); body.append('pdf', new Blob([bytes], { type: 'application/pdf' }), 'plain-test.pdf'); return body }
    const saved = (await (await request('PUT', '/api/disclosure-documents/fire', form({ revision: 0 }), true)).json()).data
    ownedPaths.add(path.basename(saved.url))
    assert.equal(saved.name, 'Fire Safety Certificate')
    assert.equal((await fs.stat(path.join(root, 'uploads/disclosures', path.basename(saved.url)))).size, bytes.length)
    const current = await request('GET', saved.url)
    assert.equal(current.headers.get('content-type'), 'application/pdf')
    assert.deepEqual(new Uint8Array(await current.arrayBuffer()), bytes)
    await request('HEAD', saved.url)
    const range = await request('GET', saved.url, null, false, 206, { range: 'bytes=0-4' })
    assert.equal(await range.text(), '%PDF-')
    await request('PUT', '/api/disclosure-documents/fire', form({ revision: 0 }), true, 409)
    const custom = (await (await request('POST', '/api/disclosure-documents', form({ title: 'Isolated test report' }), true, 201)).json()).data
    ownedPaths.add(path.basename(custom.url))
    const published = (await (await request('GET', '/api/disclosure-documents')).json()).data
    assert.equal(published.additional[0].name, custom.name)
    await request('PATCH', '/api/disclosure-documents/' + custom.key, { revision: 1, active: false }, true)
    await request('GET', custom.url, null, false, 404)
    const privatePdf = await request('GET', custom.url, null, true); await privatePdf.arrayBuffer()
    await request('DELETE', '/api/disclosure-documents/' + custom.key, { revision: 2 }, true)
    await request('DELETE', '/api/disclosure-documents/fire', { revision: 1 }, true, 403)
    await request('POST', '/api/disclosure-documents/fire/restore', { revision: 1, version: 'original' }, true)
    await request('GET', '/wp-content/uploads/2026/05/Managing-Commitee.pdf')
    report.passed = true
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
    await app.close()
    if (mongoose.connection.readyState === 1) {
      for (const record of await mongoose.connection.collection('disclosuredocuments').find({}).toArray()) {
        for (const version of [record.current, record.previous]) if (version?.path?.startsWith('disclosures/')) ownedPaths.add(path.basename(version.path))
      }
    }
    await mongoose.disconnect(); delete globalThis.__maligaonMongoPromise
    Admin.findById = originalLookup
    for (const filename of ownedPaths) {
      assert.match(filename, /^[a-f0-9-]{36}\.pdf$/)
      await fs.unlink(path.join(root, 'uploads/disclosures', filename)).catch(error => { if (error.code !== 'ENOENT') throw error })
    }
    await fs.writeFile(path.join(root, 'verification/site-content-phase3-document-http.json'), JSON.stringify(report, null, 2) + '\n')
  }
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length }))
}
main().catch(error => { console.error(error.name, error.message); process.exitCode = 1 })
