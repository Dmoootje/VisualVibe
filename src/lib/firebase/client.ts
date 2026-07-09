import { getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Client SDK - used only by the /admin login screen for Firebase Auth.
 * All Firestore/Storage reads and writes go through the Admin SDK on the
 * server instead (see ./admin.ts); firestore.rules denies client access
 * entirely, so this file intentionally does not export a client Firestore
 * instance.
 *
 * Initialization is lazy (behind a function, not a module-level constant)
 * so importing this file has no side effect - Next.js still executes
 * client-component modules during server-side rendering/static generation,
 * and eager init would throw if NEXT_PUBLIC_FIREBASE_* env vars aren't set
 * at build time. Calling getClientAuth() only ever happens from a browser
 * event handler, never at render/import time.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let cachedAuth: Auth | null = null;

export function getClientAuth(): Auth {
  if (!cachedAuth) {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    cachedAuth = getAuth(app);
  }
  return cachedAuth;
}
