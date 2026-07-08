import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { ensureProfile } from "@/lib/firestore/profiles";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const idToken = body?.idToken;

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    await ensureProfile(decoded.uid, decoded.email ?? "");

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });

    const response = NextResponse.json({ status: "ok" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Ongeldige of verlopen login" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
