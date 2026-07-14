import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { IMAGE_EXT_BY_TYPE, uploadImageBuffer } from "@/lib/firebase/uploadImage";

// Admin-only image upload. Saves to Firebase Storage with a download token so
// the returned URL is publicly readable without changing Storage rules (matches
// the existing token-based portfolio URLs). Server-only (Node runtime).
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Allowlisted upload scopes -> storage directory. Prevents arbitrary paths.
const UPLOAD_DIRS: Record<string, string> = {
  webdesign: "images/portfolio/webdesign",
  applicaties: "images/portfolio/applicaties",
  fotografie: "images/library/fotografie",
  profiel: "images/team",
  weddingvibe: "images/weddingvibe",
  drone: "images/library/drone",
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
  const scope = String(form.get("scope") ?? "webdesign");
  const dir = UPLOAD_DIRS[scope] ?? UPLOAD_DIRS.webdesign;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }
  if (!IMAGE_EXT_BY_TYPE[file.type]) {
    return NextResponse.json({ error: "Alleen webp, png, jpg, avif of svg." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 8 MB)." }, { status: 400 });
  }

  let url: string;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    url = await uploadImageBuffer(bytes, key || "image", dir);
  } catch {
    return NextResponse.json({ error: "Uploaden mislukt. Probeer opnieuw." }, { status: 500 });
  }

  return NextResponse.json({ url });
}
