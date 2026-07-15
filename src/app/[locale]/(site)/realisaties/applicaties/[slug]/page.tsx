import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Code2,
  ExternalLink,
  MonitorSmartphone,
  ServerCog,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  APPLICATION_CASE_IMAGE_SLOTS,
  applicationCaseImageKey,
  applicationCases,
  type ApplicationCaseImageSlot,
} from "@/data/applicationCases";
import {
  getApplicationCaseBySlug,
  getApplicationCaseImages,
} from "@/lib/firestore/applicationCases";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { buildApplicationCaseJsonLd } from "@/lib/seo/applicationCaseJsonLd";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return applicationCases.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [project, images] = await Promise.all([
    getApplicationCaseBySlug(slug),
    getApplicationCaseImages(),
  ]);
  if (!project) return {};

  return pageMetadata({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/realisaties/applicaties/${project.slug}/`,
    ogImage: images[applicationCaseImageKey(project.id, "cover")],
  });
}

function EmptyVisual({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#100e0d]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,122,0,0.18),transparent_50%)]"
      />
      <div className="relative flex flex-col items-center gap-3 px-5 text-center">
        <span
          className={`flex items-center justify-center rounded-[22px] border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.08)] text-[#ff9a45] ${
            compact ? "h-14 w-14" : "h-20 w-20"
          }`}
        >
          <MonitorSmartphone className={compact ? "h-6 w-6" : "h-9 w-9"} strokeWidth={1.5} />
        </span>
        <span className="max-w-[240px] text-xs font-medium text-white/35">
          {label} kan via de backend worden toegevoegd
        </span>
      </div>
    </div>
  );
}

function Screenshot({
  src,
  alt,
  label,
  slot,
}: {
  src?: string;
  alt: string;
  label: string;
  slot: ApplicationCaseImageSlot;
}) {
  const portrait = slot === "home-mobile" || slot === "mobile-cover";
  return (
    <figure
      className={`overflow-hidden rounded-[18px] border border-white/[0.09] bg-white/[0.025] ${
        portrait ? "md:row-span-2" : ""
      }`}
    >
      <div className={`relative ${portrait ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={portrait ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover"
          />
        ) : (
          <EmptyVisual label={label} compact />
        )}
      </div>
      <figcaption className="border-t border-white/[0.07] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white/40">
        {label}
      </figcaption>
    </figure>
  );
}

