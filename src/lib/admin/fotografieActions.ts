"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { setFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import type { FotoGallery, FotoGalleryImage } from "@/data/fotografieGalleries";

export type GalleryActionResult = { ok: boolean; error?: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function slugify(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function sanitizeImage(img: FotoGalleryImage): FotoGalleryImage | null {
  const src = str(img?.src);
  if (!src) return null;
  const caption = str(img?.caption);
  return caption ? { src, caption } : { src };
}

function sanitizeGallery(g: FotoGallery, i: number): FotoGallery {
  const title = str(g.title);
  const id = slugify(str(g.id) || title) || `galerij-${i + 1}`;
  return {
    id,
    title,
    description: str(g.description),
    icon: str(g.icon) || "foto",
    images: Array.isArray(g.images)
      ? g.images.map(sanitizeImage).filter((x): x is FotoGalleryImage => x !== null)
      : [],
  };
}

/** Replace the full ordered list of fotografie galleries. */
export async function saveFotografieGalleries(galleries: FotoGallery[]): Promise<GalleryActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!Array.isArray(galleries)) return { ok: false, error: "Ongeldige gegevens." };

  const clean = galleries.map(sanitizeGallery).filter((g) => g.title);

  // Ensure unique ids (needed for stable image keys + storage paths).
  const seen = new Set<string>();
  for (let i = 0; i < clean.length; i++) {
    let id = clean[i].id;
    while (seen.has(id)) id = `${id}-${i + 1}`;
    clean[i].id = id;
    seen.add(id);
  }

  try {
    await setFotografieGalleries(clean);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }

  revalidatePath("/realisaties/fotografie");
  revalidatePath("/admin/settings/realisaties/fotografie");
  return { ok: true };
}
