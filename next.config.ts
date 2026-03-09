import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.medin.test',
        port: '8000',
      },
    ],
  },
};

export default nextConfig;