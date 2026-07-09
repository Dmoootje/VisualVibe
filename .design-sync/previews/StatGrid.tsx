import { StatGrid } from "nova";

export const ThreeColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <StatGrid
      columns={3}
      stats={[
        { value: "58%", label: "Zoekopdrachten", description: "eindigt zonder klik" },
        { value: "3x", label: "Meer citaties", description: "met structured data" },
        { value: "2026", label: "Kantelpunt", description: "AI-first zoeken" },
      ]}
    />
  </div>
);

export const TwoColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 520 }}>
    <StatGrid
      columns={2}
      stats={[
        { value: "0,9s", label: "Laadtijd", description: "gemiddelde LCP na optimalisatie" },
        { value: "+142%", label: "Aanvragen", description: "meer offertes in zes maanden" },
      ]}
    />
  </div>
);

export const FourColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <StatGrid
      columns={4}
      stats={[
        { value: "12", label: "Steden", description: "in Limburg bediend" },
        { value: "85+", label: "Projecten", description: "voor KMO's opgeleverd" },
        { value: "4K", label: "Drone", description: "beeld in FPV-kwaliteit" },
        { value: "100/100", label: "Snelheid", description: "PageSpeed-score" },
      ]}
    />
  </div>
);

export const ValueOnly = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 720 }}>
    <StatGrid
      columns={3}
      stats={[
        { value: "10 jaar", label: "Ervaring" },
        { value: "3 talen", label: "NL, FR en EN" },
        { value: "24u", label: "Reactietijd" },
      ]}
    />
  </div>
);
