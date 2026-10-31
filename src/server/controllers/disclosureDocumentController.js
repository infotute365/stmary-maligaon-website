import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import DisclosureDocument from '../models/DisclosureDocument.js'
import connectDB from '../config/database.js'
import { badRequest } from '../security/errors.js'
import { cleanupUploads } from '../middleware/upload.js'
import { disclosureDirectory, disclosureFileAvailable, storeDisclosurePdf } from '../security/disclosurePdf.js'
import { disclosureFilePath, disclosureOriginals, disclosureUrl, fixedDisclosureDocuments, fixedDisclosureByKey, customDisclosureKey, documentTitleError, normalizeDocumentTitle } from '../../content/disclosureDocuments.js'

const conflict = () => Object.assign(new Error('This document changed in another session. Reload the document list and try again.'), { status: 409 })
function requireQuery(req) {
  if (Object.keys(req.query).length) throw badRequest('Document query parameters are not supported')
}
function requireBody(req, allowed) {
  requireQuery(req)
  if (Object.keys(req.body).some(key => !allowed.includes(key))) throw badRequest('Unexpected or protected document field')
}
function revisionFrom(req) {
  const value = req.body.revision
  const revision = typeof value === 'string' && /^(?:0|[1-9]\d{0,15})$/.test(value) ? Number(value) : value
  if (!Number.isSafeInteger(revision) || revision < 0 || revision >= Number.MAX_SAFE_INTEGER) throw badRequest('Invalid document revision')
  return revision
}
function documentKey(req) {
  const key = req.params.documentKey
  if (!Object.hasOwn(fixedDisclosureByKey, key) && !customDisclosureKey.test(key)) throw badRequest('Unknown disclosure document')
  return key
}
function customTitle(value) {
  const error = documentTitleError(value)
  if (error) throw badRequest(error)
  return { title: value.trim(), titleKey: normalizeDocumentTitle(value.trim()) }
}
async function currentRecord(key, revision) {
  const record = await DisclosureDocument.findById(key).lean()
  if (customDisclosureKey.test(key) && (!record || record.type !== 'additional')) throw Object.assign(new Error('Additional document not found'), { status: 404 })
  if ((record?.revision || 0) !== revision) throw conflict()
  if (record && record.type !== (fixedDisclosureByKey[key] ? 'fixed' : 'additional')) throw badRequest('Invalid document identity')
  return record
}
async function safeVersion(version) {
  if (!(await disclosureFileAvailable(version))) return null
  return { url: disclosureUrl(version.path), originalName: version.originalName, size: version.size, uploadedAt: version.uploadedAt }
}
async function editorRecord(key, record) {
  const fixed = fixedDisclosureByKey[key]
  const current = await safeVersion(record?.current)
  const previous = await safeVersion(record?.previous)
  return { key, type: fixed ? 'fixed' : 'additional', name: fixed ? fixed.name : record.title,
    url: current?.url || fixed?.url || null, revision: record?.revision || 0, active: fixed ? true : record.active,
    hasReplacement: !!current, current, previous, updatedAt: record?.updatedAt || null,
    missingFile: !!record?.current && !current,
  }
}

export const getDisclosureDocuments = async (req, res) => {
  requireQuery(req)
  const data = disclosureOriginals()
  if (process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED === 'false') return res.json({ success: true, data })
  try {
    await connectDB()
    const records = await DisclosureDocument.find({}).select('_id type title current active createdAt').sort({ createdAt: 1, _id: 1 }).limit(62).lean()
    for (const record of records) {
      const url = (await disclosureFileAvailable(record.current)) ? disclosureUrl(record.current.path) : null
      if (!url) continue
      if (Object.hasOwn(fixedDisclosureByKey, record._id) && record.type === 'fixed') data.fixed[record._id].url = url
      else if (record.type === 'additional' && record.active && customDisclosureKey.test(record._id) && !documentTitleError(record.title)) data.additional.push({ key: record._id, name: record.title, url })
    }
    return res.json({ success: true, data })
  } catch (error) {
    console.error('Disclosure metadata read failed:', error.name, error.code || '')
    return res.status(503).json({ success: false, message: 'Original disclosure documents remain available while document updates are unavailable.', data: disclosureOriginals() })
  }
}

