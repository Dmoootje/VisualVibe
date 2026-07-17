import { describe, expect, it } from "vitest";
import { getServiceBySlug } from "./services";

describe("service SEO descriptions", () => {
  it("keeps crawled service meta descriptions long enough to avoid thin snippets", () => {
    const crawledTooShortSlugs = ["3d-vr-ar", "masterclasses", "podcasting"];

    for (const slug of crawledTooShortSlugs) {
      const service = getServiceBySlug(slug);

      expect(service, `${slug} exists`).toBeDefined();
      expect(service?.seo.description.length, `${slug} meta description length`).toBeGreaterThanOrEqual(120);
      expect(service?.seo.description.length, `${slug} meta description length`).toBeLessThanOrEqual(160);
    }
  });
});
