// Next.js dev-mode Fast Refresh (react-refresh + webpack HMR) evaluates code
// with eval(), which needs 'unsafe-eval' in script-src. Without it the refresh
// runtime throws on load, which aborts main-app.js before React hydrates, so
// the whole page renders as static HTML with NO interactivity (menus, quote
// slide-up, forms all dead). Production has no react-refresh, so it stays
// locked down: 'unsafe-eval' is added ONLY when not building for production.
const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
    "https://analytics.ahrefs.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.gstatic.com",
    "https://seowebsites.be",
    "https://*.seowebsites.be",
    "https://*.worf.replit.dev",
  ].join(" "),
  [
    "connect-src",
    "'self'",
    "https://analytics.ahrefs.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googleapis.com",
    "https://firestore.googleapis.com",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://firebaseinstallations.googleapis.com",
    "https://firebase.googleapis.com",
    "https://www.gstatic.com",
    "https://api.smugmug.com",
    "https://seowebsites.be",
    "https://*.seowebsites.be",
    "https://*.worf.replit.dev",
  ].join(" "),
  [
    "img-src",
    "'self'",
    "data:",
    "blob:",
    "https://firebasestorage.googleapis.com",
    "https://*.firebasestorage.app",
    "https://images.unsplash.com",
    "https://img.youtube.com",
    "https://i.ytimg.com",
    "https://*.googleusercontent.com",
    "https://cdn.simpleicons.org",
    "https://img.icons8.com",
    "https://analytics.ahrefs.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://seowebsites.be",
    "https://*.seowebsites.be",
    "https://*.worf.replit.dev",
  ].join(" "),
  [
    "media-src",
    "'self'",
    "data:",
    "blob:",
    "https://firebasestorage.googleapis.com",
    "https://*.firebasestorage.app",
  ].join(" "),
  [
    "frame-src",
    "'self'",
    "data:",
    "blob:",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://my.matterport.com",
    "https://www.google.com",
    "https://maps.google.com",
    "https://*.google.com",
    "https://*.google.be",
    "https://*.google.nl",
    "https://seowebsites.be",
    "https://*.seowebsites.be",
    "https://*.worf.replit.dev",
  ].join(" "),
  "upgrade-insecure-requests",
].join("; ");

const permissionsPolicy = [
  'accelerometer=(self "https://my.matterport.com")',
  'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com")',
  "camera=()",
  "clipboard-read=()",
  'clipboard-write=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
  'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com" "https://www.google.com" "https://maps.google.com")',
  "geolocation=()",
  'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com")',
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  'xr-spatial-tracking=(self "https://my.matterport.com")',
  "browsing-topics=()",
  "interest-cohort=()",
].join(", ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: permissionsPolicy,
  },
];

module.exports = {
  contentSecurityPolicy,
  permissionsPolicy,
  securityHeaders,
};
