import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { listMailboxes } from "@/lib/firestore/emailMailboxes";
import { syncMailboxAccount } from "@/lib/email/mailboxImap";

// Periodieke IMAP-synchronisatie voor een externe scheduler (Cloud Scheduler,
// cron-job.org, ...). Beveiligd met EMAIL_SYNC_CRON_SECRET; zonder secret is
// het endpoint uitgeschakeld. De handmatige syncknop in de admin blijft de
// primaire weg; dit endpoint houdt mailboxen ook zonder open adminscherm bij.

export const runtime = "nodejs";
export const maxDuration = 300;

function authorized(request: NextRequest): boolean {
  const secret = process.env.EMAIL_SYNC_CRON_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  const mailboxes = await listMailboxes();
  const targets = mailboxes.filter(
    (mailbox) => mailbox.isActive && mailbox.imap.enabled && mailbox.syncStatus !== "paused",
  );

  const results: Array<{ mailboxId: string; imported: number; error?: string }> = [];
  for (const mailbox of targets) {
    try {
      const outcome = await syncMailboxAccount(mailbox);
      results.push({
        mailboxId: mailbox.id,
        imported: outcome.folders.reduce((sum, folder) => sum + folder.imported, 0),
        ...(outcome.error ? { error: outcome.error } : {}),
      });
    } catch (error) {
      results.push({
        mailboxId: mailbox.id,
        imported: 0,
        error: error instanceof Error ? error.message : "Sync mislukt.",
      });
    }
  }

  return NextResponse.json({ synced: results.length, results });
}
