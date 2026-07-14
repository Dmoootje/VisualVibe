"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Code2, MonitorSmartphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  applicationCaseImageKey,
  type ApplicationCase,
} from "@/data/applicationCases";
import type { ApplicationCaseImages } from "@/lib/firestore/applicationCases";

export function ApplicationPortfolioCarousel({
  projects,
  images,
}: {
  projects: ApplicationCase[];
  images: ApplicationCaseImages;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  if (projects.length === 0) return null;

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.min(rail.clientWidth * 0.86, 430),
      behavior: "smooth",
    });
  };

  return (
    <section className="relative -mt-10 pb-24 pt-8 text-white sm:-mt-14 sm:pt-12">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
              Andere applicatiecases
            </p>
            <h2 className="font-sora text-2xl font-extrabold tracking-tight sm:text-3xl">
              Meer apps uit ons portfolio
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
              Ontdek hoe we websites, dashboards, SaaS-platformen en krachtige backends tot één werkende toepassing combineren.
            </p>
          </div>

          <div className="hidden flex-none items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.035] text-white/70 transition-colors hover:border-[rgba(255,122,0,0.4)] hover:text-[#ff9a45]"
              aria-label="Vorige applicatiecases"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.035] text-white/70 transition-colors hover:border-[rgba(255,122,0,0.4)] hover:text-[#ff9a45]"
              aria-label="Volgende applicatiecases"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => {
            const cover = images[applicationCaseImageKey(project.id, "cover")];
            return (
              <Link
                key={project.id}
                href={`/realisaties/applicaties/${project.slug}`}
                className="group min-w-[84vw] max-w-[420px] snap-start overflow-hidden rounded-[22px] border border-white/[0.09] bg-white/[0.025] transition-all hover:-translate-y-1 hover:border-[rgba(255,122,0,0.42)] hover:bg-white/[0.04] motion-reduce:transform-none sm:min-w-[360px] lg:min-w-[390px]"
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07] bg-[#100e0d]">
                  {cover ? (
                    // De app-portfolio uploads zijn al geoptimaliseerde WebP-bestanden.
                    // Rechtstreeks laden vermijdt een trage tweede omzetting via /_next/image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={`${project.title} applicatiecase`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,122,0,0.16),transparent_52%)]"
                      />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.08)] text-[#ff9a45]">
                        <MonitorSmartphone className="h-8 w-8" strokeWidth={1.5} />
                      </span>
                    </div>
                  )}

                  <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] backdrop-blur ${
                      project.status === "live"
                        ? "border-emerald-400/30 bg-emerald-950/70 text-emerald-300"
                        : "border-amber-400/30 bg-amber-950/70 text-amber-300"
                    }`}
                  >
                    {project.status === "live" ? "Live" : "In ontwikkeling"}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.09] bg-white/[0.035] px-2.5 py-1 text-[10px] font-semibold text-white/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sora text-xl font-extrabold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[14px] font-medium leading-relaxed text-[#ff9a45]">
                        {project.tagline}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/[0.1] text-white/45 transition-colors group-hover:border-[rgba(255,122,0,0.35)] group-hover:text-[#ff9a45]">
                      <Code2 className="h-5 w-5" />
                    </span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                    Bekijk deze case
                    <ArrowRight className="h-4 w-4 text-[#ff9a45] transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 flex justify-center sm:justify-start">
          <Link
            href="/realisaties/applicaties/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-[#ff9a45]"
          >
            Bekijk alle applicatierealisaties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
