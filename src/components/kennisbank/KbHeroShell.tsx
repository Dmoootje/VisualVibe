import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const GRID_BG =
  "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)";
const GRID_MASK = "radial-gradient(ellipse 70% 120% at 20% 20%,#000,transparent 72%)";

export type KbBreadcrumb = { label: string; href?: string };
export type KbStat = { value: string; label: string };

/**
 * Shared hero chrome for the kennisbank landing + categoriepagina: grid-pattern
 * background, warm top-right glow, breadcrumb, eyebrow pill, two-tone H1,
 * subtitle, a search slot and a decorative graphic slot on the right.
 */
export function KbHeroShell({
  breadcrumb,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  stats,
  search,
  graphic,
  backgroundImage,
}: {
  breadcrumb: KbBreadcrumb[];
  eyebrow: { icon: React.ReactNode; label: string };
  title: string;
  titleAccent?: string;
  subtitle: string;
  stats: KbStat[];
  search: React.ReactNode;
  graphic?: React.ReactNode;
  /** Subtiele volle-breedte herotextuur (bv. categoriebeeld zonder tekst). */
  backgroundImage?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.06] pb-11 pt-28 sm:pt-32 md:pt-36">
      {backgroundImage && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-[0.18]" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/55" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-44 z-0 h-[640px] w-[760px]"
        style={{
          background:
            "radial-gradient(ellipse 52% 52% at 62% 40%,rgba(255,90,0,.18),rgba(255,90,0,.05) 46%,transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: GRID_BG,
          backgroundSize: "54px 54px",
          WebkitMaskImage: GRID_MASK,
          maskImage: GRID_MASK,
        }}
      />

      <div className="container relative z-[2] mx-auto px-2.5 sm:px-4">
        <nav
          aria-label="Kruimelpad"
          className="mb-7 flex items-center gap-2 text-xs font-semibold text-white/40"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/20">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-white/70">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#ff9a45]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid items-center gap-11 lg:grid-cols-[1fr_460px]">
          <div className="max-w-[720px]">
            <span
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#ff7500]/25 bg-[#ff7500]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ff9a45]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {eyebrow.icon}
              {eyebrow.label}
            </span>
            <h1
              className={cn(
                "mb-5 text-[clamp(38px,8vw,64px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-white"
              )}
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              {title}
              {titleAccent && (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-red-500 to-[#ff9a45] bg-clip-text text-transparent">
                    {titleAccent}
                  </span>
                </>
              )}
            </h1>
            <p className="mb-8 max-w-[600px] text-lg leading-relaxed text-white/64">{subtitle}</p>

            {search}

            {stats.length > 0 && (
              <div
                className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[12.5px] text-white/50"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {stats.map((stat) => (
                  <span key={stat.label}>
                    <b className="text-[15px] text-white">{stat.value}</b> {stat.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {graphic && <div className="justify-self-end">{graphic}</div>}
        </div>
      </div>
    </header>
  );
}
