import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { uploadImageBuffer } from "@/lib/firebase/uploadImage";
import { setWebdesignImage } from "@/lib/firestore/webdesignImages";
import { revalidateWebdesign } from "@/lib/admin/revalidateWebdesign";
import { imageKey } from "@/data/webdesignShowcase";
import { hasFirecrawl, scrapeSite } from "@/lib/firecrawl";
import { generateRealisatie, hasRealisatieAi } from "@/lib/ai/generateRealisatie";

// Admin-only "Auto-genereer uit URL": captures desktop + mobile screenshots via
// Firecrawl, uploads them to Firebase, and drafts the copy with the active AI provider. Returns
// the new image URLs (already persisted) plus draft text/badges/terms/features
// for the admin to review before saving. Server-only (Node runtime).
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let body: { url?: unknown; projectId?: unknown; siteName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
  const siteName = typeof body.siteName === "string" ? body.siteName.trim() : "";

  if (!projectId) {
    return NextResponse.json({ error: "Ontbrekende realisatie." }, { status: 400 });
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new Error();
  } catch {
    return NextResponse.json({ error: "Vul een geldige website-URL in (met https://)." }, { status: 400 });
  }

  if (!hasFirecrawl()) {
    return NextResponse.json(
      { error: "Firecrawl is niet geconfigureerd (FIRECRAWL_API_KEY ontbreekt)." },
      { status: 503 },
    );
  }

  // Capture both viewports in parallel.
  let desktop: Awaited<ReturnType<typeof scrapeSite>>;
  let mobile: Awaited<ReturnType<typeof scrapeSite>>;
  try {
    [desktop, mobile] = await Promise.all([
      scrapeSite(url, { mobile: false }),
      scrapeSite(url, { mobile: true }),
    ]);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Screenshots maken mislukt." },
      { status: 502 },
    );
  }

  // SEO-friendly filename stem: prefer the site name, else the domain, never the
  // random project id. uploadImageBuffer slugifies + lowercases this.
  const hostStem = parsedUrl.hostname.replace(/^www\./i, "").replace(/\.[a-z.]+$/i, "");
  const nameStem = siteName.trim() || hostStem || projectId;

  // Upload each viewport once, then reuse the URL across the matching slots.
  const images: Record<string, string> = {};
  try {
    const [desktopUrl, mobileUrl] = await Promise.all([
      uploadImageBuffer(desktop.screenshot, `${nameStem}-desktop`),
      uploadImageBuffer(mobile.screenshot, `${nameStem}-mobiel`),
    ]);
    // thumb + hoofdscreenshot (1) + desktop (2) share the desktop shot; mobiel (4) is the phone shot.
    const slotUrls: Record<string, string> = {
      [imageKey(projectId, "thumb")]: desktopUrl,
      [imageKey(projectId, "1")]: desktopUrl,
      [imageKey(projectId, "2")]: desktopUrl,
      [imageKey(projectId, "4")]: mobileUrl,
    };
    await Promise.all(Object.entries(slotUrls).map(([k, v]) => setWebdesignImage(k, v)));
    Object.assign(images, slotUrls);
    // Let the new screenshots appear on the public page without the ISR wait.
    revalidateWebdesign();
  } catch {
    return NextResponse.json({ error: "Screenshots opslaan mislukt." }, { status: 500 });
  }

  // Draft the copy. If this fails, still return the images so the run isn't wasted.
  let copy: Awaited<ReturnType<typeof generateRealisatie>> | null = null;
  let copyError: string | undefined;
  if (await hasRealisatieAi()) {
    try {
      copy = await generateRealisatie({ siteName, url, markdown: desktop.markdown });
    } catch (e) {
      copyError = e instanceof Error ? e.message : "Tekst genereren mislukt.";
    }
  } else {
    copyError = "AI-tekst niet geconfigureerd. Stel de actieve provider in onder Instellingen > AI-providers.";
  }

  return NextResponse.json({ images, copy, copyError });
}
