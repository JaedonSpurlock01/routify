/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "900mb",
    },
  },
};

module.exports = nextConfig;
