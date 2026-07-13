import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createHash, randomUUID } from "crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";
import {
  createWeddingPhoto,
  findPhotoByHash,
  getWeddingProject,
  refreshProjectCounters,
  updateWeddingProject,
} from "@/lib/firestore/trouwstudio";
import { orientationFor, type WeddingPhoto } from "@/features/trouwstudio/types";

// Trouwstudio-upload. In de trouwstudio werken we bewust in de kwaliteit en het
// type van de fotograaf (JPEG/PNG blijven JPEG/PNG): het album en de PDF worden
// uit deze originelen opgebouwd. Bestanden tot 4K blijven byte-voor-byte
// bewaard; alleen beelden groter dan 4K worden bij het uploaden naar 4K
// verkleind (in hetzelfde formaat, hoge kwaliteit). HEIC/HEIF wordt naar JPEG
// omgezet omdat browsers en de PDF-renderer HEIC niet kunnen tonen. Daarnaast
// worden een preview (~1600px webp) en thumbnail (~480px webp) gemaakt voor de
// interface. Duplicaten worden server-side op inhouds-hash gedetecteerd; RAW
// wordt bewust geweigerd.

export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB per trouwfoto
/** Langste zijde waarboven het origineel bij upload wordt verkleind ("4K"). */
const MAX_DIMENSION = 4096;

const SUPPORTED: Record<string, { ext: string; format: "jpeg" | "png" | "webp" | "heic" }> = {
  "image/jpeg": { ext: "jpg", format: "jpeg" },
  "image/png": { ext: "png", format: "png" },
  "image/webp": { ext: "webp", format: "webp" },
  "image/heic": { ext: "heic", format: "heic" },
  "image/heif": { ext: "heif", format: "heic" },
};

const RAW_EXTENSIONS = [".cr2", ".cr3", ".nef", ".arw", ".raf", ".dng", ".orf", ".rw2"];

