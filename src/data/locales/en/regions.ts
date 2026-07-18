import type { Region } from "@/types";

export type EnglishRegionLocaleRecord = Omit<Region, "slug" | "intro"> & {
  displaySlug: string;
  summary: string;
  body: string;
  directAnswer: string;
  intro: string;
  cta: { title: string; description: string; label: string; href: string };
  imageAlt: string;
  internalLinks: { href: string; label: string }[];
};

const quotationCta = (region: string) => ({
  title: `Planning a project in ${region}?`,
  description:
    "Tell us where your business is based and what you want to achieve. We will propose an approach suited to your region, sector and project.",
  label: "Request a quotation",
  href: "/en/request-a-quotation/",
});

export const englishRegionEditorial: Record<string, EnglishRegionLocaleRecord> = {
  limburg: {
    displaySlug: "limburg-belgium",
    title: "Limburg, Belgium",
    type: "province",
    country: "BE",
    summary: "VisualVibe's home region for web design, SEO and visual media.",
    intro:
      "Limburg, Belgium, is VisualVibe's home region. From Hasselt and Genk to Bilzen and Sint-Truiden, we understand the local market and create websites, photography and video that help local SMEs communicate clearly.",
    body:
      "VisualVibe supports businesses across Limburg, Belgium, with web design, local SEO, photography, videography, drone and FPV production, and interactive 3D tours. Working from within the province gives us practical knowledge of its towns, audiences and business landscape without limiting projects to one municipality.",
    directAnswer:
      "VisualVibe works throughout Limburg, Belgium, including Hasselt, Genk, Bilzen and Sint-Truiden.",
    localServices: ["webdesign", "seo", "fotografie", "videografie", "drone-fpv", "3d-vr-ar"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Web Design, Photography and Video in Limburg | VisualVibe",
      description:
        "Creative media agency in Limburg, Belgium, for web design, SEO, photography, video, drone and 3D tours for SMEs across the province.",
      keywords: ["creative media agency Limburg Belgium", "web design Limburg Belgium", "corporate photographer Limburg", "videographer Limburg"],
    },
    cta: quotationCta("Limburg, Belgium"),
    imageAlt: "Map highlighting VisualVibe's service area in Limburg, Belgium",
    internalLinks: [
      { href: "/en/services/", label: "services" },
      { href: "/en/request-a-quotation/", label: "request a quotation" },
    ],
  },
  vlaanderen: {
    displaySlug: "flanders",
    title: "Flanders",
    type: "market",
    country: "BE",
    summary: "Web design and visual media for businesses across Flanders.",
    intro:
      "From our base in Limburg, Belgium, VisualVibe works with businesses across Flanders on web design, photography, videography and SEO shaped around their region, sector and audience.",
    body:
      "VisualVibe brings web design, SEO and visual production together for projects throughout Flanders. Photography and video take place on location, while each website and content project is planned around the business, its audience and the geographic markets it genuinely serves.",
    directAnswer:
      "From its base in Limburg, VisualVibe works with businesses throughout Flanders.",
    localServices: ["webdesign", "seo", "fotografie", "videografie"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Creative Media Agency in Flanders | VisualVibe",
      description:
        "VisualVibe supports businesses across Flanders with web design, SEO, photography and video tailored to their region, sector and audience.",
      keywords: ["creative media agency Flanders", "web design Flanders"],
    },
    cta: quotationCta("Flanders"),
    imageAlt: "Map highlighting VisualVibe's service area across Flanders",
    internalLinks: [
      { href: "/en/services/", label: "services" },
      { href: "/en/request-a-quotation/", label: "request a quotation" },
    ],
  },
  antwerpen: {
    displaySlug: "antwerp-province",
    title: "Antwerp province",
    type: "market",
    country: "BE",
    summary: "Web design, photography and video for businesses in Antwerp province.",
    intro:
      "VisualVibe supports businesses in Antwerp province with web design, photography, videography and drone footage.",
    body:
      "Businesses in Antwerp province can work with one creative team for their website and visual content. We plan photography, video and suitable drone work around the location, while web projects connect the offer, audience and regional search context in one coherent online presence.",
    directAnswer:
      "VisualVibe supports businesses across Antwerp province with web design, photography, video and drone footage.",
    localServices: ["webdesign", "fotografie", "videografie", "drone-fpv"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Web Design and Photography in Antwerp | VisualVibe",
      description:
        "Web design, photography, video and drone footage for businesses in Antwerp province, delivered by one creative media team.",
      keywords: ["web design Antwerp", "corporate photographer Antwerp", "videographer Antwerp"],
    },
    cta: quotationCta("Antwerp province"),
    imageAlt: "Map highlighting VisualVibe's service area in Antwerp province",
    internalLinks: [
      { href: "/en/services/", label: "services" },
      { href: "/en/request-a-quotation/", label: "request a quotation" },
    ],
  },
  "nederlands-limburg": {
    displaySlug: "dutch-limburg",
    title: "Dutch Limburg",
    type: "market",
    country: "NL",
    summary: "Web design and visual media for businesses in the Dutch province of Limburg.",
    intro:
      "Just across the border, VisualVibe helps businesses in the Dutch province of Limburg present themselves through strong websites, photography and video.",
    body:
      "VisualVibe works across the border with businesses in Dutch Limburg. We combine web design with photography, videography and suitable drone footage, while keeping the regional and national context distinct from Limburg, Belgium, in both content and search metadata.",
    directAnswer:
      "VisualVibe works with businesses in Dutch Limburg, from Maastricht to Venlo and Weert.",
    localServices: ["webdesign", "fotografie", "videografie", "drone-fpv"],
    relatedCases: [],
    relatedSectors: [],
    seo: {
      title: "Web Design and Photography in Dutch Limburg | VisualVibe",
      description:
        "Web design, photography, video and drone footage for businesses in Dutch Limburg, from Maastricht to Venlo and Weert.",
      keywords: ["web design Dutch Limburg", "corporate photographer Dutch Limburg"],
    },
    cta: quotationCta("Dutch Limburg"),
    imageAlt: "Map highlighting VisualVibe's service area in Dutch Limburg",
    internalLinks: [
      { href: "/en/services/", label: "services" },
      { href: "/en/request-a-quotation/", label: "request a quotation" },
    ],
  },
};
