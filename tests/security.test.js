import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtemp, readFile, readdir, rm, writeFile, symlink } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import mongoose from 'mongoose'
import sharp from 'sharp'
import jwt from 'jsonwebtoken'
import { isTrustedRequest } from '../src/server/middleware/csrf.js'
import { boundedBody, validateFlatBody, requestMetadata } from '../src/server/security/request.js'
import { validPassword } from '../src/server/security/password.js'
import { resolveUploadPath } from '../src/server/config/localStorage.js'
import { prepareImage, validateDocument } from '../src/server/middleware/upload.js'
import { serveUpload } from '../src/server/security/serveUpload.js'
import { handleApiRequest } from '../app/api/[...path]/route.js'
import { seedAdmin } from '../scripts/seedAdmin.js'
import Admin from '../src/server/models/Admin.js'
import RateLimit from '../src/server/models/RateLimit.js'
import { consumeLimit } from '../src/server/security/rateLimit.js'

const origin = 'http://school.test'
process.env.APP_ORIGIN = origin
process.env.JWT_SECRET = randomBytes(48).toString('hex')
process.env.TRUST_PROXY_IP = 'false'

async function call(method, route, body, token, extraHeaders = {}) {
  const headers = { origin, ...extraHeaders }
  if (token) headers.cookie = `adminToken=${token}`
  if (body && !(body instanceof FormData)) { headers['content-type'] = 'application/json'; body = JSON.stringify(body) }
  return handleApiRequest(new Request(`${origin}/api/${route}`, { method, headers, ...(body ? { body } : {}) }), { params: Promise.resolve({ path: route.split('/') }) })
}
const data = async response => (await response.json()).data

test('CSRF accepts configured origin and rejects foreign/missing/null origins and cross-site metadata', () => {
  for (const candidate of ['https://evil.test', 'null', undefined, `${origin}.evil.test`]) {
    assert.equal(isTrustedRequest(new Request(origin, { method: 'POST', headers: candidate ? { origin: candidate } : {} })), false)
  }
  assert.equal(isTrustedRequest(new Request(origin, { method: 'POST', headers: { origin } })), true)
  assert.equal(isTrustedRequest(new Request(origin, { method: 'POST', headers: { origin, 'sec-fetch-site': 'cross-site' } })), false)
})
test('JSON operators, nested values, arrays, prototype keys and oversized fields are rejected', () => {
  for (const value of [[], null, { email: { $ne: null } }, { password: [] }, { $where: 'x' }, JSON.parse('{"__proto__":"x"}'), { name: 'x'.repeat(20001) }]) assert.throws(() => validateFlatBody(value))
  assert.deepEqual(validateFlatBody({ name: 'Alice', isActive: false, order: 0 }), { name: 'Alice', isActive: false, order: 0 })
})
test('body reader bounds declared and chunked request data', async () => {
  await assert.rejects(boundedBody(new Request(origin, { method: 'POST', body: 'x', headers: { 'content-length': '1000' } }), 20), { status: 413 })
  await assert.rejects(boundedBody(new Request(origin, { method: 'POST', body: 'x'.repeat(21) }), 20), { status: 413 })
  assert.equal((await boundedBody(new Request(origin, { method: 'POST', body: 'ok' }), 20)).toString(), 'ok')
})
test('malformed cookies are ignored safely and file traversal is blocked', () => {
  assert.equal(requestMetadata(new Request(origin, { headers: { cookie: 'bad=%zz; adminToken=abc' } })).cookies.adminToken, 'abc')
  for (const value of ['../package.json', '../../.env', 'images/../../../.env', '..\\..\\.env']) assert.throws(() => resolveUploadPath(value))
})
test('password policy rejects truncation and weak seed passwords', () => {
  assert.equal(validPassword('LongSecurePass123!'), true)
  assert.equal(validPassword('Aa1' + 'é'.repeat(36)), false)
  assert.equal(validPassword('short123'), false)
})
test('image validation rejects forged MIME and preserves valid PNG transparency', async () => {
  await assert.rejects(prepareImage(Buffer.from('<svg></svg>'), 'image/png'), { status: 400 })
  const png = await sharp({ create: { width: 4, height: 4, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 0.5 } } }).png().toBuffer()
  await assert.rejects(prepareImage(png, 'image/jpeg'), { status: 400 })
  const result = await sharp(await prepareImage(png, 'image/png')).metadata()
  assert.equal(result.format, 'png'); assert.equal(result.hasAlpha, true)
})
test('document extension validation rejects disguised executables', () => {
  assert.throws(() => validateDocument(Buffer.from('<html>bad</html>'), '.pdf'))
  assert.throws(() => validateDocument(Buffer.from('MZfake'), '.docx'))
  validateDocument(Buffer.from('%PDF-1.4\n'), '.pdf')
})
test('unknown and malformed routes, liveness, CSRF and unauthenticated uploads do not need MongoDB', async () => {
  assert.equal((await call('GET', 'health')).status, 200)
  assert.equal((await call('GET', 'health/anything')).status, 404)
  assert.equal((await call('GET', 'auth/check/extra')).status, 404)
  assert.equal((await call('GET', 'staff/bad-id')).status, 400)
  assert.equal((await call('POST', 'auth/login', {}, null, { origin: 'https://evil.test' })).status, 403)
  const form = new FormData(); form.append('image', new Blob(['bad'], { type: 'image/png' }), 'x.png')
  assert.equal((await call('POST', 'staff', form)).status, 401)
})

