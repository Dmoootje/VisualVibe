import { describe, expect, it } from "vitest";
import { droneCategories, droneMedia, getLocalizedDroneContent } from "@/config/drone.config";
import { getLocalizedMatterportTours, matterportTours } from "./matterportTours";

describe("static realisation media localisation", () => {
  it("localises every Matterport tour", () => {
    const translated = getLocalizedMatterportTours("en");
    expect(translated).toHaveLength(matterportTours.length);
    expect(translated.map(({ id }) => id)).toEqual(matterportTours.map(({ id }) => id));
    expect(translated.map(({ title }) => title)).not.toEqual(matterportTours.map(({ title }) => title));
  });

  it("localises every drone category and media record", () => {
    const translated = getLocalizedDroneContent("en");
    expect(translated.categories).toHaveLength(droneCategories.length);
    expect(translated.media).toHaveLength(droneMedia.length);
    expect(translated.media.every(({ title }) => !/[ë]|luchtbeelden|door het project/u.test(title))).toBe(true);
  });

  it("fails closed for unprepared locales", () => {
    expect(() => getLocalizedMatterportTours("fr")).toThrow("Missing fr Matterport translations");
    expect(() => getLocalizedDroneContent("de")).toThrow("Missing de drone translations");
  });
});
