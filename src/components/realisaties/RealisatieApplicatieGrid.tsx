import Image from "next/image";
import { ArrowRight, Code2, MonitorSmartphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  applicationCaseImageKey,
  type ApplicationCase,
} from "@/data/applicationCases";
import type { ApplicationCaseImages } from "@/lib/firestore/applicationCases";
import { ApplicationPhoneMockup } from "./ApplicationPhoneMockup";

export function RealisatieApplicatieGrid({
  projects,
  images,
}: {
  projects: ApplicationCase[];
  images: ApplicationCaseImages;
}) {
  return (
    <section className="relative pb-14 sm:pb-20">
      <div className="container mx-auto px-2.5 sm:px-4">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Software in de praktijk
          </p>
          <h2 className="font-sora text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Van publieke website tot krachtige backend
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">
            Elke case toont niet alleen hoe de toepassing eruitziet, maar ook welke processen,
            integraties en serverlogica achter de schermen samenwerken.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => {
            const cover = images[applicationCaseImageKey(project.id, "cover")];
            const mobile = images[applicationCaseImageKey(project.id, "mobile-cover")];
            return (
              <Link
                key={project.id}
                href={`/realisaties/applicaties/${project.slug}`}
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.09] bg-white/[0.025] transition-all hover:-translate-y-1 hover:border-[rgba(255,122,0,0.42)] hover:bg-white/[0.04] motion-reduce:transform-none"
              >
                {/* Cover. De binnenlaag clipt de desktopschermafbeelding binnen de
                    16:9-box (ook bij de hover-zoom); de telefoon-mockup valt buiten
                    die laag zodat hij rechtsonder mag uitsteken. */}
                <div className="relative aspect-[16/9] border-b border-white/[0.07] bg-[#100e0d]">
                  <div className="absolute inset-0 overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${project.title} applicatiecase`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,122,0,0.16),transparent_52%)]"
                        />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.08)] text-[#ff9a45]">
                          <MonitorSmartphone className="h-9 w-9" strokeWidth={1.5} />
                        </span>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] backdrop-blur ${
                          project.status === "live"
                            ? "border-emerald-400/30 bg-emerald-950/70 text-emerald-300"
                            : "border-amber-400/30 bg-amber-950/70 text-amber-300"
                        }`}
                      >
                        {project.status === "live" ? "Live" : "In ontwikkeling"}
                      </span>
                    </div>
                  </div>

                  {/* Mobiele weergave in een iPhone-mockup, rechtsonder over de cover */}
                  {mobile && (
                    <ApplicationPhoneMockup
                      src={mobile}
                      alt={`${project.title} mobiele weergave`}
                      className="absolute bottom-[-9%] right-4 z-20 aspect-[9/19] h-[86%] w-auto transition-transform duration-500 group-hover:-translate-y-1.5 motion-reduce:transform-none sm:right-6"
                    />
                  )}
                </div>

                <div className={mobile ? "px-6 pb-6 pt-9 sm:px-7 sm:pb-7 sm:pt-11" : "p-6 sm:p-7"}>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.09] bg-white/[0.035] px-2.5 py-1 text-[11px] font-semibold text-white/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sora text-xl font-extrabold text-white sm:text-2xl">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[#ff9a45]">
                        {project.tagline}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/[0.1] text-white/45 transition-colors group-hover:border-[rgba(255,122,0,0.35)] group-hover:text-[#ff9a45]">
                      <Code2 className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-3 text-[14.5px] leading-relaxed text-white/60">
                    {project.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                    Bekijk de case
                    <ArrowRight className="h-4 w-4 text-[#ff9a45] transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
