import "server-only";

import { createHash } from "node:crypto";
import { adminDb } from "@/lib/firebase/admin";

type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

const COLLECTION = "lead_rate_limits";

/**
 * Firestore-backed fixed-window limiter. It is shared by all App Hosting
 * instances, unlike an in-memory map. The limiter fails open if Firestore is
 * unavailable so a protection outage can never discard an otherwise valid lead.
 */
export async function checkLeadRateLimit(
  identity: string,
  { limit = 5, windowMs = 10 * 60_000 }: { limit?: number; windowMs?: number } = {}
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = createHash("sha256").update(identity).digest("hex");
  const ref = adminDb.collection(COLLECTION).doc(key);

  try {
    return await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      const data = doc.data();
      const windowStart = Number(data?.windowStart ?? 0);
      const count = Number(data?.count ?? 0);

      if (!doc.exists || now - windowStart >= windowMs) {
        transaction.set(ref, { windowStart: now, count: 1, updatedAt: new Date(now) });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - windowStart)) / 1000));
      if (count >= limit) {
        return { allowed: false, retryAfterSeconds };
      }

      transaction.update(ref, { count: count + 1, updatedAt: new Date(now) });
      return { allowed: true, retryAfterSeconds: 0 };
    });
  } catch {
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

