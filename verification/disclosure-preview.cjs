// Read-only local preview: exact default text/PDFs, no school database access.
process.env.NODE_ENV = 'production'
process.env.CMS_VERIFY_BUILD = 'true'
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/stmarys_test_preview_unavailable'
process.env.JWT_SECRET = require('node:crypto').randomBytes(48).toString('hex')
process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'false'
process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED = 'false'
const app = require('next')({ dev: false, hostname: '127.0.0.1' })
const server = require('node:http').createServer(app.getRequestHandler())
app.prepare().then(() => server.listen(0, '127.0.0.1', () => {
  process.env.APP_ORIGIN = `http://127.0.0.1:${server.address().port}`
  console.log(process.env.APP_ORIGIN)
})).catch(error => { console.error(error.name); process.exitCode = 1 })
async function close() { server.closeAllConnections(); server.close(); await app.close(); process.exit(0) }
process.on('SIGINT', close)
process.on('SIGTERM', close)
