import { GlowFrame } from "nova";
import { Camera, ArrowRight } from "lucide-react";

const heroImage =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Fwebsite-laten-maken-limburg-hero.webp?alt=media&token=2434bbf7-60c1-48c6-bca4-7b55e29a8f31";

export const WithImage = () => (
  <div style={{ padding: 24, maxWidth: 520 }}>
    <GlowFrame>
      <figure style={{ margin: 0, padding: 12 }}>
        <img
          src={heroImage}
          alt="Website laten maken in Limburg"
          style={{ display: "block", width: "100%", borderRadius: 12 }}
        />
        <figcaption
          style={{
            marginTop: 12,
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Nieuwe website voor een KMO uit Genk, gebouwd door VisualVibe.
        </figcaption>
      </figure>
    </GlowFrame>
  </div>
);

export const ServiceCardInside = () => (
  <div style={{ padding: 24, maxWidth: 360 }}>
    <GlowFrame>
      <div style={{ padding: 24 }}>
        <span
          style={{
            display: "inline-flex",
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            color: "#fcd34d",
            background: "rgba(245,158,11,0.14)",
          }}
        >
          <Camera className="h-5 w-5" />
        </span>
        <p
          style={{
            marginTop: 14,
            marginBottom: 6,
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Fotografie in Hasselt
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Sfeervolle bedrijfs- en productfotografie die jouw merk in Limburg
          laat opvallen.
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 16,
            fontSize: 14,
            color: "#fbbf24",
          }}
        >
          Bekijk onze fotografie
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </GlowFrame>
  </div>
);

export const StatHighlight = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <GlowFrame>
      <div style={{ padding: 24, textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fbbf24",
          }}
        >
          +180%
        </p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          organisch verkeer voor een horecazaak uit Tongeren na onze lokale
          SEO-aanpak.
        </p>
      </div>
    </GlowFrame>
  </div>
);
