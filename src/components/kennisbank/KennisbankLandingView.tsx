"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, LayoutGrid, Rows3, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleCardData, KbCategoryData } from "./data";
import { KbHeroShell } from "./KbHeroShell";
import { TargetGraphic } from "./TargetGraphic";
import { SearchBar } from "./SearchBar";
import { ArticleCard } from "./ArticleCard";
import { FeaturedCard } from "./FeaturedCard";
import { NewsletterBox } from "./NewsletterBox";
import { BladerPerOnderwerp } from "./BladerPerOnderwerp";
import { CategoryIcon } from "./CategoryIcon";
import { knowledgeBaseLabels } from "./localization";

export type KennisbankLandingViewProps = {
  articles: ArticleCardData[];
  featured: ArticleCardData | null;
  /** Categories that have at least one live post (chips + sidebar + filter). */
  activeCategories: KbCategoryData[];
  /** All registered categories with counts (Blader per onderwerp). */
  allCategories: KbCategoryData[];
  totalArticles: number;
  locale?: string;
};

const ALL = "all";

export function KennisbankLandingView({
  articles,
  featured,
  activeCategories,
  allCategories,
  totalArticles,
  locale = "nl",
}: KennisbankLandingViewProps) {
  const labels = knowledgeBaseLabels(locale);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>(ALL);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [scrolled, setScrolled] = useState(false);

  // Seed from ?q= / ?cat= after mount (e.g. arriving from a categoriepagina
  // search). Reading window.location instead of useSearchParams keeps the full
  // article list in the server-rendered HTML for SEO.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const c = params.get("cat");
    if (q) setQuery(q);
    if (c && (c === ALL || activeCategories.some((category) => category.slug === c))) {
      setCat(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 160);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtering = cat !== ALL || normalizedQuery.length > 0;

  const results = useMemo(() => {
    return articles.filter((article) => {
      if (cat !== ALL && article.categorySlug !== cat) return false;
      if (normalizedQuery) {
        const haystack = `${article.fullTitle} ${article.excerpt} ${article.categoryName}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [articles, cat, normalizedQuery]);

  function pickCategory(slug: string) {
    setCat(slug);
    document.getElementById("kb-nieuwste")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    setQuery("");
    setCat(ALL);
  }

  const activeCategoryName =
    cat !== ALL ? activeCategories.find((c) => c.slug === cat)?.name : undefined;
  const resultCount = `${results.length} ${results.length === 1 ? labels.article : labels.articles}`;

  return (
    <div>
      <KbHeroShell
        breadcrumb={[{ label: "Home", href: "/" }, { label: labels.knowledgeBase }]}
        eyebrow={{
          icon: <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />,
          label: labels.knowledgeBase,
        }}
        title={locale === "en" ? "Grow smarter" : "Slim online"}
        titleAccent={locale === "en" ? "online as an SME" : "groeien als KMO"}
        subtitle={locale === "en" ? "Practical guides about web design, SEO and GEO, photography, video and digital growth for SMEs." : "Praktische gidsen en artikels over webdesign, SEO & GEO, fotografie, video en meer, geschreven voor ondernemers in Limburg."}
        stats={[
          { value: String(totalArticles), label: labels.articles },
          { value: String(activeCategories.length), label: labels.categories.toLowerCase() },
          { value: locale === "en" ? "weekly" : "wekelijks", label: locale === "en" ? "new" : "nieuw" },
        ]}
        graphic={<TargetGraphic />}
        search={
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() =>
              document.getElementById("kb-nieuwste")?.scrollIntoView({ behavior: "smooth" })
            }
            onClear={() => setQuery("")}
            placeholder={locale === "en" ? "Search for a guide or article..." : "Zoek een gids of artikel..."}
            submitLabel={labels.search}
            clearLabel={locale === "en" ? "Clear search" : "Zoekopdracht wissen"}
          />
        }
      />

      <section className="relative z-[2]">
        <div className="container mx-auto grid items-start gap-11 px-2.5 sm:px-4 py-14 lg:grid-cols-[1fr_336px]">
          {/* MAIN COLUMN */}
          <div className="min-w-0">
            {featured && !filtering && (
              <div className="mb-12 sm:mb-14">
                <div
                  className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {locale === "en" ? "Featured" : "Uitgelicht"}
                </div>
                <FeaturedCard article={featured} locale={locale} />
              </div>
            )}

            <div id="kb-nieuwste" className="scroll-mt-24">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div
                    className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {filtering ? (locale === "en" ? "Results" : "Resultaten") : (locale === "en" ? "Latest articles" : "Nieuwste artikels")}
                  </div>
                  <h2
                    className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    {filtering
                      ? activeCategoryName ?? (locale === "en" ? "Search results" : "Zoekresultaten")
                      : (locale === "en" ? "Fresh from the knowledge base" : "Vers uit de kennisbank")}
                  </h2>
                </div>
                <div className="flex items-center gap-3.5">
                  <span
                    className="text-[12.5px] text-white/50"
                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                  >
                    {resultCount}
                  </span>
                  <div className="inline-flex gap-1 rounded-[11px] border border-white/12 bg-white/[0.03] p-1">
                    <ToggleButton active={layout === "grid"} onClick={() => setLayout("grid")} label={locale === "en" ? "Grid view" : "Rasterweergave"}>
                      <LayoutGrid className="h-[17px] w-[17px]" aria-hidden="true" />
                    </ToggleButton>
                    <ToggleButton active={layout === "list"} onClick={() => setLayout("list")} label={locale === "en" ? "List view" : "Lijstweergave"}>
                      <Rows3 className="h-[17px] w-[17px]" aria-hidden="true" />
                    </ToggleButton>
                  </div>
                </div>
              </div>

              {/* Filter chips */}
              <div className="mb-6 flex flex-wrap gap-2.5">
                <Chip active={cat === ALL} onClick={() => pickCategory(ALL)}>
                  {locale === "en" ? "All" : "Alle"}
                </Chip>
                {activeCategories.map((category) => (
                  <Chip key={category.slug} active={cat === category.slug} onClick={() => pickCategory(category.slug)}>
                    {category.name}
                  </Chip>
                ))}
              </div>

              {results.length > 0 ? (
                layout === "grid" ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {results.map((article, i) => (
                        <ArticleCard key={article.id} article={article} variant="grid" index={i} locale={locale} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {results.map((article, i) => (
                        <ArticleCard key={article.id} article={article} variant="list" index={i} locale={locale} />
                    ))}
                  </div>
                )
              ) : (
                <div className="rounded-[20px] border border-dashed border-white/12 bg-white/[0.02] px-8 py-16 text-center">
                  <Search className="mx-auto mb-3.5 h-8 w-8 text-white/40" aria-hidden="true" />
                  <div
                    className="mb-1.5 text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    {locale === "en" ? "No articles found" : "Geen artikels gevonden"}
                  </div>
                  <p className="mb-5 text-sm text-white/55">{locale === "en" ? "Try another search term or category." : "Probeer een andere zoekterm of categorie."}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-[11px] border border-[#ff7500]/40 bg-[#ff7500]/10 px-5 py-2.5 text-[13.5px] font-bold text-[#ff9a45] transition-colors hover:bg-[#ff7500]/20"
                  >
                    {locale === "en" ? "Clear filters" : "Filters wissen"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="sticky top-24 flex flex-col gap-5">
            <div className={cn("kb-side-search", scrolled && "kb-show")}>
              <SearchBar
                value={query}
                onChange={setQuery}
                onClear={() => setQuery("")}
                placeholder={labels.searchPlaceholder}
                clearLabel={locale === "en" ? "Clear search" : "Zoekopdracht wissen"}
                size="sidebar"
              />
            </div>

            <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5">
              <div
                className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {labels.categories}
              </div>
              <div className="flex flex-col gap-0.5">
                <CategoryRow
                  slug="all"
                  label={locale === "en" ? "All articles" : "Alle artikels"}
                  count={totalArticles}
                  active={cat === ALL}
                  onClick={() => pickCategory(ALL)}
                />
                {activeCategories.map((category) => (
                  <CategoryRow
                    key={category.slug}
                    slug={category.slug}
                    label={category.name}
                    count={category.count}
                    active={cat === category.slug}
                    onClick={() => pickCategory(category.slug)}
                  />
                ))}
              </div>
            </div>

            <NewsletterBox locale={locale} />
          </aside>
        </div>
      </section>

      {/* BLADER PER ONDERWERP */}
      <section className="relative z-[2]">
        <div className="container mx-auto px-2.5 sm:px-4 pb-24 pt-2">
          <div
            className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {labels.categories}
          </div>
          <h2
            className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            {locale === "en" ? "Browse by topic" : "Blader per onderwerp"}
          </h2>
          <BladerPerOnderwerp categories={allCategories} locale={locale} />
        </div>
      </section>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-9 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-gradient-to-r from-red-500 to-[#ff7500] text-white"
          : "text-white/50 hover:bg-white/[0.06] hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
        active
          ? "border-[#ff7500]/60 bg-gradient-to-r from-red-500/20 to-[#ff7500]/20 text-white"
          : "border-white/12 bg-white/[0.02] text-white/62 hover:-translate-y-px hover:border-[#ff7500]/45 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function CategoryRow({
  slug,
  label,
  count,
  active,
  onClick,
}: {
  slug: string;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-left text-sm font-semibold transition-colors",
        active ? "bg-[#ff7500]/10 text-white" : "text-white/72 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] border border-[#ff7500]/22 bg-[#ff7500]/10 text-[#ff9a45]">
        <CategoryIcon slug={slug} className="h-4 w-4" />
      </span>
      <span className="flex-1">{label}</span>
      <span
        className="text-[11px] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        {count}
      </span>
    </button>
  );
}
