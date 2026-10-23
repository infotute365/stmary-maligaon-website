import { NextResponse } from 'next/server'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import connectDB from '@/server/config/database.js'
import { writeLocalUpload } from '@/server/config/localStorage.js'
import { protect } from '@/server/middleware/auth.js'
import { prepareImage, validateDocument, cleanupUploads } from '@/server/middleware/upload.js'
import { requestMetadata, boundedBody, validateFlatBody } from '@/server/security/request.js'
import { isTrustedRequest } from '@/server/middleware/csrf.js'
import { consumeLimit, clientKey } from '@/server/security/rateLimit.js'
import { badRequest } from '@/server/security/errors.js'

import { login, logout, checkAuth, changePassword } from '@/server/controllers/authController.js'
import { createManagement, getManagement, getAllManagement, getManagementById, updateManagement, deleteManagement } from '@/server/controllers/managementController.js'
import { createCommittee, getCommittee, getAllCommittee, getCommitteeById, updateCommittee, deleteCommittee } from '@/server/controllers/managingCommitteeController.js'
import { createStaff, getStaff, getAllStaff, getStaffById, updateStaff, deleteStaff } from '@/server/controllers/staffController.js'
import { createTeachingStaff, getTeachingStaff, getAllTeachingStaff, getTeachingStaffById, updateTeachingStaff, deleteTeachingStaff } from '@/server/controllers/teachingStaffController.js'
import { createCircular, getCirculars, getAllCirculars, getCircularById, updateCircular, deleteCircular } from '@/server/controllers/circularController.js'
import { createGallery, getGalleries, getAllGalleries, getGalleryById, updateGallery, deleteGallery, toggleGalleryStatus } from '@/server/controllers/galleryController.js'
import { createDownload, getDownloads, getAllDownloads, getDownloadById, updateDownload, deleteDownload, toggleDownloadStatus } from '@/server/controllers/downloadController.js'

const cookieOptions = (options = {}) => {
  const production = process.env.NODE_ENV === 'production'
  return {
    httpOnly: options.httpOnly ?? true,
    secure: production ? (options.secure ?? true) : false,
    sameSite: 'lax',
    
    maxAge: options.maxAge === undefined ? undefined : Math.floor(options.maxAge / 1000),
    path: options.path ?? '/',
  }
}

function createResponse() {
  const state = { status: 200, body: null, cookies: [], headers: {} }
  return {
    state,
    status(code) { state.status = code; return this },
    json(body) { state.body = body; return this },
    cookie(name, value, options = {}) {
      state.cookies.push({ name, value, options: cookieOptions(options) })
      return this
    },
    clearCookie(name, options = {}) {
      state.cookies.push({ name, value: '', options: { ...cookieOptions(options), maxAge: 0 } })
      return this
    },
    setHeader(name, value) { state.headers[name] = value; return this },
    get(name) { return state.headers?.[name.toLowerCase()] },
  }
}

const extensionForMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

async function writeUpload(file, type, fieldname, req) {
  const originalname = file.name || 'upload'
  const mimetype = file.type || 'application/octet-stream'
  const size = file.size || 0

  const limits = {
    image: 5 * 1024 * 1024,
    pdf: 10 * 1024 * 1024,
    document: 20 * 1024 * 1024,
  }
  if (!size || size > limits[type]) throw Object.assign(new Error(`File too large. Maximum size is ${limits[type] / (1024 * 1024)}MB`), { status: 400 })

  let directory
  let filename
  if (type === 'image') {
    if (!extensionForMime[mimetype]) throw Object.assign(new Error('Only image files are allowed'), { status: 400 })
    directory = 'images'
    filename = `${uuidv4()}${extensionForMime[mimetype]}`
  } else if (type === 'pdf') {
    if (mimetype !== 'application/pdf' || path.extname(originalname).toLowerCase() !== '.pdf') {
      throw Object.assign(new Error('Only PDF files are allowed'), { status: 400 })
    }
    filename = `${uuidv4()}.pdf`
    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw Object.assign(new Error('Invalid PDF upload'), { status: 400 })
    }
    validateDocument(buffer, ".pdf")
    req.newUploads.push(`circulars/${filename}`)
    await writeLocalUpload(`circulars/${filename}`, buffer)
    return {
      fieldname,
      originalname,
      encoding: '7bit',
      mimetype,
      destination: 'circulars',
      filename,
      path: '',
      buffer,
      size,
    }
  } else {
    const allowed = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.zip', '.rar'])
    const ext = path.extname(originalname).toLowerCase()
    if (!allowed.has(ext)) throw Object.assign(new Error('Only document files are allowed'), { status: 400 })
    directory = 'downloads'
    filename = `${uuidv4()}${ext}`
  }

  let buffer = Buffer.from(await file.arrayBuffer())
  if (type === 'image') buffer = await prepareImage(buffer, mimetype)
  else validateDocument(buffer, path.extname(filename))
  req.newUploads.push(`${directory}/${filename}`)
  await writeLocalUpload(`${directory}/${filename}`, buffer)

  return {
    fieldname,
    originalname,
    encoding: '7bit',
    mimetype,
    destination: directory,
    filename,
    path: '',
    buffer,
    size,
  }
}

