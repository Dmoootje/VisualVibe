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
      "Praktische gidsen over websites laten maken in Limburg: webdesign, kosten, onepagers, webshops, snelheid en conversie voor KMO's die online willen groeien.",
  },
  {
    slug: "fotografie",
    name: "Fotografie",
    description:
      "Tips en gidsen over bedrijfs-, product-, event- en vastgoedfotografie voor KMO's in Limburg.",
    seoTitle: "Fotografie artikels voor KMO's | Kennisbank VisualVibe",
    seoDescription:
      "Praktische fotografie-tips voor KMO's: bedrijfsfotografie, productfotografie, events en vastgoed in Limburg.",
  },
  {
    slug: "videografie",
    name: "Videografie",
    description:
      "Praktische gidsen die KMO's helpen het juiste videotype te kiezen en script, productie, distributie en resultaat doelgericht te plannen.",
    seoTitle: "Videografie voor KMO's: praktische gidsen | VisualVibe",
    seoDescription:
      "Ontdek hoe je als KMO een bedrijfsvideo, social video, aftermovie, wervingsvideo of testimonial doelgericht plant, produceert, publiceert en meet.",
  },
  {
    slug: "drone",
    name: "Drone & FPV",
    description:
      "Dronefotografie, dronevideo en FPV voor bedrijven, vastgoed, bouw en events.",
    seoTitle: "Drone & FPV artikels voor bedrijven | Kennisbank VisualVibe",
    seoDescription:
      "Dronebeelden en FPV-video voor bedrijven, vastgoed en bouwprojecten: tips en toepassingen voor KMO's in Limburg.",
  },
  {
    slug: "3d-vr",
    name: "3D & VR",
    description:
      "3D-tours en virtuele rondleidingen voor showrooms, vastgoed en horeca.",
    seoTitle: "3D & VR artikels voor bedrijven | Kennisbank VisualVibe",
    seoDescription:
      "Zo verhogen 3D-tours en virtuele rondleidingen vertrouwen voor showrooms, vastgoed en horeca in Limburg.",
  },
  {
    slug: "podcasting",
    name: "Podcasting",
    description:
      "Een bedrijfspodcast of videopodcast starten en inzetten als contentkanaal.",
    seoTitle: "Podcasting artikels voor bedrijven | Kennisbank VisualVibe",
    seoDescription:
      "Bedrijfspodcast en videopodcast starten: format, opname en hergebruik als social content voor KMO's in Limburg.",
  },
  {
    slug: "masterclasses",
    name: "Masterclasses",
    description:
      "Opleidingen, cursussen en workshops professioneel op video zetten en hergebruiken.",
    seoTitle: "Masterclasses & opleiding filmen | Kennisbank VisualVibe",
    seoDescription:
      "Opleidingen, online cursussen en workshops professioneel laten filmen en omzetten naar video-content voor bedrijven.",
  },
];

export function getCategoryBySlug(slug: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.slug === slug);
}

/** Maps a post's display category name (e.g. "SEO & GEO") to its category. */
export function getCategoryByName(name: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.name === name);
}
