// Read-only HTTP smoke checks against a local production server with isolated config.
// This deliberately overrides database/auth settings BEFORE Next loads .env.local.
const { randomBytes } = require('node:crypto')
const { createServer } = require('node:http')
const { writeFileSync } = require('node:fs')
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/stmarys_smoke_unavailable'
process.env.JWT_SECRET = randomBytes(48).toString('hex')
process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'true'
process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED = 'true'
const next = require('next')

async function main() {
  const phase3 = process.argv.includes('--phase3')
  const phase2 = phase3 || process.argv.includes('--phase2')
  const app = next({ dev: false, hostname: '127.0.0.1' })
  await app.prepare()
  const server = createServer(app.getRequestHandler())
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  process.env.APP_ORIGIN = base
  const source = require('node:fs').readFileSync('src/App.jsx','utf8')
  const routes = source.match(/const publicPages = \{([\s\S]*?)\n\}/)[1]
  const admins = source.match(/const adminPages = \{([\s\S]*?)\n\}/)[1]
  const paths = [...routes.matchAll(/'([^']+)':/g)].map(match => match[1])
  const adminPaths = [...admins.matchAll(/'([^']+)':/g)].map(match => match[1])
  const report = { pages: [], assets: [], api: [] }
  try {
    for (const route of [...paths, '/admin/login', ...adminPaths, ...(phase2 ? ['/__phase2_nonexistent_page__'] : [])]) {
      const response = await fetch(base + route)
      const html = await response.text()
      report.pages.push({ route, status: response.status })
      if (route === '/') {
        const builtImages = require('node:fs').readdirSync('.next/static/media').filter(name => /\.(png|jpe?g|webp)$/i.test(name)).map(name => '/_next/static/media/' + name)
        const linkedAssets = [...html.matchAll(/(?:src|href)="([^"\s]+)"/g)].map(match => match[1]).filter(value => value.startsWith('/_next/') && !value.endsWith('.js'))
        for (const asset of [...new Set([...linkedAssets, ...builtImages])]) {
          const result = await fetch(base + asset)
          report.assets.push({ asset, status: result.status })
          await result.arrayBuffer()
        }
      }
    }
    for (const [method, route, expected, expectedContentType] of [
      ['GET', '/api/health', 200],
      ['GET', '/api/site-content/all?group=home', 401],
      ['PUT', '/api/site-content/home.hero.slide1.title', 401],
      ['GET', '/api/site-content?group=invalid', 400],
      ['GET', '/api/site-content?group=home', 503],
      ...(phase2 ? [
        ['GET', '/api/site-content/all?group=cbse.schoolInfo', 401],
        ['PUT', '/api/site-content/cbse.schoolInfo.schoolData.name', 401],
        ['GET', '/api/site-content?group=cbse.schoolInfo', 503],
        ['GET', '/wp-content/uploads/2026/05/Managing-Commitee.pdf', 200, 'application/pdf'],
        // The existing catch-all serves a NotFound HTML shell with HTTP 200 for this missing file.
        ['GET', '/wp-content/uploads/2026/05/Managing-Committee.pdf', 200, 'text/html'],
      ] : []),
      ...(phase3 ? [
        ['GET', '/api/disclosure-documents/all', 401],
        ['PUT', '/api/disclosure-documents/fire', 401],
        ['GET', '/api/disclosure-documents?path=unsafe', 400],
        ['GET', '/api/disclosure-documents', 503],
        ...(await import('../src/content/disclosureDocuments.js')).fixedDisclosureDocuments.map(document => ['GET', document.url, 200, 'application/pdf']),
      ] : []),
    ]) {
      const response = await fetch(base + route, { method, headers: { origin: base } })
      report.api.push({ method, route, status: response.status, expected, ...(expectedContentType ? { contentType: response.headers.get('content-type'), expectedContentType } : {}) })
      await response.text()
    }
    if (phase2) {
      process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'false'
      const response = await fetch(base + '/api/site-content?group=students.examination')
      const payload = await response.json()
      report.api.push({ method: 'GET', route: '/api/site-content?group=students.examination (rollback enabled)', status: response.status, expected: 200, emptyOverrides: JSON.stringify(payload.data) === '{}' })
      process.env.SITE_CONTENT_OVERRIDES_ENABLED = 'true'
    }
    if (phase3) {
      process.env.DISCLOSURE_DOCUMENT_OVERRIDES_ENABLED = 'false'
      const response = await fetch(base + '/api/disclosure-documents')
      const payload = await response.json()
      report.api.push({ method: 'GET', route: '/api/disclosure-documents (rollback enabled)', status: response.status, expected: 200, emptyOverrides: Object.keys(payload.data.fixed).length === 12 && payload.data.additional.length === 0 })
    }
    report.passed = report.pages.every(item => item.status === 200) && report.assets.every(item => item.status === 200) && report.api.every(item => item.status === item.expected && item.emptyOverrides !== false && (!item.expectedContentType || item.contentType?.includes(item.expectedContentType)))
    writeFileSync(phase3 ? 'verification/site-content-phase3-http.json' : phase2 ? 'verification/site-content-phase2-http.json' : 'verification/site-content-http.json', JSON.stringify(report, null, 2) + '\n')
    console.log(JSON.stringify({ passed: report.passed, pages: report.pages.length, assets: report.assets.length, api: report.api.length }))
    if (!report.passed) process.exitCode = 1
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    await app.close()
  }
}
main().catch(error => { console.error(error.name, error.message); process.exitCode = 1 })
