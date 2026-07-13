import { notFound } from "next/navigation";
import {
  getTrouwstudioSettings,
  getWeddingAlbum,
  getWeddingProject,
  listWeddingPhotos,
} from "@/lib/firestore/trouwstudio";
import { resolveAnalysisProvider } from "@/features/trouwstudio/services/analysis";
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

  const [photos, album, settings] = await Promise.all([
    listWeddingPhotos(projectId),
    getWeddingAlbum(projectId),
    getTrouwstudioSettings(),
  ]);
  const aiProviderId = resolveAnalysisProvider(settings).id;

  return (
    <ProjectDetail
      project={project}
      initialPhotos={photos}
      initialAlbum={album}
      aiProviderId={aiProviderId}
      settings={settings}
    />
  );
}
