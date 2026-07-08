import type { CaseItem } from "@/types";

// Populated in Fase 4 (realisaties). Kept typed + empty so hub components
// can render a graceful "binnenkort" state rather than assuming data exists.
export const cases: CaseItem[] = [];

export function getCaseBySlug(slug: string): CaseItem | undefined {
  return cases.find((item) => item.slug === slug);
}
