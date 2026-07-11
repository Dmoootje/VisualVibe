import type { Region } from "@/types";
import { regionMunicipalities } from "@/data/regionMunicipalities";

/**
 * GEO-blok voor een regio: een direct-antwoord paragraaf (goed voor AI-
 * antwoordmachines) met een opsomming van gemeentes, plus een full-bleed
 * "pil-runner" die de gemeentes voorbij laat lopen. Hergebruikt de marquee-
 * animatie (.vv-mq) uit globals.css.
 */
export function RegionGeo({ region }: { region: Region }) {
  const municipalities = regionMunicipalities[region.slug] ?? [];
  if (municipalities.length === 0) return null;

  const [a, b, c, d] = municipalities;
  // Dupliceren zodat de -50% keyframe naadloos doorloopt.
  const runner = [...municipalities, ...municipalities];

  return (
    <section className="relative border-y border-white/[0.06] bg-white/[0.015] py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">
            WERKGEBIED
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            In welke gemeentes is VisualVibe actief in {region.title}?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            VisualVibe werkt voor KMO&apos;s in heel {region.title} en omstreken. Van {a} en {b} tot{" "}
            {c} en {d}: we bouwen snelle websites, maken professionele foto- en videobeelden en
            verzorgen lokale SEO in onder meer de gemeentes hieronder.
          </p>
        </div>
      </div>

      {/* Full-bleed pil-runner met alle gemeentes. */}
      <div className="vv-mq" aria-label={`Gemeentes in ${region.title}`}>
        <div className="vv-mq-track vv-mq-l">
          {runner.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex flex-none items-center gap-2 rounded-full border border-[rgba(255,122,0,0.18)] bg-[rgba(255,122,0,0.05)] px-4 py-2 text-sm font-medium text-white/80"
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#FF7A00]" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
