import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: { collection: () => ({ doc: () => ({ get }) }) },
}));
vi.mock("@/lib/firestore/withTimeout", () => ({ withTimeout: <T>(value: Promise<T>) => value }));

describe("English public site-setting defaults", () => {
  beforeEach(() => get.mockReset());

  it("returns code-owned English defaults when Firestore is unavailable", async () => {
    get.mockRejectedValueOnce(new Error("offline"));
    const { getSiteSettings } = await import("./siteSettings");

    const settings = await getSiteSettings("en");

    expect(settings.responseTimeText).toBe("Within two business days");
    expect(settings.country).toBe("Belgium");
    expect(settings.openingHours[0].label).toBe("Monday");
  });

  it("returns code-owned English defaults when the settings document is missing", async () => {
    get.mockResolvedValueOnce({ exists: false });
    const { getSiteSettings } = await import("./siteSettings");

    const settings = await getSiteSettings("en");

    expect(settings.responseTimeText).toBe("Within two business days");
    expect(settings.openingHours[6].note).toBe("Closed");
  });

  it("uses English visitor defaults for legacy scalar visitor fields", async () => {
    get.mockResolvedValueOnce({
      exists: true,
      data: () => ({ responseTimeText: "Binnen 2 werkdagen" }),
    });
    const { getSiteSettings } = await import("./siteSettings");

    const settings = await getSiteSettings("en");

    expect(settings.responseTimeText).toBe("Within two business days");
    expect(settings.appointmentTitle).toBe("Schedule a call");
    expect(settings.responseTimeText).not.toContain("werkdagen");
  });
});
