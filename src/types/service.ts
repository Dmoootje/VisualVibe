export type ServiceCategory =
  | "webdesign"
  | "seo"
  | "fotografie"
  | "videografie"
  | "drone-fpv"
  | "3d-vr-ar"
  | "podcasting"
  | "masterclasses";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceSeo = {
  title: string;
  description: string;
  keywords: string[];
  /** Absolute (Firebase) or root-relative OG/Twitter image; falls back to the site default. */
  ogImage?: string;
};

export type SubserviceContentItem = {
  title: string;
  description: string;
};

export type SubserviceSearchIntent = {
  primaryKeyword: string;
  supportingKeywords: string[];
  type: "commercial" | "informational" | "mixed";
};

export type SubserviceOverviewContent = {
  title: string;
  paragraphs: string[];
  highlights?: string[];
};

export type SubserviceCardSectionContent = {
  title: string;
  intro?: string;
  items: SubserviceContentItem[];
};

export type SubservicePricingContent = {
  title: string;
  paragraphs: string[];
  factors: string[];
};

export type SubserviceRegionalContent = {
  title: string;
  description: string;
  regionSlugs: string[];
};

export type SubserviceCtaContent = {
  title: string;
  description: string;
  label?: string;
  href?: string;
};

export type SubserviceContent = {
  searchIntent?: SubserviceSearchIntent;
  overview?: SubserviceOverviewContent;
  outcomes?: SubserviceCardSectionContent;
  idealFor?: SubserviceCardSectionContent;
  deliverables?: SubserviceCardSectionContent;
  pricing?: SubservicePricingContent;
  whyVisualVibe?: SubserviceCardSectionContent;
  regional?: SubserviceRegionalContent;
  cta?: SubserviceCtaContent;
};

/**
 * Long-form, server-only copy for a sub-service page. The lightweight Service
 * catalog remains separate because it also feeds the client-side navigation.
 */
export type SubserviceEditorial = {
  intro: string;
  excerpt: string;
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  relatedServices: string[];
  seo: ServiceSeo;
  content?: SubserviceContent;
};

export type Service = {
  title: string;
  slug: string;
  parentSlug?: string;
  category: ServiceCategory;
  excerpt: string;
  intro: string;
  benefits: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFaq[];
  relatedServices: string[];
  relatedRegions: string[];
  relatedCases: string[];
  relatedPosts: string[];
  seo: ServiceSeo;
};
