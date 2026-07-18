import { describe, expect, it } from "vitest";
import { applicationCases } from "@/data/applicationCases";
import { webdesignProjects } from "@/data/webdesignShowcase";
import {
  localizeApplicationHubSources,
  localizeWebdesignHubSources,
} from "./hubData";

describe("realisation hub dynamic localisation boundary", () => {
  it("keeps known reviewed defaults and hides unknown web design records in English", () => {
    const unknown = { ...webdesignProjects[0], id: "firestore-only", text: "Nederlandse beheertekst" };
    const translated = localizeWebdesignHubSources([...webdesignProjects, unknown], "en");
    expect(translated).toHaveLength(webdesignProjects.length);
    expect(translated.some(({ id }) => id === unknown.id)).toBe(false);
    expect(JSON.stringify(translated)).not.toContain("Nederlandse beheertekst");
  });

  it("keeps known reviewed defaults and hides unknown application records in English", () => {
    const unknown = { ...applicationCases[0], id: "firestore-only", title: "Nederlandse beheertitel" };
    const translated = localizeApplicationHubSources([...applicationCases, unknown], "en");
    expect(translated).toHaveLength(applicationCases.length);
    expect(translated.some(({ id }) => id === unknown.id)).toBe(false);
    expect(JSON.stringify(translated)).not.toContain("Nederlandse beheertitel");
  });
});
