// Server-side data-adapter voor de realisatieshub (/realisaties/). Bundelt de
// echte, bestaande bronnen (Firestore webdesign-projecten, applicatiecases,
// fotogalerijen, videografie, dronemedia en Matterport-tours) tot één dataset.
// Alleen items met een echt beeld komen in het recente-projectgrid; de categorie-
// aantallen tellen wel alle gepubliceerde cases, zodat nieuwe cases al vindbaar zijn.

import { cache } from "react";
import { imageKey, getLocalizedWebdesignProject, type WebdesignProject } from "@/data/webdesignShowcase";
import { applicationCaseImageKey, getLocalizedApplicationCaseById, type ApplicationCase } from "@/data/applicationCases";
import type { SupportedLocale } from "@/i18n/locales";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getWebdesignImages, type WebdesignImages } from "@/lib/firestore/webdesignImages";
import {
  getApplicationCaseImages,
  getApplicationCases,
  type ApplicationCaseImages,
} from "@/lib/firestore/applicationCases";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { FOTO_GALLERY_ICONS, type FotoGallery } from "@/data/fotografieGalleries";
import { getVideografieVideos } from "@/lib/youtube";
import { droneMedia } from "@/config/drone.config";
import { matterportTours } from "@/data/matterportTours";
import {
  featuredHubRefs,
  trajectGalleryId,
  trajectProjectId,
} from "@/config/realisatiesHub.config";

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
  /** Echte aantallen per categorie-slug. */
  countsByCategory: Record<string, number>;
  /** Tot 3 echte beelden per discipline voor de categorie-stackkaarten. */
  stacksByCategory: Record<string, HubStackImage[]>;
  /** Complete-traject sectie: het project + bijhorende fotogalerij. */
  traject: { project: HubProject; screenshots: HubStackImage[]; galleryCover?: HubStackImage } | null;
};

const iconLabel = (id: string) =>
  FOTO_GALLERY_ICONS.find((option) => option.id === id)?.label ?? "Fotografie";

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
  return (sectors ?? []).map((sector) => SECTOR_TO_CONTEXT[sector]).filter(Boolean);
}

export function localizeWebdesignHubSources(
  projects: WebdesignProject[],
  locale: SupportedLocale,
): WebdesignProject[] {
  return projects
    .map((project) => getLocalizedWebdesignProject(project, locale))
    .filter((project): project is WebdesignProject => Boolean(project));
}

export function localizeApplicationHubSources(
  projects: ApplicationCase[],
  locale: SupportedLocale,
): ApplicationCase[] {
  if (locale === "nl") return projects;
  if (locale !== "en") return [];
  return projects.flatMap((project) => {
    try {
      return [getLocalizedApplicationCaseById(project.id, locale)];
    } catch {
      return [];
    }
  });
}

function webdesignToHub(project: WebdesignProject, images: WebdesignImages, locale: SupportedLocale): HubProject | null {
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
    imageAlt: locale === "en" ? `Website for ${project.name}` : `Website voor ${project.name}`,
    discipline: locale === "en" ? "Web design" : "Webdesign",
    categorySlug: "webdesign",
    contexts: [...new Set(contextsFromSectors(project.sectors))],
    serviceSlugs: [...new Set(serviceSlugs)],
  };
}

function applicationToHub(
  project: ApplicationCase,
  images: ApplicationCaseImages,
  locale: SupportedLocale,
): HubProject | null {
  if (!project.published) return null;
  const image = images[applicationCaseImageKey(project.id, "cover")];
  if (!image) return null;

  return {
    id: `applicaties:${project.id}`,
    title: project.title,
    description: project.excerpt || project.tagline || undefined,
    image,
    imageAlt: locale === "en" ? `${project.title} - custom application and software by VisualVibe` : `${project.title} - applicatie en software op maat door VisualVibe`,
    discipline: locale === "en" ? "Applications" : "Applicaties",
    categorySlug: "applicaties",
    contexts: ["bedrijven"],
    serviceSlugs: ["app-laten-maken", "webapplicatie-laten-maken"],
  };
}

