import { ApplicationCasesManager } from "@/components/admin/ApplicationCasesManager";
import {
  getApplicationCaseImages,
  getApplicationCases,
} from "@/lib/firestore/applicationCases";

export const dynamic = "force-dynamic";

export default async function AdminApplicationCasesPage() {
  const [projects, images] = await Promise.all([
    getApplicationCases(),
    getApplicationCaseImages(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Applicatie realisaties</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/60">
          Beheer de cases voor webapps, SaaS-platformen en software op maat. De vier projecten zijn
          vooraf ingevuld op basis van hun echte functies en technische architectuur. Voeg na deploy
          per case de publieke en backend-screenshots toe.
        </p>
      </div>

      <ApplicationCasesManager initialProjects={projects} images={images} />
    </div>
  );
}
