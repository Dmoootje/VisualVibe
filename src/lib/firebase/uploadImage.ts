import { randomUUID } from "crypto";
import sharp from "sharp";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";

// Portfolio images are stored as WebP only. Any incoming image (Firecrawl PNG
// screenshot, or a manual png/jpg/svg upload) is converted to webp here before
// it hits Storage. Filenames are clean (no timestamp): each save mints a fresh
// download token, so the URL still changes per upload (cache-busting) without
// cluttering the name. A `contentDisposition` gives a clean download filename
// even though the object lives under images/portfolio/webdesign/. Node runtime.

export const IMAGE_EXT_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export const DEFAULT_STORAGE_DIR = "images/portfolio/webdesign";

/** Slugify a key into a clean, safe, lowercase filename stem (no extension). */
export function slugifyKey(key: string): string {
  return (
    (key || "image")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "image"
  );
}

/**
 * Convert an image buffer to WebP and store it under a clean filename. Returns
 * the public (token-authenticated) URL. `key` becomes the filename stem, e.g.
 * "studentenkot-desktop" -> images/portfolio/webdesign/studentenkot-desktop.webp
 * `dir` overrides the storage directory (defaults to the webdesign portfolio).
 */
export async function uploadImageBuffer(
  bytes: Buffer,
  key: string,
  dir: string = DEFAULT_STORAGE_DIR,
): Promise<string> {
  const webp = await sharp(bytes).webp({ quality: 82 }).toBuffer();

  const safeKey = slugifyKey(key);
  const token = randomUUID();
  const path = `${dir}/${safeKey}.webp`;

  await adminStorageBucket.file(path).save(webp, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      contentDisposition: `inline; filename="${safeKey}.webp"`,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
    path,
  )}?alt=media&token=${token}`;
}
