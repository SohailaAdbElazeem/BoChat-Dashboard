/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'i.pravatar.cc',
      'lh3.googleusercontent.com',
      'bo-chat.space',
      'bo-chat.cfd',
      "platform-lookaside.fbsbx.com"
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
