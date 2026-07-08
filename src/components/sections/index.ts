export { PageHero } from "./PageHero";
export { CTASection } from "./CTASection";
export { ServiceGrid } from "./ServiceGrid";
export { RegionGrid } from "./RegionGrid";
export { CaseGrid } from "./CaseGrid";
export { BlogGrid } from "./BlogGrid";

// StatsSection, FAQSection, and PricingSection are preserved but not yet
// wired into any page — import them directly from their file (e.g.
// "@/components/sections/FAQSection") when a page actually uses one, rather
// than re-exporting here, so unused ones aren't pulled into shared bundles.
