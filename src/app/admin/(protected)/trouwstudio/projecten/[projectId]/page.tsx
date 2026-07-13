import { notFound } from "next/navigation";
import {
  getTrouwstudioSettings,
  getWeddingAlbum,
  getWeddingProject,
  listWeddingPhotos,
} from "@/lib/firestore/trouwstudio";
import { resolveAnalysisProvider } from "@/features/trouwstudio/services/analysis";
import { getAiSettingsAdminView } from "@/lib/firestore/aiSettings";
import { ProjectDetail } from "@/components/admin/trouwstudio/ProjectDetail";

export const dynamic = "force-dynamic";

export default async function TrouwstudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getWeddingProject(projectId);
  if (!project) notFound();

  const [photos, album, settings, aiSettings, analysisProvider] = await Promise.all([
    listWeddingPhotos(projectId),
    getWeddingAlbum(projectId),
    getTrouwstudioSettings(),
    getAiSettingsAdminView(),
    resolveAnalysisProvider(),
  ]);
  const aiProviderId = analysisProvider.id;
  const aiProviderModel = aiSettings.providers[aiSettings.activeProvider].model;

  return (
    <ProjectDetail
      project={project}
      initialPhotos={photos}
      initialAlbum={album}
      aiProviderId={aiProviderId}
      aiProviderModel={aiProviderModel}
      settings={settings}
    />
  );
}
