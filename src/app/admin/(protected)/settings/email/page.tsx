import { EmailSettingsForm } from "@/components/admin/EmailSettingsForm";
import { getEmailSettingsForAdmin } from "@/lib/firestore/emailSettings";

export const dynamic = "force-dynamic";

export default async function AdminEmailSettingsPage() {
  const settings = await getEmailSettingsForAdmin();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">E-mailinstellingen</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Beheer de uitgaande SMTP-verbinding, automatische leadmails en de vaste
          VisualVibe-afzender. Het opgeslagen SMTP-wachtwoord wordt nooit opnieuw getoond.
        </p>
      </div>

      <EmailSettingsForm settings={settings} />
    </div>
  );
}
