import { describe, expect, it } from "vitest";
import { applicationCases } from "@/data/applicationCases";
import { buildApplicationCaseJsonLd } from "./applicationCaseJsonLd";

describe("buildApplicationCaseJsonLd", () => {
  it("describes a bespoke application as a project case without sales markup", () => {
    const project = applicationCases.find((item) => item.id === "pelletkachelzorg");
    if (!project) throw new Error("Pelletkachelzorg fixture ontbreekt");

    const canonical =
      "https://visualvibe.media/be/realisaties/applicaties/pelletkachelzorg-multisite-commerce-platform/";
    const cover = "https://firebasestorage.googleapis.com/pelletkachelzorg-cover.webp";
    const schema = buildApplicationCaseJsonLd({ project, canonical, cover });

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: project.seoTitle,
      description: project.seoDescription,
      inLanguage: "nl-BE",
      isPartOf: { "@id": "https://visualvibe.media/#website" },
      publisher: { "@id": "https://visualvibe.media/#organization" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: cover,
      },
      mainEntity: {
        "@type": "CreativeWork",
        "@id": `${canonical}#project`,
        name: project.title,
        description: project.seoDescription,
        genre: "Maatwerk softwareproject",
        creativeWorkStatus: "In development",
        creator: { "@id": "https://visualvibe.media/#organization" },
        keywords: project.capabilities,
        image: cover,
      },
    });

    const serialized = JSON.stringify(schema);
    expect(serialized).not.toContain("SoftwareApplication");
    expect(serialized).not.toContain("aggregateRating");
    expect(serialized).not.toContain('"offers"');
  });

  it("localizes English application case language and genre metadata", () => {
    const project = applicationCases.find((item) => item.id === "pelletkachelzorg");
    if (!project) throw new Error("Pelletkachelzorg fixture ontbreekt");

    const canonical =
      "https://visualvibe.media/en/realisaties/applications/pellet-stove-care-multisite-commerce-platform/";
    const schema = buildApplicationCaseJsonLd({ project, canonical, locale: "en" });

    expect(schema).toMatchObject({
      inLanguage: "en-BE",
      mainEntity: {
        genre: "Custom software project",
      },
    });
    expect(JSON.stringify(schema)).not.toMatch(/nl-BE|Maatwerk softwareproject/);
  });
});
