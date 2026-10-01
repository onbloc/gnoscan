/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Restore each history entry's scroll position on back/forward after the page renders.
  experimental: {
    scrollRestoration: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
