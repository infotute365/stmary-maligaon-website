import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { runInNewContext } from 'node:vm'
import redirects from 'follow-redirects'

test('patched redirect client strips cross-realm sensitive headers and preserves ordinary headers', async () => {
  const destination = createServer((request, response) => response.end(JSON.stringify(request.headers)))
  const redirect = createServer((_request, response) => { response.writeHead(302, { location: `http://127.0.0.1:${destination.address().port}/final` }); response.end() })
  const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  await listen(destination); await listen(redirect)
  try {
    const result = await new Promise((resolve, reject) => {
      const request = redirects.http.get(`http://127.0.0.1:${redirect.address().port}/start`, { sensitiveHeaders: runInNewContext("['X-API-Key']"), headers: { 'X-API-Key': 'synthetic-test-value', 'X-Harmless': 'kept' } }, response => {
        let body = ''; response.on('data', chunk => { body += chunk }); response.on('end', () => resolve(JSON.parse(body)))
      })
      request.on('error', reject)
    })
    assert.equal(result['x-api-key'], undefined)
    assert.equal(result['x-harmless'], 'kept')
  } finally {
    redirect.closeAllConnections(); destination.closeAllConnections()
    await Promise.all([new Promise(resolve => redirect.close(resolve)), new Promise(resolve => destination.close(resolve))])
  }
})
