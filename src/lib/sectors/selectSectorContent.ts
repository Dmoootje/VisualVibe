// Pure selection helpers for the sector detail pages: which real webdesign
// projects, fotogalerijen and video's belong on /sectoren/[slug]. Curated
// featured ids (sector data) win; admin-tagged content (`sectors` field) fills
// up; nothing is padded - an empty result hides the section.

import { imageKey } from "@/data/webdesignShowcase";
import type { WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import type { FotoGallery } from "@/data/fotografieGalleries";
import type { DroneMedia } from "@/config/drone.config";
import type { VideoItem } from "@/lib/youtube";
import type { Sector } from "@/types";

export function selectSectorWebdesignProjects(
  sector: Sector,
  projects: WebdesignProject[],
  images: WebdesignImages,
  max = 3,
): WebdesignProject[] {
  // Require a renderable image; placeholder-only cards don't belong on a
  // marketing landing page.
  const hasImage = (p: WebdesignProject) =>
    Boolean(images[imageKey(p.id, "thumb")] || images[imageKey(p.id, "1")]);

  const featured = (sector.featuredWebdesignIds ?? [])
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is WebdesignProject => Boolean(p));
  const tagged = projects.filter((p) => p.sectors?.includes(sector.slug));

  const seen = new Set<string>();
  const result: WebdesignProject[] = [];
  for (const project of [...featured, ...tagged]) {
    if (seen.has(project.id) || !hasImage(project)) continue;
    seen.add(project.id);
    result.push(project);
    if (result.length >= max) break;
  }
  return result;
}

export function selectSectorGalleries(
  sector: Sector,
  galleries: FotoGallery[],
  max = 3,
): FotoGallery[] {
  const featured = (sector.featuredGalleryIds ?? [])
    .map((id) => galleries.find((g) => g.id === id))
    .filter((g): g is FotoGallery => Boolean(g));
  const tagged = galleries.filter((g) => g.sectors?.includes(sector.slug));

  const seen = new Set<string>();
  const result: FotoGallery[] = [];
  for (const gallery of [...featured, ...tagged]) {
    if (seen.has(gallery.id) || gallery.images.length === 0) continue;
    seen.add(gallery.id);
    result.push(gallery);
    if (result.length >= max) break;
  }
  return result;
}

/**
 * Explicit ids only: video's are YouTube-fed (not admin-taggable), so anything
 * not curated via `featuredVideoIds` is excluded. Ids resolve against the
 * videografie items first, then against drone videos (by youtubeId).
 */
export function selectSectorVideos(
  sector: Sector,
  videos: VideoItem[],
  drone: DroneMedia[],
  max = 3,
): VideoItem[] {
  const seen = new Set<string>();
  const result: VideoItem[] = [];
  for (const id of sector.featuredVideoIds ?? []) {
    if (seen.has(id)) continue;
    const video = videos.find((v) => v.id === id);
    if (video) {
      seen.add(id);
      result.push(video);
    } else {
      const droneItem = drone.find((d) => d.kind === "video" && d.youtubeId === id);
      if (droneItem?.youtubeId) {
        seen.add(id);
        result.push({ id: droneItem.youtubeId, title: droneItem.title, category: droneItem.category });
      }
    }
    if (result.length >= max) break;
  }
  return result;
}
