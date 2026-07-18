"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { categoryHref } from "./data";
import { SearchBar } from "./SearchBar";
import { CategoryIcon } from "./CategoryIcon";
import { knowledgeBaseLabels } from "./localization";

export type CategorySidebarProps = {
  tocLinks: { title: string; href: string }[];
  otherCategories: { slug: string; name: string; count: number }[];
  cta: { title: string; description: string; label: string; href: string };
  locale?: string;
};

export function CategorySidebar({ tocLinks, otherCategories, cta, locale = "nl" }: CategorySidebarProps) {
  const labels = knowledgeBaseLabels(locale);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 160);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go() {
    const q = query.trim();
    router.push(q ? `/kennisbank?q=${encodeURIComponent(q)}` : "/kennisbank");
  }

  return (
    <aside className="sticky top-24 flex flex-col gap-5">
      <div className={cn("kb-side-search", scrolled && "kb-show")}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={go}
          onClear={() => setQuery("")}
          placeholder={labels.searchPlaceholder}
          clearLabel={locale === "en" ? "Clear search" : "Zoekopdracht wissen"}
          size="sidebar"
        />
      </div>

      {tocLinks.length > 0 && (
        <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5">
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {labels.inThisCategory}
          </div>
          <div className="flex flex-col">
            {tocLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-l-2 border-transparent py-2.5 pl-3 text-[13.5px] font-semibold leading-snug text-white/66 transition-all hover:border-[#ff7500]/50 hover:pl-4 hover:text-white"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {otherCategories.length > 0 && (
        <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5">
          <div
            className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {labels.otherCategories}
          </div>
          <div className="flex flex-col gap-0.5">
            {otherCategories.map((category) => (
              <Link
                key={category.slug}
                href={categoryHref(category.slug)}
                className="flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] border border-[#ff7500]/22 bg-[#ff7500]/10 text-[#ff9a45]">
                  <CategoryIcon slug={category.slug} className="h-4 w-4" />
                </span>
                <span className="flex-1">{category.name}</span>
                <span
                  className="text-[11px] text-white/40"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[18px] border border-[#ff7500]/28 bg-gradient-to-b from-[#ff7500]/[0.14] to-[#ff7500]/[0.03] p-6">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(255,90,0,.22),transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="mb-1.5 text-lg font-extrabold tracking-tight text-white"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          {cta.title}
        </div>
        <p className="mb-[18px] text-[13.5px] leading-relaxed text-white/66">{cta.description}</p>
        <Link
          href={cta.href}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-red-500 to-[#ff7500] px-4 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          {cta.label}
          <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
