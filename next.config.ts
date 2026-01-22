import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://serve.iitiansquad.com';
    
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/practice',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
