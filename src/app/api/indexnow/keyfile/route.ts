import type { NextRequest } from "next/server";
import { getIndexNowKey } from "@/lib/seo/indexnow";

// Serveert het IndexNow-sleutelbestand. next.config schrijft /{sleutel}.txt door
// naar deze route (?key=<sleutel>). Zoekmachines halen dit bestand op om te
// bevestigen dat wie aanmeldt ook eigenaar van het domein is; het moet exact de
// sleutel als platte tekst teruggeven.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("key")?.trim() ?? "";
  const key = await getIndexNowKey();

  // Alleen het pad dat exact overeenkomt met de actieve sleutel geeft het
  // bestand terug; elk ander .txt-pad valt door naar een nette 404.
  if (!key || requested !== key) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
