import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("SEO/GEO checklist PDF route", () => {
  it("returns a branded PDF for selected checklist items", async () => {
    const response = await POST(
      new Request("https://visualvibe.media/api/tools/seo-geo-checklist/pdf", {
        method: "POST",
        body: JSON.stringify({
          checkedItemIds: ["technical-seo-indexable", "aio-geo-direct-answer"],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/pdf");
    expect(response.headers.get("content-disposition")).toContain("visualvibe-seo-geo-checklist.pdf");
    expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(1000);
  });

  it("rejects invalid payloads", async () => {
    const response = await POST(
      new Request("https://visualvibe.media/api/tools/seo-geo-checklist/pdf", {
        method: "POST",
        body: JSON.stringify({ checkedItemIds: "alles" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "invalid_payload",
    });
  });
});
