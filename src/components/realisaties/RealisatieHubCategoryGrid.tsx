import Image from "next/image";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { RealisatieCategory } from "@/data/realisatieCategories";
import type { HubStackImage } from "@/lib/realisaties/hubData";
import type { SupportedLocale } from "@/i18n/locales";

export type HubCategoryItem = {
  category: RealisatieCategory;
  /** Tot 3 echte projectbeelden uit deze categorie (leeg = cover-fallback). */
  images: HubStackImage[];
  /** Werkelijk aantal realisaties (dynamisch uit echte data). */
  count: number;
  /** Max 3 voorbeeldsubdisciplines (echte subdienst-namen). */
  subdisciplines: string[];
};

/**
 * Disciplinekaart met mini-stack van drie echte projectbeelden die bij hover
 * subtiel uitwaaieren (puur CSS, stil bij prefers-reduced-motion; op touch is
 * niets van hover afhankelijk). Categorieën zonder eigen beeldmateriaal
 * (3D/VR-tours, podcasting) behouden de bestaande cover-stijl.
 */
function HubCategoryCard({ item, locale }: { item: HubCategoryItem; locale: SupportedLocale }) {
  const { category, images, count, subdisciplines } = item;
  const hasStack = images.length > 0;

  return (
    <Link
      href={`/realisaties/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.02] transition-colors hover:border-[rgba(255,122,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500]"
    >
      {hasStack ? (
        <div className="relative m-4 mb-0 aspect-[16/9]">
          {images[2] && (
            <div className="absolute left-1/2 top-0 w-[82%] -translate-x-1/2 rotate-[2.5deg] overflow-hidden rounded-[12px] border border-white/[0.12] transition-transform duration-500 group-hover:rotate-[5deg] group-hover:translate-x-[-44%] motion-reduce:transition-none motion-reduce:group-hover:rotate-[2.5deg] motion-reduce:group-hover:-translate-x-1/2">
              <div className="relative aspect-[16/10]">
                <Image src={images[2].src} alt={images[2].alt} fill sizes="330px" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.35)]" />
              </div>
            </div>
          )}
          {images[1] && (
            <div className="absolute left-1/2 top-2 w-[86%] -translate-x-1/2 -rotate-[2deg] overflow-hidden rounded-[12px] border border-white/[0.14] transition-transform duration-500 group-hover:-rotate-[4deg] group-hover:translate-x-[-56%] motion-reduce:transition-none motion-reduce:group-hover:-rotate-[2deg] motion-reduce:group-hover:-translate-x-1/2">
              <div className="relative aspect-[16/10]">
                <Image src={images[1].src} alt={images[1].alt} fill sizes="340px" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.25)]" />
              </div>
            </div>
          )}
          <div className="absolute left-1/2 top-4 w-[90%] -translate-x-1/2 overflow-hidden rounded-[13px] border border-white/[0.16] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                sizes="(max-width: 640px) 90vw, 360px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="m-4 mb-0 flex aspect-[16/9] items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.02]">
          {/* Brand chip (vlak, oranje rand/icoon) - gradient icon tiles zijn verboden. */}
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
            <FolderOpen className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sora text-lg font-bold text-white">{category.name}</h3>
          <span className="whitespace-nowrap font-mono text-[11px] font-bold text-white/45">
            {count > 0 ? `${count} ${locale === "en" ? "case studies" : "realisaties"}` : locale === "en" ? "More soon" : "Binnenkort meer"}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{category.description}</p>
        {subdisciplines.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subdisciplines.map((name) => (
              <span key={name} className="rounded-full border border-white/[0.09] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-white/55">
                {name}
              </span>
            ))}
          </div>
        )}
        <span className="mt-4 inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.06em] text-white/80">
          {locale === "en" ? "VIEW CASE STUDIES" : "BEKIJK REALISATIES"}
          <ArrowRight className="h-3.5 w-3.5 text-[#FF9A45] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/** "Ontdek realisaties per discipline": de zes primaire disciplines, groot. */
export function RealisatieHubCategoryGrid({ items, locale = "nl" }: { items: HubCategoryItem[]; locale?: SupportedLocale }) {
  return (
    <section id="disciplines" className="relative scroll-mt-24 py-10 sm:py-14">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-8">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Disciplines
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">{locale === "en" ? "Explore case studies by discipline" : "Ontdek realisaties per discipline"}</h2>
          <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">
            {locale === "en" ? "Browse our work by specialism and see which services can be combined in one project." : "Bekijk ons werk per specialisatie en ontdek welke diensten binnen één project gecombineerd kunnen worden."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <HubCategoryCard key={item.category.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
