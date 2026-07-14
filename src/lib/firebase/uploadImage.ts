import { randomUUID } from "crypto";
import sharp from "sharp";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";

// Portfolio images are stored as WebP only. Any incoming image (Firecrawl PNG
// screenshot, or a manual png/jpg/svg upload) is converted to webp here before
// it hits Storage. Filenames are clean (no timestamp): each save mints a fresh
// download token, so the URL still changes per upload (cache-busting) without
// cluttering the name. When a stem is already taken, a "-2", "-3", ... suffix
// is appended so two uploads that slug to the same name never overwrite each
// other. A `contentDisposition` gives a clean download filename even though
// the object lives under images/portfolio/webdesign/. Node runtime.

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
 * Find a free filename stem in `dir`: `safeKey` itself, then `safeKey-2`,
 * `safeKey-3`, ... so a new upload never silently overwrites an existing
 * object with the same slug. Caps the counter at 50, then falls back to a
 * short slice of this upload's random token (collision odds negligible).
 */
async function findFreeStem(dir: string, safeKey: string, token: string): Promise<string> {
  const isTaken = async (stem: string): Promise<boolean> => {
    const [exists] = await adminStorageBucket.file(`${dir}/${stem}.webp`).exists();
    return exists;
  };
  if (!(await isTaken(safeKey))) return safeKey;
  for (let n = 2; n <= 50; n++) {
    const stem = `${safeKey}-${n}`;
    if (!(await isTaken(stem))) return stem;
  }
  return `${safeKey}-${token.slice(0, 8)}`;
}

/**
 * Convert an image buffer to WebP and store it under a clean filename. Returns
 * the public (token-authenticated) URL. `key` becomes the filename stem, e.g.
 * "studentenkot-desktop" -> images/portfolio/webdesign/studentenkot-desktop.webp
 * (deduped with a "-2", "-3", ... suffix when that name is already taken).
 * `dir` overrides the storage directory (defaults to the webdesign portfolio).
 */
export async function uploadImageBuffer(
  bytes: Buffer,
  key: string,
  dir: string = DEFAULT_STORAGE_DIR,
): Promise<string> {
  // Screenshots are often exported at 4K or larger. Keeping those dimensions
  // made the browser download megabytes before anything appeared. Rotate from
  // EXIF, cap the longest side at 2200 px and encode once as a compact WebP.
  const webp = await sharp(bytes, { limitInputPixels: 80_000_000 })
    .rotate()
    .resize({
      width: 2200,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();

  const safeKey = slugifyKey(key);
  const token = randomUUID();
  const stem = await findFreeStem(dir, safeKey, token);
  const path = `${dir}/${stem}.webp`;

  await adminStorageBucket.file(path).save(webp, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      contentDisposition: `inline; filename="${stem}.webp"`,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
    path,
  )}?alt=media&token=${token}`;
}
