import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Ignoruje Bit compositions a spec/test súbory počas buildu
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(compositions|spec|test)\.(tsx|ts|js|jsx)$/,
      })
    );
    return config;
  },
};

export default nextConfig;
