import { getTrouwstudioSettings } from "@/lib/firestore/trouwstudio";
import { TrouwstudioSettingsForm } from "@/components/admin/trouwstudio/TrouwstudioSettingsForm";
import { getAiSettingsAdminView } from "@/lib/firestore/aiSettings";

export const dynamic = "force-dynamic";

export default async function TrouwstudioInstellingenPage() {
  const [settings, aiSettings] = await Promise.all([
    getTrouwstudioSettings(),
    getAiSettingsAdminView(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Trouwstudio-instellingen</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Standaardinstellingen voor projecten, de AI-analyse en de export. API-keys staan nooit in de
        browser; de AI draait volledig server-side.
      </p>
      <TrouwstudioSettingsForm settings={settings} aiSettings={aiSettings} />
    </div>
  );
}
