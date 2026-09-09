/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignoruje chyby typov pri produkčnom builde
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoruje eslint chyby pri produkčnom builde
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
