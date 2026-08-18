/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for local page images served via API
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3', 'sharp'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
