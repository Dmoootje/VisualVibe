import type { Sector } from "@/types";
import { kmo } from "./kmo";
import { bouwRenovatie } from "./bouw-renovatie";
import { horeca } from "./horeca";
import { vastgoedImmo } from "./vastgoed-immo";
import { retailWebshops } from "./retail-webshops";
import { events } from "./events";
import { sportclubs } from "./sportclubs";
import { opleidingenMasterclasses } from "./opleidingen-masterclasses";
import { wellnessBeauty } from "./wellness-beauty";
import { industrie } from "./industrie";

// One file per sector; array order is meaningful (hub grid + marquee order).
export const sectors: Sector[] = [
  kmo,
  bouwRenovatie,
  horeca,
  vastgoedImmo,
  retailWebshops,
  events,
  sportclubs,
  opleidingenMasterclasses,
  wellnessBeauty,
  industrie,
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((sector) => sector.slug === slug);
}
