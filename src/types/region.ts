export type Region = {
  title: string;
  slug: string;
  type: "province" | "city" | "market";
  country: "BE" | "NL";
  parentRegion?: string;
  intro: string;
  localServices: string[];
  relatedCases: string[];
  relatedSectors: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};
