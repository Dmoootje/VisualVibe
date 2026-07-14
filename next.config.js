const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Strip the `X-Powered-By: Next.js` response header (SEO/security hygiene:
  // don't advertise the stack).
  poweredByHeader: false,
  // sharp is a native module used server-side (portfolio image -> webp); keep it
  // external so webpack doesn't try to bundle it.
  serverExternalPackages: ['sharp'],
  // Consistent trailing slashes across the whole site; non-slashed URLs 308 to
  // the slashed form. Aligns with the kennisbank canonical URLs.
  trailingSlash: true,
  // The Dutch default locale is published under /be. next-intl's middleware
  // sends the bare root "/" to "/be/" with a 307 (temporary), which Google
  // treats as a separate, unconsolidated URL and reports as an indexing issue.
  // Emit an explicit 308 (permanent) instead: next.config redirects run before
  // middleware, so "/" resolves to the canonical "/be/" in a single hop and
  // Google consolidates all signals onto it.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/be/',
        permanent: true,
      },
      // fr/en stonden als locales aangekondigd terwijl alleen Nederlandse
      // content bestaat; crawlers vonden daardoor honderden /fr- en /en-URL's
      // (grotendeels 404). Vouw ze permanent op de gepubliceerde Nederlandse
      // pagina's tot er echte vertalingen zijn (zie src/i18n/routing.ts).
      // De kale prefix staat bewust vóór de :path*-regel (vangt het lege pad),
      // en de :path*-bestemming eindigt op een slash zodat de redirect in één
      // hop op de canonieke slashed URL landt (trailingSlash: true).
      { source: '/en', destination: '/be/', permanent: true },
      { source: '/en/:path+', destination: '/be/:path+/', permanent: true },
      { source: '/fr', destination: '/be/', permanent: true },
      { source: '/fr/:path+', destination: '/be/:path+/', permanent: true },
    ];
  },
  // Add image optimization configuration
  images: {
    // Use a selective loader: application-portfolio screenshots are already
    // optimized WebP files and load directly from Firebase CDN; every other
    // image keeps using Next's responsive image optimizer.
    loader: 'custom',
    loaderFile: './src/lib/nextImageLoader.js',
    // Firebase App Hosting can opt out of Next's image pipeline unless this is
    // explicit. Keep remote content images responsive and cached by Next.
    unoptimized: false,
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
