import { imageKey, type WebdesignProject } from "@/data/webdesignShowcase";
import type { WebdesignImages } from "@/lib/firestore/webdesignImages";
import { ShowcaseImage } from "@/components/webdesign/ShowcaseImage";

const Magnifier = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.4} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
  </svg>
);
const Check = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * Featured "Laatste creatie" (design_handoff_realisaties_webdesign): links de
 * project-copy, rechts een device-compositie (laptop groot, tablet + gsm klein)
 * die de screenshots uit de admin-beelden toont. Server-side; alle beweging is
 * pure CSS (.vvw-bob / .vvw-liveDot in globals.css, .rwd-* voor de responsive
 * schaal van het toestellen-podium).
 */
export function RealisatieWebdesignFeatured({
  project,
  images,
}: {
  project: WebdesignProject;
  images: WebdesignImages;
}) {
  const laptop = images[imageKey(project.id, "1")];
  const tablet = images[imageKey(project.id, "3")];
  const phone = images[imageKey(project.id, "4")];
  const neutralTags = project.tags.filter((t) => !/seo|geo/i.test(t));

  return (
    <section className="relative overflow-hidden pb-14 pt-14 sm:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-120px] top-10 z-0 h-[620px] w-[760px] max-w-full bg-[radial-gradient(circle_at_60%_45%,rgba(255,90,0,0.12),transparent_64%)]"
      />

      <div className="container relative z-[2] mx-auto grid items-center gap-10 px-2.5 sm:px-4 lg:grid-cols-[520px_1fr] lg:gap-[60px]">
        {/* LINKS: copy */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,122,0,0.25)] bg-[rgba(255,122,0,0.1)] px-[15px] py-2 font-mono text-xs font-bold tracking-[0.1em] text-[#FF9A45]">
            <span className="vvw-liveDot h-[7px] w-[7px] rounded-full bg-[#FF7A00]" />
            LAATSTE CREATIE
          </div>
          {project.client && (
            <div className="mb-3 font-mono text-[11px] font-bold tracking-[0.14em] text-white/40">
              {project.client}
            </div>
          )}
          <h2 className="font-sora mb-5 text-[clamp(30px,9vw,42px)] font-extrabold leading-[1.03] tracking-[-0.025em] text-white sm:text-[44px]">
            {project.name}
          </h2>
          <p className="mb-[26px] text-[16.5px] leading-[1.65] text-white/[0.68]">{project.text}</p>

          {/* Tags: accent SEO/GEO-chips + neutrale pills */}
          <div className="mb-[26px] flex flex-wrap gap-[7px]">
            {project.terms.map((term) => (
              <span
                key={term}
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-[rgba(255,122,0,0.22)] bg-[rgba(255,122,0,0.08)] px-2.5 py-1.5 font-mono text-[11px] font-medium text-[#FF9A45]"
              >
                <Magnifier />
                {term}
              </span>
            ))}
            {neutralTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.09] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Checklist */}
          {project.features.length > 0 && (
            <div className="mb-[30px] grid grid-cols-1 gap-x-5 gap-y-[11px] sm:grid-cols-2">
              {project.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <span className="flex h-[21px] w-[21px] flex-none items-center justify-center rounded-md border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.14)]">
                    <Check />
                  </span>
                  <span className="text-[13.5px] font-semibold text-white/[0.82]">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="vvw-visitLink inline-flex items-center gap-2 rounded-xl border border-[rgba(255,122,0,0.35)] bg-[rgba(255,122,0,0.12)] px-[26px] py-3.5 text-[15px] font-bold text-white"
          >
            Bekijk de live site
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9A45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        {/* RECHTS: device-compositie (laptop groot, tablet + gsm klein) */}
        <div className="rwd-col lg:justify-end">
          <div className="rwd-stage">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[-10px] z-0 blur-[34px]"
              style={{ background: "radial-gradient(circle at 55% 42%,rgba(255,100,0,.32),transparent 66%)" }}
            />

            {/* LAPTOP */}
            <div className="absolute left-[38px] top-3 z-[1] w-[640px]">
              <div
                className="rounded-2xl p-[1.5px]"
                style={{
                  background:
                    "linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))",
                  boxShadow: "0 44px 90px -34px rgba(255,80,0,.6)",
                }}
              >
                <div className="overflow-hidden rounded-[14px] border border-white/5 bg-[#0e0d0c]">
                  <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#100e0d] px-3.5 py-[11px]">
                    <span className="h-[9px] w-[9px] rounded-full bg-[#FF3B2E]" />
                    <span className="h-[9px] w-[9px] rounded-full bg-[#FF7A00]" />
                    <span className="h-[9px] w-[9px] rounded-full bg-[#FFA23A]" />
                    <span className="ml-2 flex h-[22px] flex-1 items-center gap-[7px] rounded-[7px] bg-white/[0.05] px-2.5 font-mono text-[11px] text-white/50">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5ac47d" strokeWidth={2.4} aria-hidden="true">
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                      </svg>
                      gordijnenmyriam.be
                    </span>
                  </div>
                  <div className="relative h-[352px]">
                    <ShowcaseImage src={laptop} alt={`${project.name} desktop-screenshot`} placeholder="Desktop-screenshot" sizes="640px" eager />
                  </div>
                </div>
              </div>
              {/* laptop-voet */}
              <div className="relative left-[-6%] mx-auto h-[15px] w-[112%] rounded-b-xl bg-[linear-gradient(180deg,#2a2724,#151312)] shadow-[0_14px_24px_-8px_rgba(0,0,0,0.7)]">
                <span className="absolute left-1/2 top-0 h-[5px] w-[90px] -translate-x-1/2 rounded-b-md bg-white/[0.06]" />
              </div>
            </div>

            {/* TABLET */}
            <div className="vvw-bob absolute bottom-[6px] left-0 z-[3] w-[186px] rounded-[20px] border border-white/[0.08] bg-[linear-gradient(160deg,#26221f,#131110)] p-2 shadow-[0_34px_60px_-24px_rgba(0,0,0,0.85)]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#0e0d0c]">
                <ShowcaseImage src={tablet} alt={`${project.name} tablet-screenshot`} placeholder="Tablet" sizes="170px" />
              </div>
              <span className="absolute left-1/2 top-3.5 z-[2] h-1 w-[26px] -translate-x-1/2 rounded-full bg-white/[0.14]" />
            </div>

            {/* GSM */}
            <div className="vvw-bob2 absolute bottom-[-6px] right-[22px] z-[4] w-[132px] rounded-[24px] border border-white/[0.09] bg-[linear-gradient(160deg,#2a2622,#131110)] p-1.5 shadow-[0_38px_64px_-22px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[1/2] overflow-hidden rounded-[19px] bg-[#0e0d0c]">
                <ShowcaseImage src={phone} alt={`${project.name} mobiel-screenshot`} placeholder="Mobiel" sizes="120px" />
              </div>
              <span className="absolute left-1/2 top-[13px] z-[2] h-[5px] w-[34px] -translate-x-1/2 rounded-full bg-white/[0.16]" />
            </div>

            {/* PageSpeed-chip */}
            <div className="vvw-bob absolute right-[-8px] top-0.5 z-[5] flex items-center gap-2.5 rounded-xl border border-[rgba(255,122,0,0.22)] bg-[rgba(20,17,14,0.92)] px-3.5 py-2.5 backdrop-blur-md shadow-[0_16px_34px_-16px_rgba(0,0,0,0.8)]">
              <svg width="26" height="26" viewBox="0 0 36 36" aria-hidden="true">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={4} />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#5ac47d" strokeWidth={4} strokeLinecap="round" strokeDasharray="94" strokeDashoffset="6" transform="rotate(-90 18 18)" />
              </svg>
              <div>
                <div className="font-sora text-base font-extrabold leading-none text-white">98</div>
                <div className="mt-0.5 text-[10px] text-white/50">PageSpeed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
