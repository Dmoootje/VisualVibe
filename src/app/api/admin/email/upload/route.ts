import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminStorageBucket } from "@/lib/firebase/admin";

// Upload van uitgaande bijlagen voor de e-mailclient. Bestanden gaan naar
// Firebase Storage (nooit base64 in Firestore); het concept bewaart alleen het
// storagePath. Gevaarlijke uitvoerbare types worden geweigerd.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;

const BLOCKED_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".com", ".scr", ".pif", ".js", ".jse", ".vbs",
  ".vbe", ".ws", ".wsf", ".wsh", ".ps1", ".msi", ".msp", ".jar", ".hta",
  ".cpl", ".reg", ".dll", ".apk", ".app", ".lnk",
];

function sanitizeFilename(value: string): string {
  const clean = value
    .replace(/[\\/:*?"<>|\r\n\0]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150);
  return clean || "bijlage";
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
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Geen bestand ontvangen." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Bestand te groot (max 15 MB per bijlage)." }, { status: 413 });
  }
  const lowerName = file.name.toLowerCase();
  if (BLOCKED_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
    return NextResponse.json(
      { error: "Dit bestandstype is niet toegestaan als bijlage." },
      { status: 415 },
    );
  }

  const filename = sanitizeFilename(file.name);
  const contentType = (file.type || "application/octet-stream").slice(0, 120);
  const storagePath = `email-client/outgoing/${new Date().toISOString().slice(0, 10)}/${randomUUID()}/${filename}`;

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    await adminStorageBucket.file(storagePath).save(bytes, {
      resumable: false,
      metadata: { contentType, metadata: { uploadedBy: admin.email } },
    });
    return NextResponse.json({
      attachment: {
        filename,
        contentType,
        size: file.size,
        storagePath,
      },
    });
  } catch {
    return NextResponse.json({ error: "De bijlage kon niet worden opgeslagen." }, { status: 500 });
  }
}
