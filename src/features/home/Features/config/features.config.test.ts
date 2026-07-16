import { describe, expect, it } from "vitest";
import { featuresConfig } from "./features.config";

describe("featuresConfig homepage images", () => {
  it("uses stable first-party image URLs for replaceable homepage feature images", () => {
    const replaceableImages = ["Webdesign.webp", "SEO.webp", "Fotografie.webp", "Videografie.webp"];

    for (const imageName of replaceableImages) {
      const feature = featuresConfig.features.find((item) => item.image.includes(imageName));

      expect(feature, `${imageName} is configured`).toBeDefined();
      expect(feature?.image).toBe(`/api/home-feature-image/${imageName}/`);
      expect(feature?.image).not.toContain("firebasestorage.googleapis.com");
      expect(feature?.image).not.toContain("token=");
    }
  });
});
