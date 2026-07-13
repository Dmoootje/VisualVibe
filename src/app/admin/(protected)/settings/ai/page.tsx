import { AiSettingsForm } from "@/components/admin/AiSettingsForm";
import { getAiSettingsAdminView } from "@/lib/firestore/aiSettings";

export const dynamic = "force-dynamic";

export default async function AdminAiSettingsPage() {
  const settings = await getAiSettingsAdminView();

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">AI-instellingen</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Beheer Gemini, Claude en OpenAI vanuit de backend. Gemini is de standaardprovider; een
          wijziging geldt meteen voor alle bestaande AI-functies.
        </p>
      </div>
      <AiSettingsForm settings={settings} />
    </div>
  );
}
