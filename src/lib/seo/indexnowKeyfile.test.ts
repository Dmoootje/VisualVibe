import { describe, expect, it } from "vitest";
import { resolveRequestedIndexNowKey } from "./indexnowKeyfile";

describe("resolveRequestedIndexNowKey", () => {
  it("uses the explicit query key when present", () => {
    const requestUrl = new URL(
      "https://visualvibe.media/api/indexnow/keyfile/?key=75e59c0abdbf97fe74fd41d08fb8503b",
    );

    expect(resolveRequestedIndexNowKey(requestUrl)).toBe("75e59c0abdbf97fe74fd41d08fb8503b");
  });

  it("falls back to the original root .txt path used by IndexNow rewrites", () => {
    const requestUrl = new URL("https://visualvibe.media/75e59c0abdbf97fe74fd41d08fb8503b.txt");

    expect(resolveRequestedIndexNowKey(requestUrl)).toBe("75e59c0abdbf97fe74fd41d08fb8503b");
  });

  it("ignores unrelated text files", () => {
    const requestUrl = new URL("https://visualvibe.media/BingSiteAuth.xml");

    expect(resolveRequestedIndexNowKey(requestUrl)).toBe("");
  });
});
