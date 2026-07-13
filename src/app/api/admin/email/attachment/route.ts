import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { adminStorageBucket } from "@/lib/firebase/admin";
import { getMailbox } from "@/lib/firestore/emailMailboxes";
import { getMessage } from "@/lib/firestore/emailClientStore";
import { downloadRemoteAttachment, withImapClient } from "@/lib/email/mailboxImap";

// Beveiligde bijlage- en brondownloads voor de e-mailclient. Inkomende
// bijlagen worden on demand van de IMAP-server gehaald (nooit in de database
// bewaard); uitgaande bijlagen komen uit Firebase Storage. Alleen veilige
// types mogen inline renderen, al de rest wordt geforceerd gedownload.

export const runtime = "nodejs";
export const maxDuration = 60;

const INLINE_SAFE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const OUTGOING_ATTACHMENT_PREFIX = "email-client/outgoing/";

function sanitizeFilename(value: string): string {
  const clean = value.replace(/[\r\n"\\;\0]/g, " ").replace(/\s+/g, " ").trim().slice(0, 150);
  return clean || "bijlage";
}

function fileResponse(
  content: Buffer,
  contentType: string,
  filename: string,
  disposition: "inline" | "attachment",
): NextResponse {
  const safeType = disposition === "inline" && INLINE_SAFE_TYPES.has(contentType)
    ? contentType
    : disposition === "inline"
      ? "application/octet-stream"
      : contentType || "application/octet-stream";
  const finalDisposition = safeType === "application/octet-stream" ? "attachment" : disposition;
  return new NextResponse(new Uint8Array(content), {
    status: 200,
    headers: {
      "Content-Type": safeType,
      "Content-Length": String(content.length),
      "Content-Disposition": `${finalDisposition}; filename="${sanitizeFilename(filename)}"`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'",
      "Cache-Control": "private, max-age=300",
    },
  });
}

async function canAccess(mailboxId: string, adminEmail: string) {
  const mailbox = await getMailbox(mailboxId);
  if (!mailbox) return null;
  if (
    mailbox.allowedAdminEmails.length > 0 &&
    !mailbox.allowedAdminEmails.map((email) => email.toLowerCase()).includes(adminEmail.toLowerCase())
  ) {
    return null;
  }
  return mailbox;
}

export async function GET(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const messageId = params.get("messageId") ?? "";
  const mode = params.get("mode") ?? "attachment";

  const message = await getMessage(messageId);
  if (!message) return NextResponse.json({ error: "Bericht niet gevonden." }, { status: 404 });
  const mailbox = await canAccess(message.mailboxId, admin.email);
  if (!mailbox) return NextResponse.json({ error: "Geen toegang tot deze mailbox." }, { status: 403 });

  // Volledig bericht als .eml downloaden.
  if (mode === "eml") {
    if (!message.remoteFolderPath || typeof message.remoteUid !== "number") {
      return NextResponse.json(
        { error: "Voor dit bericht is geen serverbron beschikbaar." },
        { status: 404 },
      );
    }
    try {
      const source = await withImapClient(mailbox, async (client) => {
        const lock = await client.getMailboxLock(message.remoteFolderPath as string, { readOnly: true });
        try {
          const fetched = await client.fetchOne(
            String(message.remoteUid),
            { uid: true, source: { start: 0, maxLength: 30 * 1024 * 1024 } },
            { uid: true },
          );
          return fetched && fetched.source ? fetched.source : null;
        } finally {
          lock.release();
        }
      });
      if (!source) {
        return NextResponse.json({ error: "Het bericht bestaat niet meer op de server." }, { status: 404 });
      }
      return fileResponse(
        source,
        "message/rfc822",
        `${message.subject || "bericht"}.eml`,
        "attachment",
      );
    } catch {
      return NextResponse.json(
        { error: "Het bericht kon niet van de mailserver worden opgehaald." },
        { status: 502 },
      );
    }
  }

  const index = Number.parseInt(params.get("index") ?? "", 10);
  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: "Ongeldige bijlage." }, { status: 400 });
  }
  const meta = message.attachments.find((attachment) => attachment.index === index);
  if (!meta) return NextResponse.json({ error: "Bijlage niet gevonden." }, { status: 404 });

  const disposition: "inline" | "attachment" = mode === "inline" ? "inline" : "attachment";

  // Uitgaande bijlage: rechtstreeks uit Firebase Storage.
  if (meta.storagePath) {
    if (!meta.storagePath.startsWith(OUTGOING_ATTACHMENT_PREFIX)) {
      return NextResponse.json({ error: "Ongeldig bijlagepad." }, { status: 400 });
    }
    try {
      const [content] = await adminStorageBucket.file(meta.storagePath).download();
      return fileResponse(content, meta.contentType, meta.filename, disposition);
    } catch {
      return NextResponse.json({ error: "De bijlage kon niet worden geladen." }, { status: 404 });
    }
  }

  // Inkomende bijlage: on demand van de IMAP-server.
  try {
    const attachment = await downloadRemoteAttachment(mailbox, message, index);
    if (!attachment) {
      return NextResponse.json(
        { error: "De bijlage is niet meer beschikbaar op de mailserver." },
        { status: 404 },
      );
    }
    return fileResponse(attachment.content, attachment.contentType, attachment.filename, disposition);
  } catch {
    return NextResponse.json(
      { error: "De bijlage kon niet van de mailserver worden opgehaald." },
      { status: 502 },
    );
  }
}
