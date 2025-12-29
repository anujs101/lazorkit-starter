/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
      process: require.resolve('process/browser'),
      encoding: require.resolve('encoding'),
    };
    return config;
  },
};

module.exports = nextConfig;