import { RelatedServices } from "nova";
import { Search, PenTool, Camera, Video, Plane, Mic } from "lucide-react";

export const Default = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <RelatedServices
      title="Gerelateerde diensten"
      items={[
        {
          title: "SEO & GEO",
          href: "/diensten/seo",
          description: "Vindbaar in Google én AI-zoekmachines.",
          icon: Search,
        },
        {
          title: "Webdesign",
          href: "/diensten/webdesign",
          description: "Snelle, converterende websites op maat.",
          icon: PenTool,
        },
        {
          title: "Fotografie",
          href: "/diensten/fotografie",
          description: "Sterk merkbeeld voor je bedrijf in Limburg.",
          icon: Camera,
        },
        {
          title: "Videografie",
          href: "/diensten/videografie",
          description: "Bedrijfsvideo, drone en FPV productie.",
          icon: Video,
        },
      ]}
    />
  </div>
);

export const CompactPair = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 760 }}>
    <RelatedServices
      title="Ook interessant voor jou"
      items={[
        {
          title: "Drone & FPV",
          href: "/diensten/drone-fpv",
          description: "Luchtbeelden met vergunning in heel Limburg.",
          icon: Plane,
        },
        {
          title: "Podcasting",
          href: "/diensten/podcasting",
          description: "Opname, montage en distributie.",
          icon: Mic,
        },
      ]}
    />
  </div>
);
