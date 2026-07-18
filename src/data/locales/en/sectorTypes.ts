import type { Sector } from "@/types";

export type EnglishSectorLocaleRecord = Sector & {
  displaySlug: string;
  summary: string;
  body: string;
  directAnswer: string;
  cta: { title: string; description: string; label: string; href: string };
  imageAlt: string;
  internalLinks: { href: string; label: string }[];
};
