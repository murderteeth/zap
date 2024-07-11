/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.smold.app',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**/*',
      }
    ]
  }
};

export default nextConfig;
