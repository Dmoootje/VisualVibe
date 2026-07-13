import { ArrowRight, Camera } from "lucide-react";
import type { SmugMugGallery } from "@/lib/smugmug";

/**
 * Livegalerijen rechtstreeks uit SmugMug: elke publieke galerij van het
 * account verschijnt hier automatisch (nieuwste eerst), met cover, naam en
 * aantal foto's. De kaart opent de volledige galerij op SmugMug.
 */
export function RealisatieSmugMugGalerijen({ galleries }: { galleries: SmugMugGallery[] }) {
  if (galleries.length === 0) return null;

  return (
    <section className="relative py-10 sm:py-14">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-8">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Livegalerijen
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">Onze nieuwste fotoreportages</h2>
          <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">
            Rechtstreeks uit ons fotoarchief: zodra we een nieuwe reportage publiceren, verschijnt
            die hier automatisch. Klik op een galerij om alle foto&apos;s te bekijken.
          </p>
        </div>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {galleries.map((gallery) => (
            <a
              key={gallery.key}
              href={gallery.webUri}
              target="_blank"
              rel="noopener"
              className="group flex flex-col overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.4)] hover:shadow-[0_20px_55px_-22px_rgba(255,117,0,0.5)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
                {gallery.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gallery.coverUrl}
                    alt={`Fotogalerij ${gallery.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    <Camera className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-white">{gallery.name}</h3>
                {gallery.imageCount > 0 && (
                  <p className="mt-1 text-[13.5px] text-white/50">
                    {gallery.imageCount} foto{gallery.imageCount === 1 ? "" : "'s"}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#ff7500] transition-all duration-300 group-hover:gap-2.5">
                  Bekijk galerij
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
