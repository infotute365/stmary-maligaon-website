export function isTrustedRequest(request) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin || origin === 'null') return false
  // APP_ORIGIN is the public HTTPS origin behind a reverse proxy. Never trust
  // X-Forwarded-Host supplied by an arbitrary client.
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin
  try { return new URL(origin).origin === new URL(expected).origin && origin === new URL(origin).origin } catch { return false }
}