async function saveToStorage(bytes: Buffer, path: string, contentType: string): Promise<string> {
  const token = randomUUID();
  await adminStorageBucket.file(path).save(bytes, {
    resumable: false,
    metadata: { contentType, metadata: { firebaseStorageDownloadTokens: token } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

type StoredOriginal = {
  bytes: Buffer;
  ext: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
};

/**
 * Bepaalt de te bewaren "originele" versie: byte-voor-byte wanneer het beeld
 * binnen 4K valt en al een web/PDF-vriendelijk type heeft, anders naar 4K
 * verkleind (of van HEIC naar JPEG omgezet) in hoge kwaliteit.
 */
async function buildStoredOriginal(
  source: Buffer,
  uploaded: { format: "jpeg" | "png" | "webp" | "heic"; ext: string; mimeType: string },
  meta: { width?: number; height?: number; orientation?: number },
): Promise<StoredOriginal> {
  const storedW = meta.width ?? 0;
  const storedH = meta.height ?? 0;
  const swap = (meta.orientation ?? 1) >= 5; // EXIF 90/270 wisselt breedte/hoogte
  const displayWidth = swap ? storedH : storedW;
  const displayHeight = swap ? storedW : storedH;
  const longEdge = Math.max(storedW, storedH);
  const needsResize = longEdge > MAX_DIMENSION;
  const isHeic = uploaded.format === "heic";

  // Web/PDF-vriendelijk type binnen 4K: origineel byte-voor-byte bewaren.
  if (!needsResize && !isHeic) {
    return {
      bytes: source,
      ext: uploaded.ext,
      mimeType: uploaded.mimeType,
      width: displayWidth,
      height: displayHeight,
      sizeBytes: source.byteLength,
    };
  }

  // Verkleinen naar 4K en/of HEIC->JPEG. EXIF-rotatie wordt in de pixels gebakken.
  let pipeline = sharp(source, { failOn: "none" }).rotate();
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let outExt = uploaded.ext;
  let outMime = uploaded.mimeType;
  if (uploaded.format === "png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (uploaded.format === "webp") {
    pipeline = pipeline.webp({ quality: 92 });
  } else {
    // jpeg of heic -> jpeg
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
    outExt = "jpg";
    outMime = "image/jpeg";
  }

  const out = await pipeline.toBuffer({ resolveWithObject: true });
  return {
    bytes: out.data,
    ext: outExt,
    mimeType: outMime,
    width: out.info.width ?? displayWidth,
    height: out.info.height ?? displayHeight,
    sizeBytes: out.data.byteLength,
  };
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige upload." }, { status: 400 });
  }

  const file = form.get("file");
  const projectId = String(form.get("projectId") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }
  if (!projectId) return NextResponse.json({ error: "Project ontbreekt." }, { status: 400 });

  const project = await getWeddingProject(projectId);
  if (!project) return NextResponse.json({ error: "Project niet gevonden." }, { status: 404 });

  const lowerName = file.name.toLowerCase();
  if (RAW_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
    return NextResponse.json(
      { error: "RAW-bestanden worden nog niet verwerkt; RAW-ondersteuning volgt later. Upload een JPEG-export." },
      { status: 415 },
    );
  }
  const uploaded = SUPPORTED[file.type];
  if (!uploaded) {
    return NextResponse.json({ error: "Alleen JPEG, PNG, WebP of HEIC/HEIF." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 50 MB)." }, { status: 413 });
  }
  if (file.size < 20 * 1024) {
    return NextResponse.json({ error: "Bestand verdacht klein (<20 kB); waarschijnlijk geen volwaardige foto." }, { status: 422 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const contentHash = createHash("sha256").update(bytes).digest("hex");

  const duplicate = await findPhotoByHash(projectId, contentHash);
  if (duplicate) {
    return NextResponse.json(
      { error: `Duplicaat: identiek aan "${duplicate.filename}".`, duplicateOf: duplicate.id },
      { status: 409 },
    );
  }

  try {
    // HEIC/HEIF: sharp kan het meestal decoderen (afhankelijk van libvips-build);
    // faalt de decode, dan melden we dat eerlijk in plaats van te crashen.
    const meta = await sharp(bytes, { failOn: "none" }).metadata();
    if (!meta.width || !meta.height) {
      return NextResponse.json({ error: "Beschadigde of niet-leesbare foto." }, { status: 422 });
    }

    const stored = await buildStoredOriginal(bytes, { ...uploaded, mimeType: file.type }, meta);
    const photoId = `foto-${randomUUID().slice(0, 12)}`;
    const base = `trouwstudio/${projectId}`;

    const [preview, thumb] = await Promise.all([
      sharp(bytes, { failOn: "none" }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
      sharp(bytes, { failOn: "none" }).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer(),
    ]);

    const [originalUrl, previewUrl, thumbUrl] = await Promise.all([
      saveToStorage(stored.bytes, `${base}/original/${photoId}.${stored.ext}`, stored.mimeType),
      saveToStorage(preview, `${base}/preview/${photoId}.webp`, "image/webp"),
      saveToStorage(thumb, `${base}/thumb/${photoId}.webp`, "image/webp"),
    ]);

    const now = new Date().toISOString();
    const photo: WeddingPhoto = {
      id: photoId,
      projectId,
      originalUrl,
      previewUrl,
      thumbUrl,
      filename: file.name.slice(0, 180),
      mimeType: stored.mimeType,
      width: stored.width,
      height: stored.height,
      contentHash,
      sizeBytes: stored.sizeBytes,
      orientation: orientationFor(stored.width, stored.height),
      status: "wacht_op_analyse",
      favorite: false,
      selectedForAlbum: false,
      createdAt: now,
      updatedAt: now,
    };
    await createWeddingPhoto(photo);
    await refreshProjectCounters(projectId);
    if (project.status === "concept") {
      await updateWeddingProject(projectId, { status: "fotos_toegevoegd" });
    }

    return NextResponse.json({ photo });
  } catch {
    return NextResponse.json({ error: "Verwerken van de foto mislukt. Probeer opnieuw." }, { status: 500 });
  }
}
