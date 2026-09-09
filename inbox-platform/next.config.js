import path from 'path';
import fs from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'tsx', 'ts', 'jsx', 'js'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@lov/design', 'design'],
  webpack: (config, { webpack, defaultLoaders }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx?|jsx?)$/,
      })
    );

    const platformDir = process.cwd();
    const rootDir = path.resolve(platformDir, '..');

    const generatedAliases = {};

    const registerDirectory = (dirPath, prefix) => {
      if (!fs.existsSync(dirPath)) return;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const aliasKey = `${prefix}.${entry.name}`;
          const fullPath = path.join(dirPath, entry.name);
          generatedAliases[aliasKey] = fullPath;
          registerDirectory(fullPath, aliasKey);
        }
      }
    };

    registerDirectory(platformDir, '@lov/inbox-platform');
    registerDirectory(path.join(rootDir, 'design'), '@lov/design');

    config.resolve.alias = {
      ...config.resolve.alias,
      ...generatedAliases,
      'classnames': 'classnames',
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
