import type { ServiceFaq, ServiceProcessStep } from "./service";

/** Titled text block used across the extended sector sections. */
export type SectorHighlight = {
  title: string;
  text: string;
};

export type Sector = {
  title: string;
  slug: string;
  /** Sprite glyph id for the sector icon system (#sector-<icon>). */
  icon?: string;
  /** Short eyebrow / category label (e.g. "Gastvrijheid & beleving"). */
  tag?: string;
  /** One-line description used on sector cards (homepage + overview). */
  cardDescription?: string;
  intro: string;
  painPoints: string[];
  recommendedServices: string[];
  relatedCases: string[];
  relatedPosts: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  /** Longer SEO H1 for the detail hero; hero falls back to `title`. */
  heroTitle?: string;
  /** Primary hero CTA label; falls back to "Start je project". */
  heroCtaLabel?: string;
  /** Answer-first intro (AEO): H2 + direct answer + highlight blocks. */
  answerIntro?: {
    title: string;
    text: string;
    highlights: SectorHighlight[];
  };
  /** Expanded pain points; section falls back to plain `painPoints`. */
  painPointsExpanded?: SectorHighlight[];
  challengesIntro?: string;
  servicesTitle?: string;
  servicesIntro?: string;
  casesTitle?: string;
  casesIntro?: string;
  realisationsTitle?: string;
  realisationsIntro?: string;
  mediaTitle?: string;
  mediaIntro?: string;
  processTitle?: string;
  proofTitle?: string;
  /** Curated webdesign showcase ids; win over admin `sectors` tagging. */
  featuredWebdesignIds?: string[];
  /** Curated fotografie gallery ids; win over admin `sectors` tagging. */
  featuredGalleryIds?: string[];
  /** Explicit YouTube ids (videografie VideoItem.id or drone youtubeId). */
  featuredVideoIds?: string[];
  processSteps?: ServiceProcessStep[];
  proofPoints?: SectorHighlight[];
  localSection?: {
    title: string;
    text: string;
    regionSlugs: string[];
  };
  faq?: ServiceFaq[];
  /** Kennisbank relevance-scorer inputs. */
  knowledgeKeywords?: string[];
  knowledgeCategories?: string[];
  ctaTitle?: string;
  ctaText?: string;
};
