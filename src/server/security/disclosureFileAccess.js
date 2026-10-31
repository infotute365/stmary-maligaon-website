import connectDB from '../config/database.js'
import DisclosureDocument from '../models/DisclosureDocument.js'
import { disclosureFilePath } from '../../content/disclosureDocuments.js'
import { requestMetadata } from './request.js'
import { protect } from '../middleware/auth.js'
import { disclosureFileAvailable } from './disclosurePdf.js'

export async function disclosureFileAccess(request, segments) {
  const storedPath = segments.join('/')
  if (segments.length !== 2 || !disclosureFilePath.test(storedPath)) return 403
  try {
    await connectDB()
    const record = await DisclosureDocument.findOne({ $or: [{ 'current.path': storedPath }, { 'previous.path': storedPath }] }).select('type current previous active').lean()
    if (!record) return 404 // Uncommitted and orphan files are never publicly accessible.
    const version = record.current?.path === storedPath ? record.current : record.previous
    if (!(await disclosureFileAvailable(version))) return 404
    if (record.current?.path === storedPath && (record.type === 'fixed' || record.active)) return 200
    const req = requestMetadata(request)
    if (!req.cookies.adminToken && !req.headers.authorization?.startsWith('Bearer ')) return 404
    let allowed = false
    const res = { status() { return this }, json() { return this } }
    await protect(req, res, () => { allowed = true })
    return allowed ? 200 : 404
  } catch (error) {
    console.error('Disclosure file access failed:', error.name, error.code || '')
    return 503
  }
}
