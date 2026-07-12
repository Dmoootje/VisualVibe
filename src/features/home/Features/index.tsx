"use client";

import { Tabs } from "@/components/ui/tabs";
import {
  FeaturesHeader,
  FeaturesTabs,
  MobileFeatureTitle,
  FeatureContent,
  ServiceTrustRow,
  ExtraServiceChips,
} from "./components";
import { useFeaturesTabs } from "./hooks/useFeaturesTabs";

export default function Features() {
  const { activeTab, handleTabChange, contentStyle } = useFeaturesTabs();

  return (
    <section
      id="features"
      className="py-12 px-4 sm:py-16 md:py-24 relative"
    >
      <div className="container mx-auto relative z-10">
        <FeaturesHeader />

        <Tabs
          defaultValue="webdesign"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <FeaturesTabs />
          <MobileFeatureTitle activeTab={activeTab} />
          <FeatureContent contentStyle={contentStyle} />
        </Tabs>

        {/* Shared trust badges + supporting-service chips (under active content) */}
        <ServiceTrustRow />
        <ExtraServiceChips />
      </div>
    </section>
  );
}
