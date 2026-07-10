import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Dedicated bucket for VisualVibe uploads - this GCP project is shared with
// other, unrelated apps (e.g. "vsaanhangwagens"), so we never touch the
// project's implicit default bucket, only this one.
export const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? "gen-lang-client-0235296023";

/**
 * In production (Firebase App Hosting / Cloud Run) this authenticates via
 * Application Default Credentials automatically - no key file involved.
 * Locally, point GOOGLE_APPLICATION_CREDENTIALS at a downloaded service
 * account key that only has access to the Firestore/Auth *emulators*,
 * never at production data.
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (rawKey) {
    try {
      return initializeApp({
        credential: cert(JSON.parse(rawKey)),
        storageBucket: STORAGE_BUCKET,
      });
    } catch (err) {
      // A malformed value (e.g. only "{" because the JSON was pasted across
      // multiple lines in .env, or a file path) must not crash every request.
      // Fall back to Application Default Credentials with a clear hint.
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is geen geldige JSON. Zet de volledige sleutel op EEN regel, of gebruik liever GOOGLE_APPLICATION_CREDENTIALS met een bestandspad. Val nu terug op Application Default Credentials.",
        err,
      );
    }
  }

  return initializeApp({ storageBucket: STORAGE_BUCKET });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
/** `adminStorageBucket.file(path).save(...)` etc. - always resolves to STORAGE_BUCKET. */
export const adminStorageBucket = getStorage(adminApp).bucket(STORAGE_BUCKET);