async function parseRequest(request, pathParts, req, route) {
  if (['GET', 'HEAD'].includes(request.method)) return req
  const contentType = request.headers.get('content-type') || ''
  const multipart = contentType.includes('multipart/form-data')
  if (multipart && !route.upload) throw badRequest('This route does not accept files')
  if (multipart) {
    const buffer = await boundedBody(request, 21 * 1024 * 1024)
    let form
    try { form = await new Request(request.url, { method: 'POST', headers: { 'content-type': contentType }, body: buffer }).formData() }
    catch { throw badRequest('Invalid multipart form') }
    const body = Object.create(null)
    const incoming = []
    const expected = { 'image-single': 'image', images: 'images', pdf: 'pdf', document: 'file' }[route.upload]
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') {
        if (Object.hasOwn(body, key)) throw badRequest('Duplicate form field')
        body[key] = value
      } else {
        if (key !== expected) throw badRequest('Unexpected upload field')
        incoming.push(value)
      }
    }
    req.body = validateFlatBody(body)
    if (incoming.length > (route.upload === 'images' ? 4 : 1)) throw badRequest('Too many uploaded files')
    // Sequential processing avoids multiplying image decoder memory usage.
    const files = []
    for (const value of incoming) files.push(await writeUpload(value, route.upload === 'pdf' ? 'pdf' : route.upload === 'document' ? 'document' : 'image', expected, req))
    if (route.upload === 'images') req.files = files
    else req.file = files[0]
  } else {
    const buffer = await boundedBody(request, 64 * 1024)
    if (buffer.length && !contentType.includes('application/json')) throw Object.assign(new Error('Expected JSON'), { status: 415 })
    try { req.body = validateFlatBody(buffer.length ? JSON.parse(buffer.toString('utf8')) : {}) }
    catch (error) { if (error instanceof SyntaxError) throw badRequest('Invalid JSON'); throw error }
  }
  return req
}

async function runMiddleware(middleware, req, res) {
  let nextCalled = false
  await middleware(req, res, () => { nextCalled = true })
  return nextCalled
}

function matchRoute(method, parts) {
  const [resource, first, second] = parts
  if (parts.length > 3 || (parts.length === 3 && !(method === 'PATCH' && ['gallery', 'downloads'].includes(resource) && second === 'toggle'))) return null
  if (resource === 'auth' && parts.length !== 2) return null
  if (resource === 'health' && !(parts.length === 1 || (parts.length === 2 && first === 'ready'))) return null

  if (resource === 'health' && first === 'ready' && method === 'GET') return { handler: async (_req, res) => { await connectDB(); res.json({ success: true, message: 'Database is ready' }) } }
  if (resource === 'health' && method === 'GET') return { handler: (_req, res) => res.json({ success: true, message: 'API is running' }) }

  if (resource === 'auth') {
    if (method === 'POST' && first === 'login') return { handler: login }
    if (method === 'POST' && first === 'logout') return { handler: logout, auth: true }
    if (method === 'GET' && first === 'check') return { handler: checkAuth, auth: true }
    if (method === 'PUT' && first === 'change-password') return { handler: changePassword, auth: true }
  }

  if (resource === 'management') {
    if (method === 'GET' && !first) return { handler: getManagement }
    if (method === 'GET' && first === 'all') return { handler: getAllManagement, auth: true }
    if (method === 'GET' && first) return { handler: getManagementById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createManagement, auth: true, upload: 'image-single' }
    if (method === 'PUT' && first) return { handler: updateManagement, auth: true, upload: 'image-single', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteManagement, auth: true, params: { id: first } }
  }

  if (resource === 'managing-committee') {
    if (method === 'GET' && !first) return { handler: getCommittee }
    if (method === 'GET' && first === 'all') return { handler: getAllCommittee, auth: true }
    if (method === 'GET' && first) return { handler: getCommitteeById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createCommittee, auth: true, upload: 'image-single' }
    if (method === 'PUT' && first) return { handler: updateCommittee, auth: true, upload: 'image-single', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteCommittee, auth: true, params: { id: first } }
  }

  if (resource === 'staff') {
    if (method === 'GET' && !first) return { handler: getStaff }
    if (method === 'GET' && first === 'all') return { handler: getAllStaff, auth: true }
    if (method === 'GET' && first) return { handler: getStaffById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createStaff, auth: true, upload: 'image-single' }
    if (method === 'PUT' && first) return { handler: updateStaff, auth: true, upload: 'image-single', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteStaff, auth: true, params: { id: first } }
  }

  if (resource === 'teaching-staff') {
    if (method === 'GET' && !first) return { handler: getTeachingStaff }
    if (method === 'GET' && first === 'all') return { handler: getAllTeachingStaff, auth: true }
    if (method === 'GET' && first) return { handler: getTeachingStaffById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createTeachingStaff, auth: true, upload: 'image-single' }
    if (method === 'PUT' && first) return { handler: updateTeachingStaff, auth: true, upload: 'image-single', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteTeachingStaff, auth: true, params: { id: first } }
  }

  if (resource === 'circulars') {
    if (method === 'GET' && first === 'all') return { handler: getAllCirculars, auth: true }
    if (method === 'GET' && !first) return { handler: getCirculars }
    if (method === 'GET' && first) return { handler: getCircularById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createCircular, auth: true, upload: 'pdf', params: {} }
    if (method === 'PUT' && first) return { handler: updateCircular, auth: true, upload: 'pdf', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteCircular, auth: true, params: { id: first } }
  }

  if (resource === 'gallery') {
    if (method === 'GET' && first === 'all') return { handler: getAllGalleries, auth: true }
    if (method === 'GET' && !first) return { handler: getGalleries }
    if (method === 'GET' && first) return { handler: getGalleryById, params: { id: first } }
    if (method === 'POST' && !first) return { handler: createGallery, auth: true, upload: 'images' }
    if (method === 'PUT' && first) return { handler: updateGallery, auth: true, upload: 'images', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteGallery, auth: true, params: { id: first } }
    if (method === 'PATCH' && first && second === 'toggle') return { handler: toggleGalleryStatus, auth: true, params: { id: first } }
  }

  if (resource === 'downloads') {
    if (method === 'GET' && !first) return { handler: getDownloads }
    if (method === 'GET' && first === 'all') return { handler: getAllDownloads, auth: true }
    if (method === 'GET' && first) return { handler: getDownloadById, params: { id: first } }
    if (method === 'POST' && (!first || first === 'upload')) return { handler: createDownload, auth: true, upload: 'document' }
    if (method === 'PUT' && first) return { handler: updateDownload, auth: true, upload: 'document', params: { id: first } }
    if (method === 'DELETE' && first) return { handler: deleteDownload, auth: true, params: { id: first } }
    if (method === 'PATCH' && first && second === 'toggle') return { handler: toggleDownloadStatus, auth: true, params: { id: first } }
  }

  return null
}

