import { describe, expect, it } from "vitest";
import { pageMetadata } from "./pageMetadata";
import { businessConfig } from "@/config/business.config";

describe("pageMetadata locale output", () => {
  it("emits an English canonical, Open Graph locale and exact published alternates", () => {
    const metadata = pageMetadata({
      locale: "en",
      title: "Creative media agency in Limburg | VisualVibe",
      description: "English description",
      path: "/request-a-quotation/",
      languagePaths: {
        nl: "/offerte-aanvragen/",
        en: "/request-a-quotation/",
      },
    });

    expect(metadata.alternates).toEqual({
      canonical: `${businessConfig.url}/en/request-a-quotation/`,
      languages: {
        "nl-BE": `${businessConfig.url}/be/offerte-aanvragen/`,
        "en-BE": `${businessConfig.url}/en/request-a-quotation/`,
        "x-default": `${businessConfig.url}/be/offerte-aanvragen/`,
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: `${businessConfig.url}/en/request-a-quotation/`,
      locale: "en_GB",
    });
  });

  it("does not fabricate language alternates for Dutch-only metadata", () => {
    const metadata = pageMetadata({
      title: "Nederlandse pagina | VisualVibe",
      description: "Nederlandse beschrijving",
      path: "/alleen-nederlands/",
    });

    expect(metadata.alternates).toEqual({
      canonical: `${businessConfig.url}/be/alleen-nederlands/`,
      languages: undefined,
    });
  });
});
