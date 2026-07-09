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
};
