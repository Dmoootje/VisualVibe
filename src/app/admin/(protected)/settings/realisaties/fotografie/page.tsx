import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { FotografieGalleriesManager } from "@/components/admin/FotografieGalleriesManager";

export const dynamic = "force-dynamic";

export default async function AdminFotografieGalleriesPage() {
  const galleries = await getFotografieGalleries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fotografie galerijen</h1>
        <p className="mt-1 text-sm text-white/60">
          Beheer de fotogalerijen op de pagina Realisaties &gt; Fotografie. Maak een galerij, upload
          er foto&apos;s in (automatisch naar WebP), sleep ze in volgorde met de pijltjes en geef
          optioneel een titel, omschrijving, categorie-icoon en captions. Sla op zodat ze publiek
          verschijnen.
        </p>
      </div>

      <FotografieGalleriesManager initialGalleries={galleries} />
    </div>
  );
}
