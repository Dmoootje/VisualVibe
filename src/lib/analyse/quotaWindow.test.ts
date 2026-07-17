import { describe, expect, it } from "vitest";
import {
  activeAnalysisEntries,
  entriesInWindow,
  latestBlockingLimit,
  resetAtForWindow,
} from "./quotaWindow";

const NOW = Date.parse("2026-07-15T18:30:00.000Z");
const DAY_MS = 24 * 60 * 60_000;

describe("rolling quota windows", () => {
  it("drops a success at the exact 24-hour boundary", () => {
    const entries = [
      { t: "2026-07-14T18:30:00.000Z", kind: "success" as const },
      { t: "2026-07-14T18:30:00.001Z", kind: "success" as const },
    ];

    expect(entriesInWindow(entries, ["success"], NOW - DAY_MS)).toHaveLength(1);
  });

  it("counts only live reservations with successes", () => {
    const entries = [
      { t: "2026-07-15T18:29:00.000Z", kind: "reserved" as const },
      { t: "2026-07-15T18:20:00.000Z", kind: "reserved" as const },
      { t: "2026-07-15T17:00:00.000Z", kind: "success" as const },
    ];

    expect(activeAnalysisEntries(entries, NOW - DAY_MS, NOW, 5 * 60_000)).toHaveLength(2);
  });

  it("adds the completion allowance to a reserved entry reset", () => {
    const entries = [
      { t: "2026-07-15T18:29:00.000Z", kind: "reserved" as const },
    ];

    expect(resetAtForWindow(entries, DAY_MS, 1, 8 * 60_000)).toBe(
      "2026-07-16T18:37:00.000Z",
    );
  });

  it("returns the expiry that actually creates one free slot", () => {
    const entries = [
      { t: "2026-07-15T10:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T11:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T12:00:00.000Z", kind: "attempt" as const },
      { t: "2026-07-15T13:00:00.000Z", kind: "attempt" as const },
    ];

    expect(resetAtForWindow(entries, DAY_MS, 3)).toBe("2026-07-16T11:00:00.000Z");
  });

  it("selects the latest reset when multiple limits block", () => {
    const selected = latestBlockingLimit([
      { decision: "limit_ip_daily" as const, resetsAt: "2026-07-16T10:00:00.000Z" },
      { decision: "limit_ip_monthly" as const, resetsAt: "2026-07-20T10:00:00.000Z" },
    ]);

    expect(selected.decision).toBe("limit_ip_monthly");
  });
});
