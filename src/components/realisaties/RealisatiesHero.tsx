import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HubProject } from "@/lib/realisaties/hubData";

/**
 * Hub-hero: links copy + CTA's (ankerlinks naar de secties), rechts een
 * gestapelde compositie van echt eigen werk uit verschillende disciplines.
 * Volledig server-rendered; de subtiele stackbeweging is puur CSS (hover)
 * en valt stil bij prefers-reduced-motion. Mobiel: tekst eerst, daarna een
 * stack van maximaal drie kaarten, zonder horizontale overflow.
 */
export function RealisatiesHero({ stack }: { stack: HubProject[] }) {
  // Vooraan = laatste in DOM-volgorde; achterste kaarten krijgen rotatie.
  const cards = stack.slice(0, 5);
  const front = cards[0];
  const behind = cards.slice(1);

  return (
    <section className="relative overflow-x-clip pb-10 pt-28 sm:pb-14">
      {/* Zachte oranje gloed achter de stack (subtiel, geen sectieband). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-10 h-[560px] w-[560px] max-w-full translate-x-1/4 bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.14),transparent_62%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-2.5 sm:px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          {/* Links: copy */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff9a45]">
              Ons werk
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              Realisaties van VisualVibe
            </h1>
            <p className="mb-8 max-w-[560px] text-lg leading-relaxed text-white/70">
              Ontdek websites, fotografie, video, dronebeelden, virtuele ervaringen en podcasts die
              we realiseerden voor bedrijven in Limburg, Vlaanderen en daarbuiten. Bekijk projecten
              per discipline, sector of locatie.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href="#uitgelicht"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                Bekijk uitgelichte projecten
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#disciplines"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)] sm:w-auto"
              >
                Ontdek per discipline
              </a>
            </div>
          </div>

          {/* Rechts: image-stack van echt werk */}
          {front && (
            <div className="group relative mx-auto aspect-[4/3] w-full max-w-[560px]">
              {behind.map((project, i) => {
                // Twee zichtbaar op mobiel (max 3 kaarten), rest vanaf sm. De
                // motion-reduce-variant herhaalt de basisrotatie zodat de stack
                // bij prefers-reduced-motion echt stilstaat (geen hover-sprong).
                const layout = [
                  "right-0 top-0 w-[62%] rotate-[2.5deg] motion-reduce:group-hover:rotate-[2.5deg]",
                  "left-0 top-6 w-[56%] -rotate-[3deg] motion-reduce:group-hover:-rotate-[3deg]",
                  "right-10 bottom-0 hidden w-[52%] rotate-[1.5deg] sm:block motion-reduce:group-hover:rotate-[1.5deg]",
                  "left-12 bottom-2 hidden w-[46%] -rotate-[2deg] sm:block motion-reduce:group-hover:-rotate-[2deg]",
                ][i];
                return (
                  <div
                    key={project.id}
                    className={`absolute overflow-hidden rounded-[16px] border border-white/[0.12] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:rotate-0 motion-reduce:transition-none ${layout}`}
                  >
                    <div className="relative aspect-[16/11]">
                      {/* Decoratief: dezelfde info staat op de voorste kaart/pagina. */}
                      <Image src={project.image} alt="" fill sizes="(max-width: 640px) 60vw, 340px" className="object-cover" />
                      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.25)]" />
                    </div>
                  </div>
                );
              })}
              {/* Voorste kaart met projectnaam + discipline */}
              <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] border border-[rgba(255,122,0,0.35)] shadow-[0_28px_70px_-20px_rgba(255,90,0,0.35)] transition-transform duration-500 group-hover:-translate-y-[54%] motion-reduce:transition-none motion-reduce:group-hover:-translate-y-1/2">
                <div className="relative aspect-[16/11]">
                  <Image
                    src={front.image}
                    alt={front.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 640px) 74vw, 420px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg,transparent 45%,rgba(8,7,6,0.85))" }}
                  />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-sm font-bold text-white">{front.title}</div>
                    <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#FF9A45]">
                      {front.discipline}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
