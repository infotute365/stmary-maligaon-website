import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import path from 'node:path'
import { resolveUploadPath } from '../config/localStorage.js'
import { disclosureFileAccess } from './disclosureFileAccess.js'

const types = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.pdf': 'application/pdf',
  '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain', '.zip': 'application/zip', '.rar': 'application/vnd.rar',
}
export async function serveUpload(request, context) {
  const { path: segments = [] } = await context.params
  if (segments[0] === 'disclosures') {
    const access = await disclosureFileAccess(request, segments)
    if (access !== 200) return new Response(access === 503 ? 'Document temporarily unavailable' : 'File not found', { status: access, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
  }
  let requested
  try { requested = resolveUploadPath(segments.join('/')) }
  catch { return new Response('Forbidden', { status: 403 }) }
  try {
    // Resolve symlinks too; a link inside uploads must not expose another directory.
    const actual = await fs.realpath(requested)
    const root = await fs.realpath(path.resolve(process.cwd(), 'uploads'))
    if (!actual.startsWith(`${root}${path.sep}`)) return new Response('Forbidden', { status: 403 })
    const stat = await fs.stat(actual)
    if (!stat.isFile()) return new Response('File not found', { status: 404 })
    const ext = path.extname(actual).toLowerCase()
    const headers = {
      'Content-Type': types[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes', 'Content-Length': String(stat.size),
      // Keep PDFs and images viewable. Other documents download rather than execute.
      'Content-Disposition': `${['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'].includes(ext) ? 'inline' : 'attachment'}; filename="${path.basename(actual).replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
      'Content-Security-Policy': "default-src 'none'; sandbox; frame-ancestors 'self'",
    }
    if (segments[0] === 'disclosures') {
      headers['Content-Type'] = 'application/pdf'
      headers['Cache-Control'] = 'no-store'
    }
    let start = 0
    let end = stat.size - 1
    let status = 200
    const range = request.headers.get('range')
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range)
      if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${stat.size}` } })
      if (!match[1]) start = Math.max(0, stat.size - Number(match[2]))
      else { start = Number(match[1]); if (match[2]) end = Math.min(end, Number(match[2])) }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${stat.size}` } })
      status = 206
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`
      headers['Content-Length'] = String(end - start + 1)
    }
    if (request.method === 'HEAD' || stat.size === 0) return new Response(null, { status, headers })
    const stream = createReadStream(actual, { start, end })
    return new Response(Readable.toWeb(stream), { status, headers })
  } catch (error) {
    return new Response('File not found', { status: 404 })
  }
}
