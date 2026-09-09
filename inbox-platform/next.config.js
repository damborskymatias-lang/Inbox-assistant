import path from 'path';
import fs from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'tsx', 'ts', 'jsx', 'js'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx?|jsx?)$/,
      })
    );

    const platformDir = process.cwd();
    const rootDir = path.resolve(platformDir, '..');

    // Rekurzívne preskúmanie adresárov na vygenerovanie bodkových aliasov pre Bit
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

    // Vygeneruje aliasy pre @lov/inbox-platform a @lov/design
    registerDirectory(platformDir, '@lov/inbox-platform');
    registerDirectory(path.join(rootDir, 'design'), '@lov/design');

    config.resolve.alias = {
      ...config.resolve.alias,
      ...generatedAliases,
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
