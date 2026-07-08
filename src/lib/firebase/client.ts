import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Client SDK — used only by the /admin login screen for Firebase Auth.
 * All Firestore/Storage reads and writes go through the Admin SDK on the
 * server instead (see ./admin.ts); firestore.rules denies client access
 * entirely, so this file intentionally does not export a client Firestore
 * instance.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const clientApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const clientAuth = getAuth(clientApp);
