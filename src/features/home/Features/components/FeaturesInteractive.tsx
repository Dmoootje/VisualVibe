"use client";

import { Tabs } from "@/components/ui/tabs";
import { FeatureContent } from "./FeatureContent";
import { FeaturesTabs } from "./FeaturesTabs";
import { MobileFeatureTitle } from "./MobileFeatureTitle";
import { useFeaturesTabs } from "../hooks/useFeaturesTabs";

export function FeaturesInteractive() {
  const { activeTab, handleTabChange } = useFeaturesTabs();

  return (
    <Tabs
      defaultValue="webdesign"
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <FeaturesTabs />
      <MobileFeatureTitle activeTab={activeTab} />
      <FeatureContent />
    </Tabs>
  );
}
