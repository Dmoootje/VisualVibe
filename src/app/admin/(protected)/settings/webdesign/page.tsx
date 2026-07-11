import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { WebdesignProjectsManager } from "@/components/admin/WebdesignProjectsManager";
import { MigrateImagesButton } from "@/components/admin/MigrateImagesButton";

export const dynamic = "force-dynamic";

export default async function AdminWebdesignSettingsPage() {
  const [images, projects] = await Promise.all([getWebdesignImages(), getWebdesignProjects()]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Webdesign realisaties</h1>
        <p className="mt-1 text-sm text-white/60">
          Beheer de realisaties op de webdesign-dienstpagina. Voeg projecten toe, verwijder ze,
          sleep ze in volgorde met de pijltjes en vul per project de titel, badges, tagline,
          afbeeldingen, beschrijving, SEO-focus, wat je leverde en de knop-link in.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-semibold">Onderhoud</h2>
        <MigrateImagesButton />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-b border-white/10 pb-2 text-lg font-semibold">Hero-preview</h2>
        <div className="max-w-xs">
          <ImageUploadField imageKey="hero" label="Browser-preview" initialUrl={images.hero} />
        </div>
      </section>

      <WebdesignProjectsManager initialProjects={projects} images={images} />
    </div>
  );
}
