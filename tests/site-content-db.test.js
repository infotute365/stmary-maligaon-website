import { test } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import connectDB from '../src/server/config/database.js'
import SiteContent from '../src/server/models/SiteContent.js'
import { getSiteContent, updateSiteContent, resetSiteContent } from '../src/server/controllers/siteContentController.js'
import { contentRegistry } from '../src/content/registry.js'

const uri = process.env.TEST_MONGODB_URI
test('disposable MongoDB: unique initial writes, connection restart persistence and reset revisions', { skip: !uri }, async () => {
  assert.match(uri, /^mongodb:\/\/127\.0\.0\.1:\d+\/stmarys_test_[a-zA-Z0-9_-]+(?:\?|$)/, 'Use an explicitly configured fresh loopback database named stmarys_test_*')
  process.env.MONGODB_URI = uri
  const key = 'home.hero.slide1.title'
  const pageKey = 'cbse.schoolInfo.schoolData.name'
  const req = revision => ({ params: { key }, query: { group: 'home' }, body: { value: 'Disposable integration test', revision }, admin: { _id: new mongoose.Types.ObjectId() } })
  const res = () => ({ code: 200, body: null, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })
  let ownsRecord = false
  try {
    await connectDB()
    assert.equal(await SiteContent.countDocuments(), 0, 'SiteContent test collection must be empty')
    const results = await Promise.all([res(), res()].map(async response => {
      await updateSiteContent(req(0), response)
      return response
    }))
    ownsRecord = true
    assert.deepEqual(results.map(response => response.code).sort(), [200, 409])
    assert.equal(await SiteContent.countDocuments(), 1)
    const pageWrite = res()
    await updateSiteContent({ ...req(0), params: { key: pageKey }, body: { value: 'Disposable page content', revision: 0 } }, pageWrite)
    assert.equal(pageWrite.code, 200)
    assert.equal((await SiteContent.findById(pageKey)).group, 'cbse.schoolInfo')
    await mongoose.disconnect()
    delete globalThis.__maligaonMongoPromise
    await connectDB()
    const read = res()
    await getSiteContent(req(1), read)
    assert.equal(read.body.data[key], 'Disposable integration test')
    const pageRead = res()
    await getSiteContent({ ...req(1), query: { group: 'cbse.schoolInfo' } }, pageRead)
    assert.equal(pageRead.body.data[pageKey], 'Disposable page content')
    const pageReset = res()
    await resetSiteContent({ ...req(1), params: { key: pageKey }, body: { revision: 1 } }, pageReset)
    assert.equal(pageReset.body.data.value, contentRegistry[pageKey].defaultValue)
    const reset = res()
    await resetSiteContent({ ...req(1), body: { revision: 1 } }, reset)
    assert.equal(reset.body.data.value, contentRegistry[key].defaultValue)
    assert.equal(reset.body.data.revision, 2)
    const stale = res()
    await updateSiteContent(req(0), stale)
    assert.equal(stale.code, 409)
    assert.equal((await SiteContent.findById(key)).value, null)
  } finally {
    if (ownsRecord && mongoose.connection.readyState === 1) await SiteContent.deleteMany({ _id: { $in: [key, pageKey] } })
    await mongoose.disconnect()
    delete globalThis.__maligaonMongoPromise
  }
})
