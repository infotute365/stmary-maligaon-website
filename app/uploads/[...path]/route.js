import { serveUpload } from '@/server/security/serveUpload.js'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const GET = serveUpload
export const HEAD = serveUpload
