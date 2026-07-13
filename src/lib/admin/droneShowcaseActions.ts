"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { setDroneShowcase } from "@/lib/firestore/droneShowcase";
import type { DronePhoto, DroneVideo } from "@/data/droneShowcase";

export type DroneShowcaseActionResult = { ok: boolean; error?: string };

// Em-dash (U+2014) en horizontale balk (U+2015) zijn projectbreed verboden.
const FORBIDDEN_DASHES = new RegExp(`[${String.fromCharCode(0x2014, 0x2015)}]`, "g");
const clean = (value: unknown, max = 120): string =>
  typeof value === "string" ? value.replace(FORBIDDEN_DASHES, "-").trim().slice(0, max) : "";

/** Revalidate the public Drone & FPV service page (all locales) + the admin page. */
function revalidateDrone(): void {
  // Locale prefix (e.g. /be) means a literal path no longer matches; revalidate
  // the dynamic route pattern, which covers every locale at once.
  revalidatePath("/[locale]/diensten/[slug]", "page");
  revalidatePath("/[locale]/realisaties/[slug]", "page");
  revalidatePath("/admin/settings/drone");
}

/** Replace the full ordered drone photo + video showcase lists. */
export async function saveDroneShowcaseAction(
  photos: DronePhoto[],
  videos: DroneVideo[],
): Promise<DroneShowcaseActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!Array.isArray(photos) || !Array.isArray(videos)) {
    return { ok: false, error: "Ongeldige gegevens." };
  }

  const cleanPhotos: DronePhoto[] = photos
    .filter((p) => p && /^https?:\/\//.test(String(p.src)))
    .map((p) => ({ src: String(p.src).trim(), title: clean(p.title) || "Dronefoto", label: clean(p.label, 60) }));

  const cleanVideos: DroneVideo[] = videos
    .filter((v) => v && /^[A-Za-z0-9_-]{11}$/.test(String(v.yt).trim()))
    .map((v) => ({ yt: String(v.yt).trim(), title: clean(v.title) || "Dronevideo", tag: clean(v.tag, 40) }));

  if (cleanPhotos.length === 0) return { ok: false, error: "Voeg minstens een dronefoto toe." };
  if (cleanVideos.length === 0) return { ok: false, error: "Voeg minstens een dronevideo toe." };

  try {
    await setDroneShowcase(cleanPhotos, cleanVideos);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }

  revalidateDrone();
  return { ok: true };
}
