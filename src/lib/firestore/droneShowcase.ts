import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  dronePhotos as DEFAULT_DRONE_PHOTOS,
  droneVideos as DEFAULT_DRONE_VIDEOS,
  type DronePhoto,
  type DroneVideo,
} from "@/data/droneShowcase";

// Admin-managed media for the Drone & FPV service-page split (dronefotografie
// photos + dronevideografie videos). One Firestore doc, same pattern as
// site_content/webdesign_showcase: stored values win, and a missing doc or empty
// list falls back to the seed data in @/data/droneShowcase so the page is never
// blank. Reads are resilient (unreachable Firestore returns the defaults).

const COLLECTION = "site_content";
const DOC_ID = "drone_showcase";

export type DroneShowcaseContent = {
  photos: DronePhoto[];
  videos: DroneVideo[];
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Extract the 11-char YouTube id from a raw id or any YouTube URL. */
function youtubeId(value: unknown): string {
  const raw = str(value);
  if (!raw) return "";
  const byUrl = raw.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (byUrl) return byUrl[1];
  return /^[A-Za-z0-9_-]{11}$/.test(raw) ? raw : "";
}

function cleanPhotos(value: unknown): DronePhoto[] {
  if (!Array.isArray(value)) return [];
  const out: DronePhoto[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const src = str(record.src);
    if (!/^https?:\/\//.test(src)) continue;
    out.push({ src, title: str(record.title) || "Dronefoto", label: str(record.label) });
  }
  return out;
}

function cleanVideos(value: unknown): DroneVideo[] {
  if (!Array.isArray(value)) return [];
  const out: DroneVideo[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const yt = youtubeId(record.yt);
    if (!yt) continue;
    out.push({ yt, title: str(record.title) || "Dronevideo", tag: str(record.tag) });
  }
  return out;
}

async function readDroneShowcase(): Promise<DroneShowcaseContent> {
  const defaults: DroneShowcaseContent = {
    photos: DEFAULT_DRONE_PHOTOS,
    videos: DEFAULT_DRONE_VIDEOS,
  };

  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    if (!doc.exists) return defaults;
    const data = doc.data() ?? {};
    const photos = cleanPhotos(data.photos);
    const videos = cleanVideos(data.videos);
    // An empty list means "never configured" (or fully cleared); fall back to
    // the seed so the service-page bands are never blank.
    return {
      photos: photos.length > 0 ? photos : defaults.photos,
      videos: videos.length > 0 ? videos : defaults.videos,
    };
  } catch {
    return defaults;
  }
}

/** Cached per request so the page and its sections share a single read. */
export const getDroneShowcase = cache(readDroneShowcase);

/** Replace the full ordered photo + video lists. */
export async function setDroneShowcase(photos: DronePhoto[], videos: DroneVideo[]): Promise<void> {
  await adminDb
    .collection(COLLECTION)
    .doc(DOC_ID)
    .set({ photos: cleanPhotos(photos), videos: cleanVideos(videos), updatedAt: new Date() }, { merge: true });
}
