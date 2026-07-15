import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HubStackImage } from "@/lib/realisaties/hubData";

export type HubContextItem = {
  slug: string;
  /** Zichtbare titel (bv. "Bouw & interieur" voor de bestaande slug "projecten"). */
  title: string;
  description: string;
  /** Eén echt projectbeeld uit deze context (leeg = tekst-tegel). */
  image?: HubStackImage;
  /** Werkelijk aantal gekoppelde projecten in het filtergrid. */
  count: number;
};

/**
 * "Werk per sector en context": compacte tegels. Contexten met echte projecten
 * zijn een filteractie (ankerlink die het Recent werk-grid filtert); contexten
 * zonder projecten linken naar hun bestaande categoriepagina met een eerlijke
 * "Binnenkort meer realisaties"-melding. Geen valse aantallen.
 */
export function RealisatieContextGrid({ items }: { items: HubContextItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="relative py-10 sm:py-14">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-8">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Context
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">Werk per sector en context</h2>
        </div>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => {
            const inner = (
              <>
                {item.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* Inhoudelijk projectvoorbeeld met de bestaande projectspecifieke alttekst. */}
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.3)]" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[15px] font-bold text-white">{item.title}</h3>
                    <span className="whitespace-nowrap font-mono text-[10.5px] font-bold text-white/45">
                      {item.count > 0 ? `${item.count} projecten` : "Binnenkort"}
                    </span>
                  </div>
                  <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-white/60">{item.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-white/75">
                    {item.count > 0 ? "BEKIJK PROJECTEN" : "BEKIJK CATEGORIE"}
                    <ArrowRight className="h-3 w-3 text-[#FF9A45]" aria-hidden="true" />
                  </span>
                </div>
              </>
            );
            const className =
              "group flex flex-col overflow-hidden rounded-[16px] border border-white/[0.09] bg-white/[0.02] transition-colors hover:border-[rgba(255,122,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500]";
            return item.count > 0 ? (
              // Filteractie: ankerstub in het Recent werk-grid activeert de context.
              <a key={item.slug} href={`#werk-${item.slug}`} className={className}>
                {inner}
              </a>
            ) : (
              <Link key={item.slug} href={`/realisaties/${item.slug}`} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
