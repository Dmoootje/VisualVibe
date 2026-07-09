import type { ServiceCategory } from "@/types";

export type ServiceCategoryMeta = {
  slug: ServiceCategory;
  label: string;
  iconName: "Monitor" | "Search" | "Camera" | "Video" | "Plane" | "Box" | "Mic" | "GraduationCap";
};

// Icon metadata for grids (ServiceGrid/dienstenhub cards) - the icon name is
// resolved to a lucide-react component by the presentational component so
// this file stays framework-agnostic data, not JSX.
export const serviceCategories: ServiceCategoryMeta[] = [
  { slug: "webdesign", label: "Webdesign", iconName: "Monitor" },
  { slug: "seo", label: "SEO", iconName: "Search" },
  { slug: "fotografie", label: "Fotografie", iconName: "Camera" },
  { slug: "videografie", label: "Videografie", iconName: "Video" },
  { slug: "drone-fpv", label: "Drone & FPV", iconName: "Plane" },
  { slug: "3d-vr-ar", label: "3D, VR & AR", iconName: "Box" },
  { slug: "podcasting", label: "Podcasting", iconName: "Mic" },
  { slug: "masterclasses", label: "Masterclasses", iconName: "GraduationCap" },
];
