import {
  FeaturesInteractive,
  FeaturesHeader,
  ServiceTrustRow,
  ExtraServiceChips,
} from "./components";

export default function Features() {
  return (
    <section
      id="features"
      className="home-deferred-section relative py-12 sm:py-16 md:py-24"
    >
      <div className="container mx-auto relative z-10">
        <FeaturesHeader />

        <FeaturesInteractive />

        {/* Shared trust badges + supporting-service chips (under active content) */}
        <ServiceTrustRow />
        <ExtraServiceChips />
      </div>
    </section>
  );
}
