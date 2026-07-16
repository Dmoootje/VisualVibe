import { ANALYSIS_RESERVATION_LEASE_MS } from "../../src/lib/analyse/quotaConstants.mjs";

export const QUOTA_SETTINGS = Object.freeze({
  maxPerEmail24h: 3,
  maxPerDevice24h: 3,
  maxPerIp24h: 12,
  maxPerIp30d: 180,
});

const ALLOWED_PROJECT = "gen-lang-client-0235296023";
export const OPEN_RESERVATION_POLL_INTERVAL_MS = 2_000;
export const OPEN_RESERVATION_TIMEOUT_MS = 10 * 60_000;
export const RESERVATION_LEASE_MS = ANALYSIS_RESERVATION_LEASE_MS;

function timestampMs(value) {
  if (typeof value === "string") return Date.parse(value);
  if (value instanceof Date) return value.getTime();
  if (value && typeof value.toMillis === "function") return value.toMillis();
  if (value && typeof value.toDate === "function") return value.toDate().getTime();
  return Number.NaN;
}

export function countActiveReservations(
  reservations,
  nowMs = Date.now(),
  leaseMs = RESERVATION_LEASE_MS,
) {
  if (!Array.isArray(reservations)) {
    throw new Error("Een lijst analysereserveringen is vereist.");
  }
  const activeFloor = nowMs - leaseMs;
  return reservations.filter((reservation) => {
    if (!reservation || reservation.status !== "reserved") return false;
    const createdAt = timestampMs(reservation.createdAt);
    return Number.isFinite(createdAt) && createdAt > activeFloor;
  }).length;
}

export function selectFirebaseCredential(rawServiceAccountKey, certificateFactory) {
  const raw = typeof rawServiceAccountKey === "string" ? rawServiceAccountKey.trim() : "";
  if (!raw) return undefined;
  if (typeof certificateFactory !== "function") {
    throw new Error("Een Firebase-certificaatfactory is vereist.");
  }

  try {
    const serviceAccount = JSON.parse(raw);
    if (!serviceAccount || typeof serviceAccount !== "object" || Array.isArray(serviceAccount)) {
      throw new Error("Service-account JSON moet een object zijn.");
    }
    return certificateFactory(serviceAccount);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY bevat geen geldige service-account JSON.");
  }
}

export function parseRolloutArgs(argv) {
  const validLength = argv.length === 2 || argv.length === 3;
  const validApply = argv.length === 2 || argv[2] === "--apply";
  if (!validLength || argv[0] !== "--project" || argv[1] !== ALLOWED_PROJECT || !validApply) {
    throw new Error(`Gebruik exact --project ${ALLOWED_PROJECT}.`);
  }
  return { projectId: ALLOWED_PROJECT, apply: argv.length === 3 };
}

export async function waitForNoOpenReservations({
  countOpenReservations,
  pollIntervalMs = OPEN_RESERVATION_POLL_INTERVAL_MS,
  timeoutMs = OPEN_RESERVATION_TIMEOUT_MS,
  now = Date.now,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
}) {
  if (typeof countOpenReservations !== "function") {
    throw new Error("Een teller voor open reserveringen is vereist.");
  }
  if (!Number.isFinite(pollIntervalMs) || pollIntervalMs <= 0) {
    throw new Error("Het pollinterval moet positief en begrensd zijn.");
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("De timeout moet positief en begrensd zijn.");
  }

  const startedAt = now();
  let checks = 0;
  for (;;) {
    const openReservations = await countOpenReservations();
    checks += 1;
    if (!Number.isInteger(openReservations) || openReservations < 0) {
      throw new Error("De teller voor open reserveringen gaf een ongeldige waarde.");
    }
    if (openReservations === 0) return { checks };

    const elapsedMs = now() - startedAt;
    if (elapsedMs >= timeoutMs) {
      throw new Error("Timeout tijdens wachten op open analysereserveringen.");
    }
    await sleep(Math.min(pollIntervalMs, timeoutMs - elapsedMs));
  }
}

export async function runQuotaResetUnderMaintenance({
  setMaintenanceMode,
  waitForReservations,
  applyQuotaSettings,
  deleteReservations,
  deleteQuotaDocuments,
  verifyPostconditions,
}) {
  await setMaintenanceMode(true);
  const drain = await waitForReservations();
  await applyQuotaSettings();
  const deletedReservations = await deleteReservations();
  const deletedQuotaDocuments = await deleteQuotaDocuments();
  await verifyPostconditions();
  try {
    await setMaintenanceMode(false);
  } catch (error) {
    try {
      await setMaintenanceMode(true);
    } catch {
      throw new Error(
        "Onderhoud kon na een mislukte uitschakeling niet opnieuw worden bevestigd. Controleer analysis_settings/default handmatig.",
        { cause: error },
      );
    }
    throw error;
  }
  return {
    reservationChecks: drain.checks,
    deletedReservations,
    deletedQuotaDocuments,
  };
}

export function assertQuotaResetPostconditions(state) {
  const failures = [];
  if (state?.settings?.maintenanceMode !== true) {
    failures.push("maintenance is niet actief");
  }
  if (state?.reservationCount !== 0) {
    failures.push("reservation documents zijn niet leeg");
  }
  if (state?.quotaCount !== 0) {
    failures.push("quota documents zijn niet leeg");
  }
  if (
    state?.settings?.maxPerEmail24h !== QUOTA_SETTINGS.maxPerEmail24h ||
    state?.settings?.maxPerDevice24h !== QUOTA_SETTINGS.maxPerDevice24h ||
    state?.settings?.maxPerIp24h !== QUOTA_SETTINGS.maxPerIp24h ||
    state?.settings?.maxPerIp30d !== QUOTA_SETTINGS.maxPerIp30d
  ) {
    failures.push("settings wijken af van de exacte quota-instellingen");
  }
  if (
    state?.settings?.hasLegacyEmailField !== false ||
    state?.settings?.hasLegacyDeviceField !== false
  ) {
    failures.push("legacy quota-instellingen zijn nog aanwezig");
  }
  if (failures.length > 0) {
    throw new Error(
      `Quota-reset postconditions mislukt: ${failures.join("; ")}. Onderhoud blijft actief.`,
    );
  }
}
