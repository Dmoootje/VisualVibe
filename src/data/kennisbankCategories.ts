// Kennisbank categories - the taxonomy behind the nested URL structure
// /kennisbank/[categorySlug]/[slug]/. `name` must match the `category` field in
// each post's MDX frontmatter (that's how posts are grouped into a category).
export type KennisbankCategory = {
  /** URL segment, e.g. "seo-geo". */
  slug: string;
  /** Display name, matches BlogPost.category, e.g. "SEO & GEO". */
  name: string;
  /** Short intro shown on the category hub + used for its meta description. */
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export const kennisbankCategories: KennisbankCategory[] = [
  {
    slug: "seo-geo",
    name: "SEO & GEO",
    description:
      "Artikels over lokale SEO, AEO, GEO, AI-vindbaarheid en online zichtbaarheid voor KMO's in Limburg.",
    seoTitle: "SEO & GEO artikels voor KMO's | Kennisbank VisualVibe",
    seoDescription:
      "Lokale SEO, AEO en GEO voor KMO's in Limburg. Ontdek hoe je beter gevonden wordt in Google én AI-zoekresultaten.",
  },
  {
    slug: "webdesign",
    name: "Webdesign",
    description:
      "Alles over een professionele website laten maken: design, snelheid, conversie en techniek voor KMO's.",
    seoTitle: "Webdesign artikels voor KMO's | Kennisbank VisualVibe",
    seoDescription:
      "Praktische gidsen over websites laten maken in Limburg: webdesign, performance, SEO en conversie voor KMO's.",
  },
];

export function getCategoryBySlug(slug: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.slug === slug);
}

/** Maps a post's display category name (e.g. "SEO & GEO") to its category. */
export function getCategoryByName(name: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.name === name);
}
