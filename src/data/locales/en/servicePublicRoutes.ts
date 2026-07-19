const englishServicePublicRoutes: Record<string, string> = {
  "3d-tour": "/en/services/3d-vr-ar/3d-tour/",
  bedrijfsfotografie: "/en/services/photography/corporate-photography/",
  bedrijfspodcast: "/en/services/podcasting/business-podcast/",
  bedrijfsvideo: "/en/services/videography/corporate-video/",
  brandingfotografie: "/en/services/photography/brand-photography/",
  dronefotografie: "/en/services/drone-fpv/drone-photography/",
  dronevideo: "/en/services/drone-fpv/drone-video/",
  "event-aftermovie": "/en/services/videography/event-aftermovie/",
  "event-dronebeelden": "/en/services/drone-fpv/event-drone-footage/",
  eventfotografie: "/en/services/photography/event-photography/",
  "fpv-video": "/en/services/drone-fpv/fpv-video/",
  "google-business-profiel-optimalisatie":
    "/en/services/seo/google-business-profile-optimisation/",
  "online-cursus-video": "/en/services/masterclasses/online-course-video/",
  "opleiding-opnemen":
    "/en/services/masterclasses/training-video-production/",
  "podcast-opname": "/en/services/podcasting/podcast-recording/",
  "podcast-traject":
    "/en/services/podcasting/podcast-production-programme/",
  "podcast-video": "/en/services/videography/podcast-video/",
  "podcast-voor-experts": "/en/services/podcasting/podcast-for-experts/",
  productfotografie: "/en/services/photography/product-photography/",
  promovideo: "/en/services/videography/promotional-video/",
  realisatiefotografie: "/en/services/photography/project-photography/",
  "seo-copywriting": "/en/services/seo/seo-copywriting/",
  "showroom-3d-tour": "/en/services/3d-vr-ar/showroom-3d-tour/",
  "social-media-video": "/en/services/videography/social-media-video/",
  "testimonial-video": "/en/services/videography/testimonial-video/",
  "vastgoed-3d-tour": "/en/services/3d-vr-ar/real-estate-3d-tour/",
  "vastgoed-dronebeelden":
    "/en/services/drone-fpv/real-estate-drone-footage/",
  vastgoedfotografie: "/en/services/photography/property-photography/",
  videopodcast: "/en/services/podcasting/video-podcast/",
  "virtuele-rondleiding": "/en/services/3d-vr-ar/virtual-tour/",
  webdesign: "/en/services/web-design/",
  "webshop-laten-maken":
    "/en/services/web-design/online-shop-development/",
  "website-laten-maken":
    "/en/services/web-design/business-website-design/",
  "workshop-filmen":
    "/en/services/masterclasses/workshop-video-production/",
  "zakelijke-portretten": "/en/services/photography/business-portraits/",
};

export function getEnglishServicePublicHref(serviceId: string): string {
  const href = englishServicePublicRoutes[serviceId];
  if (!href) {
    throw new Error(`Unknown English service route ID: ${serviceId}`);
  }
  return href;
}
