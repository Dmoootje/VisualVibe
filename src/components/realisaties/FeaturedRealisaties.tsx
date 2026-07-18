import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HubProject } from "@/lib/realisaties/hubData";
import type { SupportedLocale } from "@/i18n/locales";
import { getLocalizedRealisatieCategoryById } from "@/data/realisatieCategories";

function FeaturedCard({ project, big, locale }: { project: HubProject; big?: boolean; locale: SupportedLocale }) {
  return (
    <Link
      href={`/realisaties/${getLocalizedRealisatieCategoryById(project.categorySlug, locale).slug}`}
      className={`group relative block overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#141210] transition-colors hover:border-[rgba(255,122,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] ${
        big ? "aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[16/10] lg:aspect-[4/3]"
      }`}
    >
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        sizes={big ? "(max-width: 1024px) 100vw, 900px" : "(max-width: 1024px) 100vw, 440px"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(10,10,10,.15) 0%,transparent 35%,rgba(10,10,10,.92) 100%)" }}
      />
      <span className="absolute left-4 top-4 inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,122,0,0.3)] bg-[rgba(8,7,6,.62)] px-3 py-[7px] font-mono text-[10.5px] font-bold leading-none tracking-[0.05em] text-[#FF9A45] backdrop-blur">
        {project.discipline}
      </span>
      <div className={`absolute bottom-5 left-5 right-5 ${big ? "sm:bottom-6 sm:left-6 sm:right-6" : ""}`}>
        <h3 className={`font-sora font-bold tracking-[-0.01em] text-white ${big ? "text-[22px] sm:text-[26px]" : "text-[19px]"}`}>
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-1.5 line-clamp-2 max-w-[520px] text-[13.5px] leading-relaxed text-white/[0.72]">
            {project.description}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-[7px] font-mono text-[11px] font-bold tracking-[0.06em] text-white/80">
          {locale === "en" ? "VIEW CASE STUDY" : "BEKIJK DE REALISATIE"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/**
 * "Uitgelichte realisaties": config-gedreven selectie (geen willekeur in de
 * component). Eén grote hoofdcase links, kleinere cases rechts. Kaarten linken
 * naar de bestaande categoriepagina waar het project volledig te bekijken is.
 */
export function FeaturedRealisaties({ featured, locale = "nl" }: { featured: HubProject[]; locale?: SupportedLocale }) {
  if (featured.length === 0) return null;
  const [main, ...rest] = featured;

  return (
    <section id="uitgelicht" className="relative scroll-mt-24 py-10 sm:py-14">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-8">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            {locale === "en" ? "Featured" : "Uitgelicht"}
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">{locale === "en" ? "Featured case studies" : "Uitgelichte realisaties"}</h2>
          <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">
            {locale === "en" ? "A selection of projects that bring strategy, design and visual content together." : "Een selectie van projecten waarin strategie, ontwerp en visuele content samenkomen."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3">
          <FeaturedCard project={main} big locale={locale} />
          {rest.slice(0, 2).map((project) => (
            <FeaturedCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
