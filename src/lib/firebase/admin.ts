import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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
    });
  }

  return initializeApp();
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
