import assert from "node:assert/strict";
import test from "node:test";
import { parseRolloutArgs, QUOTA_SETTINGS } from "./analysis-quota-rollout.mjs";

test("rollout defaults are exact", () => {
  assert.deepEqual(QUOTA_SETTINGS, {
    maxPerEmail24h: 3,
    maxPerDevice24h: 3,
    maxPerIp24h: 12,
    maxPerIp30d: 180,
  });
});

test("production apply needs the exact project and flag", () => {
  assert.deepEqual(
    parseRolloutArgs(["--project", "gen-lang-client-0235296023", "--apply"]),
    { projectId: "gen-lang-client-0235296023", apply: true },
  );
  assert.throws(() => parseRolloutArgs(["--project", "wrong-project", "--apply"]));
  assert.deepEqual(
    parseRolloutArgs(["--project", "gen-lang-client-0235296023"]),
    { projectId: "gen-lang-client-0235296023", apply: false },
  );
});
