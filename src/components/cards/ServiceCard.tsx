import { Link } from "@/i18n/navigation";
import { ArrowRight, Monitor, Search, Camera, Video, Plane, Box, Mic, GraduationCap } from "lucide-react";
import type { ServiceCategoryMeta } from "@/data/serviceCategories";

const iconMap = {
  Monitor,
  Search,
  Camera,
  Video,
  Plane,
  Box,
  Mic,
  GraduationCap,
} as const;

export function ServiceCard({
  category,
  excerpt,
}: {
  category: ServiceCategoryMeta;
  excerpt: string;
}) {
  const Icon = iconMap[category.iconName];

  return (
    <Link
      href={`/diensten/${category.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-amber-500 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
        {category.label}
      </span>
      <span className="text-sm text-white/70">{excerpt}</span>
      <span className="mt-auto inline-flex items-center gap-1 text-sm text-white/60 group-hover:text-white transition-colors">
        Meer info
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
