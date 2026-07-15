export const QUOTA_SETTINGS = Object.freeze({
  maxPerEmail24h: 3,
  maxPerDevice24h: 3,
  maxPerIp24h: 12,
  maxPerIp30d: 180,
});

const ALLOWED_PROJECT = "gen-lang-client-0235296023";
export const OPEN_RESERVATION_POLL_INTERVAL_MS = 2_000;
export const OPEN_RESERVATION_TIMEOUT_MS = 10 * 60_000;

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
}) {
  try {
    await setMaintenanceMode(true);
    const drain = await waitForReservations();
    await applyQuotaSettings();
    const deletedReservations = await deleteReservations();
    const deletedQuotaDocuments = await deleteQuotaDocuments();
    return {
      reservationChecks: drain.checks,
      deletedReservations,
      deletedQuotaDocuments,
    };
  } finally {
    await setMaintenanceMode(false);
  }
}
