import { describe, expect, it } from "vitest";
import { pageMetadata } from "./pageMetadata";
import { businessConfig } from "@/config/business.config";

describe("pageMetadata locale output", () => {
  it("emits a self-referencing English canonical and English Open Graph locale", () => {
    const metadata = pageMetadata({
      locale: "en",
      title: "Creative media agency in Limburg | VisualVibe",
      description: "English description",
      path: "/contact/",
    });

    expect(metadata.alternates?.canonical).toBe(`${businessConfig.url}/en/contact/`);
    expect(metadata.openGraph).toMatchObject({
      url: `${businessConfig.url}/en/contact/`,
      locale: "en_GB",
    });
  });
});