export const getAllDisclosureDocuments = async (req, res) => {
  requireQuery(req)
  const records = await DisclosureDocument.find({}).sort({ createdAt: 1, _id: 1 }).limit(62).lean()
  const byKey = Object.fromEntries(records.map(record => [record._id, record]))
  const fixed = await Promise.all(fixedDisclosureDocuments.map(document => editorRecord(document.key, byKey[document.key])))
  const additional = await Promise.all(records.filter(record => record.type === 'additional' && customDisclosureKey.test(record._id)).map(record => editorRecord(record._id, record)))
  return res.json({ success: true, overridesEnabled: process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED !== 'false', data: { fixed, additional, maximumAdditional: 50 } })
}

// Called only after the metadata commit. Server-generated references are never reused
// by another upload; the additional reference check also protects retained versions.
async function releaseVersions(req, versions) {
  for (const version of versions.filter(Boolean)) {
    if (!disclosureFilePath.test(version.path)) continue
    try {
      const referenced = await DisclosureDocument.exists({ $or: [{ 'current.path': version.path }, { 'previous.path': version.path }] })
      if (!referenced) req.pendingDeletes.push(version.path)
    } catch (error) { console.error('Disclosure retention cleanup deferred:', error.name, error.code || '') }
  }
}

// Reconcile only old, generated files in the new dedicated directory. Recent files
// may belong to concurrent in-flight requests, so they always survive this sweep.
export async function pruneDisclosureOrphans({ now = Date.now(), dryRun = true, maximum = 100 } = {}) {
  const directory = await disclosureDirectory()
  const records = await DisclosureDocument.find({}).select('current.path previous.path').limit(62).lean()
  const referenced = new Set(records.flatMap(record => [record.current?.path, record.previous?.path]).filter(Boolean))
  const candidates = []
  for (const filename of (await fs.readdir(directory)).sort()) {
    if (candidates.length >= maximum) break
    const storedPath = `disclosures/${filename}`
    if (!disclosureFilePath.test(storedPath) || referenced.has(storedPath)) continue
    const stat = await fs.lstat(path.join(directory, filename))
    if (stat.isFile() && !stat.isSymbolicLink() && now - stat.mtimeMs > 24 * 60 * 60 * 1000) candidates.push(storedPath)
  }
  if (!dryRun) await cleanupUploads(candidates)
  return { candidates: candidates.length, dryRun }
}

let indexClient, indexPromise
async function beforeUpload() {
  const client = DisclosureDocument.db.getClient()
  if (indexClient !== client) {
    indexClient = client
    // Explicit initialization after connect also handles a new driver client after
    // reconnect; Model.init() can retain an earlier automatic-init rejection.
    indexPromise = DisclosureDocument.createIndexes().catch(error => { indexClient = null; throw error })
  }
  await indexPromise
  await pruneDisclosureOrphans({ dryRun: false })
}

export const createDisclosureDocument = async (req, res) => {
  requireBody(req, ['title'])
  const title = customTitle(req.body.title)
  await beforeUpload()
  const existing = await DisclosureDocument.find({ type: 'additional' }).select('slot titleKey').limit(50).lean()
  if (existing.some(record => record.titleKey === title.titleKey)) throw Object.assign(new Error('An additional document with this name already exists.'), { status: 409 })
  const occupied = new Set(existing.map(record => record.slot))
  const slots = Array.from({ length: 50 }, (_, slot) => slot).filter(slot => !occupied.has(slot))
  if (!slots.length) throw Object.assign(new Error('The limit of 50 additional documents has been reached.'), { status: 409 })
  const version = await storeDisclosurePdf(req.file, req)
  const key = `custom-${randomUUID()}`
  for (const slot of slots) {
    try {
      const record = await DisclosureDocument.create({ _id: key, type: 'additional', slot, ...title, current: version, previous: null, active: true, revision: 1, updatedBy: req.admin._id })
      return res.status(201).json({ success: true, data: await editorRecord(key, record.toObject()) })
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.slot) continue
      if (error.code === 11000) throw Object.assign(new Error('An additional document with this name already exists.'), { status: 409 })
      throw error
    }
  }
  throw Object.assign(new Error('The additional document slots changed. Please reload and try again.'), { status: 409 })
}

