import Link from "next/link";
import { MailboxAccountsManager } from "@/components/admin/email/MailboxAccountsManager";

export const dynamic = "force-dynamic";

export default function MailboxAccountsPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mailboxaccounts</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Volledige e-mailaccounts (IMAP + SMTP) voor de in-app e-mailclient, zoals
          info@visualvibe.be of fotografie@visualvibe.be. Dit staat volledig los van de{" "}
          <Link href="/admin/settings/email" className="text-amber-300 hover:underline">
            website-SMTP
          </Link>{" "}
          die contactformulieren en automatische mails blijft versturen.
        </p>
      </div>
      <MailboxAccountsManager />
    </div>
  );
}
