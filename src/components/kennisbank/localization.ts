export type KnowledgeBaseLocale = "nl" | "en" | "fr";

const nl = {
  knowledgeBase: "Kennisbank", category: "Categorie", categories: "Categorieën",
  article: "artikel", articles: "artikels", guide: "gids", guides: "gidsen",
  updated: "bijgewerkt", startHere: "Start hier", completeGuide: "Complete gids",
  completeGuides: "Complete gidsen", deepDive: "Verdieping", articlesByQuestion: "Artikels per vraag",
  relatedServices: "Gerelateerde diensten", relatedRegions: "Gerelateerde regio's",
  articlesInSeries: "Artikels in deze reeks", relatedArticles: "Gerelateerde artikels",
  viewService: "Bekijk dienst", readGuide: "Lees de gids", readArticle: "Lees het volledige artikel",
  readingTime: "Leestijd", published: "Gepubliceerd", author: "Auteur", profilePhoto: "Profielfoto van",
  tableOfContents: "Inhoud", inThisArticle: "In dit artikel", beginReading: "Begin met lezen",
  share: "Delen", shareLinkedIn: "Deel op LinkedIn", shareFacebook: "Deel op Facebook", copyLink: "Link kopiëren",
  search: "Zoeken", searchPlaceholder: "Zoeken in kennisbank...", inThisCategory: "In deze categorie",
  clearSearch: "Zoekopdracht wissen",
  otherCategories: "Andere categorieën", discoverService: "Ontdek deze dienst",
} as const;

const en: Record<keyof typeof nl, string> = {
  knowledgeBase: "Knowledge base", category: "Category", categories: "Categories",
  article: "article", articles: "articles", guide: "guide", guides: "guides",
  updated: "updated", startHere: "Start here", completeGuide: "Complete guide",
  completeGuides: "Complete guides", deepDive: "Explore further", articlesByQuestion: "Articles by question",
  relatedServices: "Related services", relatedRegions: "Related regions",
  articlesInSeries: "Articles in this series", relatedArticles: "Related articles",
  viewService: "View service", readGuide: "Read the guide", readArticle: "Read the full article",
  readingTime: "Reading time", published: "Published", author: "Author", profilePhoto: "Profile photo of",
  tableOfContents: "Contents", inThisArticle: "In this article", beginReading: "Start reading",
  share: "Share", shareLinkedIn: "Share on LinkedIn", shareFacebook: "Share on Facebook", copyLink: "Copy link",
  search: "Search", searchPlaceholder: "Search the knowledge base...", inThisCategory: "In this category",
  clearSearch: "Clear search",
  otherCategories: "Other categories", discoverService: "Discover this service",
};

export function knowledgeBaseLabels(locale: string) {
  return locale === "en" ? en : nl;
}
