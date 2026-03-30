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
}

export default nextConfig
