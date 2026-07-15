import { IndexNowSettingsForm } from "@/components/admin/IndexNowSettingsForm";
import { getIndexNowSettingsAdminView } from "@/lib/seo/indexnow";

export const dynamic = "force-dynamic";

export default async function AdminIndexNowPage() {
  const settings = await getIndexNowSettingsAdminView();

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">IndexNow</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-white/60">
          Meld nieuwe en gewijzigde pagina's meteen aan bij Bing, Yandex, Seznam, Naver en Yep.
          Beheer hier de sleutel (automatisch genereren of vernieuwen) en meld in een keer de
          volledige site aan.
        </p>
      </div>

      <IndexNowSettingsForm settings={settings} />
    </div>
  );
}
