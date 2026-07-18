import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  dronePhotos as DEFAULT_DRONE_PHOTOS,
  droneVideos as DEFAULT_DRONE_VIDEOS,
  type DronePhoto,
  type DroneVideo,
} from "@/data/droneShowcase";
import type { SupportedLocale } from "@/i18n/locales";
import { mergeDutchRecords, readLocalizedRequired } from "./localizedContent";

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

function cleanPhotos(value: unknown, locale: SupportedLocale = "nl"): DronePhoto[] {
  if (!Array.isArray(value)) return [];
  const out: DronePhoto[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const src = str(record.src);
    if (!/^https?:\/\//.test(src)) continue;
    const title = record.title === undefined && locale === "nl" ? "Dronefoto" : record.title;
    const label = record.label === undefined && locale === "nl" ? "" : record.label;
    out.push({ src, title: readLocalizedRequired(title as never, locale, "dronePhoto.title"), label: readLocalizedRequired(label as never, locale, "dronePhoto.label") });
  }
  return out;
}

function cleanVideos(value: unknown, locale: SupportedLocale = "nl"): DroneVideo[] {
  if (!Array.isArray(value)) return [];
  const out: DroneVideo[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const yt = youtubeId(record.yt);
    if (!yt) continue;
    const title = record.title === undefined && locale === "nl" ? "Dronevideo" : record.title;
    const tag = record.tag === undefined && locale === "nl" ? "" : record.tag;
    out.push({ yt, title: readLocalizedRequired(title as never, locale, "droneVideo.title"), tag: readLocalizedRequired(tag as never, locale, "droneVideo.tag") });
  }
  return out;
}

async function readDroneShowcase(locale: SupportedLocale = "nl"): Promise<DroneShowcaseContent> {
  const defaults: DroneShowcaseContent = {
    photos: cleanPhotos(DEFAULT_DRONE_PHOTOS, locale),
    videos: cleanVideos(DEFAULT_DRONE_VIDEOS, locale),
  };

  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    if (!doc.exists) return defaults;
    const data = doc.data() ?? {};
    const photos = cleanPhotos(data.photos, locale);
    const videos = cleanVideos(data.videos, locale);
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
  const ref = adminDb.collection(COLLECTION).doc(DOC_ID);
  const snapshot = await ref.get();
  const data = snapshot.exists ? snapshot.data() : undefined;
  const mergedPhotos = mergeDutchRecords(data?.photos, cleanPhotos(photos) as unknown as Record<string, unknown>[], ["title", "label"], "src");
  const mergedVideos = mergeDutchRecords(data?.videos, cleanVideos(videos) as unknown as Record<string, unknown>[], ["title", "tag"], "yt");
  await ref.set({ photos: mergedPhotos, videos: mergedVideos, updatedAt: new Date() }, { merge: true });
}
