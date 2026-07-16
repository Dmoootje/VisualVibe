import type { NextRequest } from "next/server";
import { createIndexNowKeyfileResponse } from "@/lib/seo/indexnowKeyfileResponse";
import { resolveRequestedIndexNowKey } from "@/lib/seo/indexnowKeyfile";

// Serveert het IndexNow-sleutelbestand. next.config schrijft /{sleutel}.txt door
// naar deze route (?key=<sleutel>). Zoekmachines halen dit bestand op om te
// bevestigen dat wie aanmeldt ook eigenaar van het domein is; het moet exact de
// sleutel als platte tekst teruggeven.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requested = resolveRequestedIndexNowKey(request.nextUrl);
  return createIndexNowKeyfileResponse(requested);
}
