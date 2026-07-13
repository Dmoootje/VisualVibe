// Server-side data-adapter voor de realisatieshub (/realisaties/). Bundelt de
// echte, bestaande bronnen (Firestore webdesign-projecten + fotogalerijen,
// videografie, statische dronemedia, Matterport-tours) tot één serialiseerbare
// dataset voor de hub-secties en de client-side filter. Er wordt niets
// verzonnen: alleen items met een echt beeld komen in het projectgrid, en
// contexten (bedrijven/projecten/events/sport) worden enkel afgeleid uit
// expliciete data (galerij-categorie/icoon en admin sector-tags).

import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import { unstable_cache } from "next/cache";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getWebdesignImages, type WebdesignImages } from "@/lib/firestore/webdesignImages";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { FOTO_GALLERY_ICONS, type FotoGallery } from "@/data/fotografieGalleries";
import { getVideografieVideos } from "@/lib/youtube";
import { droneMedia } from "@/config/drone.config";
import { matterportTours } from "@/data/matterportTours";
import { featuredHubRefs, trajectGalleryId, trajectProjectId } from "@/config/realisatiesHub.config";

export type HubProject = {
  /** Uniek over alle bronnen (source-prefix + bron-id). */
  id: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  /** Weergavenaam van de discipline, bv. "Drone & FPV". */
  discipline: string;
  /** Realisatie-categorie-slug; de kaart linkt naar /realisaties/<slug>/. */
  categorySlug: string;
  /** Context-categorie-slugs (bedrijven | projecten | events | sport | buitenland). */
  contexts: string[];
  /** Subdiensten die expliciet uit de bronvelden van dit project blijken. */
  serviceSlugs: string[];
};

export type HubStackImage = { src: string; alt: string };

export type HubData = {
  /** Alle grid-projecten (elk met echt beeld), in bronvolgorde per discipline. */
  projects: HubProject[];
  /** Uitgelichte realisaties (config-gedreven); [0] is de hoofdcase. */
  featured: HubProject[];
  /** 4-5 beelden uit verschillende disciplines voor de hero-stack. */
  heroStack: HubProject[];
  /** Echte aantallen per categorie-slug (incl. 3d-vr en podcasting). */
  countsByCategory: Record<string, number>;
  /** Tot 3 echte beelden per discipline voor de categorie-stackkaarten. */
  stacksByCategory: Record<string, HubStackImage[]>;
  /** Complete-traject sectie: het project + bijhorende fotogalerij. */
  traject: { project: HubProject; screenshots: HubStackImage[]; galleryCover?: HubStackImage } | null;
};

const iconLabel = (id: string) => FOTO_GALLERY_ICONS.find((o) => o.id === id)?.label ?? "Fotografie";

/** Zelfde alt-conventie als de realisaties-fotografiepagina. */
function galleryAlt(gallery: FotoGallery): string {
  const caption = gallery.images[0]?.caption?.trim();
  return caption || gallery.description?.trim() || `${gallery.title} - foto 1`;
}

const ytThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/** Sector-tags (admin) -> context-categorie. Alleen expliciete koppelingen. */
const SECTOR_TO_CONTEXT: Record<string, string> = {
  "bouw-renovatie": "projecten",
  sportclubs: "sport",
  events: "events",
};

/** Fotografie-categorie (galerij-icoon) -> context-categorie. */
const ICON_TO_CONTEXT: Record<string, string> = {
  sport: "sport",
  party: "events",
  layers: "projecten",
  biz: "bedrijven",
};

const ICON_TO_SUBSERVICE: Record<string, string> = {
  biz: "bedrijfsfotografie",
  user: "zakelijke-portretten",
  box: "productfotografie",
  party: "eventfotografie",
  home: "vastgoedfotografie",
  layers: "realisatiefotografie",
  spark: "brandingfotografie",
};

const VIDEO_CATEGORY_TO_SUBSERVICE: Record<string, string> = {
  Bedrijfsvideo: "bedrijfsvideo",
  Promovideo: "promovideo",
  "Social media video": "social-media-video",
  "Event-aftermovie": "event-aftermovie",
  Wervingsvideo: "wervingsvideo",
  "Testimonial-video": "testimonial-video",
  Podcastvideo: "podcast-video",
  Nieuwsreportage: "nieuwsreportage",
};

