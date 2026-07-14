import { ImageResponse } from "next/og";

const SIZE = {
  width: 1200,
  height: 630,
};

export const dynamic = "force-static";

/**
 * Branded fallback image for pages that have no dedicated social image.
 * It intentionally lives behind /api/og rather than the opengraph-image file
 * convention, so page-specific metadata can never be overridden by inheritance.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "white",
          background:
            "radial-gradient(circle at 86% 18%, rgba(255,122,0,0.38) 0%, rgba(255,122,0,0.10) 28%, transparent 53%), linear-gradient(135deg, #080808 0%, #151515 55%, #080808 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.14,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 46,
            right: 52,
            width: 224,
            height: 224,
            display: "flex",
            border: "2px solid rgba(255,154,69,0.42)",
            borderRadius: 999,
            boxShadow: "0 0 84px rgba(255,122,0,0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 104,
            right: 110,
            width: 108,
            height: 108,
            display: "flex",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ffb16f, #ff6500)",
            boxShadow: "0 18px 70px rgba(255,90,0,0.40)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            padding: "64px 72px 54px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 17 }}>
            <div
              style={{
                width: 18,
                height: 18,
                display: "flex",
                borderRadius: 999,
                background: "linear-gradient(135deg, #ffb16f, #ff6500)",
                boxShadow: "0 0 24px rgba(255,122,0,0.82)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              VisualVibe
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 870 }}>
            <div
              style={{
                display: "flex",
                marginBottom: 18,
                color: "#ff9a45",
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Creatief mediabureau in Limburg
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 67,
                lineHeight: 1.03,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}
            >
              Sterke merken worden gezien, gevonden en onthouden.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 25,
              borderTop: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 24,
                color: "rgba(255,255,255,0.78)",
                fontSize: 22,
              }}
            >
              <span>Webdesign</span>
              <span>SEO &amp; GEO</span>
              <span>Fotografie</span>
              <span>Video</span>
              <span>Apps</span>
            </div>
            <div style={{ display: "flex", color: "#ff9a45", fontSize: 22, fontWeight: 700 }}>
              visualvibe.media
            </div>
          </div>
        </div>
      </div>
    ),
    SIZE,
  );
}
