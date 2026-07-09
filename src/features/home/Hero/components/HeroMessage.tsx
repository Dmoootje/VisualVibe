import { Link } from "@/i18n/navigation";
import { heroConfig } from "../config/hero.config";

const Spark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF7A00" aria-hidden="true">
    <path d="M12 2l1.6 5.6L19 9l-5.4 1.4L12 16l-1.6-5.6L5 9l5.4-1.4z" />
  </svg>
);

const Star = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF7A00" aria-hidden="true">
    <path d="M12 2l2.9 6.3L22 9.3l-5 4.7 1.2 6.9L12 17.8 5.8 20.9 7 14 2 9.3l7.1-1z" />
  </svg>
);

const Arrow = () => (
  <svg
    className="vvh-ar"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

/** Left column: the static marketing message (eyebrow, title, copy, CTAs, trust). */
export function HeroMessage() {
  return (
    <div className="max-w-[640px]">
      <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white">
        <Spark />
        {heroConfig.eyebrow}
      </div>

      <h1 className="mb-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-[74px] lg:leading-[1.03]">
        {heroConfig.titleLine1}
        <br />
        <span className="bg-gradient-to-r from-[#FF3B2E] to-[#FF7A00] bg-clip-text text-transparent">
          {heroConfig.titleLine2}
        </span>
      </h1>

      <p className="mb-9 max-w-[520px] text-lg leading-relaxed text-white/60 sm:text-xl">
        {heroConfig.description}
      </p>

      <div className="mb-11 flex flex-wrap gap-4">
        <Link
          href={heroConfig.primaryCta.href}
          className="vvh-btn inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-[17px] font-bold text-white"
          style={{
            background: "linear-gradient(90deg,#FF3B2E,#FF7A00)",
            boxShadow: "0 16px 40px -14px rgba(255,90,0,.85)",
          }}
        >
          {heroConfig.primaryCta.label}
          <Arrow />
        </Link>
        <Link
          href={heroConfig.secondaryCta.href}
          className="vvh-btn inline-flex items-center rounded-xl border border-white/[0.14] bg-white/5 px-7 py-4 text-[17px] font-bold text-white"
        >
          {heroConfig.secondaryCta.label}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex">
          {[1, 2, 3, 4].map((n, i) => (
            <span
              key={n}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[#080808] bg-[#1c1c1c] text-xs font-bold text-white"
              style={i > 0 ? { marginLeft: -9 } : undefined}
            >
              {n}
            </span>
          ))}
        </div>
        <span className="text-[15px] text-white/60">
          Vertrouwd door <strong className="text-white">{heroConfig.trustedBy}</strong>{" "}
          {heroConfig.trustLabel}
        </span>
        <span className="inline-flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} />
          ))}
        </span>
      </div>
    </div>
  );
}
