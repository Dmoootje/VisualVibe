export { PageHero } from "./PageHero";
export { Breadcrumbs, type Crumb } from "./Breadcrumbs";
export { CTASection } from "./CTASection";
export { CTABlock } from "./CTABlock";
export { ServiceGrid } from "./ServiceGrid";
export { ProcessSteps } from "./ProcessSteps";
export { RegionGrid } from "./RegionGrid";
export { CaseGrid } from "./CaseGrid";
export { BlogGrid } from "./BlogGrid";
export { CategoryGrid, type CategoryCard } from "./CategoryGrid";

// StatsSection, FAQSection, and PricingSection are preserved but not yet
// wired into any page - import them directly from their file (e.g.
// "@/components/sections/FAQSection") when a page actually uses one, rather
// than re-exporting here, so unused ones aren't pulled into shared bundles.
