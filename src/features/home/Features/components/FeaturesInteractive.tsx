"use client";

import { Tabs } from "@/components/ui/tabs";
import { FeatureContent } from "./FeatureContent";
import { FeaturesTabs } from "./FeaturesTabs";
import { MobileFeatureTitle } from "./MobileFeatureTitle";
import { useFeaturesTabs } from "../hooks/useFeaturesTabs";

export function FeaturesInteractive({ locale = "nl" }: { locale?: string }) {
  const { activeTab, handleTabChange } = useFeaturesTabs();

  return (
    <Tabs
      defaultValue="webdesign"
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <FeaturesTabs locale={locale} />
      <MobileFeatureTitle activeTab={activeTab} locale={locale} />
      <FeatureContent locale={locale} />
    </Tabs>
  );
}
