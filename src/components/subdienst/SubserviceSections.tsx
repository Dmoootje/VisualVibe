import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleCheckBig,
  Compass,
  Layers3,
  MapPin,
  PackageCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/ui";
import type { HubProject } from "@/lib/realisaties/hubData";
import type {
  Region,
  SubserviceCardSectionContent,
  SubserviceOverviewContent,
  SubservicePricingContent,
  SubserviceRegionalContent,
} from "@/types";

type CardSectionProps = {
  content: SubserviceCardSectionContent;
  eyebrow: string;
  icon: typeof Target;
};

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl sm:mb-10">
      <p className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
        <span aria-hidden="true" className="h-px w-6 bg-amber-400" />
        {eyebrow}
      </p>
      <h2 className="font-sora text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">{intro}</p>}
    </div>
  );
}

function SubserviceCardSection({ content, eyebrow, icon: Icon }: CardSectionProps) {
  return (
    <Section className="px-0">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={content.title} intro={content.intro} />
        <ul
          className={`grid gap-4 md:grid-cols-2 ${
            content.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {content.items.map((item) => (
            <li
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.045] sm:p-6"
            >
              <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="font-sora text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function SubserviceOverview({ content }: { content: SubserviceOverviewContent }) {
  return (
    <Section className="px-0">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-12">
          <div>
            <SectionHeading eyebrow="Kort uitgelegd" title={content.title} />
            <div className="max-w-3xl space-y-5 text-base leading-8 text-white/70">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {content.highlights && content.highlights.length > 0 && (
            <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6" aria-label="Belangrijkste aandachtspunten">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                  <Compass aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="font-sora text-lg font-bold text-white">Waar we op letten</h3>
              </div>
              <ul className="space-y-3">
                {content.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm leading-6 text-white/70">
                    <CircleCheckBig aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function SubserviceOutcomeCards({ content }: { content: SubserviceCardSectionContent }) {
  return <SubserviceCardSection content={content} eyebrow="Resultaat" icon={Target} />;
}

export function SubserviceIdealFor({ content }: { content: SubserviceCardSectionContent }) {
  return <SubserviceCardSection content={content} eyebrow="Voor wie" icon={Layers3} />;
}

export function SubserviceDeliverables({ content }: { content: SubserviceCardSectionContent }) {
  return <SubserviceCardSection content={content} eyebrow="Inbegrepen" icon={PackageCheck} />;
}

export function SubserviceWhyVisualVibe({ content }: { content: SubserviceCardSectionContent }) {
  return <SubserviceCardSection content={content} eyebrow="VisualVibe" icon={Sparkles} />;
}

export function SubservicePricing({ content }: { content: SubservicePricingContent }) {
  return (
    <Section className="px-0">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] lg:gap-12">
            <div>
              <SectionHeading eyebrow="Investering" title={content.title} />
              <div className="space-y-4 text-base leading-7 text-white/70">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300">
                  <WalletCards aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="font-sora text-lg font-bold text-white">Prijsbepalende factoren</h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {content.factors.map((factor) => (
                  <li key={factor} className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-sm leading-5 text-white/70">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function SubserviceRealisations({
  projects,
  serviceTitle,
}: {
  projects: HubProject[];
  serviceTitle: string;
}) {
  const visibleProjects = projects.slice(0, 3);
  if (visibleProjects.length === 0) return null;

  return (
    <Section className="px-0">
      <Container>
        <SectionHeading
          eyebrow="Realisaties"
          title={`Bekijk werk dat aansluit bij ${serviceTitle}`}
          intro="Deze selectie komt rechtstreeks uit onze bestaande realisatiebronnen en bevat alleen projecten die inhoudelijk aan deze dienst gekoppeld zijn."
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/realisaties/${project.categorySlug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-amber-300">
                    {project.discipline}
                  </p>
                  <h3 className="mt-2 font-sora text-lg font-bold text-white">{project.title}</h3>
                  {project.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{project.description}</p>}
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-white/80 transition-colors group-hover:text-amber-300">
                    Bekijk realisaties binnen {project.discipline.toLowerCase()}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function SubserviceRegions({
  content,
  regions,
}: {
  content: SubserviceRegionalContent;
  regions: Region[];
}) {
  if (regions.length === 0) return null;

  return (
    <Section className="px-0">
      <Container>
        <SectionHeading eyebrow="Regio's" title={content.title} intro={content.description} />
        <ul className="flex flex-wrap gap-3">
          {regions.map((region) => (
            <li key={region.slug}>
              <Link
                href={`/regio/${region.slug}/`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-white/75 transition-colors hover:border-amber-400/30 hover:bg-amber-400/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <MapPin aria-hidden="true" className="h-4 w-4 text-amber-300" />
                {region.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
