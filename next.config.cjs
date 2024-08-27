/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }
    return config;
  },
  // Optionally, specify the output directory if you want to change it from the default 'out'
  // distDir: 'out',
}

module.exports = nextConfig