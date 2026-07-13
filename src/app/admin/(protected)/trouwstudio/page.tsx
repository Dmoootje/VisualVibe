import { listWeddingProjects } from "@/lib/firestore/trouwstudio";
import { ProjectsOverview } from "@/components/admin/trouwstudio/ProjectsOverview";

export const dynamic = "force-dynamic";

export default async function TrouwstudioPage() {
  const projects = await listWeddingProjects();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Trouwstudio</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Beheer trouwprojecten van upload tot trouwboek: foto&apos;s toevoegen, AI-analyse en
        optimalisatie, albumselectie en PDF-export.
      </p>
      <ProjectsOverview initialProjects={projects} />
    </div>
  );
}
