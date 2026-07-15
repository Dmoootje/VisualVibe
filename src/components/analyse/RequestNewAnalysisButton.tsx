import { RefreshCw } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Brengt de klant terug naar de normale analyseflow. Daar gelden opnieuw de
 * e-mailverificatie en quota, en iedere toegestane aanvraag start een verse scan.
 */
export function RequestNewAnalysisButton() {
  return (
    <Link
      href="/website-analyse"
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:w-auto"
    >
      <RefreshCw className="h-4 w-4" aria-hidden="true" />
      Nieuwe analyse starten
    </Link>
  );
}
