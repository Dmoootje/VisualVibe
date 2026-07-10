import { Search, Camera, Video, PlaneTakeoff, Box, Mic, GraduationCap, type LucideIcon } from "lucide-react";
import type { ServiceCategory } from "@/types";

// Webdesign sub-services carry the exact glyph id + tag from the Subdienst-hero
// handoff. Sub-services in other pillars fall back to a category icon and use
// the pillar name as their tag, so every sub-service page renders the hero.
const WEBDESIGN: Record<string, { icon: string; tag: string }> = {
  "website-laten-maken": { icon: "website", tag: "Websites op maat" },
  "webshop-laten-maken": { icon: "webshop", tag: "Verkopen online" },
  "onepager-laten-maken": { icon: "onepager", tag: "Snel online" },
  "website-vernieuwen": { icon: "vernieuwen", tag: "Redesign & migratie" },
  "website-onderhoud": { icon: "onderhoud", tag: "Zorgeloos online" },
  "wordpress-website-laten-maken": { icon: "wordpress", tag: "Zelf beheerbaar" },
  "seo-website-laten-maken": { icon: "seo", tag: "Gebouwd om te ranken" },
};

const CATEGORY_ICON: Record<ServiceCategory, LucideIcon> = {
  webdesign: Search, // webdesign resolves to per-service glyphs; this is a safety net
  seo: Search,
  fotografie: Camera,
  videografie: Video,
  "drone-fpv": PlaneTakeoff,
  "3d-vr-ar": Box,
  podcasting: Mic,
  masterclasses: GraduationCap,
};

export type ResolvedIcon = { kind: "glyph"; id: string } | { kind: "lucide"; Icon: LucideIcon };

export function iconForSubdienst(slug: string, category: ServiceCategory): ResolvedIcon {
  const wd = WEBDESIGN[slug];
  if (wd) return { kind: "glyph", id: wd.icon };
  return { kind: "lucide", Icon: CATEGORY_ICON[category] };
}

export function tagForSubdienst(slug: string, pillarTitle: string): string {
  return WEBDESIGN[slug]?.tag ?? pillarTitle;
}
