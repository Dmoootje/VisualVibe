import "server-only";
import type { SubserviceEditorial } from "@/types";
import { webdesignEditorial } from "./webdesign";
import { seoEditorial } from "./seo";
import { fotografieEditorial } from "./fotografie";
import { videografieEditorial } from "./videografie";
import { droneEditorial } from "./drone";
import { xrEditorial } from "./xr";
import { podcastingEditorial } from "./podcasting";
import { masterclassesEditorial } from "./masterclasses";

/**
 * Central server-only content map for every dynamic sub-service route. Keeping
 * it separate from subservices.ts prevents long-form copy from entering the
 * client-side navigation bundle.
 */
export const subserviceEditorial: Record<string, SubserviceEditorial> = {
  ...webdesignEditorial,
  ...seoEditorial,
  ...fotografieEditorial,
  ...videografieEditorial,
  ...droneEditorial,
  ...xrEditorial,
  ...podcastingEditorial,
  ...masterclassesEditorial,
};

export function getSubserviceEditorial(slug: string): SubserviceEditorial | undefined {
  return subserviceEditorial[slug];
}
