import { StickyBlogSidebar } from "nova";
import { Search, Monitor } from "lucide-react";

export const Full = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <StickyBlogSidebar
      toc={[
        { id: "intro", label: "Inleiding", level: 2 },
        { id: "wat-is-geo", label: "Wat is GEO?", level: 2 },
        { id: "aeo", label: "AEO in de praktijk", level: 3 },
        { id: "checklist", label: "GEO-checklist", level: 2 },
        { id: "contact", label: "Aan de slag", level: 2 },
      ]}
      cta={{
        title: "Gratis GEO-scan",
        description: "Ontdek hoe AI-proof je website in Limburg is.",
        label: "Vraag scan aan",
        href: "/offerte-aanvragen",
      }}
      service={{
        title: "SEO & GEO",
        description: "Lokale én AI-vindbaarheid voor KMO's in Limburg.",
        href: "/diensten/seo",
        icon: <Search className="h-5 w-5" />,
      }}
    />
  </div>
);

export const TocAndCta = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <StickyBlogSidebar
      toc={[
        { id: "webdesign", label: "Webdesign in Hasselt", level: 2 },
        { id: "snelheid", label: "Core Web Vitals", level: 2 },
        { id: "webshop", label: "Webshops voor KMO's", level: 2 },
      ]}
      cta={{
        title: "Website nodig?",
        description: "Plan een vrijblijvende kennismaking met ons team.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      }}
    />
  </div>
);

export const WithServiceCard = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <StickyBlogSidebar
      toc={[
        { id: "intro", label: "Waarom een snelle site", level: 2 },
        { id: "meten", label: "Snelheid meten", level: 3 },
        { id: "resultaat", label: "Resultaat", level: 2 },
      ]}
      service={{
        title: "Webdesign",
        description: "Snelle, converterende websites voor bedrijven in Genk en omstreken.",
        href: "/diensten/webdesign",
        icon: <Monitor className="h-5 w-5" />,
        linkLabel: "Bekijk webdesign",
      }}
    />
  </div>
);
