import { Link } from "@/i18n/navigation";
import { featuresConfig } from "../config/features.config";

/** Supporting services as subtle chips / mini-links (not extra tabs). */
export function ExtraServiceChips() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-wide text-white/60">Ook onder één dak</p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {featuresConfig.extraServices.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 backdrop-blur-sm transition-colors hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-white"
          >
            <span className="text-amber-300/80 transition-colors group-hover:text-amber-300">
              {service.icon}
            </span>
            {service.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
