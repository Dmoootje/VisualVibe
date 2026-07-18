import type { SupportedLocale } from "@/i18n/locales";

export type BlogLocale = Exclude<SupportedLocale, "de">;

export type BlogPostStatus = "draft" | "scheduled" | "published" | "archived";

export type BlogAuthor = {
  /** A blog post is written by a real person, never by the VisualVibe brand. */
  type: "Person";
  name: string;
  /** Site-relative profile path or an absolute profile URL. */
  url?: string;
  jobTitle?: string;
};

export type BlogCta = {
  title: string;
  description: string;
  label: string;
  /** Internal, site-relative destination. External CTA URLs are rejected by the loader. */
  href: string;
};

export type BlogSource = {
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
};

export type BlogSearchIntent = {
  primary: string;
  type: "informational" | "commercial" | "transactional" | "navigational";
  audience?: string;
  funnelStage?: "awareness" | "consideration" | "decision";
};

export type BlogPost = {
  title: string;
  slug: string;
  /** Display category name, e.g. "SEO & GEO" - matches a KennisbankCategory.name. */
  category: string;
  /** URL category segment, e.g. "seo-geo". Derived from `category` when omitted in frontmatter. */
  categorySlug: string;
  pillar: boolean;
  /** Only published posts whose publication date has passed are publicly returned by the content API. */
  status: BlogPostStatus;
  /** Content language. Existing posts default to Dutch (`nl`). */
  locale: BlogLocale;
  /** Shared key used to connect genuinely translated posts across locales. */
  translationKey: string;
  /** Display-name compatibility for existing cards and hero components. */
  author: string;
  /** Structured author data used for metadata and BlogPosting JSON-LD. */
  authorProfile: BlogAuthor;
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
  /** Vierkante deelafbeelding met tekst erop (og:image, alleen voor social). */
  ogImage?: string;
  /** Uitgelichte afbeelding zonder tekst: getoond in de hero en in alle cards. */
  featuredImage?: string;
  /** When true, the hero image is a fully composed banner (badge/title/logo baked in),
   * so the preview card renders it as-is instead of overlaying its own chrome. */
  heroComposed?: boolean;
  /** Alt/title/caption for the visible hero image rendered on the post page (falls back to title/excerpt when absent). */
  heroImageAlt?: string;
  heroImageTitle?: string;
  heroImageCaption?: string;
  robots?: string;
  /** Optional article override, merged over a category-specific safe fallback. */
  cta?: Partial<BlogCta>;
  searchIntent?: BlogSearchIntent;
  sources?: BlogSource[];
  /** "sub" articles belong to a pillar via parentPillar (an absolute kennisbank path). */
  clusterType?: "pillar" | "sub";
  parentPillar?: string;
  /** Absolute site paths, e.g. "/diensten/webdesign/" */
  relatedServices?: string[];
  relatedRegions?: string[];
  relatedSectors?: string[];
  relatedCases?: string[];
  relatedPosts?: string[];
};
