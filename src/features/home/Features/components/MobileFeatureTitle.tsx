"use client";

import { featuresConfig, featuresConfigEn } from "../config/features.config";

interface MobileFeatureTitleProps {
  activeTab: string;
  locale?: string;
}

export function MobileFeatureTitle({ activeTab, locale = "nl" }: MobileFeatureTitleProps) {
  const copy = locale === "en" ? featuresConfigEn : featuresConfig;
  return (
    <div className="sm:hidden text-center mb-4">
      <h3 className="text-lg font-bold">
        {copy.features.find((f) => f.id === activeTab)?.title}
      </h3>
    </div>
  );
}
