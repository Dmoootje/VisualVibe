export type ToolCard = {
  id: "website-analyse" | "seo-geo-checklist";
  name: string;
  href: string;
  icon: string;
  tag: string;
  desc: string;
  cta: string;
  previewTitle: string;
  previewText: string;
  previewPoints: string[];
};

export const toolCards: ToolCard[] = [
  {
    id: "website-analyse",
    name: "Website analyse",
    href: "/website-analyse",
    icon: "seo",
    tag: "Gratis scan",
    desc: "Laat je website controleren op SEO, snelheid, techniek, content en AI-vindbaarheid.",
    cta: "Start gratis analyse",
    previewTitle: "Gratis rapport op 100",
    previewText: "Een duidelijke score, meldingen per onderdeel en tips die je meteen kunt openklikken.",
    previewPoints: ["SEO & techniek", "Core Web Vitals", "AI-vindbaarheid"],
  },
  {
    id: "seo-geo-checklist",
    name: "SEO/GEO checklist",
    href: "/tools/seo-geo-checklist",
    icon: "checklist",
    tag: "Aanvinkbaar + PDF",
    desc: "Controleer je pagina stap voor stap en download je gekozen punten als VisualVibe PDF.",
    cta: "Maak je checklist",
    previewTitle: "Checklist voor Google en AI",
    previewText: "Vink af wat klaar is, zie je voortgang en neem een branded PDF mee voor jezelf of je team.",
    previewPoints: ["Technische SEO", "AEO/GEO", "Structured data"],
  },
];
