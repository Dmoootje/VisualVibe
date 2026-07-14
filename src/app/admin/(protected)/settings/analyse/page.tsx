import { AnalysisSettingsForm } from "@/components/admin/AnalysisSettingsForm";
import { AnalysisIntegrationForm } from "@/components/admin/AnalysisIntegrationForm";
import { getAnalysisQuotaConfig } from "@/lib/analyse/config";
import { getAnalysisIntegrationAdminView } from "@/lib/analyse/integration";

export const dynamic = "force-dynamic";

export default async function AdminAnalysisSettingsPage() {
  const [config, integration] = await Promise.all([
    getAnalysisQuotaConfig(),
    getAnalysisIntegrationAdminView(),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Websiteanalyse</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Beheer de SEO Supercharged-koppeling (widget of directe API met versleutelde sleutels) en
          de quota en limieten van de gratis websiteanalyse.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white/90">Koppeling en sleutels</h2>
        <AnalysisIntegrationForm integration={integration} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white/90">Quota en limieten</h2>
        <AnalysisSettingsForm config={config} />
      </section>
    </div>
  );
}
