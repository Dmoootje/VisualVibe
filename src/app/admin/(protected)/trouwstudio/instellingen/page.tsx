import { getTrouwstudioSettings } from "@/lib/firestore/trouwstudio";
import { TrouwstudioSettingsForm } from "@/components/admin/trouwstudio/TrouwstudioSettingsForm";

export const dynamic = "force-dynamic";

export default async function TrouwstudioInstellingenPage() {
  const settings = await getTrouwstudioSettings();
  const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Trouwstudio-instellingen</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Standaardinstellingen voor projecten, de AI-analyse en de export. API-keys staan nooit in de
        browser; de AI draait volledig server-side.
      </p>
      <TrouwstudioSettingsForm settings={settings} hasAnthropicKey={hasAnthropicKey} />
    </div>
  );
}
