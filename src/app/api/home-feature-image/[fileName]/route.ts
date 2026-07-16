import { adminStorageBucket } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_FILES = new Set(["Webdesign.webp", "SEO.webp", "Fotografie.webp", "Videografie.webp"]);
const HOME_FEATURE_IMAGE_CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000";

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
        // These four branded homepage visuals live behind stable first-party
        // URLs and are small static WebP files. Give repeat visitors a long
        // browser cache lifetime; when replacing one, bump the URL or purge the
        // CDN/browser cache so visitors don't keep an old copy.
        "cache-control": HOME_FEATURE_IMAGE_CACHE_CONTROL,
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
