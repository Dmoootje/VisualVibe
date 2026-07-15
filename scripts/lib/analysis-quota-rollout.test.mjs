import assert from "node:assert/strict";
import test from "node:test";
import * as rollout from "./analysis-quota-rollout.mjs";

const { parseRolloutArgs, QUOTA_SETTINGS } = rollout;

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

test("rollout rejects unknown and duplicate arguments", () => {
  assert.throws(() => parseRolloutArgs([
    "--project",
    "gen-lang-client-0235296023",
    "--unexpected",
  ]));
  assert.throws(() => parseRolloutArgs([
    "--project",
    "gen-lang-client-0235296023",
    "--apply",
    "--apply",
  ]));
});

test("rollout exports a bounded reservation drain contract", () => {
  assert.equal(typeof rollout.OPEN_RESERVATION_POLL_INTERVAL_MS, "number");
  assert.equal(typeof rollout.OPEN_RESERVATION_TIMEOUT_MS, "number");
  assert.equal(typeof rollout.waitForNoOpenReservations, "function");
  assert.equal(typeof rollout.runQuotaResetUnderMaintenance, "function");
});

test("reservation drain polls until no reserved documents remain", async () => {
  const counts = [2, 1, 0];
  const sleeps = [];
  let now = 0;

  const result = await rollout.waitForNoOpenReservations({
    countOpenReservations: async () => counts.shift(),
    pollIntervalMs: 100,
    timeoutMs: 500,
    now: () => now,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      now += milliseconds;
    },
  });

  assert.deepEqual(result, { checks: 3 });
  assert.deepEqual(sleeps, [100, 100]);
});

test("reservation drain stops at its timeout", async () => {
  const sleeps = [];
  let now = 0;
  let checks = 0;

  await assert.rejects(
    rollout.waitForNoOpenReservations({
      countOpenReservations: async () => {
        checks += 1;
        return 1;
      },
      pollIntervalMs: 100,
      timeoutMs: 250,
      now: () => now,
      sleep: async (milliseconds) => {
        sleeps.push(milliseconds);
        now += milliseconds;
      },
    }),
    /timeout/i,
  );

  assert.equal(checks, 4);
  assert.deepEqual(sleeps, [100, 100, 50]);
});

test("quota reset enables maintenance, drains, resets, deletes and restores in order", async () => {
  const events = [];

  const result = await rollout.runQuotaResetUnderMaintenance({
    setMaintenanceMode: async (enabled) => events.push(`maintenance:${enabled}`),
    waitForReservations: async () => {
      events.push("drained");
      return { checks: 3 };
    },
    applyQuotaSettings: async () => events.push("settings"),
    deleteReservations: async () => {
      events.push("delete:reservations");
      return 2;
    },
    deleteQuotaDocuments: async () => {
      events.push("delete:quota");
      return 4;
    },
  });

  assert.deepEqual(events, [
    "maintenance:true",
    "drained",
    "settings",
    "delete:reservations",
    "delete:quota",
    "maintenance:false",
  ]);
  assert.deepEqual(result, {
    reservationChecks: 3,
    deletedReservations: 2,
    deletedQuotaDocuments: 4,
  });
});

test("quota reset restores maintenance when draining fails", async () => {
  const events = [];

  await assert.rejects(
    rollout.runQuotaResetUnderMaintenance({
      setMaintenanceMode: async (enabled) => events.push(`maintenance:${enabled}`),
      waitForReservations: async () => {
        events.push("drain:failed");
        throw new Error("drain timeout");
      },
      applyQuotaSettings: async () => events.push("settings"),
      deleteReservations: async () => 0,
      deleteQuotaDocuments: async () => 0,
    }),
    /drain timeout/,
  );

  assert.deepEqual(events, [
    "maintenance:true",
    "drain:failed",
    "maintenance:false",
  ]);
});
