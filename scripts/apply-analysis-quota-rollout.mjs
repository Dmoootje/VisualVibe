import { deleteApp, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  OPEN_RESERVATION_POLL_INTERVAL_MS,
  OPEN_RESERVATION_TIMEOUT_MS,
  QUOTA_SETTINGS,
  parseRolloutArgs,
  runQuotaResetUnderMaintenance,
  waitForNoOpenReservations,
} from "./lib/analysis-quota-rollout.mjs";

async function collectionCount(db, collectionName) {
  const snapshot = await db.collection(collectionName).count().get();
  return snapshot.data().count;
}

async function openReservationCount(db) {
  const snapshot = await db
    .collection("analysis_reservations")
    .where("status", "==", "reserved")
    .count()
    .get();
  return snapshot.data().count;
}

async function deleteCollection(db, collectionName) {
  let deleted = 0;
  for (;;) {
    const snapshot = await db.collection(collectionName).limit(400).get();
    if (snapshot.empty) return deleted;
    const batch = db.batch();
    for (const document of snapshot.docs) batch.delete(document.ref);
    await batch.commit();
    deleted += snapshot.size;
  }
}

async function readSafeState(db) {
  const [quotaCount, reservationCount, openReservations, settingsDocument] = await Promise.all([
    collectionCount(db, "analysis_quota"),
    collectionCount(db, "analysis_reservations"),
    openReservationCount(db),
    db.collection("analysis_settings").doc("default").get(),
  ]);
  const settings = settingsDocument.data() ?? {};
  return {
    quotaCount,
    reservationCount,
    openReservations,
    settings: {
      maintenanceMode: settings.maintenanceMode === true,
      maxPerEmail24h: settings.maxPerEmail24h,
      maxPerDevice24h: settings.maxPerDevice24h,
      maxPerIp24h: settings.maxPerIp24h,
      maxPerIp30d: settings.maxPerIp30d,
      hasLegacyEmailField: Object.hasOwn(settings, "maxPerEmail90d"),
      hasLegacyDeviceField: Object.hasOwn(settings, "maxPerDevice90d"),
    },
  };
}

async function main() {
  const args = parseRolloutArgs(process.argv.slice(2));
  const app = initializeApp({ projectId: args.projectId }, "analysis-quota-rollout");
  const db = getFirestore(app);

  try {
    const before = await readSafeState(db);
    console.log(JSON.stringify({ mode: args.apply ? "apply" : "dry-run", before }, null, 2));
    if (!args.apply) return;

    const settingsRef = db.collection("analysis_settings").doc("default");
    const resetResult = await runQuotaResetUnderMaintenance({
      setMaintenanceMode: (maintenanceMode) => settingsRef.set({
        maintenanceMode,
        updatedAt: new Date().toISOString(),
        updatedBy: "analysis-quota-24h-rollout",
      }, { merge: true }),
      waitForReservations: () => waitForNoOpenReservations({
        countOpenReservations: () => openReservationCount(db),
        pollIntervalMs: OPEN_RESERVATION_POLL_INTERVAL_MS,
        timeoutMs: OPEN_RESERVATION_TIMEOUT_MS,
      }),
      applyQuotaSettings: () => settingsRef.set({
        ...QUOTA_SETTINGS,
        maxPerEmail90d: FieldValue.delete(),
        maxPerDevice90d: FieldValue.delete(),
        updatedAt: new Date().toISOString(),
        updatedBy: "analysis-quota-24h-rollout",
      }, { merge: true }),
      deleteReservations: () => deleteCollection(db, "analysis_reservations"),
      deleteQuotaDocuments: () => deleteCollection(db, "analysis_quota"),
    });
    const after = await readSafeState(db);
    console.log(JSON.stringify({
      ...resetResult,
      after,
    }, null, 2));
  } finally {
    await deleteApp(app);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Quota-uitrol mislukt.");
  process.exitCode = 1;
});
