const englishServicePublicRoutes: Record<string, string> = {
  "3d-tour": "/en/diensten/3d-vr-ar/3d-tour/",
  bedrijfsfotografie: "/en/diensten/photography/corporate-photography/",
  bedrijfspodcast: "/en/diensten/podcasting/business-podcast/",
  bedrijfsvideo: "/en/diensten/videography/corporate-video/",
  brandingfotografie: "/en/diensten/photography/brand-photography/",
  dronefotografie: "/en/diensten/drone-fpv/drone-photography/",
  dronevideo: "/en/diensten/drone-fpv/drone-video/",
  "event-aftermovie": "/en/diensten/videography/event-aftermovie/",
  "event-dronebeelden": "/en/diensten/drone-fpv/event-drone-footage/",
  eventfotografie: "/en/diensten/photography/event-photography/",
  "fpv-video": "/en/diensten/drone-fpv/fpv-video/",
  "google-business-profiel-optimalisatie":
    "/en/diensten/seo/google-business-profile-optimisation/",
  "online-cursus-video": "/en/diensten/masterclasses/online-course-video/",
  "opleiding-opnemen":
    "/en/diensten/masterclasses/training-video-production/",
  "podcast-opname": "/en/diensten/podcasting/podcast-recording/",
  "podcast-traject":
    "/en/diensten/podcasting/podcast-production-programme/",
  "podcast-video": "/en/diensten/videography/podcast-video/",
  "podcast-voor-experts": "/en/diensten/podcasting/podcast-for-experts/",
  productfotografie: "/en/diensten/photography/product-photography/",
  promovideo: "/en/diensten/videography/promotional-video/",
  realisatiefotografie: "/en/diensten/photography/project-photography/",
  "seo-copywriting": "/en/diensten/seo/seo-copywriting/",
  "showroom-3d-tour": "/en/diensten/3d-vr-ar/showroom-3d-tour/",
  "social-media-video": "/en/diensten/videography/social-media-video/",
  "testimonial-video": "/en/diensten/videography/testimonial-video/",
  "vastgoed-3d-tour": "/en/diensten/3d-vr-ar/real-estate-3d-tour/",
  "vastgoed-dronebeelden":
    "/en/diensten/drone-fpv/real-estate-drone-footage/",
  vastgoedfotografie: "/en/diensten/photography/property-photography/",
  videopodcast: "/en/diensten/podcasting/video-podcast/",
  "virtuele-rondleiding": "/en/diensten/3d-vr-ar/virtual-tour/",
  webdesign: "/en/diensten/web-design/",
  "webshop-laten-maken":
    "/en/diensten/web-design/online-shop-development/",
  "website-laten-maken":
    "/en/diensten/web-design/business-website-design/",
  "workshop-filmen":
    "/en/diensten/masterclasses/workshop-video-production/",
  "zakelijke-portretten": "/en/diensten/photography/business-portraits/",
};

export function getEnglishServicePublicHref(serviceId: string): string {
  const href = englishServicePublicRoutes[serviceId];
  if (!href) {
    throw new Error(`Unknown English service route ID: ${serviceId}`);
  }
  return href;
}
