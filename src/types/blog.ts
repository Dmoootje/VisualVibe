export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  pillar: boolean;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  excerpt: string;
  content: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  seoTitle: string;
  seoDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  /** "sub" articles belong to a pillar via parentPillar (an absolute kennisbank path). */
  clusterType?: "pillar" | "sub";
  parentPillar?: string;
  /** Absolute site paths, e.g. "/diensten/webdesign/" */
  relatedServices?: string[];
  relatedRegions?: string[];
  relatedPosts?: string[];
};
