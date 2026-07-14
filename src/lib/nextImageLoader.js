'use strict';

const APP_PORTFOLIO_MARKERS = [
  'images%2Fportfolio%2Fapplicaties%2F',
  'images/portfolio/applicaties/',
];

/**
 * Keep Next's normal image optimizer for the rest of the site, but skip the
 * extra proxy/transform hop for application-portfolio screenshots. Those files
 * are already resized WebP uploads and Firebase serves them from its CDN.
 */
module.exports = function visualVibeImageLoader({ src, width, quality }) {
  const isApplicationPortfolioImage =
    typeof src === 'string' && APP_PORTFOLIO_MARKERS.some((marker) => src.includes(marker));

  if (isApplicationPortfolioImage) {
    // The fragment makes the loader output width-specific for Next's generated
    // srcset, but is never sent to Firebase. The original CDN URL stays intact.
    return `${src}#w=${width}`;
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
};
