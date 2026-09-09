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
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx?|jsx?)$/,
      })
    );

    const platformDir = process.cwd();
    const rootDir = path.resolve(platformDir, '..');

    config.resolve.alias = {
      ...config.resolve.alias,
      '@lov/inbox-platform': platformDir,
      '@lov/design': path.join(rootDir, 'design'),
      '@lov': rootDir,
    };

    config.resolve.extensionAlias = {
      '.js': ['.tsx', '.ts', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    return config;
  },
};

export default nextConfig;
