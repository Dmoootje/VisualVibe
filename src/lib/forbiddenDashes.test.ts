import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const FORBIDDEN_DASHES = [String.fromCodePoint(0x2014), String.fromCodePoint(0x2015)];

describe("repository text safety", () => {
  it("contains no forbidden dash characters in tracked text files", () => {
    const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
    const violations: string[] = [];

    for (const file of trackedFiles) {
      if (!existsSync(file)) continue;
      const contents = readFileSync(file);
      if (contents.includes(0)) continue;

      const text = contents.toString("utf8");
      if (FORBIDDEN_DASHES.some((dash) => text.includes(dash))) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });
});
