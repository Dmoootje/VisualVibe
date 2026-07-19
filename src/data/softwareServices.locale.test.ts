import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import * as softwareModule from "./softwareServices";

describe("localized custom software services", () => {
  it("exposes the complete natural English route inventory", () => {
    expect(typeof softwareModule.getSoftwareServices).toBe("function");
    const services = softwareModule.getSoftwareServices!("en");

    expect(services.map((service) => service.slug)).toEqual([
      "app-development",
      "web-application-development",
      "ai-application-development",
      "api-integrations-and-automation",
      "app-design-ux-ui",
    ]);
    expect(services.map((service) => softwareModule.softwareServiceHref!(service, "en"))).toEqual([
      "/services/custom-software/app-development",
      "/services/custom-software/web-application-development",
      "/services/custom-software/ai-application-development",
      "/services/custom-software/api-integrations-and-automation",
      "/services/custom-software/app-design-ux-ui",
    ]);
  });

  it("looks up English slugs while preserving stable Dutch identities", () => {
    expect(typeof softwareModule.getLocalizedSoftwareServiceBySlug).toBe("function");
    const service = softwareModule.getLocalizedSoftwareServiceBySlug!("api-integrations-and-automation", "en");

    expect(service).toMatchObject({
      id: "api-koppelingen-en-automatisering",
      title: "API integrations and automation",
      slug: "api-integrations-and-automation",
    });
    expect(softwareModule.getLocalizedSoftwareServiceBySlug!("api-koppelingen-en-automatisering", "en")).toBeUndefined();
    expect(softwareModule.getLocalizedSoftwareServiceBySlug!("api-koppelingen-en-automatisering", "nl")?.title)
      .toBe("API-koppelingen en automatisering");
  });

  it("resolves every English knowledge-base custom-software target", () => {
    const routeSet = new Set([
      "/en/services/custom-software/",
      ...softwareModule.getSoftwareServices!("en").map(
        (service) => `/en${softwareModule.softwareServiceHref!(service, "en")}/`,
      ),
    ]);
    const directory = resolve("content/kennisbank/en");
    const targets = readdirSync(directory)
      .filter((name) => name.endsWith(".mdx"))
      .flatMap((name) => [...readFileSync(resolve(directory, name), "utf8").matchAll(/\]\((\/en\/services\/custom-software\/[^)#?]*\/?)\)/g)].map((match) => match[1]))
      .map((href) => href.endsWith("/") ? href : `${href}/`);

    expect(targets.length).toBeGreaterThan(0);
    expect([...new Set(targets)].filter((target) => !routeSet.has(target))).toEqual([]);
  });

  it("has one schema-shaped localization brief for the hub and every detail", () => {
    const filenames = ["custom-software", ...softwareModule.getSoftwareServices!("en").map((service) => service.slug)];
    for (const filename of filenames) {
      const brief = JSON.parse(readFileSync(resolve(`docs/localization/briefs/services/${filename}.json`), "utf8"));
      expect(brief).toMatchObject({
        targetRoute: expect.stringMatching(/^\/en\/services\/custom-software\//),
        audience: expect.any(String),
        primaryDutchSearchIntent: expect.any(String),
        directAnswer: expect.any(String),
        title: expect.any(String),
        metaDescription: expect.any(String),
        h1: expect.any(String),
      });
      expect(brief.factsToPreserve.length).toBeGreaterThanOrEqual(4);
    }
  });
});
