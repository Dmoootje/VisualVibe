import "server-only";

import { getIndexNowKey } from "@/lib/seo/indexnow";

export async function createIndexNowKeyfileResponse(requested: string): Promise<Response> {
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
