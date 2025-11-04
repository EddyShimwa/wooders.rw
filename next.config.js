/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.ctfassets.net', 'api.qrserver.com'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
