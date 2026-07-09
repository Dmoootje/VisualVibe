import { FeatureGrid, FeatureCard } from "nova";
import { PenTool, Search, Camera, Video, Plane, Mic } from "lucide-react";

export const ThreeColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <FeatureGrid columns={3}>
      <FeatureCard icon={PenTool} title="Webdesign">
        Snelle, converterende websites op maat voor KMO&apos;s in Limburg.
      </FeatureCard>
      <FeatureCard icon={Search} title="SEO &amp; GEO">
        Vindbaar in Google én in AI-zoekmachines zoals ChatGPT.
      </FeatureCard>
      <FeatureCard icon={Camera} title="Fotografie">
        Beeld dat je merk versterkt, van product tot bedrijfsreportage.
      </FeatureCard>
    </FeatureGrid>
  </div>
);

export const TwoColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 620 }}>
    <FeatureGrid columns={2}>
      <FeatureCard icon={Video} title="Videografie">
        Bedrijfsvideo, sfeerbeeld en socialecontent uit Hasselt.
      </FeatureCard>
      <FeatureCard icon={Plane} title="Drone &amp; FPV">
        Luchtbeelden en dynamische FPV-vluchten met vergunning.
      </FeatureCard>
    </FeatureGrid>
  </div>
);

export const FourColumns = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 900 }}>
    <FeatureGrid columns={4}>
      <FeatureCard icon={PenTool} title="Webdesign">
        Websites op maat.
      </FeatureCard>
      <FeatureCard icon={Search} title="SEO">
        Lokale vindbaarheid.
      </FeatureCard>
      <FeatureCard icon={Camera} title="Fotografie">
        Sterk merkbeeld.
      </FeatureCard>
      <FeatureCard icon={Mic} title="Podcasting">
        Opname en montage.
      </FeatureCard>
    </FeatureGrid>
  </div>
);
