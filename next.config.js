/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bundle server dependencies so CommonJS packages like @cosmjs can load ESM only packages like @scure/base.
  // The Vercel runtime rejects require() of ESM, which breaks the 404 page and /search with a 500.
  bundlePagesRouterDependencies: true,
  experimental: {
    // Restore each history entry's scroll position on back/forward after the page renders.
    scrollRestoration: true,
    // Allows bundling those require() calls instead of failing the build.
    esmExternals: "loose",
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
