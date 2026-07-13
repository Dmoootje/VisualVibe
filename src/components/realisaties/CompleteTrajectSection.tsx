import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HubData } from "@/lib/realisaties/hubData";

/**
 * "Van website tot volledige beeldvorming": één echt project waarin meerdere
 * disciplines samenkwamen, getoond als visuele stack (website-weergaves +
 * bedrijfsfotografie van dezelfde klant). De CTA linkt naar het Recent
 * werk-grid (via ctaHref eventueel met contextfilter); geen nieuwe route.
 */
export function CompleteTrajectSection({
  traject,
  ctaHref = "#recent-werk",
}: {
  traject: HubData["traject"];
  ctaHref?: string;
}) {
  if (!traject || traject.screenshots.length === 0) return null;
  const stack = [...traject.screenshots.slice(0, 3), ...(traject.galleryCover ? [traject.galleryCover] : [])];
  const [front, ...behind] = stack;

  return (
    <section className="relative overflow-x-clip py-10 sm:py-14">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
              Complete trajecten
            </p>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Van website tot volledige beeldvorming</h2>
            <p className="mb-4 max-w-[560px] text-[15.5px] leading-relaxed text-white/65">
              Voor veel klanten combineren we webdesign, fotografie, video, dronebeelden en digitale
              content binnen één traject. Zo sluiten techniek, uitstraling en communicatie perfect
              op elkaar aan.
            </p>
            <p className="mb-8 max-w-[560px] text-[14px] leading-relaxed text-white/50">
              Zoals bij {traject.project.title}: één huisstijl, een snelle website en eigen
              bedrijfsfotografie die overal dezelfde uitstraling dragen.
            </p>
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[rgba(255,122,0,0.2)] sm:w-auto"
            >
              Bekijk complete trajecten
              <ArrowRight className="h-4 w-4 text-[#FF9A45]" aria-hidden="true" />
            </a>
          </div>

          <div className="group relative mx-auto aspect-[4/3] w-full max-w-[520px]">
            {behind.map((image, i) => {
              // motion-reduce herhaalt de basisrotatie: stack staat dan stil.
              const layout = [
                "right-0 top-0 w-[58%] rotate-[2.5deg] motion-reduce:group-hover:rotate-[2.5deg]",
                "left-0 top-8 w-[52%] -rotate-[3deg] motion-reduce:group-hover:-rotate-[3deg]",
                "right-8 bottom-0 hidden w-[48%] rotate-[1.5deg] sm:block motion-reduce:group-hover:rotate-[1.5deg]",
              ][i];
              return (
                <div
                  key={image.src}
                  className={`absolute overflow-hidden rounded-[14px] border border-white/[0.12] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:rotate-0 motion-reduce:transition-none ${layout}`}
                >
                  <div className="relative aspect-[16/11]">
                    <Image src={image.src} alt="" fill sizes="300px" className="object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.28)]" />
                  </div>
                </div>
              );
            })}
            <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[16px] border border-[rgba(255,122,0,0.35)] shadow-[0_28px_70px_-20px_rgba(255,90,0,0.35)]">
              <div className="relative aspect-[16/11]">
                <Image
                  src={front.src}
                  alt={front.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, 380px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
