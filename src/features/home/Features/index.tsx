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
  const { activeTab, handleTabChange } = useFeaturesTabs();

  return (
    <section
      id="features"
      className="home-deferred-section relative py-12 sm:py-16 md:py-24"
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
          <FeatureContent />
        </Tabs>

        {/* Shared trust badges + supporting-service chips (under active content) */}
        <ServiceTrustRow />
        <ExtraServiceChips />
      </div>
    </section>
  );
}
