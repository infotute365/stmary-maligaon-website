import { badRequest } from './errors.js'
export function requestMetadata(request) {
  const cookies = Object.create(null)
  for (const item of (request.headers.get('cookie') || '').split(';')) {
    const index = item.indexOf('=')
    if (index < 1) continue
    try { cookies[item.slice(0, index).trim()] = decodeURIComponent(item.slice(index + 1).trim()) } catch { /* Ignore malformed cookies. */ }
  }
  return { method: request.method, headers: Object.fromEntries(request.headers), cookies,
    params: {}, body: {}, query: Object.fromEntries(new URL(request.url).searchParams),
    pendingDeletes: [], newUploads: [], get(name) { return this.headers[name.toLowerCase()] } }
}
export async function boundedBody(request, limit) {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > limit) throw Object.assign(new Error('Request body is too large'), { status: 413 })
  if (!request.body) return Buffer.alloc(0)
  const reader = request.body.getReader()
  const chunks = []
  let length = 0
  const timeout = setTimeout(() => reader.cancel(new Error("Body read timed out")).catch(() => {}), 15000)
  const deadline = Date.now() + 15000
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (Date.now() >= deadline) throw Object.assign(new Error("Request body timed out"), { status: 408 })
      if (done) break
      length += value.byteLength
      if (length > limit) { await reader.cancel(); throw Object.assign(new Error('Request body is too large'), { status: 413 }) }
      chunks.push(value)
    }
  } finally { clearTimeout(timeout); reader.releaseLock() }
  return Buffer.concat(chunks, length)
}
export function validateFlatBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw badRequest('Expected an object')
  if (Object.keys(body).length > 30) throw badRequest('Too many fields')
  for (const [key, value] of Object.entries(body)) {
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(key) || ['constructor', 'prototype'].includes(key)) throw badRequest('Invalid field name')
    if (value !== null && !['string', 'boolean', 'number'].includes(typeof value)) throw badRequest('Fields must contain simple values')
    if (typeof value === 'string' && value.length > 20000) throw badRequest('Field is too long')
    if (typeof value === 'number' && !Number.isFinite(value)) throw badRequest('Invalid number')
  }
  return body
}