async function commitVersion(req, key, record, revision, current, previous) {
  let updated
  try {
    updated = await DisclosureDocument.findOneAndUpdate({ _id: key, revision }, {
      $set: { current, previous, updatedBy: req.admin._id },
      $setOnInsert: { type: 'fixed', active: true }, $inc: { revision: 1 },
    }, { new: true, upsert: !record && !!fixedDisclosureByKey[key], runValidators: true, setDefaultsOnInsert: false })
  } catch (error) { if (error.code === 11000) throw conflict(); throw error }
  if (!updated) throw conflict()
  const retained = new Set([current?.path, previous?.path])
  await releaseVersions(req, [record?.current, record?.previous].filter(version => version && !retained.has(version.path)))
  return updated.toObject()
}

export const replaceDisclosureDocument = async (req, res) => {
  requireBody(req, ['revision'])
  const key = documentKey(req), revision = revisionFrom(req)
  const record = await currentRecord(key, revision)
  await beforeUpload()
  const version = await storeDisclosurePdf(req.file, req)
  const updated = await commitVersion(req, key, record, revision, version, record?.current || record?.previous || null)
  return res.json({ success: true, data: await editorRecord(key, updated) })
}

export const restoreDisclosureDocument = async (req, res) => {
  requireBody(req, ['revision', 'version'])
  const key = documentKey(req), revision = revisionFrom(req)
  if (!['original', 'previous'].includes(req.body.version)) throw badRequest('Choose Original or Previous version')
  if (req.body.version === 'original' && !fixedDisclosureByKey[key]) throw badRequest('Only fixed documents have an original static PDF')
  const record = await currentRecord(key, revision)
  if (!record) {
    if (req.body.version === 'previous') throw Object.assign(new Error('A valid previous version is not available.'), { status: 409 })
    return res.json({ success: true, data: await editorRecord(key, null) })
  }
  if (req.body.version === 'previous' && !(await disclosureFileAvailable(record.previous))) throw Object.assign(new Error('A valid previous version is not available.'), { status: 409 })
  const current = req.body.version === 'original' ? null : record.previous
  const previous = record.current || (req.body.version === 'original' ? record.previous : null)
  const updated = await commitVersion(req, key, record, revision, current, previous)
  return res.json({ success: true, data: await editorRecord(key, updated) })
}

export const updateDisclosureDocument = async (req, res) => {
  requireBody(req, ['revision', 'title', 'active'])
  const key = documentKey(req), revision = revisionFrom(req)
  if (fixedDisclosureByKey[key]) throw Object.assign(new Error('Fixed disclosure names and identities cannot be edited.'), { status: 403 })
  await currentRecord(key, revision)
  const update = { updatedBy: req.admin._id }
  if (Object.hasOwn(req.body, 'title')) Object.assign(update, customTitle(req.body.title))
  if (Object.hasOwn(req.body, 'active')) {
    if (typeof req.body.active !== 'boolean') throw badRequest('Active status must be true or false')
    update.active = req.body.active
  }
  if (Object.keys(update).length === 1) throw badRequest('Choose a title or publication status to update')
  let record
  try { record = await DisclosureDocument.findOneAndUpdate({ _id: key, type: 'additional', revision }, { $set: update, $inc: { revision: 1 } }, { new: true, runValidators: true }) }
  catch (error) { if (error.code === 11000) throw Object.assign(new Error('An additional document with this name already exists.'), { status: 409 }); throw error }
  if (!record) throw conflict()
  return res.json({ success: true, data: await editorRecord(key, record.toObject()) })
}

export const deleteDisclosureDocument = async (req, res) => {
  requireBody(req, ['revision'])
  const key = documentKey(req), revision = revisionFrom(req)
  if (fixedDisclosureByKey[key]) throw Object.assign(new Error('Fixed disclosure entries cannot be deleted.'), { status: 403 })
  const record = await currentRecord(key, revision)
  const result = await DisclosureDocument.deleteOne({ _id: key, type: 'additional', revision })
  if (!result.deletedCount) throw conflict()
  await releaseVersions(req, [record.current, record.previous])
  return res.json({ success: true, message: 'Additional document removed.' })
}
