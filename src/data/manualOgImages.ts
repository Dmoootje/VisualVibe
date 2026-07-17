import type { OgImage } from "./ogImages";
import { TOOL_PAGE_IMAGES } from "./toolPageImages";

/**
 * Beelden die al rechtstreeks in Firebase Storage zijn geplaatst en daarom niet
 * door de bestaande uploadgenerator zijn geschreven. Hou de canonieke route als
 * sleutel; een latere generatorrun kan deze entries zonder URL-wijziging opnemen.
 */
export const MANUAL_PAGE_OG_IMAGES: Record<string, OgImage> = {
  "/website-analyse/": TOOL_PAGE_IMAGES.websiteAnalyse,
  "/tools/seo-geo-checklist/": TOOL_PAGE_IMAGES.seoGeoChecklist,
  "/diensten/software-op-maat/ai-applicatie-laten-maken/": {
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fog-images%2Fdiensten%2Fwebdesign%2Fwebdesign-ai-applicatie-laten-maken.webp?alt=media&token=c67684e4-fa00-4ded-a763-1ad702b1c95e",
    width: 1254,
    height: 1254,
  },
};
