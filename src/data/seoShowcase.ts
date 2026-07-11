// SEO-realisaties shown on the SEO service page (design_handoff_seo_service).
// These reference existing webdesign projects by id; the card shows an SEO/GEO
// badge plus SEO-specific tags/teaser, while the detail modal reuses the full
// project data from webdesignProjects. Order = display order.

export type SeoCase = {
  /** Matches a WebdesignProject id (for the modal + thumbnail image). */
  id: string;
  /** Gradient badge top-left, e.g. "SEO · GEO" or "SEO". */
  badge: string;
  /** SEO-focused tag pills on the card. */
  tags: string[];
  /** SEO-focused teaser under the project name. */
  teaser: string;
};

export const seoCases: SeoCase[] = [
  {
    id: "gordijnenmyriam",
    badge: "SEO · GEO",
    tags: ["Lokale SEO", "GEO / AI"],
    teaser:
      "Lokale SEO én zichtbaarheid in AI-zoekmachines, met op maat gemaakte realisatiepagina's.",
  },
  {
    id: "nozeco",
    badge: "SEO",
    tags: ["SEO", "Offerte"],
    teaser: "SEO-gericht op “zonnepanelen” en “EV laadstations” met een gedetailleerd dienstenaanbod.",
  },
  {
    id: "horsespa",
    badge: "SEO",
    tags: ["SEO", "Galerij"],
    teaser: "SEO-gericht op “mobile spa voor paarden” en “behandelingen staldieren”.",
  },
];
