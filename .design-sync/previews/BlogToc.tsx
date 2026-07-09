import { BlogToc } from "nova";

export const Default = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <BlogToc
      items={[
        { id: "intro", label: "Wat is lokale SEO?", level: 2 },
        { id: "waarom", label: "Waarom Limburg-first", level: 2 },
        { id: "aanpak", label: "Onze aanpak", level: 2 },
        { id: "contact", label: "Aan de slag", level: 2 },
      ]}
    />
  </div>
);

export const WithActiveItem = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <BlogToc
      activeId="geo"
      items={[
        { id: "seo", label: "Klassieke SEO", level: 2 },
        { id: "geo", label: "Wat is GEO?", level: 2 },
        { id: "aeo", label: "AEO in de praktijk", level: 2 },
        { id: "checklist", label: "GEO-checklist", level: 2 },
      ]}
    />
  </div>
);

export const NestedLevels = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <BlogToc
      activeId="webshop"
      title="In dit artikel"
      items={[
        { id: "webdesign", label: "Webdesign in Hasselt", level: 2 },
        { id: "responsive", label: "Responsive ontwerp", level: 3 },
        { id: "webshop", label: "Webshops voor KMO's", level: 3 },
        { id: "snelheid", label: "Core Web Vitals", level: 2 },
        { id: "onderhoud", label: "Onderhoud en support", level: 2 },
      ]}
    />
  </div>
);