test('file streaming supports range/HEAD, safe headers and symlink containment', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'stmarys-file-test-'))
  const old = process.cwd()
  try {
    process.chdir(dir)
    const { mkdir } = await import('node:fs/promises')
    await mkdir('uploads/downloads', { recursive: true })
    await writeFile('uploads/downloads/test.txt', 'abcdef')
    await mkdir('outside')
    await writeFile('outside/test.txt', 'secret')
    await symlink(path.join(dir, 'outside'), 'uploads/downloads/link', process.platform === 'win32' ? 'junction' : 'dir')
    const context = { params: Promise.resolve({ path: ['downloads', 'test.txt'] }) }
    let response = await serveUpload(new Request(origin, { headers: { range: 'bytes=1-3' } }), context)
    assert.equal(response.status, 206); assert.equal(await response.text(), 'bcd')
    assert.equal(response.headers.get('content-range'), 'bytes 1-3/6')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.match(response.headers.get('content-disposition'), /^attachment/)
    response = await serveUpload(new Request(origin, { method: 'HEAD' }), context)
    assert.equal(await response.text(), ''); assert.equal(response.headers.get('content-length'), '6')
    assert.equal((await serveUpload(new Request(origin), { params: Promise.resolve({ path: ['downloads', 'link', 'test.txt'] }) })).status, 403)
    assert.equal((await serveUpload(new Request(origin, { headers: { range: 'bytes=9-10' } }), context)).status, 416)
  } finally { process.chdir(old); await rm(dir, { recursive: true, force: true }) }
})

