import { featuresConfig } from "../config/features.config";

/** Shared trust badges shown once, under the active tab content. */
export function ServiceTrustRow() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 sm:mt-14">
      {featuresConfig.trustItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 backdrop-blur-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
            {item.icon}
          </span>
          <span className="text-sm font-medium text-white/85">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
