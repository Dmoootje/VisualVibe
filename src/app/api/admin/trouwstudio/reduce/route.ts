import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getWeddingPhoto } from "@/lib/firestore/trouwstudio";

// Server-side beeldreductie voor de PDF-export. Geeft een gereduceerde JPEG
// terug (schaal 50-100% van de brondimensie, instelbare kwaliteit) die de
// client-side react-pdf-renderer als beeldbron gebruikt. Zo blijft het
// PDF-bestand kleiner zonder dat de browser met CORS/canvas-taint hoeft te
// werken. Het origineel op Storage blijft onaangeroerd.

export const runtime = "nodejs";
export const maxDuration = 60;

function clamp(value: number, min: number, max: number, fallback: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const projectId = String(params.get("projectId") ?? "").trim();
  const photoId = String(params.get("photoId") ?? "").trim();
  const scale = clamp(Number(params.get("scale")), 0.5, 1, 1);
  const quality = Math.round(clamp(Number(params.get("q")), 40, 100, 90));
  if (!projectId || !photoId) {
    return NextResponse.json({ error: "Ontbrekende parameters." }, { status: 400 });
  }

  const photo = await getWeddingPhoto(projectId, photoId);
  if (!photo) return NextResponse.json({ error: "Foto niet gevonden." }, { status: 404 });

  const sourceUrl = photo.processedUrl ?? photo.originalUrl;
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Bronbeeld niet bereikbaar." }, { status: 502 });
    }
    const source = Buffer.from(await response.arrayBuffer());

    let pipeline = sharp(source, { failOn: "none" }).rotate();
    if (scale < 1) {
      const targetWidth = Math.max(200, Math.round((photo.width || 2000) * scale));
      pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true });
    }
    const out = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();

    return new NextResponse(new Uint8Array(out), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(out.byteLength),
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Reductie mislukt." }, { status: 500 });
  }
}