function galleryToHub(gallery: FotoGallery): HubProject | null {
  const image = gallery.images[0]?.src;
  if (!image) return null;
  const iconContext = ICON_TO_CONTEXT[gallery.icon];
  const contexts = new Set([
    ...(iconContext ? [iconContext] : []),
    ...contextsFromSectors(gallery.sectors),
  ]);
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

async function readHubData(locale: SupportedLocale = "nl"): Promise<HubData> {
  const [
    projects,
    images,
    applicationProjects,
    applicationImages,
    galleries,
    videoData,
  ] = await Promise.all([
    getWebdesignProjects(),
    getWebdesignImages(),
    getApplicationCases(),
    getApplicationCaseImages(),
    getFotografieGalleries(),
    getVideografieVideos(),
  ]);

  const localizedWebdesignProjects = localizeWebdesignHubSources(projects, locale);
  const webdesign = localizedWebdesignProjects
    .map((project) => webdesignToHub(project, images, locale))
    .filter((project): project is HubProject => project !== null);

  const publishedApplicationProjects = localizeApplicationHubSources(applicationProjects, locale).filter((project) => project.published);
  const applications = publishedApplicationProjects
    .map((project) => applicationToHub(project, applicationImages, locale))
    .filter((project): project is HubProject => project !== null);

  const fotografie = (locale === "nl" ? galleries : [])
    .map(galleryToHub)
    .filter((project): project is HubProject => project !== null);

  const videografie: HubProject[] = (locale === "nl" ? videoData.videos : []).map((video) => ({
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

  const drone: HubProject[] = (locale === "nl" ? droneMedia : [])
    .map((media, index): HubProject | null => {
      const image =
        media.kind === "video" && media.youtubeId ? ytThumb(media.youtubeId) : media.src;
      if (!image) return null;
      const sameAsCategory =
        media.title.toLowerCase().replace(/\s+/g, "") ===
        media.category.toLowerCase().replace(/\s+/g, "");
      return {
        id: `drone:${media.youtubeId ?? index}`,
        title: media.title,
        description: undefined,
        image,
        imageAlt: sameAsCategory
          ? `${media.title} door VisualVibe`
          : `${media.title} - ${media.category}`,
        discipline: "Drone & FPV",
        categorySlug: "drone",
        contexts: [],
        serviceSlugs: DRONE_CATEGORY_TO_SUBSERVICE[media.category]
          ? [DRONE_CATEGORY_TO_SUBSERVICE[media.category]]
          : [],
      };
    })
    .filter((project): project is HubProject => project !== null);

  const all = [...webdesign, ...applications, ...fotografie, ...videografie, ...drone];
  const byId = new Map(all.map((project) => [project.id, project]));

  const configuredFeatured = featuredHubRefs
    .map((reference) => byId.get(`${reference.source}:${reference.id}`))
    .filter((project): project is HubProject => Boolean(project));
  const featuredApplications = applications.filter((project) =>
    publishedApplicationProjects.find(
      (source) => source.featured && `applicaties:${source.id}` === project.id,
    ),
  );
  const featured = [...featuredApplications, ...configuredFeatured].filter(
    (project, index, collection) =>
      collection.findIndex((candidate) => candidate.id === project.id) === index,
  );

  const heroStack = [
    applications[0],
    webdesign[0],
    fotografie[0],
    videografie.find((video) => video.id === "videografie:8zGBwfcbX9A") ?? videografie[0],
    drone.find((project) => !project.image.includes("img.youtube.com")) ?? drone[0],
    webdesign[1],
  ]
    .filter((project): project is HubProject => Boolean(project))
    .filter(
      (project, index, collection) =>
        collection.findIndex((candidate) => candidate.id === project.id) === index,
    )
    .slice(0, 5);

  const countsByCategory: Record<string, number> = {
    webdesign: webdesign.length,
    applicaties: publishedApplicationProjects.length,
    fotografie: fotografie.length,
    videografie: videografie.length,
    drone: drone.length,
    "3d-vr": matterportTours.length,
    podcasting: 0,
  };

  const stacksByCategory: Record<string, HubStackImage[]> = {
    webdesign: webdesign.slice(0, 3).map((project) => ({
      src: project.image,
      alt: project.imageAlt,
    })),
    applicaties: applications.slice(0, 3).map((project) => ({
      src: project.image,
      alt: project.imageAlt,
    })),
    fotografie: fotografie.slice(0, 3).map((project) => ({
      src: project.image,
      alt: project.imageAlt,
    })),
    videografie: videografie.slice(0, 3).map((project) => ({
      src: project.image,
      alt: project.imageAlt,
    })),
    drone: drone.slice(0, 3).map((project) => ({
      src: project.image,
      alt: project.imageAlt,
    })),
    "3d-vr": [],
    podcasting: [],
  };

  const trajectHub = byId.get(`webdesign:${trajectProjectId}`) ?? null;
  const trajectSource = localizedWebdesignProjects.find((project) => project.id === trajectProjectId);
  const trajectGallery = (locale === "nl" ? galleries : []).find((gallery) => gallery.id === trajectGalleryId);
  const traject =
    trajectHub && trajectSource
      ? {
          project: trajectHub,
          screenshots: (["1", "2", "4"] as const)
            .map((slot) => images[imageKey(trajectSource.id, slot)])
            .filter((src): src is string => Boolean(src))
            .map((src, index) => ({
              src,
              alt: locale === "en" ? `Website for ${trajectSource.name} - view ${index + 1}` : `Website voor ${trajectSource.name} - weergave ${index + 1}`,
            })),
          galleryCover: trajectGallery?.images[0]
            ? { src: trajectGallery.images[0].src, alt: galleryAlt(trajectGallery) }
            : undefined,
        }
      : null;

  return { projects: all, featured, heroStack, countsByCategory, stacksByCategory, traject };
}

/** Shared cross-route cache: one read per request/render pass. */
export const getHubData = cache(readHubData);