function toNextResponse(state) {
  const response = NextResponse.json(state.body ?? {}, { status: state.status, headers: { ...state.headers, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
  for (const cookie of state.cookies) response.cookies.set(cookie.name, cookie.value, cookie.options)
  return response
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function handleApiRequest(request, context) {
  let req
  let committed = false
  try {
    const { path: pathParts = [] } = await context.params
    const route = matchRoute(request.method, pathParts)
    if (!route) return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 })
    if (!isTrustedRequest(request)) return NextResponse.json({ success: false, message: 'Request origin is not allowed' }, { status: 403 })
    req = requestMetadata(request)
    req.params = route.params || {}
    const res = createResponse()
    if (req.params.id && !/^[a-f0-9]{24}$/i.test(req.params.id)) return NextResponse.json({ success: false, message: 'Invalid record ID' }, { status: 400 })
    // Liveness stays available during a DB outage; /health/ready tests DB connectivity.
    if (route.auth && !req.cookies.adminToken && !req.headers.authorization?.startsWith('Bearer ')) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
    if (pathParts[0] !== 'health') await connectDB()
    if (route.auth && !(await runMiddleware(protect, req, res))) return toNextResponse(res.state)
    if (pathParts[0] === 'auth' && request.method !== 'GET') {
      const limit = await consumeLimit(`auth-client:${clientKey(request)}`, 60, 15 * 60 * 1000)
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } })
    }
    if (route.upload && !['GET', 'DELETE'].includes(request.method)) {
      const limit = await consumeLimit(`upload:${req.admin._id}`, 60, 15 * 60 * 1000)
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many uploads. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } })
    }
    await parseRequest(request, pathParts, req, route)
    if (pathParts[0] === 'auth' && pathParts[1] === 'login') {
      const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
      const limit = await consumeLimit(`login-account:${email}`, 10, 15 * 60 * 1000)
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } })
    }
    await route.handler(req, res)
    committed = res.state.status < 400
    if (committed) await cleanupUploads(req.pendingDeletes)
    return toNextResponse(res.state)
  } catch (error) {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500
    console.error('API request failed:', error.name, error.code || '')
    return NextResponse.json({ success: false, message: status === 500 ? 'Service temporarily unavailable. Please try again.' : error.message }, { status, headers: { 'Cache-Control': 'no-store' } })
  } finally {
    if (req && !committed) await cleanupUploads(req.newUploads)
  }
}

export async function GET(request, context) { return handleApiRequest(request, context) }
export async function POST(request, context) { return handleApiRequest(request, context) }
export async function PUT(request, context) { return handleApiRequest(request, context) }
export async function DELETE(request, context) { return handleApiRequest(request, context) }
export async function PATCH(request, context) { return handleApiRequest(request, context) }
