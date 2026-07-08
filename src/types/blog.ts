export type BlogPost = {
  title: string;
  slug: string;
  /** Display category name, e.g. "SEO & GEO" — matches a KennisbankCategory.name. */
  category: string;
  /** URL category segment, e.g. "seo-geo". Derived from `category` when omitted in frontmatter. */
  categorySlug: string;
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
  /** When true, the hero image is a fully composed banner (badge/title/logo baked in),
   * so the preview card renders it as-is instead of overlaying its own chrome. */
  heroComposed?: boolean;
  /** Alt/title/caption for the visible hero image rendered on the post page (falls back to title/excerpt when absent). */
  heroImageAlt?: string;
  heroImageTitle?: string;
  heroImageCaption?: string;
  robots?: string;
  /** "sub" articles belong to a pillar via parentPillar (an absolute kennisbank path). */
  clusterType?: "pillar" | "sub";
  parentPillar?: string;
  /** Absolute site paths, e.g. "/diensten/webdesign/" */
  relatedServices?: string[];
  relatedRegions?: string[];
  relatedPosts?: string[];
};
