import type { NextConfig } from 'next'

const engineUrl = process.env.ENGINE_URL?.replace(/\/+$/, '')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: { formats: ['image/avif', 'image/webp'] },
  redirects() {
    return Promise.resolve([
      { source: '/blog', destination: '/writing', permanent: true },
      { source: '/blog/:slug', destination: '/writing/:slug', permanent: true },
      { source: '/portfolio', destination: '/work', permanent: true },
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/case-studies', destination: '/writing', permanent: true },
      { source: '/contact', destination: '/book', permanent: true },
      { source: '/articles', destination: '/writing', permanent: true },
      { source: '/articles/:slug', destination: '/writing/:slug', permanent: true },
    ])
  },
  rewrites() {
    // With ENGINE_URL set, /api/event goes straight to the engine; otherwise the local
    // src/app/api/event route answers 204.
    if (!engineUrl) return Promise.resolve([])
    return Promise.resolve({
      beforeFiles: [{ source: '/api/event', destination: `${engineUrl}/api/event` }],
      afterFiles: [],
      fallback: [],
    })
  },
  headers() {
    return Promise.resolve([
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ])
  },
}

export default nextConfig
