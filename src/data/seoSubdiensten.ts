import type { Subdienst } from "@/components/subdiensten";

// De 5 SEO-subdiensten als ghost-glyph kaarten op de SEO-dienstenpagina. `id`
// verwijst naar het lijn-icoon (zie components/subdiensten/icons.tsx), `href`
// linkt naar de subdienstpagina.
export const seoSubdiensten: Subdienst[] = [
  {
    id: "seo-lokaal",
    name: "Lokale SEO",
    desc: "Beter vindbaar worden voor klanten die in jouw regio zoeken.",
    href: "/diensten/seo/lokale-seo",
  },
  {
    id: "seo-technisch",
    name: "Technische SEO",
    desc: "Snelheid, structuur en indexering: de technische basis onder je vindbaarheid.",
    href: "/diensten/seo/technische-seo",
  },
  {
    id: "seo-copy",
    name: "SEO-copywriting",
    desc: "Content die zowel je klant als Google en AI-zoekmachines overtuigt.",
    href: "/diensten/seo/seo-copywriting",
  },
  {
    id: "seo-gbp",
    name: "Google Business Profiel",
    desc: "Je Google-vermelding optimaal ingesteld voor lokale zichtbaarheid.",
    href: "/diensten/seo/google-business-profiel-optimalisatie",
  },
  {
    id: "seo-ai",
    name: "AI SEO / AEO / GEO",
    desc: "Vindbaar en aanbevolen worden in ChatGPT, Perplexity en Google AI Overviews.",
    href: "/diensten/seo/ai-seo-aeo-geo",
  },
];
