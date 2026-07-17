import { describe, expect, it } from "vitest";

import { evaluateLocaleReadiness } from "./readiness";

describe("evaluateLocaleReadiness", () => {
  it("blocks readiness when a required message is missing", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      requiredMessageKeys: ["nav.home", "nav.contact"],
      messageKeys: ["nav.home"],
    });

    expect(result.ready).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({ code: "missing_message", source: "nav.contact" }),
    ]);
  });

  it("blocks readiness when expected content is absent", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [{ source: "services/webdesign", present: false }],
    });

    expect(result.issues[0]?.code).toBe("missing_content");
  });

  it("blocks readiness when required metadata is blank", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [
        {
          source: "services/webdesign",
          metadata: { title: "Web design", description: "" },
          requiredMetadata: ["title", "description"],
        },
      ],
    });

    expect(result.issues[0]?.code).toBe("missing_metadata");
  });

  it("blocks readiness when a meaningful image has no alt text", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [
        {
          source: "services/webdesign",
          images: [{ source: "hero", decorative: false, alt: " " }],
        },
      ],
    });

    expect(result.issues[0]?.code).toBe("missing_alt");
  });

  it("allows decorative images to use empty alt text", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [
        {
          source: "services/webdesign",
          images: [{ source: "texture", decorative: true, alt: "" }],
        },
      ],
    });

    expect(result).toEqual({ ready: true, issues: [] });
  });

  it("blocks readiness when a translation partner is missing", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [
        { source: "knowledge/wat-is-aeo", requiresTranslationPartner: true },
      ],
    });

    expect(result.issues[0]?.code).toBe("missing_translation_partner");
  });

  it("blocks readiness when an internal link targets another locale", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      content: [
        {
          source: "knowledge/what-is-aeo",
          links: ["/en/services/seo", "/be/diensten/seo"],
        },
      ],
    });

    expect(result.issues[0]?.code).toBe("cross_locale_link");
  });

  it("reports leaked routes for unpublished locale prefixes", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      publishedRouteLeaks: ["/en/contact"],
    });

    expect(result.issues[0]?.code).toBe("published_route_leak");
  });

  it("sorts issues deterministically", () => {
    const result = evaluateLocaleReadiness({
      locale: "en",
      requiredMessageKeys: ["z.key", "a.key"],
      messageKeys: [],
    });

    expect(result.issues.map((issue) => issue.source)).toEqual(["a.key", "z.key"]);
  });
});
