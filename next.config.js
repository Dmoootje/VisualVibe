const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sharp is a native module used server-side (portfolio image -> webp); keep it
  // external so webpack doesn't try to bundle it.
  serverExternalPackages: ['sharp'],
  // Consistent trailing slashes across the whole site; non-slashed URLs 308 to
  // the slashed form. Aligns with the kennisbank canonical URLs.
  trailingSlash: true,
  // Add image optimization configuration
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        // VisualVibe's own YouTube video stills used by videography articles.
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        // Google review author profile photos (Places API).
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  // Add compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

module.exports = withNextIntl(nextConfig);
