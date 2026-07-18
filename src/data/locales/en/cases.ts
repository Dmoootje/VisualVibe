import type { CaseItem } from "@/types";

export type EnglishCaseOverlay = Omit<CaseItem, "slug"> & {
  displaySlug: string;
};

// The static Dutch case inventory is currently empty. Keep this strict overlay
// empty as well: translations can only be added for source-backed case records.
export const englishCaseEditorial: Record<string, EnglishCaseOverlay> = {};
