import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instellingen</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
