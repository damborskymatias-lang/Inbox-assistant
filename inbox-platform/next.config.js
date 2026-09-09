/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'tsx', 'ts', 'jsx', 'js'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Ignoruje testy, špecifikácie a Bit compositions súbory pri Webpack kompilácii
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx?|jsx?)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
