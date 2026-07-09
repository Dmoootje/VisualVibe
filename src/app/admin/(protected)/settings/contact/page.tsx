import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { SettingsContactForm } from "@/components/admin/SettingsContactForm";

export const dynamic = "force-dynamic";

export default async function AdminContactSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contactgegevens</h1>
        <p className="mt-1 text-sm text-white/60">
          Deze gegevens worden gebruikt op de contactpagina, in de footer en in de LocalBusiness-schema.
        </p>
      </div>
      <SettingsContactForm settings={settings} />
    </div>
  );
}