export default async function ApplicationCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, images] = await Promise.all([
    getApplicationCaseBySlug(slug),
    getApplicationCaseImages(),
  ]);
  if (!project) notFound();

  const cover = images[applicationCaseImageKey(project.id, "cover")];
  const screenshots = APPLICATION_CASE_IMAGE_SLOTS.filter(
    ({ slot }) => slot !== "cover" && slot !== "mobile-cover",
  );
  const canonical = `${businessConfig.url}/be/realisaties/applicaties/${project.slug}/`;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Realisaties", path: "/realisaties/" },
          { name: "Applicaties", path: "/realisaties/applicaties/" },
          { name: project.title, path: `/realisaties/applicaties/${project.slug}/` },
        ]}
      />
      <JsonLd
        data={buildApplicationCaseJsonLd({
          project,
          canonical,
          cover,
        })}
      />

      <header className="relative overflow-hidden pb-12 pt-28 sm:pt-32 lg:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(255,90,0,0.2),transparent_38%)]"
        />
        <div className="container relative z-[1] mx-auto px-2.5 sm:px-4">
          <nav className="mb-7 flex flex-wrap items-center gap-2 font-mono text-xs font-semibold text-white/40">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/realisaties/">Realisaties</Link>
            <span>/</span>
            <Link href="/realisaties/applicaties/">Applicaties</Link>
            <span>/</span>
            <span className="text-[#ff9a45]">{project.title}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${
                    project.status === "live"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {project.status === "live" ? "Live platform" : "In ontwikkeling"}
                </span>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-1 text-[11px] font-semibold text-white/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.17em] text-[#ff9a45]">
                {project.client}
              </p>
              <h1 className="font-sora text-[clamp(42px,8vw,72px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-xl font-semibold leading-snug text-white/85">
                {project.tagline}
              </p>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/60">
                {project.excerpt}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    Bekijk het platform
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href="/diensten/software-op-maat/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.15] px-6 py-3 font-semibold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.45)] hover:text-white"
                >
                  Software op maat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] border border-white/[0.1] bg-white/[0.025] shadow-[0_35px_90px_-35px_rgba(0,0,0,0.9)]">
              {cover ? (
                <Image
                  src={cover}
                  alt={`${project.title} platform`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : (
                <EmptyVisual label="Cover" />
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto grid gap-6 px-2.5 sm:px-4 lg:grid-cols-2">
          <article className="rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-7 sm:p-9">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              De uitdaging
            </p>
            <h2 className="font-sora text-2xl font-extrabold">Van versnipperd proces naar één systeem</h2>
            <p className="mt-5 text-[15.5px] leading-[1.8] text-white/65">{project.challenge}</p>
          </article>
          <article className="rounded-[22px] border border-[rgba(255,122,0,0.2)] bg-[rgba(255,122,0,0.035)] p-7 sm:p-9">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              De oplossing
            </p>
            <h2 className="font-sora text-2xl font-extrabold">Frontend, backend en integraties samen</h2>
            <p className="mt-5 text-[15.5px] leading-[1.8] text-white/65">{project.solution}</p>
          </article>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Functionaliteit
            </p>
            <h2 className="font-sora text-3xl font-extrabold tracking-tight">Wat het platform werkelijk doet</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.capabilities.map((capability) => (
              <div
                key={capability}
                className="flex items-start gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.025] p-4"
              >
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.08)] text-[#ff9a45]">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-relaxed text-white/75">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Publiek & backend
            </p>
            <h2 className="font-sora text-3xl font-extrabold tracking-tight">Schermen uit de volledige gebruikersflow</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/60">
              Van de eerste publieke kennismaking tot dashboards, beheer, planning en dagelijkse opvolging.
            </p>
          </div>
          <div className="grid auto-rows-auto gap-5 md:grid-cols-2 lg:grid-cols-3">
            {screenshots.map(({ slot, label }) => (
              <Screenshot
                key={slot}
                slot={slot}
                label={label}
                alt={`${project.title} - ${label}`}
                src={images[applicationCaseImageKey(project.id, slot)]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="overflow-hidden rounded-[26px] border border-[rgba(255,122,0,0.22)] bg-white/[0.025]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/[0.08] p-7 sm:p-10 lg:border-b-0 lg:border-r">
                <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.09)] text-[#ff9a45]">
                  <ServerCog className="h-7 w-7" />
                </span>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
                  SSR & technische SEO
                </p>
                <h2 className="mt-3 font-sora text-2xl font-extrabold sm:text-3xl">
                  {project.ssr.title}
                </h2>
                <p className="mt-5 text-[15.5px] leading-[1.8] text-white/65">
                  {project.ssr.description}
                </p>
              </div>
              <div className="grid content-center gap-3 p-7 sm:p-10">
                {project.ssr.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-4 rounded-[15px] border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <Code2 className="mt-0.5 h-5 w-5 flex-none text-[#ff9a45]" />
                    <span className="text-[14.5px] font-medium leading-relaxed text-white/72">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto grid gap-6 px-2.5 sm:px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-7 sm:p-9">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Technologie
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technology.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/65"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-7 sm:p-9">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Resultaat
            </p>
            <div className="space-y-3">
              {project.results.map((result) => (
                <div key={result} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-none text-[#ff9a45]" />
                  <span className="text-[15px] leading-relaxed text-white/68">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24 pt-12">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="flex flex-col items-center rounded-[26px] border border-[rgba(255,122,0,0.24)] bg-white/[0.025] px-6 py-12 text-center sm:px-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Een gelijkaardig idee?
            </p>
            <h2 className="mt-3 max-w-2xl font-sora text-3xl font-extrabold tracking-tight">
              Van eerste procesanalyse tot een werkende toepassing
            </h2>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/60">
              Bespreek je gebruikers, functies en integraties. We vertalen ze naar een haalbare technische aanpak en duidelijke fasering.
            </p>
            <Link
              href="/offerte-aanvragen/"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ff7500] px-7 py-3.5 font-semibold text-black transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              Bespreek je applicatie
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
