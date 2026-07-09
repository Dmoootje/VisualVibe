import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";

// Admin-only image upload. Saves to Firebase Storage with a download token so
// the returned URL is publicly readable without changing Storage rules (matches
// the existing token-based portfolio URLs). Server-only (Node runtime).
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige upload." }, { status: 400 });
  }

  const file = form.get("file");
  const key = String(form.get("key") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Alleen webp, png, jpg, avif of svg." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 8 MB)." }, { status: 400 });
  }

  const safeKey = (key || "image").replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
  const token = randomUUID();
  const path = `images/portfolio/webdesign/${safeKey}-${Date.now()}.${ext}`;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    await adminStorageBucket.file(path).save(bytes, {
      resumable: false,
      metadata: { contentType: file.type, metadata: { firebaseStorageDownloadTokens: token } },
    });
  } catch {
    return NextResponse.json({ error: "Uploaden mislukt. Probeer opnieuw." }, { status: 500 });
  }

  const url = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(
    path
  )}?alt=media&token=${token}`;

  return NextResponse.json({ url });
}
