import { AnalysisSettingsForm } from "@/components/admin/AnalysisSettingsForm";
import { getAnalysisQuotaConfig } from "@/lib/analyse/config";

export const dynamic = "force-dynamic";

export default async function AdminAnalysisSettingsPage() {
  const config = await getAnalysisQuotaConfig();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Websiteanalyse</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Beheer de quota en limieten van de gratis websiteanalyse: aantallen per e-mailadres,
          toestel, IP-adres en domein, plus de instellingen voor verificatiecodes.
        </p>
      </div>

      <AnalysisSettingsForm config={config} />
    </div>
  );
}
