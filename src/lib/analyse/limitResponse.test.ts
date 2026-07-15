import { describe, expect, it } from "vitest";
import { toAnalysisLimitResponse } from "./limitResponse";

describe("toAnalysisLimitResponse", () => {
  it("keeps the quota decision and reset time", () => {
    expect(
      toAnalysisLimitResponse({
        decision: "limit_device",
        reason: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
        resetsAt: "2026-07-16T18:30:00.000Z",
      }),
    ).toEqual({
      status: "limit_reached",
      message: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
      quotaDecision: "limit_device",
      resetsAt: "2026-07-16T18:30:00.000Z",
    });
  });
});
