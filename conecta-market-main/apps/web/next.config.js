/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
