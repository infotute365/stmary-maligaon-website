import SiteContent from '../models/SiteContent.js'
import connectDB from '../config/database.js'
import { badRequest } from '../security/errors.js'
import { contentFields, contentRegistry } from '../../content/registry.js'
import { validContentGroup, contentValueError, approvedOverrides } from '../../content/validation.js'

function groupFrom(req) {
  if (Object.keys(req.query).some(key => key !== 'group') || !validContentGroup(req.query.group)) throw badRequest('Choose a valid content group')
  return req.query.group
}

function editFrom(req, reset) {
  const field = contentRegistry[req.params.key]
  if (!field?.enabled) throw badRequest('Unknown or disabled content field')
  const allowed = reset ? ['revision'] : ['revision', 'value']
  if (Object.keys(req.body).some(key => !allowed.includes(key))) throw badRequest('Unexpected content field')
  if (!Number.isSafeInteger(req.body.revision) || req.body.revision < 0 || req.body.revision >= Number.MAX_SAFE_INTEGER) throw badRequest('Invalid revision')
  if (!reset) {
    const error = contentValueError(field, req.body.value)
    if (error) throw badRequest(error)
  }
  return field
}

const conflict = res => res.status(409).json({ success: false, message: 'This field changed in another session. Reload the saved value before trying again.' })

export const getSiteContent = async (req, res) => {
  const group = groupFrom(req)
  if (process.env.SITE_CONTENT_OVERRIDES_ENABLED === 'false') return res.json({ success: true, data: {} })
  try {
    await connectDB()
    const records = await SiteContent.find({ group }).select('key value -_id').lean()
    return res.json({ success: true, data: approvedOverrides(group, records) })
  } catch (error) {
    console.error('Site content read failed:', error.name, error.code || '')
    return res.status(503).json({ success: false, message: 'Website text is temporarily unavailable. Original text remains available.', data: {} })
  }
}

export const getAllSiteContent = async (req, res) => {
  const group = groupFrom(req)
  const records = await SiteContent.find({ group }).select('key value revision updatedAt -_id').lean()
  const saved = Object.fromEntries(records.map(record => [record.key, record]))
  const values = approvedOverrides(group, records)
  return res.json({ success: true, overridesEnabled: process.env.SITE_CONTENT_OVERRIDES_ENABLED !== 'false', data: contentFields.filter(field => field.group === group && field.enabled).map(field => ({
    ...field, value: values[field.key] ?? field.defaultValue, revision: saved[field.key]?.revision || 0,
    hasOverride: Object.hasOwn(values, field.key), updatedAt: saved[field.key]?.updatedAt || null,
  })) })
}

async function writeContent(req, res, reset) {
  const field = editFrom(req, reset)
  const { revision } = req.body
  // Retain a revision tombstone on reset to prevent stale writes after a reset/recreate cycle.
  if (reset && revision === 0) {
    if (await SiteContent.exists({ _id: field.key })) return conflict(res)
    return res.json({ success: true, data: { key: field.key, value: field.defaultValue, revision: 0, hasOverride: false, updatedAt: null } })
  }
  let record
  try {
    record = await SiteContent.findOneAndUpdate({ _id: field.key, revision }, {
      $set: { value: reset ? null : req.body.value, updatedBy: req.admin._id },
      $setOnInsert: { key: field.key, group: field.group },
      $inc: { revision: 1 },
    }, { new: true, upsert: revision === 0, runValidators: true, setDefaultsOnInsert: false })
  } catch (error) {
    if (error.code === 11000) return conflict(res)
    throw error
  }
  if (!record) return conflict(res)
  return res.json({ success: true, data: { key: field.key, value: reset ? field.defaultValue : record.value, revision: record.revision, hasOverride: !reset, updatedAt: record.updatedAt } })
}

export const updateSiteContent = (req, res) => writeContent(req, res, false)
export const resetSiteContent = (req, res) => writeContent(req, res, true)
