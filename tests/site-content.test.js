import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { handleApiRequest } from '../app/api/[...path]/route.js'
import SiteContent from '../src/server/models/SiteContent.js'
import Admin from '../src/server/models/Admin.js'
import RateLimit from '../src/server/models/RateLimit.js'
import { contentFields, contentRegistry, contentGroups } from '../src/content/registry.js'
import { contentValueError, approvedOverrides } from '../src/content/validation.js'

const origin = 'http://content.test'
process.env.APP_ORIGIN = origin
process.env.JWT_SECRET = randomBytes(48).toString('hex')
// No real database connection is ever made by this suite, regardless of local environment files.
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/site_content_mock_only'
globalThis.__maligaonMongoPromise = Promise.resolve()
const adminId = '0123456789abcdef01234567'
const token = jwt.sign({ id: adminId, version: 0 }, process.env.JWT_SECRET, { algorithm: 'HS256' })
const records = new Map()
let failRead = false
let failWrite = false
let allowed = true
mock.method(Admin, 'findById', () => ({ select: async () => ({ _id: adminId, sessionVersion: 0 }) }))
mock.method(RateLimit, 'findOneAndUpdate', async () => ({ count: allowed ? 1 : 121 }))
mock.method(SiteContent, 'find', query => ({ select: () => ({ lean: async () => {
  if (failRead) throw new Error('Simulated read failure')
  return [...records.values()].filter(record => record.group === query.group)
} }) }))
mock.method(SiteContent, 'exists', async query => records.has(query._id))
mock.method(SiteContent, 'findOneAndUpdate', async (query, update, options) => {
  if (failWrite) throw new Error('Simulated write failure')
  const current = records.get(query._id)
  if (current && current.revision !== query.revision) {
    if (options.upsert) throw Object.assign(new Error('Duplicate key'), { code: 11000 })
    return null
  }
  if (!current && !options.upsert) return null
  const record = { ...current, ...(!current ? update.$setOnInsert : {}), ...update.$set, _id: query._id, revision: (current?.revision || 0) + 1, updatedAt: new Date() }
  records.set(query._id, record)
  return record
})

