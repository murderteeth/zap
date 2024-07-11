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
  },
  env: {
    WALLETCONNECT_PROJECT_NAME: process.env.WALLETCONNECT_PROJECT_NAME,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
    SMOL_ASSETS_URL: process.env.SMOL_ASSETS_URL,
    TESTNET_ID: process.env.TESTNET_ID,
    TESTNET_URL: process.env.TESTNET_URL
  }
};

export default nextConfig;
