import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { FotografieGalleriesManager } from "@/components/admin/FotografieGalleriesManager";
import { CleanFotografieUploadsButton } from "@/components/admin/CleanFotografieUploadsButton";

export const dynamic = "force-dynamic";

export default async function AdminFotografieGalleriesPage() {
  const galleries = await getFotografieGalleries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fotografie galerijen</h1>
        <p className="mt-1 text-sm text-white/60">
          Beheer de fotogalerijen op de pagina Realisaties &gt; Fotografie. Maak een galerij, upload
          er foto&apos;s in (automatisch naar WebP, met behoud van je bestandsnaam), sleep ze in
          volgorde met de pijltjes en geef optioneel een titel, omschrijving, categorie-icoon en
          captions. Sla op zodat ze publiek verschijnen.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <p className="mb-2 text-sm font-medium text-white/70">Opschonen</p>
        <p className="mb-3 text-xs leading-relaxed text-white/50">
          Verwijder de oude, automatisch hernoemde uploads (bestanden zoals
          <span className="mx-1 font-mono text-white/70">g-c8ed509d-0.webp</span>) uit Storage en uit
          de galerijen. De galerijen zelf blijven staan, zodat je meteen opnieuw kunt uploaden met je
          eigen SEO-bestandsnamen.
        </p>
        <CleanFotografieUploadsButton />
      </div>

      <FotografieGalleriesManager initialGalleries={galleries} />
    </div>
  );
}
