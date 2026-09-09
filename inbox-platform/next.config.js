import path from 'path';

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
  webpack: (config, { webpack }) => {
    // 1. Ignorovanie testov a compositions
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx?|jsx?)$/,
      })
    );

    // 2. Webpack Aliasy pre @lov prepojenia
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lov/design': path.resolve(process.cwd(), '../design'),
      '@lov/inbox-platform': path.resolve(process.cwd(), './'),
      '@lov': path.resolve(process.cwd(), '../'),
    };

    // 3. Riešenie Bit ESM importov s `.js` koncovkami
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    return config;
  },
};

export default nextConfig;