const DRONE_CATEGORY_TO_SUBSERVICE: Record<string, string> = {
  Dronefotografie: "dronefotografie",
  Dronevideo: "dronevideo",
  "FPV-video": "fpv-video",
  "Vastgoed-dronebeelden": "vastgoed-dronebeelden",
  "Realisatie-dronebeelden": "realisatie-dronebeelden",
  "Event-dronebeelden": "event-dronebeelden",
};

function contextsFromSectors(sectors: string[] | undefined): string[] {
  return (sectors ?? []).map((s) => SECTOR_TO_CONTEXT[s]).filter(Boolean);
}

function webdesignToHub(project: WebdesignProject, images: WebdesignImages): HubProject | null {
  // || i.p.v. ??: een door de admin gewiste slot is een lege string (sentinel),
  // die moet ook doorvallen naar het hoofdscreenshot.
  const image = images[imageKey(project.id, "thumb")] || images[imageKey(project.id, "1")];
  if (!image) return null;
  const evidence = [project.text, ...(project.tags ?? []), ...(project.features ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const serviceSlugs = ["website-laten-maken"];
  if (evidence.includes("seo")) serviceSlugs.push("seo-website-laten-maken");
  if (evidence.includes("lokale seo")) serviceSlugs.push("lokale-seo");
  if (/\bgeo\b/u.test(evidence) || evidence.includes("ai-zoek")) {
    serviceSlugs.push("ai-seo-aeo-geo");
  }

  return {
    id: `webdesign:${project.id}`,
    title: project.name,
    description: project.teaser || undefined,
    image,
    imageAlt: `Website voor ${project.name}`,
    discipline: "Webdesign",
    categorySlug: "webdesign",
    contexts: [...new Set(contextsFromSectors(project.sectors))],
    serviceSlugs: [...new Set(serviceSlugs)],
  };
}

function galleryToHub(gallery: FotoGallery): HubProject | null {
  const image = gallery.images[0]?.src;
  if (!image) return null;
  const iconContext = ICON_TO_CONTEXT[gallery.icon];
  const contexts = new Set([...(iconContext ? [iconContext] : []), ...contextsFromSectors(gallery.sectors)]);
  return {
    id: `fotografie:${gallery.id}`,
    title: gallery.title,
    description: gallery.description || undefined,
    image,
    imageAlt: galleryAlt(gallery),
    discipline: iconLabel(gallery.icon),
    categorySlug: "fotografie",
    contexts: [...contexts],
    serviceSlugs: ICON_TO_SUBSERVICE[gallery.icon] ? [ICON_TO_SUBSERVICE[gallery.icon]] : [],
  };
}

async function readHubData(): Promise<HubData> {
  const [projects, images, galleries, videoData] = await Promise.all([
    getWebdesignProjects(),
    getWebdesignImages(),
    getFotografieGalleries(),
    getVideografieVideos(),
  ]);

  const webdesign = projects
    .map((p) => webdesignToHub(p, images))
    .filter((p): p is HubProject => p !== null);

  const fotografie = galleries
    .map(galleryToHub)
    .filter((p): p is HubProject => p !== null);

  const videografie: HubProject[] = videoData.videos.map((video) => ({
    id: `videografie:${video.id}`,
    title: video.title,
    description: video.description ?? undefined,
    image: ytThumb(video.id),
    imageAlt: `${video.title} - videoproductie door VisualVibe`,
    discipline: "Videografie",
    categorySlug: "videografie",
    contexts: [],
    serviceSlugs: VIDEO_CATEGORY_TO_SUBSERVICE[video.category]
      ? [VIDEO_CATEGORY_TO_SUBSERVICE[video.category]]
      : [],
  }));

  const drone: HubProject[] = droneMedia
    .map((media, index): HubProject | null => {
      const image = media.kind === "video" && media.youtubeId ? ytThumb(media.youtubeId) : media.src;
      if (!image) return null;
      // Vermijd dubbelop-alts zoals "Dronefotografie - Dronefotografie".
      const sameAsCategory =
        media.title.toLowerCase().replace(/\s+/g, "") === media.category.toLowerCase().replace(/\s+/g, "");
      return {
        id: `drone:${media.youtubeId ?? index}`,
        title: media.title,
        description: undefined,
        image,
        imageAlt: sameAsCategory ? `${media.title} door VisualVibe` : `${media.title} - ${media.category}`,
        discipline: "Drone & FPV",
        categorySlug: "drone",
        contexts: [],
        serviceSlugs: DRONE_CATEGORY_TO_SUBSERVICE[media.category]
          ? [DRONE_CATEGORY_TO_SUBSERVICE[media.category]]
          : [],
      };
    })
    .filter((p): p is HubProject => p !== null);

  const all = [...webdesign, ...fotografie, ...videografie, ...drone];
  const byId = new Map(all.map((p) => [p.id, p]));

  // Uitgelicht: config-volgorde; onbekende ids worden geskipt.
  const featured = featuredHubRefs
    .map((ref) => byId.get(`${ref.source}:${ref.id}`))
    .filter((p): p is HubProject => Boolean(p));

  // Hero-stack: één beeld per discipline (webdesign, fotografie, videografie,
  // drone) + een tweede webdesignbeeld, zodat de stack de breedte van het werk
  // toont. Alles komt uit de echte lijsten hierboven.
  const heroStack = [
    webdesign[0],
    fotografie[0],
    videografie.find((v) => v.id === "videografie:8zGBwfcbX9A") ?? videografie[0],
    drone.find((d) => !d.image.includes("img.youtube.com")) ?? drone[0],
    webdesign[1],
  ]
    .filter((p): p is HubProject => Boolean(p))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 5);

  const countsByCategory: Record<string, number> = {
    webdesign: webdesign.length,
    fotografie: fotografie.length,
    videografie: videografie.length,
    drone: drone.length,
    "3d-vr": matterportTours.length,
    podcasting: 0,
  };

  const stacksByCategory: Record<string, HubStackImage[]> = {
    webdesign: webdesign.slice(0, 3).map((p) => ({ src: p.image, alt: p.imageAlt })),
    fotografie: fotografie.slice(0, 3).map((p) => ({ src: p.image, alt: p.imageAlt })),
    videografie: videografie.slice(0, 3).map((p) => ({ src: p.image, alt: p.imageAlt })),
    drone: drone.slice(0, 3).map((p) => ({ src: p.image, alt: p.imageAlt })),
    // Matterport-tours en podcasts hebben geen eigen thumbnails; die kaarten
    // vallen terug op de bestaande cover-stijl (geen beelden dupliceren).
    "3d-vr": [],
    podcasting: [],
  };

  // Complete traject: website-screenshots + de bedrijfsfotografie-galerij van
  // dezelfde klant (beide echt aanwezig in de data).
  const trajectHub = byId.get(`webdesign:${trajectProjectId}`) ?? null;
  const trajectSource = projects.find((p) => p.id === trajectProjectId);
  const trajectGallery = galleries.find((g) => g.id === trajectGalleryId);
  const traject =
    trajectHub && trajectSource
      ? {
          project: trajectHub,
          screenshots: (["1", "2", "4"] as const)
            .map((slot) => images[imageKey(trajectSource.id, slot)])
            .filter((src): src is string => Boolean(src))
            .map((src, i) => ({ src, alt: `Website voor ${trajectSource.name} - weergave ${i + 1}` })),
          galleryCover: trajectGallery?.images[0]
            ? { src: trajectGallery.images[0].src, alt: galleryAlt(trajectGallery) }
            : undefined,
        }
      : null;

  return { projects: all, featured, heroStack, countsByCategory, stacksByCategory, traject };
}

/**
 * Shared cross-route cache. Sub-service pages reuse the same realisation data
 * instead of repeating every Firestore and video read during static rendering.
 */
export const getHubData = unstable_cache(readHubData, ["realisaties-hub-v2"], {
  revalidate: 3600,
  tags: ["realisaties-hub"],
});