async function call(method, route, body, authenticated = false, headers = {}) {
  const [pathname, search = ''] = route.split('?')
  return handleApiRequest(new Request(`${origin}/api/${pathname}${search ? '?' + search : ''}`, {
    method, headers: { origin, ...(authenticated ? { cookie: `adminToken=${token}` } : {}), ...(body ? { 'content-type': 'application/json' } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }), { params: Promise.resolve({ path: pathname.split('/') }) })
}
const bodyOf = response => response.json()

test('registry has unique approved fields, valid exact defaults and bounded values', () => {
  assert.equal(contentFields.length, new Set(contentFields.map(field => field.key)).size)
  for (const field of contentFields) {
    assert.match(field.key, /^[a-zA-Z0-9.-]+$/)
    assert.ok(Object.hasOwn(contentGroups, field.group))
    assert.equal(contentValueError(field, field.defaultValue), '', field.key)
    assert.ok(field.label && field.section && field.enabled)
  }
  assert.ok(contentValueError(contentRegistry['global.school.established'], -1))
  assert.ok(contentValueError(contentRegistry['global.school.established'], NaN))
  assert.ok(contentValueError(contentRegistry['home.about.value2'], 'Infinity'))
  assert.ok(contentValueError(contentRegistry['home.about.value2'], '1e309'))
})

test('API security, persistence, concurrency, reset, failure preservation and rollback with isolated model doubles', async t => {
  const key = 'home.hero.slide1.title'
  await t.test('public reads are anonymous, projected to approved keys and group only', async () => {
    records.set('unknown', { key: 'unknown', group: 'home', value: 'Private', revision: 10, updatedBy: 'private' })
    records.set('wrong', { key: 'global.school.name', group: 'home', value: 'Wrong group' })
    records.set('invalid', { key: 'home.about.value2', group: 'home', value: 'broken' })
    const response = await call('GET', 'site-content?group=home')
    assert.equal(response.status, 200)
    assert.deepEqual((await bodyOf(response)).data, {})
    assert.equal(response.headers.get('cache-control'), 'no-store')
    records.clear()
    assert.equal((await call('GET', 'site-content?group=unknown')).status, 400)
    assert.equal((await call('GET', 'site-content?group=home&query=x')).status, 400)
  })
  await t.test('anonymous editor reads/writes and foreign-origin writes are rejected', async () => {
    assert.equal((await call('GET', 'site-content/all?group=home')).status, 401)
    for (const method of ['PUT', 'DELETE']) {
      assert.equal((await call(method, `site-content/${key}`, { value: 'x', revision: 0 })).status, 401)
      assert.equal((await call(method, `site-content/${key}`, { value: 'x', revision: 0 }, true, { origin: 'https://evil.test' })).status, 403)
    }
    assert.equal((await call('GET', 'site-content/all?group=home', null, false, { cookie: 'adminToken=forged' })).status, 401)
    assert.equal((await call('POST', 'site-content', { value: 'x' }, true)).status, 404)
    assert.equal((await call('GET', `site-content/${key}`)).status, 404)
    assert.equal((await call('PUT', `site-content/${key}/extra`, {}, true)).status, 404)
  })
  await t.test('unknown keys, nested structures, reserved fields, types, lengths and revisions are rejected', async () => {
    assert.equal((await call('PUT', 'site-content/global.disabled', { value: 'x', revision: 0 }, true)).status, 400)
    for (const value of [null, 42, false, {}, [], 'x'.repeat(contentRegistry[key].maxLength + 1), '']) assert.equal((await call('PUT', `site-content/${key}`, { value, revision: 0 }, true)).status, 400)
    for (const revision of [-1, 0.5, '0', null, Number.MAX_SAFE_INTEGER]) assert.equal((await call('PUT', `site-content/${key}`, { value: 'x', revision }, true)).status, 400)
    assert.equal((await call('PUT', `site-content/${key}`, { value: 'x', revision: 0, updatedBy: adminId }, true)).status, 400)
    assert.equal((await call('PUT', `site-content/${key}`, JSON.parse('{"__proto__":"x","value":"x","revision":0}'), true)).status, 400)
    assert.equal(records.size, 0)
  })
  await t.test('social URLs, email and telephone details validate protocols and destination types', async () => {
    const social = 'global.footer.facebookUrl'
    for (const value of ['javascript:alert(1)', '//facebook.com', 'http://facebook.com', 'https://evil.test', 'https://facebook.com.evil.test', 'https://user@facebook.com', 'https://facebook.com:444']) assert.equal((await call('PUT', `site-content/${social}`, { value, revision: 0 }, true)).status, 400)
    assert.equal(contentValueError(contentRegistry[social], 'https://www.facebook.com/school'), '')
    assert.equal((await call('PUT', 'site-content/global.school.email', { value: 'wrong', revision: 0 }, true)).status, 400)
    assert.equal((await call('PUT', 'site-content/global.school.phone', { value: 'not-a-phone', revision: 0 }, true)).status, 400)
  })
  await t.test('authenticated save creates one record; new public/admin requests retrieve its revision and value', async () => {
    const response = await call('PUT', `site-content/${key}`, { value: 'Saved title', revision: 0 }, true)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal((await bodyOf(response)).data.revision, 1)
    assert.equal(records.size, 1)
    assert.deepEqual((await bodyOf(await call('GET', 'site-content?group=home'))).data, { [key]: 'Saved title' })
    const editor = await bodyOf(await call('GET', 'site-content/all?group=home', null, true))
    const field = editor.data.find(field => field.key === key)
    assert.equal(field.revision, 1); assert.equal(field.value, 'Saved title')
    assert.ok(editor.data.every(field => !('_id' in field) && !('updatedBy' in field)))
    assert.deepEqual((await bodyOf(await call('GET', 'site-content?group=global'))).data, {})
  })
  await t.test('atomic stale first-save, update and reset conflicts return 409 and preserve content', async () => {
    assert.equal((await call('PUT', `site-content/${key}`, { value: 'Stale', revision: 0 }, true)).status, 409)
    const responses = await Promise.all(['Editor A', 'Editor B'].map(value => call('PUT', `site-content/${key}`, { value, revision: 1 }, true)))
    assert.deepEqual(responses.map(response => response.status).sort(), [200, 409])
    assert.equal(records.get(key).revision, 2)
    assert.equal((await call('DELETE', `site-content/${key}`, { revision: 1 }, true)).status, 409)
    assert.equal(records.get(key).value, 'Editor A')
  })
  await t.test('failed writes and read failures cannot report success or lose the saved record', async () => {
    failWrite = true
    for (const method of ['PUT', 'DELETE']) assert.equal((await call(method, `site-content/${key}`, { ...(method === 'PUT' ? { value: 'Fail' } : {}), revision: 2 }, true)).status, 500)
    failWrite = false
    assert.equal(records.get(key).value, 'Editor A')
    failRead = true
    const response = await call('GET', 'site-content?group=home')
    assert.equal(response.status, 503); assert.deepEqual((await bodyOf(response)).data, {})
    failRead = false
    assert.equal(records.get(key).value, 'Editor A')
  })
  await t.test('rate-limited saves are rejected without modifying the record', async () => {
    allowed = false
    const response = await call('PUT', `site-content/${key}`, { value: 'Limited', revision: 2 }, true)
    assert.equal(response.status, 429); assert.ok(response.headers.get('retry-after'))
    allowed = true
    assert.equal(records.get(key).revision, 2)
  })
  await t.test('reset restores exact defaults and retains a revision tombstone against stale recreation', async () => {
    const response = await call('DELETE', `site-content/${key}`, { revision: 2 }, true)
    assert.equal(response.status, 200)
    const restored = (await bodyOf(response)).data
    assert.equal(restored.value, contentRegistry[key].defaultValue)
    assert.equal(restored.revision, 3); assert.equal(restored.hasOverride, false)
    assert.deepEqual((await bodyOf(await call('GET', 'site-content?group=home'))).data, {})
    assert.equal((await call('PUT', `site-content/${key}`, { value: 'Stale resurrection', revision: 0 }, true)).status, 409)
    assert.equal((await call('PUT', `site-content/${key}`, { value: 'Fresh edit', revision: 3 }, true)).status, 200)
    assert.equal(records.size, 1)
    const absent = 'home.hero.slide2.title'
    assert.equal((await call('DELETE', `site-content/${absent}`, { revision: 0 }, true)).status, 200)
    assert.equal(records.size, 1, 'Reset of an absent override must not seed a default')
  })
  await t.test('rollback suppresses public overrides but preserves admin records and does not seed defaults', async () => {
    process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'false'
    assert.deepEqual((await bodyOf(await call('GET', 'site-content?group=home'))).data, {})
    const editor = await bodyOf(await call('GET', 'site-content/all?group=home', null, true))
    assert.equal(editor.overridesEnabled, false)
    assert.equal(editor.data.find(field => field.key === key).value, 'Fresh edit')
    delete process.env.SITE_CONTENT_OVERRIDES_ENABLED
    assert.equal(records.size, 1)
    assert.equal(approvedOverrides('home', [...records.values()])[key], 'Fresh edit')
    assert.equal((await call('GET', 'health')).status, 200)
    assert.equal((await call('GET', 'staff/bad-id')).status, 400)
    assert.equal((await call('GET', 'circulars/all')).status, 401)
  })
  await t.test('every new page group uses the existing authenticated API, persists independently and resets without changing Phase 1', async () => {
    for (const group of Object.keys(contentGroups).filter(group => !['global', 'home'].includes(group))) {
      const field = contentFields.find(field => field.group === group && ['text', 'textarea'].includes(field.type))
      const value = 'Page-specific saved text'
      const saved = await call('PUT', `site-content/${field.key}`, { value, revision: 0 }, true)
      assert.equal(saved.status, 200, field.key)
      const read = await bodyOf(await call('GET', `site-content?group=${group}`))
      assert.deepEqual(read.data, { [field.key]: value })
      const editor = await bodyOf(await call('GET', `site-content/all?group=${group}`, null, true))
      assert.ok(editor.data.every(item => item.group === group))
      assert.equal(editor.data.find(item => item.key === field.key).revision, 1)
      assert.equal((await call('PUT', `site-content/${field.key}`, { value: 'Stale text', revision: 0 }, true)).status, 409)
      const reset = await bodyOf(await call('DELETE', `site-content/${field.key}`, { revision: 1 }, true))
      assert.equal(reset.data.value, field.defaultValue)
      assert.deepEqual((await bodyOf(await call('GET', `site-content?group=${group}`))).data, {})
    }
    assert.equal(records.get(key).value, 'Fresh edit')
  })
  await t.test('new formatted field types are also validated at the server boundary', async () => {
    for (const type of ['number', 'integerText', 'year', 'yearRange', 'currency', 'choice', 'measurement', 'webAddress', 'email', 'tel']) {
      const field = contentFields.find(field => field.group !== 'home' && field.group !== 'global' && field.type === type)
      assert.ok(field, type)
      const response = await call('PUT', `site-content/${field.key}`, { value: type === 'number' ? -5 : 'javascript:alert(1)', revision: 0 }, true)
      assert.equal(response.status, 400, type)
      if (field.maxLength) assert.equal((await call('PUT', `site-content/${field.key}`, { value: 'x'.repeat(field.maxLength + 1), revision: 0 }, true)).status, 400)
    }
  })
})
