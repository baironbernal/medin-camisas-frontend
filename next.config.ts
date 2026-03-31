import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.medin.test',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'deepskyblue-gorilla-748938.hostingersite.com',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;