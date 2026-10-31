const config = {
  // Keep local production verification separate from a running development server.
  distDir: process.env.CMS_VERIFY_BUILD === 'true' ? '.next-cms-verification' : '.next',
  poweredByHeader: false,
  serverExternalPackages: ['@cantoo/pdf-lib'],
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }]
  },
}
export default config
