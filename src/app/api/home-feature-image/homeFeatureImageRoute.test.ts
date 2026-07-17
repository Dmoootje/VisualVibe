import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  file: vi.fn(),
  getMetadata: vi.fn(),
  download: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  adminStorageBucket: {
    file: mocks.file,
  },
}));

import { GET } from "./[fileName]/route";

describe("home feature image route", () => {
  beforeEach(() => {
    mocks.file.mockReturnValue({
      getMetadata: mocks.getMetadata,
      download: mocks.download,
    });
    mocks.getMetadata.mockResolvedValue([{ contentType: "image/webp" }]);
    mocks.download.mockResolvedValue([Buffer.from("webp-bytes")]);
  });

  it("serves replaceable homepage feature images with a long browser cache lifetime", async () => {
    const response = await GET(new Request("https://visualvibe.media/api/home-feature-image/Webdesign.webp"), {
      params: Promise.resolve({ fileName: "Webdesign.webp" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, s-maxage=31536000",
    );
  });
});
