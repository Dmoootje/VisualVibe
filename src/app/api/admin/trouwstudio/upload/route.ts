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

// Trouwstudio-upload: bewaart het ORIGINEEL byte-voor-byte (nooit
// geconverteerd of overschreven) en genereert daarnaast een preview (~1600px
// webp) en thumbnail (~480px webp) voor de interface. Duplicaten worden
// server-side op inhouds-hash gedetecteerd. RAW-formaten (CR2/CR3/NEF/ARW)
// worden bewust geweigerd met een duidelijke melding: die ondersteuning volgt
// later.

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB per trouwfoto

const SUPPORTED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
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
  const ext = SUPPORTED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Alleen JPEG, PNG, WebP of HEIC/HEIF." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 25 MB)." }, { status: 413 });
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
    const image = sharp(bytes, { failOn: "none" }).rotate();
    const meta = await image.metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    if (!width || !height) {
      return NextResponse.json({ error: "Beschadigde of niet-leesbare foto." }, { status: 422 });
    }

    const photoId = `foto-${randomUUID().slice(0, 12)}`;
    const base = `trouwstudio/${projectId}`;

    const [preview, thumb] = await Promise.all([
      sharp(bytes, { failOn: "none" }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
      sharp(bytes, { failOn: "none" }).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer(),
    ]);

    const [originalUrl, previewUrl, thumbUrl] = await Promise.all([
      saveToStorage(bytes, `${base}/original/${photoId}.${ext}`, file.type),
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
      mimeType: file.type,
      width,
      height,
      contentHash,
      sizeBytes: file.size,
      orientation: orientationFor(width, height),
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
