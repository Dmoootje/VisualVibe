const createNextIntlPlugin = require('next-intl/plugin');
const { securityHeaders } = require('./security-headers.config.cjs');

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
      // Dutch and English are published. Fold the still-disabled French and
      // German prefixes permanently onto their Dutch counterparts until those
      // translations are complete (see src/i18n/routing.ts).
      // De kale prefix staat bewust vóór de :path*-regel (vangt het lege pad),
      // en de :path*-bestemming eindigt op een slash zodat de redirect in één
      // hop op de canonieke slashed URL landt (trailingSlash: true).
      { source: '/fr', destination: '/be/', permanent: true },
      { source: '/fr/:path+', destination: '/be/:path+/', permanent: true },
      { source: '/de', destination: '/be/', permanent: true },
      { source: '/de/:path+', destination: '/be/:path+/', permanent: true },
    ];
  },
  async rewrites() {
    return {
      // A few legacy metadata paths still mention /image.jpg. Resolve that path
      // to the branded fallback before the old public template asset can win.
      beforeFiles: [
        { source: '/image.jpg', destination: '/api/og' },
        {
          source: '/en/diensten/custom-software',
          destination: '/en/diensten/software-op-maat',
        },
        {
          source: '/en/diensten/custom-software/:subslug',
          destination: '/en/diensten/software-op-maat/:subslug',
        },
      ],
      // IndexNow verifieert de eigenaar via een sleutelbestand op /{sleutel}.txt.
      // De sleutel is dynamisch (beheerbaar in de admin), dus we kunnen geen
      // statisch bestand plaatsen: schrijf /{sleutel}.txt door naar de route die
      // de opgeslagen sleutel teruggeeft (en elke andere .txt naar 404). Dit
      // staat in `afterFiles` zodat echte statische bestanden in /public
      // (bv. een toekomstige BingSiteAuth.txt) altijd voorgaan.
      afterFiles: [
        {
          source: '/:key([a-zA-Z0-9-]{8,128}).txt',
          destination: '/api/indexnow/keyfile/:key/',
        },
      ],
      fallback: [],
    };
  },
  // Add image optimization configuration
  images: {
    // Serve every image straight from its source, skipping Next's built-in
    // optimizer (/_next/image). All content images are admin uploads that
    // uploadImageBuffer() already normalizes to WebP, caps at 2200px and stores
    // with a 1-year immutable Cache-Control on Firebase's CDN. Re-optimizing
    // them yields ~0 byte savings but, on Firebase App Hosting, routes every
    // image through a Cloud Run optimizer whose cold starts + per-container
    // concurrency limits made gallery pages wait 8-15s for their images. Going
    // straight to the Firebase CDN serves them in well under a second. The
    // trade-off is no responsive downscaling (mobile also gets the 2200px WebP),
    // which is a few hundred KB per photo - acceptable for the CDN + hard cache.
    unoptimized: true,
    // Elke quality die een next/image component gebruikt moet hier staan; Next
    // 16 gaat dit vereisen (nu nog een waarschuwing). Alleen ServiceImageCard
    // zet quality={70}; de 74/80/82/92-waarden elders zijn sharp-compressie bij
    // upload, geen next/image, en horen hier dus niet.
    qualities: [70],
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
  // Houd globale CSS uit de eerste HTML-response. `experimental.inlineCss` maakte
  // de homepage-HTML te groot en dupliceerde CSS in de Next flight-data, waardoor
  // GTmetrix lang bleef wachten/ontvangen op het document zelf.
  // Merk- en icoonassets in /public hebben vaste (niet-gehashte) namen en wijzigen
  // zelden; geef ze een lange browsercache i.p.v. de korte default. Werkt pas
  // volledig wanneer Cloudflare's "Browser Cache TTL" op "Respect Existing Headers"
  // staat (nu 4u, die override op de origin). /_next/static blijft ongemoeid (Next
  // zet daar zelf al immutable + 1 jaar op).
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source:
          '/:asset(logo\\.svg|logo-email\\.png|weddingvibe-logo\\.svg|weddingvibe-logo-licht\\.svg|favicon\\.svg|favicon-96x96\\.png|apple-touch-icon\\.png|web-app-manifest-192x192\\.png|web-app-manifest-512x512\\.png)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }],
      },
    ];
  },
  // Add compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

module.exports = withNextIntl(nextConfig);
