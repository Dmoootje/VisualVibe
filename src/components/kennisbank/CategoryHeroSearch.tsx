"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { SearchBar } from "./SearchBar";
import { knowledgeBaseLabels } from "./localization";

/**
 * Hero search on the categoriepagina: typing then Enter / "Zoeken" jumps to the
 * kennisbank landing with the query pre-applied (?q=...).
 */
export function CategoryHeroSearch({ locale = "nl" }: { locale?: string }) {
  const labels = knowledgeBaseLabels(locale);
  const [value, setValue] = useState("");
  const router = useRouter();

  function go() {
    const q = value.trim();
    router.push(q ? `/kennisbank?q=${encodeURIComponent(q)}` : "/kennisbank");
  }

  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onSubmit={go}
      onClear={() => setValue("")}
      placeholder={locale === "en" ? "Search for a guide or article..." : "Zoek een gids of artikel..."}
      submitLabel={labels.search}
      clearLabel={locale === "en" ? "Clear search" : "Zoekopdracht wissen"}
    />
  );
}
