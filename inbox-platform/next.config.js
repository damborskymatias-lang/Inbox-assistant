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

    // Dynamický resolver pre prevod bodkového Bit zápisu na adresárovú štruktúru
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push({
      apply(resolver) {
        const target = resolver.ensureHook('resolve');
        resolver.getHook('module').tapAsync('BitDotPathResolver', (request, resolveContext, callback) => {
          if (request.request && request.request.startsWith('@lov/')) {
            const rawPath = request.request.replace('@lov/', '');
            const parts = rawPath.split('.');
            
            // Určenie koreňovej zložky podľa scope
            let resolvedPath = '';
            if (parts[0] === 'inbox-platform') {
              resolvedPath = path.resolve(process.cwd(), parts.slice(1).join('/'));
            } else {
              resolvedPath = path.resolve(process.cwd(), '..', parts.join('/'));
            }

            const newRequest = { ...request, request: resolvedPath };
            return resolver.doResolve(target, newRequest, null, resolveContext, callback);
          }
          return callback();
        });
      }
    });

    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    return config;
  },
};

export default nextConfig;
