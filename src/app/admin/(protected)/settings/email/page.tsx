import Link from "next/link";
import { Inbox } from "lucide-react";
import { EmailSettingsForm } from "@/components/admin/EmailSettingsForm";
import { getEmailSettingsForAdmin } from "@/lib/firestore/emailSettings";

export const dynamic = "force-dynamic";

export default async function AdminEmailSettingsPage() {
  const settings = await getEmailSettingsForAdmin();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">E-mailinstellingen (website-SMTP)</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Beheer de uitgaande SMTP-verbinding voor de website (contactformulieren, offertes,
          automatische leadmails) en de vaste VisualVibe-afzender. Het opgeslagen SMTP-wachtwoord
          wordt nooit opnieuw getoond.
        </p>
      </div>

      <Link
        href="/admin/email/accounts"
        className="mb-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-amber-500/40 hover:bg-white/[0.05]"
      >
        <Inbox className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <span>
          <span className="block text-sm font-semibold text-white">Mailboxaccounts (e-mailclient)</span>
          <span className="block text-sm text-white/55">
            Volledige e-mailaccounts met eigen IMAP en SMTP voor de in-app e-mailclient
            (info@, fotografie@, facturatie@, ...) beheer je apart onder E-mail &gt; Mailboxaccounts.
            De website-SMTP hieronder blijft de automatische websitemails versturen.
          </span>
        </span>
      </Link>

      <EmailSettingsForm settings={settings} />
    </div>
  );
}
