import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.medin.test',
        port: '8000',
      },
    ],
  }
};

export default nextConfig;