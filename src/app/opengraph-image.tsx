import { ImageResponse } from "next/og";

export const alt = "VisualVibe — creatief mediabureau in Limburg voor webdesign, SEO, foto en video";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Branded site-wide fallback for Open Graph and Twitter cards.
 * Page-specific Firebase images still take precedence through pageMetadata().
 */
export default function OpenGraphImage() {
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
            "radial-gradient(circle at 84% 18%, rgba(255,122,0,0.34) 0, rgba(255,122,0,0.08) 28%, transparent 52%), linear-gradient(135deg, #080808 0%, #111111 52%, #070707 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to right, black, transparent 78%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 54,
            right: 62,
            width: 210,
            height: 210,
            display: "flex",
            border: "2px solid rgba(255,154,69,0.42)",
            borderRadius: 999,
            boxShadow: "0 0 80px rgba(255,122,0,0.26)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 104,
            right: 112,
            width: 110,
            height: 110,
            display: "flex",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff9a45, #ff5a00)",
            boxShadow: "0 18px 70px rgba(255,90,0,0.38)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            padding: "66px 74px 58px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 18,
                height: 18,
                display: "flex",
                borderRadius: 999,
                background: "linear-gradient(135deg, #ffb16f, #ff6a00)",
                boxShadow: "0 0 24px rgba(255,122,0,0.8)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              VisualVibe
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 860 }}>
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
                fontSize: 68,
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
              paddingTop: 26,
              borderTop: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            <div style={{ display: "flex", gap: 26, color: "rgba(255,255,255,0.78)", fontSize: 23 }}>
              <span>Webdesign</span>
              <span>SEO & GEO</span>
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
    size,
  );
}
