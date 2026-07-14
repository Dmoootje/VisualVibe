import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { getProfile } from "@/lib/firestore/profiles";
import { SESSION_COOKIE_NAME } from "./constants";

export type CurrentAdmin = {
  uid: string;
  email: string;
};

function adminEmailAllowlist(): Set<string> {
  // Production access must always be configured explicitly. Keep the existing
  // local developer account only as a development convenience.
  const configuredEmails =
    process.env.ADMIN_EMAILS ?? (process.env.NODE_ENV === "development" ? "jens@visualvibe.be" : "");
  return new Set(
    configuredEmails
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Authorization is deliberately separate from Firebase authentication. A user
 * must have an explicit Firebase custom claim, an existing admin profile, or an
 * e-mail address in ADMIN_EMAILS. Merely owning a Firebase account is not enough.
 */
export async function isAuthorizedAdmin(token: DecodedIdToken): Promise<boolean> {
  if (token.admin === true) return true;

  const email = (token.email ?? "").trim().toLowerCase();
  if (email && adminEmailAllowlist().has(email)) return true;

  const profile = await getProfile(token.uid);
  return profile?.role === "admin";
}

/** Authoritative session check - verifies the cookie signature via the Admin SDK. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!(await isAuthorizedAdmin(decoded))) {
      return null;
    }
    return { uid: decoded.uid, email: decoded.email ?? "" };
  } catch {
    return null;
  }
}
