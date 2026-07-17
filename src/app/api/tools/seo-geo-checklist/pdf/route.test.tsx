import { describe, expect, it } from "vitest";
import { buildChecklistPdfModel } from "@/lib/tools/seoGeoChecklistPdf";
import { POST } from "./route";

describe("SEO/GEO checklist PDF route", () => {
  it("builds a printable full checklist when nothing is checked", () => {
    const model = buildChecklistPdfModel([]);

    expect(model.hasEmptySelectionNotice).toBe(true);
    expect(model.groups).toHaveLength(6);
    expect(model.groups.flatMap((group) => group.items)).toHaveLength(24);
    expect(model.groups.flatMap((group) => group.items).every((item) => item.checked === false)).toBe(
      true,
    );
  });

  it("marks selected items while keeping the full checklist printable", () => {
    const model = buildChecklistPdfModel(["technical-seo-indexable", "aio-geo-direct-answer"]);

    expect(model.hasEmptySelectionNotice).toBe(false);
    expect(model.groups.flatMap((group) => group.items)).toHaveLength(24);
    expect(
      model.groups
        .flatMap((group) => group.items)
        .filter((item) => item.checked)
        .map((item) => item.id),
    ).toEqual(["technical-seo-indexable", "aio-geo-direct-answer"]);
  });

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
