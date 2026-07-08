import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Dedicated bucket for VisualVibe uploads — this GCP project is shared with
// other, unrelated apps (e.g. "vsaanhangwagens"), so we never touch the
// project's implicit default bucket, only this one.
export const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? "gen-lang-client-0235296023";

/**
 * In production (Firebase App Hosting / Cloud Run) this authenticates via
 * Application Default Credentials automatically — no key file involved.
 * Locally, point GOOGLE_APPLICATION_CREDENTIALS at a downloaded service
 * account key that only has access to the Firestore/Auth *emulators*,
 * never at production data.
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      storageBucket: STORAGE_BUCKET,
    });
  }

  return initializeApp({ storageBucket: STORAGE_BUCKET });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
/** `adminStorageBucket.file(path).save(...)` etc. — always resolves to STORAGE_BUCKET. */
export const adminStorageBucket = getStorage(adminApp).bucket(STORAGE_BUCKET);
