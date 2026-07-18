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
      "Alles over professionele websites, WordPress, webshops, snelheid, conversie en techniek voor KMO's.",
    seoTitle: "Webdesign en WordPress voor KMO's | VisualVibe",
    seoDescription:
      "Praktische gidsen over websites, WordPress, onderhoud, webshops, snelheid en conversie voor KMO's die digitaal willen groeien.",
  },
  {
    slug: "software-op-maat",
    name: "Apps & software",
    description:
      "Praktische gidsen over apps, webapplicaties, AI-software en automatisering op maat voor KMO's.",
    seoTitle: "Apps en software op maat voor KMO's | VisualVibe",
    seoDescription:
      "Ontdek hoe je een app, webapplicatie, AI-oplossing of automatisering op maat plant, bouwt, lanceert en veilig laat doorgroeien.",
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
      "Praktische gidsen over dronefotografie, dronevideo en FPV voor vastgoed, bouw, bedrijfsvideo's en veilige producties.",
    seoTitle: "Drone & FPV voor bedrijven: praktische gidsen | VisualVibe",
    seoDescription:
      "Ontdek hoe je dronefoto, dronevideo en FPV inzet voor vastgoed, bouw en bedrijfsvideo's, met aandacht voor planning, veiligheid, privacy en actuele regels.",
  },
  {
    slug: "3d-vr",
    name: "3D & VR",
    description:
      "Praktische gidsen over 3D-tours en virtuele rondleidingen voor showrooms, horeca, vastgoed en vertrouwen.",
    seoTitle: "3D-tours voor bedrijven: praktische gidsen | VisualVibe",
    seoDescription:
      "Ontdek hoe je een 3D-tour of virtuele rondleiding inzet voor showrooms, horeca en vastgoed, met aandacht voor voorbereiding, privacy, hosting en vertrouwen.",
  },
  {
    slug: "podcasting",
    name: "Podcasting",
    description:
      "Praktische gidsen over bedrijfspodcasts, videopodcasts, opname, publicatie en hergebruik als content.",
    seoTitle: "Podcasting voor bedrijven: praktische gidsen | VisualVibe",
    seoDescription:
      "Leer hoe je een bedrijfspodcast of videopodcast plant, opneemt, publiceert en hergebruikt, van format en techniek tot distributie, rechten en social content.",
  },
  {
    slug: "masterclasses",
    name: "Masterclasses",
    description:
      "Praktische gidsen over online cursussen, masterclasses en workshops: van leerontwerp en opname tot publicatie, hergebruik en onderhoud.",
    seoTitle: "Masterclasses en online cursussen filmen | VisualVibe",
    seoDescription:
      "Leer hoe je een online cursus, opleiding, masterclass of workshop doelgericht ontwerpt, professioneel filmt, toegankelijk publiceert en slim hergebruikt.",
  },
];

const englishKennisbankCategories: Record<string, Omit<KennisbankCategory, "slug">> = {
  "seo-geo": {
    name: "SEO & GEO",
    description: "Practical guides to local SEO, AEO, GEO, AI search visibility and online visibility for SMEs.",
    seoTitle: "SEO & GEO guides for SMEs | VisualVibe knowledge base",
    seoDescription: "Learn how local SEO, AEO and GEO help SMEs become more visible in Google and AI-generated search results.",
  },
  webdesign: {
    name: "Web design",
    description: "Practical guides to professional websites, WordPress, e-commerce, performance, conversion and technology for SMEs.",
    seoTitle: "Web design and WordPress guides for SMEs | VisualVibe",
    seoDescription: "Practical advice about websites, WordPress, maintenance, e-commerce, performance and conversion for ambitious SMEs.",
  },
  "software-op-maat": {
    name: "Apps & software",
    description: "Practical guides to apps, web applications, AI software and tailored automation for SMEs.",
    seoTitle: "Custom apps and software for SMEs | VisualVibe",
    seoDescription: "Learn how to plan, build, launch and safely scale a custom app, web application, AI solution or automation.",
  },
  fotografie: {
    name: "Photography",
    description: "Tips and practical photography guides for corporate, product, event and property photography.",
    seoTitle: "Photography guides for SMEs | VisualVibe knowledge base",
    seoDescription: "Practical photography advice for SMEs, from corporate and product photography to events and property.",
  },
  videografie: {
    name: "Videography",
    description: "Practical guides to choosing the right video format and planning scripts, production, distribution and results.",
    seoTitle: "Videography for SMEs: practical guides | VisualVibe",
    seoDescription: "Learn how to plan, produce, publish and measure corporate videos, social videos, aftermovies, recruitment videos and testimonials.",
  },
  drone: {
    name: "Drone & FPV",
    description: "Practical guides to drone photography, drone video and FPV for property, construction and corporate productions.",
    seoTitle: "Drone & FPV for businesses: practical guides | VisualVibe",
    seoDescription: "Learn how to use drone photography, drone video and FPV safely for property, construction and corporate video.",
  },
  "3d-vr": {
    name: "3D & VR",
    description: "Practical guides to 3D tours and virtual visits for showrooms, hospitality, property and customer confidence.",
    seoTitle: "3D tours for businesses: practical guides | VisualVibe",
    seoDescription: "Learn how to use a 3D tour or virtual visit for showrooms, hospitality and property, including preparation, privacy and hosting.",
  },
  podcasting: {
    name: "Podcasting",
    description: "Practical guides to business podcasts, video podcasts, recording, publishing and repurposing content.",
    seoTitle: "Podcasting for businesses: practical guides | VisualVibe",
    seoDescription: "Learn how to plan, record, publish and repurpose a business podcast or video podcast, from format and technology to distribution.",
  },
  masterclasses: {
    name: "Masterclasses",
    description: "Practical guides to online courses, masterclasses and workshops, from learning design and recording to publication and maintenance.",
    seoTitle: "Filming masterclasses and online courses | VisualVibe",
    seoDescription: "Learn how to design, professionally film, publish and maintain an accessible online course, masterclass or workshop.",
  },
};

export function getLocalizedKennisbankCategoryById(
  id: string,
  locale: string,
): KennisbankCategory {
  const source = getCategoryBySlug(id);
  if (!source) throw new Error(`Unknown knowledge-base category ID: ${id}`);
  if (locale !== "en") return source;
  const translated = englishKennisbankCategories[id];
  if (!translated) throw new Error(`Missing en translation for knowledge-base category.${id}`);
  return { slug: source.slug, ...translated };
}

export function getCategoryBySlug(slug: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.slug === slug);
}

/** Maps a post's display category name (e.g. "SEO & GEO") to its category. */
export function getCategoryByName(name: string): KennisbankCategory | undefined {
  return kennisbankCategories.find((category) => category.name === name);
}
