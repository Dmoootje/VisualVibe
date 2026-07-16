import { adminStorageBucket } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_FILES = new Set(["Webdesign.webp", "SEO.webp", "Fotografie.webp", "Videografie.webp"]);

type RouteContext = {
  params: Promise<{ fileName: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { fileName } = await params;

  if (!ALLOWED_FILES.has(fileName)) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-content-type-options": "nosniff",
      },
    });
  }

  try {
    const file = adminStorageBucket.file(`images/${fileName}`);
    const [metadata] = await file.getMetadata();
    const [bytes] = await file.download();

    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": metadata.contentType || "image/webp",
        "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-content-type-options": "nosniff",
      },
    });
  }
}
