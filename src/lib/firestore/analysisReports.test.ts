import { beforeEach, describe, expect, it, vi } from "vitest";

const firestore = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: firestore.collection,
  },
}));

import { createAnalysisReport, getAnalysisReport } from "./analysisReports";

const report = {
  schemaVersion: 1 as const,
  url: "https://voorbeeld.be/",
  overallScore: 90,
  summary: "Sterk rapport",
  categories: [],
  page: {},
  topIssues: [],
  strengths: [],
  technical: {},
  outputLanguage: "en" as const,
};

describe("analysisReports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestore.collection.mockReturnValue({ doc: firestore.doc });
    firestore.doc.mockReturnValue({ id: "report-id", create: firestore.create, get: firestore.get });
    firestore.create.mockResolvedValue(undefined);
  });

  it("creates a normalized report in the dedicated collection", async () => {
    const created = await createAnalysisReport({
      partnerAnalysisId: "partner-id",
      normalizedDomain: "voorbeeld.be",
      sourceUrl: "https://voorbeeld.be/",
      report,
    });

    expect(firestore.collection).toHaveBeenCalledWith("analysis_reports");
    expect(firestore.create).toHaveBeenCalledWith(
      expect.objectContaining({
        partnerAnalysisId: "partner-id",
        normalizedDomain: "voorbeeld.be",
        sourceUrl: "https://voorbeeld.be/",
        schemaVersion: 1,
        report,
        outputLanguage: "en",
      }),
    );
    expect(firestore.create.mock.calls[0][0]).not.toHaveProperty("raw");
    expect(created.id).toBe("report-id");
    expect(created.outputLanguage).toBe("en");
  });

  it("returns null for a missing report", async () => {
    firestore.get.mockResolvedValue({ exists: false });

    await expect(getAnalysisReport("missing")).resolves.toBeNull();
  });

  it("ignores malformed top-level output language and trusts only validated report metadata", async () => {
    firestore.get.mockResolvedValue({
      exists: true,
      id: "legacy-report",
      data: () => ({
        partnerAnalysisId: "partner-id",
        normalizedDomain: "voorbeeld.be",
        sourceUrl: "https://voorbeeld.be/",
        outputLanguage: "english",
        report: { ...report, outputLanguage: undefined },
        createdAt: "2026-07-18T00:00:00.000Z",
        updatedAt: "2026-07-18T00:00:00.000Z",
      }),
    });

    const loaded = await getAnalysisReport("legacy-report");
    expect(loaded).not.toBeNull();
    expect(loaded?.outputLanguage).toBeUndefined();
  });
});
