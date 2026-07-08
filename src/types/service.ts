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
