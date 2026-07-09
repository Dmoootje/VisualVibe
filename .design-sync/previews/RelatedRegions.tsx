import { RelatedRegions } from "nova";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <RelatedRegions
      items={[
        { name: "Hasselt", href: "/regio/hasselt" },
        { name: "Genk", href: "/regio/genk" },
        { name: "Bilzen-Hoeselt", href: "/regio/bilzen-hoeselt" },
        { name: "Tongeren", href: "/regio/tongeren-borgloon" },
        { name: "Sint-Truiden", href: "/regio/sint-truiden" },
        { name: "Maasmechelen", href: "/regio/maasmechelen" },
      ]}
    />
  </div>
);

export const CustomTitle = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <RelatedRegions
      title="Ook actief in Nederlands-Limburg"
      items={[
        { name: "Maastricht", href: "/regio/maastricht" },
        { name: "Sittard-Geleen", href: "/regio/sittard-geleen" },
        { name: "Roermond", href: "/regio/roermond" },
        { name: "Venlo", href: "/regio/venlo" },
      ]}
    />
  </div>
);
