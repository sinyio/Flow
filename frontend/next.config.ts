import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xn--k1agpb.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '130.49.143.41',
        port: '9000',
        pathname: '/flow/**',
      },
    ],
  },
  turbopack: {},

  // Proxy для тестирования production API с локалхоста (когда задан NEXT_PUBLIC_SESSION_KEY)
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST

    if (!apiHost) {
      return []
    }

    return [
      {
        source: '/api-proxy/:path*',
        destination: `${apiHost}/:path*`,
      },
    ]
  },
}

export default nextConfig
