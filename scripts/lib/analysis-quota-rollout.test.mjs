import assert from "node:assert/strict";
import test from "node:test";
import { ANALYSIS_RESERVATION_LEASE_MS } from "../../src/lib/analyse/quotaConstants.mjs";
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
  assert.equal(typeof rollout.RESERVATION_LEASE_MS, "number");
  assert.equal(rollout.RESERVATION_LEASE_MS, ANALYSIS_RESERVATION_LEASE_MS);
  assert.equal(typeof rollout.countActiveReservations, "function");
});

test("active reservation counting uses the shared runtime lease", () => {
  const now = Date.parse("2026-07-15T18:30:00.000Z");
  const lease = rollout.RESERVATION_LEASE_MS;
  const reservations = [
    { status: "reserved", createdAt: new Date(now - lease + 1).toISOString() },
    { status: "reserved", createdAt: new Date(now - lease).toISOString() },
    { status: "reserved", createdAt: new Date(now - lease - 1).toISOString() },
    { status: "consumed", createdAt: new Date(now - 1).toISOString() },
    { status: "reserved", createdAt: "malformed" },
  ];

  assert.equal(rollout.countActiveReservations(reservations, now), 1);
});

test("reservation drain ignores stale reserved documents", async () => {
  const now = Date.parse("2026-07-15T18:30:00.000Z");
  const result = await rollout.waitForNoOpenReservations({
    countOpenReservations: async () => rollout.countActiveReservations([
      {
        status: "reserved",
        createdAt: new Date(now - rollout.RESERVATION_LEASE_MS - 1).toISOString(),
      },
    ], now),
    now: () => now,
  });

  assert.deepEqual(result, { checks: 1 });
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

test("quota reset verifies postconditions before disabling maintenance", async () => {
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
    verifyPostconditions: async () => events.push("verified"),
  });

  assert.deepEqual(events, [
    "maintenance:true",
    "drained",
    "settings",
    "delete:reservations",
    "delete:quota",
    "verified",
    "maintenance:false",
  ]);
  assert.deepEqual(result, {
    reservationChecks: 3,
    deletedReservations: 2,
    deletedQuotaDocuments: 4,
  });
});

test("quota reset leaves maintenance enabled when draining fails", async () => {
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
      verifyPostconditions: async () => events.push("verified"),
    }),
    /drain timeout/,
  );

  assert.deepEqual(events, [
    "maintenance:true",
    "drain:failed",
  ]);
});

test("quota reset leaves maintenance enabled when deletion fails", async () => {
  const events = [];

  await assert.rejects(
    rollout.runQuotaResetUnderMaintenance({
      setMaintenanceMode: async (enabled) => events.push(`maintenance:${enabled}`),
      waitForReservations: async () => ({ checks: 1 }),
      applyQuotaSettings: async () => events.push("settings"),
      deleteReservations: async () => {
        events.push("delete:reservations");
        throw new Error("delete failed");
      },
      deleteQuotaDocuments: async () => events.push("delete:quota"),
      verifyPostconditions: async () => events.push("verified"),
    }),
    /delete failed/,
  );

  assert.deepEqual(events, [
    "maintenance:true",
    "settings",
    "delete:reservations",
  ]);
});

test("quota reset leaves maintenance enabled when postconditions fail", async () => {
  const events = [];

  await assert.rejects(
    rollout.runQuotaResetUnderMaintenance({
      setMaintenanceMode: async (enabled) => events.push(`maintenance:${enabled}`),
      waitForReservations: async () => ({ checks: 1 }),
      applyQuotaSettings: async () => events.push("settings"),
      deleteReservations: async () => 0,
      deleteQuotaDocuments: async () => 0,
      verifyPostconditions: async () => {
        events.push("verify:failed");
        throw new Error("reservation documents remain");
      },
    }),
    /reservation documents remain/,
  );

  assert.deepEqual(events, [
    "maintenance:true",
    "settings",
    "verify:failed",
  ]);
});

test("quota reset re-enables maintenance when disabling it reports a failure", async () => {
  const events = [];
  let maintenanceMode = false;

  await assert.rejects(
    rollout.runQuotaResetUnderMaintenance({
      setMaintenanceMode: async (enabled) => {
        events.push(`maintenance:${enabled}`);
        maintenanceMode = enabled;
        if (!enabled) throw new Error("disable acknowledgement failed");
      },
      waitForReservations: async () => ({ checks: 1 }),
      applyQuotaSettings: async () => undefined,
      deleteReservations: async () => 0,
      deleteQuotaDocuments: async () => 0,
      verifyPostconditions: async () => undefined,
    }),
    /disable acknowledgement failed/,
  );

  assert.equal(maintenanceMode, true);
  assert.deepEqual(events, [
    "maintenance:true",
    "maintenance:false",
    "maintenance:true",
  ]);
});

test("postcondition validation requires exact settings and empty quota collections", () => {
  const valid = {
    quotaCount: 0,
    reservationCount: 0,
    settings: {
      maintenanceMode: true,
      ...QUOTA_SETTINGS,
      hasLegacyEmailField: false,
      hasLegacyDeviceField: false,
    },
  };

  assert.doesNotThrow(() => rollout.assertQuotaResetPostconditions(valid));
  assert.throws(() => rollout.assertQuotaResetPostconditions({
    ...valid,
    reservationCount: 1,
  }), /reservation/i);
  assert.throws(() => rollout.assertQuotaResetPostconditions({
    ...valid,
    settings: { ...valid.settings, maxPerEmail24h: 4 },
  }), /settings/i);
  assert.throws(() => rollout.assertQuotaResetPostconditions({
    ...valid,
    settings: { ...valid.settings, hasLegacyEmailField: true },
  }), /legacy/i);
});

test("credential selection prefers service-account JSON and falls back to ADC when absent", () => {
  const marker = { credential: true };
  let received;
  const selected = rollout.selectFirebaseCredential(
    JSON.stringify({ project_id: "example-project", client_email: "test@example.com" }),
    (serviceAccount) => {
      received = serviceAccount;
      return marker;
    },
  );

  assert.equal(selected, marker);
  assert.deepEqual(received, {
    project_id: "example-project",
    client_email: "test@example.com",
  });
  assert.equal(rollout.selectFirebaseCredential(undefined, () => marker), undefined);
  assert.throws(
    () => rollout.selectFirebaseCredential("not-json", () => marker),
    /FIREBASE_SERVICE_ACCOUNT_KEY/,
  );
});
