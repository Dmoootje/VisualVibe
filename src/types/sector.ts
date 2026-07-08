export type Sector = {
  title: string;
  slug: string;
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
