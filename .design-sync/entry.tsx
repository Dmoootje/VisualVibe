// design-sync bundle entry - the explicit, bounded surface of VisualVibe's
// presentational component library. Kept narrow on purpose: a synth-entry that
// globbed all of src/ would drag app pages, server actions and firebase-admin
// into the browser bundle. Only real, reusable design components belong here.
//
// NOTE: imports point at explicit FILE paths (not directory barrels) because the
// converter's tsconfig-paths resolver resolves a bare directory to the directory
// itself rather than its index.ts.

// UI primitives (export * keeps compound sub-parts: AccordionItem, TabsList, ...)
export * from "@/components/ui/accordion";
export * from "@/components/ui/badge";
export * from "@/components/ui/button";
export * from "@/components/ui/container";
export * from "@/components/ui/glow-card";
export * from "@/components/ui/neon-button";
export * from "@/components/ui/section";
export * from "@/components/ui/tabs";

// Cards
export { ServiceCard } from "@/components/cards/ServiceCard";
export { RegionCard } from "@/components/cards/RegionCard";

// Blog / long-form content blocks (MdxContent is intentionally excluded - it is
// MDX plumbing that needs next-mdx-remote, not a design block).
export { BlogCTA } from "@/components/blog/BlogCTA";
export { BlogHero } from "@/components/blog/BlogHero";
export { BlogImage } from "@/components/blog/BlogImage";
export { BlogProse } from "@/components/blog/BlogProse";
export { BlogToc } from "@/components/blog/BlogToc";
export { ChecklistBlock } from "@/components/blog/ChecklistBlock";
export { ComparisonTable } from "@/components/blog/ComparisonTable";
export { ContentSection } from "@/components/blog/ContentSection";
export { DoDontGrid } from "@/components/blog/DoDontGrid";
export { FaqAccordion } from "@/components/blog/FaqAccordion";
export { FeatureGrid, FeatureCard } from "@/components/blog/FeatureGrid";
export { GlowFrame } from "@/components/blog/GlowFrame";
export { LeadIntro } from "@/components/blog/LeadIntro";
export { NoticeBox } from "@/components/blog/NoticeBox";
export { QuoteBlock } from "@/components/blog/QuoteBlock";
export { RelatedArticles } from "@/components/blog/RelatedArticles";
export { RelatedRegions } from "@/components/blog/RelatedRegions";
export { RelatedServices } from "@/components/blog/RelatedServices";
export { RoadmapBlock } from "@/components/blog/RoadmapBlock";
export { StatGrid } from "@/components/blog/StatGrid";
export { StickyBlogSidebar } from "@/components/blog/StickyBlogSidebar";

// Page sections
export { PageHero } from "@/components/sections/PageHero";
export { Breadcrumbs } from "@/components/sections/Breadcrumbs";
export { CTASection } from "@/components/sections/CTASection";
export { ServiceGrid } from "@/components/sections/ServiceGrid";
export { RegionGrid } from "@/components/sections/RegionGrid";
export { CaseGrid } from "@/components/sections/CaseGrid";
export { BlogGrid } from "@/components/sections/BlogGrid";
export { CategoryGrid } from "@/components/sections/CategoryGrid";
export { StatsSection } from "@/components/sections/StatsSection";
export { FAQSection } from "@/components/sections/FAQSection";
export { PricingSection } from "@/components/sections/PricingSection";

// Forms
export { LeadForm } from "@/components/forms/LeadForm";

// Home / kennisbank - the rich blog card used in the homepage "Uit de kennisbank"
// section (hero image, category badge, logo, meta row, CTA).
export { BlogCard } from "@/features/home/BlogPreview/components/BlogCard";
