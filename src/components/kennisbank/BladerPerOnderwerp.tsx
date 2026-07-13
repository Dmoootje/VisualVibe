import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { categoryHref, type KbCategoryData } from "./data";
import { CategoryIcon } from "./CategoryIcon";

/** Canonical topic order (matches the homepage service order). */
const ORDER = [
  "webdesign",
  "seo-geo",
  "fotografie",
  "videografie",
  "drone",
  "3d-vr",
  "podcasting",
  "masterclasses",
];

/** A couple of representative sub-topics per category, shown as chips. */
const SUBS: Record<string, string[]> = {
  webdesign: ["Website laten maken", "Webshop", "Onepager"],
  "seo-geo": ["Lokale SEO", "Technische SEO", "AEO & GEO"],
  fotografie: ["Bedrijfsfotografie", "Productfotografie", "Vastgoed"],
  videografie: ["Bedrijfsvideo", "Promovideo", "Social video"],
  drone: ["Dronefotografie", "Dronevideo", "FPV"],
  "3d-vr": ["3D-tour", "Virtuele rondleiding"],
  podcasting: ["Bedrijfspodcast", "Videopodcast"],
  masterclasses: ["Online cursus", "Masterclass opnemen", "Workshop filmen"],
};

type CardModel = KbCategoryData & { num: string; wide: boolean; subs: string[] };

function order(categories: KbCategoryData[]): CardModel[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const sorted = ORDER.map((slug) => bySlug.get(slug)).filter(
    (c): c is KbCategoryData => Boolean(c)
  );
  // Any category not in the canonical order still gets shown, appended.
  categories.forEach((c) => {
    if (!ORDER.includes(c.slug)) sorted.push(c);
  });
  return sorted.map((category, i) => {
    const pos = i % 2;
    const pair = Math.floor(i / 2);
    const wide = pair % 2 === 0 ? pos === 0 : pos === 1;
    return {
      ...category,
      num: String(i + 1).padStart(2, "0"),
      wide,
      subs: SUBS[category.slug] ?? [],
    };
  });
}

function CardBody({ card }: { card: CardModel }) {
  const amber = card.wide;
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute -right-4 -top-6 text-white/[0.03] transition-colors duration-500 group-hover:text-[#ff7500]/[0.16]",
          amber && "text-[#ff7500]/[0.14]"
        )}
        aria-hidden="true"
      >
        <CategoryIcon slug={card.slug} strokeWidth={1} className="h-52 w-52" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-[15px] border transition-all duration-300",
            amber
              ? "border-transparent bg-gradient-to-br from-[#ffa23a] to-[#ff7a00] text-white shadow-[0_14px_30px_-12px_rgba(255,122,0,0.75)]"
              : "border-[#ff7500]/20 bg-[#ff7500]/[0.08] text-[#ff9a45] group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#ffa23a] group-hover:to-[#ff7a00] group-hover:text-white group-hover:shadow-[0_16px_32px_-12px_rgba(255,122,0,0.85)]"
          )}
        >
          <CategoryIcon slug={card.slug} className="h-7 w-7" />
        </span>
        <span
          className={cn(
            "text-sm font-bold tracking-[0.14em] transition-colors",
            amber ? "text-[#ff9a45]/60" : "text-white/25 group-hover:text-[#ff9a45]/60"
          )}
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {card.num}
        </span>
      </div>

      <h3
        className="relative mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-[27px]"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        {card.name}
      </h3>
      <p className="relative mt-2.5 max-w-[66%] text-sm leading-relaxed text-white/60">
        {card.description}
      </p>

      <div className="relative mt-auto flex items-end justify-between gap-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {card.subs.map((sub) => (
            <span
              key={sub}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-white/62"
            >
              {sub}
            </span>
          ))}
          {card.count === 0 && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-white/40">
              Binnenkort
            </span>
          )}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            amber
              ? "border-transparent bg-gradient-to-br from-[#ffa23a] to-[#ff7a00] text-white"
              : "border-white/12 bg-white/[0.03] text-white/70 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#ffa23a] group-hover:to-[#ff7a00] group-hover:text-white"
          )}
        >
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </>
  );
}

const CARD_BASE =
  "group relative flex flex-col overflow-hidden rounded-[20px] border p-7 transition-all duration-300";
const CARD_INTERACTIVE =
  "hover:-translate-y-1.5 hover:border-[#ff7500]/55 hover:shadow-[0_48px_96px_-40px_rgba(255,90,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function BladerPerOnderwerp({ categories }: { categories: KbCategoryData[] }) {
  const cards = order(categories);
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
      {cards.map((card) => {
        const span = card.wide ? "lg:col-span-4" : "lg:col-span-3";
        const surface = card.wide
          ? "border-[#ff7500]/32 bg-[radial-gradient(130%_100%_at_16%_114%,rgba(255,90,0,0.13),transparent_56%),linear-gradient(160deg,rgba(255,122,0,0.035),rgba(255,255,255,0.006))]"
          : "border-white/[0.09] bg-white/[0.02]";
        if (card.count === 0) {
          return (
            <div key={card.slug} className={cn(CARD_BASE, span, surface, "opacity-70")} aria-label={`${card.name} (binnenkort)`}>
              <CardBody card={card} />
            </div>
          );
        }
        return (
          <Link key={card.slug} href={categoryHref(card.slug)} className={cn(CARD_BASE, CARD_INTERACTIVE, span, surface)}>
            <CardBody card={card} />
          </Link>
        );
      })}
    </div>
  );
}
