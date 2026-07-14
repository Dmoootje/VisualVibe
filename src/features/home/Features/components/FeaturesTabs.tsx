"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { featuresConfig } from "../config/features.config";
import "./features-tabs.css";

export function FeaturesTabs() {
  return (
    <div className="mt-4 mb-10 flex justify-center overflow-x-auto pb-3 scrollbar-hide sm:mt-6 sm:mb-14 sm:pb-0">
      <TabsList className="ftabs-list h-auto flex-nowrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
        {/* Soft sweeping affordance (see features-tabs.css). */}
        <span aria-hidden="true" className="ftabs-runner" />
        {featuresConfig.features.map((feature) => (
          <TabsTrigger
            key={feature.id}
            value={feature.id}
            aria-label={feature.title}
            className="relative z-[1] whitespace-nowrap rounded-xl px-3.5 py-2.5 text-white/60 transition-all data-[state=inactive]:hover:bg-white/[0.06] data-[state=inactive]:hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/25 sm:px-5 sm:py-3"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="flex items-center justify-center">
                {feature.icon}
              </span>
              <span className="hidden text-base font-semibold sm:inline md:text-[17px]">
                {feature.title}
              </span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