const testUri = process.env.TEST_MONGODB_URI
test('isolated MongoDB integration: seed, auth, all seven resource CRUD flows and failed uploads', { skip: !testUri }, async () => {
  assert.match(testUri, /^mongodb:\/\/127\.0\.0\.1:\d+\//, 'Integration tests require an explicit isolated loopback MongoDB URI')
  const dir = await mkdtemp(path.join(os.tmpdir(), 'stmarys-db-test-'))
  const old = process.cwd()
  process.env.MONGODB_URI = testUri
  const password = 'TestPassword123!'
  try {
    process.chdir(dir)
    assert.match(await seedAdmin({ email: 'ADMIN@example.com', password }), /created/)
    const stored = await Admin.findOne({ email: 'admin@example.com' }).select('+password')
    assert.notEqual(stored.password, password); assert.equal(await stored.comparePassword(password), true)
    assert.match(await seedAdmin({ email: 'admin@example.com', password: 'OtherPassword123!' }), /No changes/)
    assert.equal(await stored.comparePassword(password), true)
    let response = await call('POST', 'auth/login', { email: ' ADMIN@example.com ', password })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('set-cookie'), /Max-Age=604800(?:;|$)/)
    assert.match(response.headers.get('set-cookie'), /HttpOnly/)
    assert.match(response.headers.get('set-cookie'), /SameSite=lax/i)
    const token = response.headers.get('set-cookie').match(/adminToken=([^;]+)/)[1]
    assert.equal((await call('GET', 'auth/check', null, token)).status, 200)
    assert.equal((await call('POST', 'auth/login', { email: { $ne: null }, password })).status, 400)
    const forged = jwt.sign({ id: String(stored._id), version: 0 }, 'wrong-secret', { algorithm: 'HS256' })
    assert.equal((await call('GET', 'auth/check', null, forged)).status, 401)
    const png = await sharp({ create: { width: 10, height: 10, channels: 4, background: '#ff000080' } }).png().toBuffer()
    const resources = [
      ['management', { name: 'Member', designation: 'Principal' }, 'image'],
      ['managing-committee', { name: 'Member', designation: 'Chair' }, 'image'],
      ['staff', { name: 'Staff', designation: 'Staff' }, 'image'],
      ['teaching-staff', { name: 'Teacher', designation: 'Teacher', category: 'tgt' }, 'image'],
      ['gallery', { eventName: 'School Event' }, 'images'],
      ['circulars', { title: 'Notice' }, 'pdf'],
      ['downloads', { title: 'Document', category: 'General' }, 'file'],
    ]
    for (const [resource, fields, fileKey] of resources) {
      const form = new FormData()
      for (const [key, value] of Object.entries(fields)) form.append(key, value)
      form.append(fileKey, new Blob([fileKey === 'image' || fileKey === 'images' ? png : '%PDF-1.4\n'], { type: fileKey === 'image' || fileKey === 'images' ? 'image/png' : 'application/pdf' }), fileKey === 'image' || fileKey === 'images' ? 'x.png' : 'x.pdf')
      response = await call('POST', resource, form, token)
      assert.equal(response.status, 201, `${resource}: ${await response.clone().text()}`)
      const record = await data(response)
      const oldUrl = record.image || record.images?.[0]?.url || record.pdf || record.file
      const oldFile = oldUrl.replace(/^\/api\/files\//, '').replace(/^\/uploads\//, '')
      assert.ok((await readFile(resolveUploadPath(oldFile))).length)
      assert.equal((await call('GET', `${resource}/all`)).status, 401)
      assert.equal((await call('GET', `${resource}/all`, null, token)).status, 200)
      assert.equal((await call('GET', resource)).status, 200)
      assert.equal((await call('PUT', `${resource}/${record._id}`, { isActive: false }, token)).status, 200)
      assert.equal((await call('GET', `${resource}/${record._id}`)).status, 404)
      if (resource === 'staff') {
        const failed = new FormData(); failed.append('name', ''); failed.append('image', new Blob([png], { type: 'image/png' }), 'new.png')
        const filesBefore = await readdir(resolveUploadPath('images'))
        assert.equal((await call('PUT', `${resource}/${record._id}`, failed, token)).status, 400)
        assert.deepEqual(await readdir(resolveUploadPath('images')), filesBefore)
        assert.ok((await readFile(resolveUploadPath(oldFile))).length, 'Failed update must preserve old file')
      }
      assert.equal((await call('DELETE', `${resource}/${record._id}`, null, token)).status, 200)
      await assert.rejects(readFile(resolveUploadPath(oldFile)), { code: 'ENOENT' })
    }
    const bad = new FormData(); bad.append('name', 'Bad'); bad.append('designation', 'Staff'); bad.append('image', new Blob(['<html>bad</html>'], { type: 'image/png' }), 'fake.png')
    assert.equal((await call('POST', 'staff', bad, token)).status, 400)
    for (let i = 0; i < 11; i++) response = await call('POST', 'auth/login', { email: 'no-user@example.com', password })
    assert.equal(response.status, 429); assert.ok(Number(response.headers.get('retry-after')) > 0)
    const limits = await Promise.all(Array.from({ length: 15 }, () => consumeLimit('concurrency-test', 10, 60000)))
    assert.equal(limits.filter(x => x.allowed).length, 10)
    assert.equal((await call('PUT', 'auth/change-password', { currentPassword: password, newPassword: 'NewPassword123!' }, token)).status, 200)
    assert.equal((await call('GET', 'auth/check', null, token)).status, 401)
    assert.equal((await call('POST', 'auth/login', { email: 'admin@example.com', password })).status, 401)
    response = await call('POST', 'auth/login', { email: 'admin@example.com', password: 'NewPassword123!' })
    const token2 = response.headers.get('set-cookie').match(/adminToken=([^;]+)/)[1]
    assert.equal((await call('POST', 'auth/logout', null, token2)).status, 200)
    assert.equal((await call('GET', 'auth/check', null, token2)).status, 401)
    assert.match(await seedAdmin({ email: 'admin@example.com', password }, { reset: true }), /reset/)
    assert.ok(await RateLimit.countDocuments() > 0)
  } finally {
    // Never drop a supplied database. Temporary MongoDB is owned by the test launcher.
    await mongoose.disconnect(); delete globalThis.__maligaonMongoPromise
    process.chdir(old); await rm(dir, { recursive: true, force: true })
  }
})
