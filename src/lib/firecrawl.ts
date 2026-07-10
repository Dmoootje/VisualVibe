// Thin Firecrawl client. We use it for two things when auto-generating a
// realisatie from a site URL: capturing a screenshot (desktop or mobile
// viewport) and scraping the page text so the AI can write the copy. The
// screenshot comes back as a temporary Firecrawl-hosted URL, so we fetch the
// bytes here and hand a Buffer to the caller, which re-uploads to Firebase.
// Server-only (Node runtime).

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/scrape";

export type ScrapeResult = {
  /** PNG screenshot bytes (viewport). */
  screenshot: Buffer;
  /** Page content as markdown, for the AI copywriter. Empty on a text-less scrape. */
  markdown: string;
};

/** True when Firecrawl is configured. Lets the route give a clear error early. */
export function hasFirecrawl(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY);
}

/**
 * Scrape one URL: viewport screenshot + markdown. `mobile: true` renders in a
 * phone viewport. Throws with a Dutch message on any failure.
 */
export async function scrapeSite(
  url: string,
  { mobile = false }: { mobile?: boolean } = {},
): Promise<ScrapeResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY ontbreekt in de omgeving.");
  }

  const res = await fetch(FIRECRAWL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "screenshot"],
      onlyMainContent: false,
      mobile,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Firecrawl-fout (${res.status}). ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: { screenshot?: string; markdown?: string };
    error?: string;
  };

  if (!json.success || !json.data) {
    throw new Error(json.error ? `Firecrawl: ${json.error}` : "Firecrawl gaf geen resultaat terug.");
  }

  const screenshotUrl = json.data.screenshot;
  if (!screenshotUrl) {
    throw new Error("Firecrawl leverde geen screenshot.");
  }

  const shot = await fetch(screenshotUrl);
  if (!shot.ok) {
    throw new Error("Screenshot van Firecrawl kon niet worden opgehaald.");
  }
  const screenshot = Buffer.from(await shot.arrayBuffer());

  return { screenshot, markdown: json.data.markdown ?? "" };
}
