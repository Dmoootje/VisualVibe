import { FeatureGrid, FeatureCard } from "nova";
import { Search, Camera, Box } from "lucide-react";

export const WithIcon = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 620 }}>
    <FeatureGrid columns={2}>
      <FeatureCard icon={Search} title="SEO &amp; GEO">
        Vindbaar in Google én AI voor je zaak in Genk of Tongeren.
      </FeatureCard>
      <FeatureCard icon={Camera} title="Fotografie">
        Professioneel merkbeeld dat converteert.
      </FeatureCard>
    </FeatureGrid>
  </div>
);

export const IconOnlyAndTextless = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 620 }}>
    <FeatureGrid columns={2}>
      <FeatureCard icon={Box} title="3D, VR &amp; AR">
        Immersieve productvisualisaties en virtuele rondleidingen.
      </FeatureCard>
      <FeatureCard title="Zonder icoon">
        Een feature-kaart zonder icoon blijft toch netjes uitgelijnd.
      </FeatureCard>
    </FeatureGrid>
  </div>
);
