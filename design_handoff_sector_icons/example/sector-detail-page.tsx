"use client";
/**
 * EXAMPLE - Sector detail page (App Router).
 * Illustrates how the provided components compose. Adapt to your routing/layout.
 * Requires: <SectorIconSprite/> mounted in app/layout.tsx, and visualvibe.css imported globally.
 */
import React from "react";
import { sectorById } from "@/data/sectors";
import { SectorHeroEmblem } from "@/components/SectorIcon";
import { SectorMarquee } from "@/components/SectorMarquee";

export default function SectorDetail({ params }: { params: { slug: string } }) {
  const sector = sectorById(params.slug);
  if (!sector) return null;

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "72px clamp(20px,5vw,64px) 64px", background: "var(--vv-bg)", color: "#fff" }}>
      {/* glow */}
      <div style={{ position: "absolute", top: -140, right: -80, width: 640, height: 640, background: "radial-gradient(circle at center, rgba(242,138,16,0.14), transparent 62%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--vv-text-45)", marginBottom: 22 }}>
            <a href="/sectoren" style={{ color: "inherit" }}>Sectoren</a> / <span style={{ color: "rgba(255,255,255,0.8)" }}>{sector.name}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--vv-accent)" }}>{sector.tag}</span>
          <h1 style={{ fontFamily: "var(--font-sora)", fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.03em", margin: "12px 0 20px" }}>{sector.name}</h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--vv-text-60)", maxWidth: 480, margin: "0 0 32px" }}>{sector.desc}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, color: "#0a0a0a", background: "var(--vv-accent)", padding: "13px 24px", borderRadius: 9999, boxShadow: "0 10px 30px -8px rgba(242,138,16,0.6)" }}>Start je project →</a>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", fontWeight: 600, color: "#fff", padding: "13px 24px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.16)" }}>Bekijk cases</a>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SectorHeroEmblem id={sector.id} />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 1180, margin: "56px auto 0", paddingTop: 28, borderTop: "1px solid var(--vv-line-soft)" }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--vv-text-45)", margin: "0 0 20px" }}>Andere sectoren</p>
        <SectorMarquee exclude={sector.id} />
      </div>
    </section>
  );
}
