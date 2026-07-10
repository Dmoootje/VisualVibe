import { randomUUID } from "crypto";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";

// Shared Firebase Storage upload used by the admin image-upload route and the
// AI auto-generate route. Saves bytes with a download token so the returned URL
// is publicly readable without changing Storage rules (matches the existing
// token-based portfolio URLs). Server-only (Node runtime).

export const IMAGE_EXT_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

/**
 * Save an image buffer to Storage under a token-authenticated public URL.
 * `key` is slugified into the filename; `ext` must be one of IMAGE_EXT_BY_TYPE.
 */
export async function uploadImageBuffer(
  bytes: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  const ext = IMAGE_EXT_BY_TYPE[contentType];
  if (!ext) {
    throw new Error(`Niet-ondersteund beeldtype: ${contentType}`);
  }

  const safeKey = (key || "image").replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
  const token = randomUUID();
  const path = `images/portfolio/webdesign/${safeKey}-${Date.now()}.${ext}`;

  await adminStorageBucket.file(path).save(bytes, {
    resumable: false,
    metadata: { contentType, metadata: { firebaseStorageDownloadTokens: token } },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
    path,
  )}?alt=media&token=${token}`;
}
