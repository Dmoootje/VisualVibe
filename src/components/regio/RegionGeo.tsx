import type { Region } from "@/types";
import { regionMunicipalities } from "@/data/regionMunicipalities";

/**
 * GEO-blok voor een regio: een direct-antwoord paragraaf die de vraag "in welke
 * gemeentes is VisualVibe actief" letterlijk beantwoordt (goed voor lokale SEO
 * en AI-antwoordmachines), met een leesbare opsomming van alle gemeentes. De
 * scrollende gemeente-runner staat nu in de hero (design_handoff_regio_
 * vlaanderen), dus hier bewust geen dubbele marquee.
 */
export function RegionGeo({ region }: { region: Region }) {
  const municipalities = regionMunicipalities[region.slug] ?? [];
  if (municipalities.length === 0) return null;

  const [a, b, c, d] = municipalities;

  return (
    <section className="relative py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Werkgebied
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            In welke gemeentes is VisualVibe actief in {region.title}?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            VisualVibe werkt voor KMO&apos;s in heel {region.title} en omstreken. Van {a} en {b} tot{" "}
            {c} en {d}: we bouwen snelle websites, maken professionele foto- en videobeelden en
            verzorgen lokale SEO in onder meer de gemeentes hieronder.
          </p>
        </div>

        {/* Statische, doorzoekbare opsomming van alle gemeentes (SEO/GEO). */}
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {municipalities.map((name) => (
            <li
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,122,0,0.18)] bg-[rgba(255,122,0,0.05)] px-4 py-2 text-sm font-medium text-white/80"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-[#FF7A00]" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
