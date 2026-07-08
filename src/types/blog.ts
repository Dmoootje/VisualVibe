export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  pillar: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  content: string;
  relatedServices: string[];
  relatedRegions: string[];
  relatedCases: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};
