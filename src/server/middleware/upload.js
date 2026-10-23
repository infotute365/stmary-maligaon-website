import sharp from 'sharp'
import path from 'node:path'
import { removeLocalUpload, writeLocalUpload } from '../config/localStorage.js'
import { badRequest } from '../security/errors.js'

export const imageExtensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' }
export async function validateImage(buffer, mime) {
  const metadata = await sharp(buffer, { limitInputPixels: 25000000, animated: true }).metadata()
  const expected = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' }[mime]
  if (!expected || metadata.format !== expected || (metadata.pages || 1) > 100 || (metadata.width || 0) * (metadata.height || 0) * (metadata.pages || 1) > 25000000) throw badRequest('Invalid or excessively large image')
  // Decode before committing, so truncated/corrupt files also fail validation.
  await sharp(buffer, { limitInputPixels: 25000000, animated: true }).stats()
}
export async function prepareImage(buffer, mime) {
  try {
    await validateImage(buffer, mime)
    // Keep animated GIFs intact and preserve PNG transparency and MIME/extension.
    if (mime === 'image/gif' || (await sharp(buffer).metadata()).pages > 1) return buffer
    return await sharp(buffer, { limitInputPixels: 25000000 }).rotate().resize({ width: 1200, withoutEnlargement: true }).toBuffer()
  } catch (error) { throw badRequest('Invalid image upload') }
}
export function validateDocument(buffer, ext) {
  const zip = buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))
  const ole = buffer.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'))
  const rar = buffer.subarray(0, 6).equals(Buffer.from('526172211a07', 'hex'))
  const valid = ext === '.pdf' ? buffer.subarray(0, 5).toString() === '%PDF-' :
    ['.zip', '.docx', '.xlsx', '.pptx'].includes(ext) ? zip :
    ['.doc', '.xls', '.ppt'].includes(ext) ? ole : ext === '.rar' ? rar :
    ext === '.txt' ? !buffer.includes(0) : false
  if (!valid) throw badRequest('File content does not match its extension')
}
// Controllers queue old files; the API deletes them only after the DB succeeds.
export async function deleteFile(filePath, req) {
  if (!req) throw new Error('File deletion requires a request context')
  req.pendingDeletes.push(filePath)
  return true
}
export async function cleanupUploads(paths) {
  for (const filePath of paths) {
    try { await removeLocalUpload(filePath) } catch (error) { console.error('Upload cleanup failed:', error.code || error.name) }
  }
}
