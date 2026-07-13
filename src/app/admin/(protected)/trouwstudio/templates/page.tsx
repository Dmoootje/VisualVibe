import { ALBUM_PRESETS } from "@/features/trouwstudio/templates/ivoryEditorial";
import { ALBUM_ACCENT_SWATCHES } from "@/features/trouwstudio/types";

export const dynamic = "force-dynamic";

export default function TrouwstudioTemplatesPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Albumtemplates</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Vijf print-klare A4-stijlen voor het trouwboek, elk beschikbaar in staand en liggend (tien
        selecteerbare templates). De accentkleur kies je per album in de builder; alle stijlen zijn
        datagedreven (kleuren, fonts en lay-outs in procentcoördinaten), dezelfde bron voor de
        preview en de PDF.
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <span className="text-xs uppercase tracking-wide text-white/40">Accentkleuren</span>
        {ALBUM_ACCENT_SWATCHES.map((color) => (
          <span key={color} className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span className="h-4 w-4 rounded-full border border-black/20" style={{ background: color }} />
            {color}
          </span>
        ))}
        <span className="text-[11px] text-white/40">+ eigen kleur per album</span>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {ALBUM_PRESETS.map((preset) => (
          <div key={preset.key} className="rounded-lg border border-amber-500/40 bg-white/[0.04] p-5">
            {/* Miniatuur: kleurstaal + typografie uit de presetdata zelf */}
            <div
              className="mb-4 flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-md border"
              style={{ background: preset.colors.background, borderColor: preset.colors.hairline }}
            >
              <div className="h-16 w-24 rounded-sm" style={{ background: preset.colors.surface }} />
              <span className="text-lg" style={{ color: preset.colors.text, fontFamily: "var(--font-cormorant), serif" }}>
                {preset.name}
              </span>
              <span className="h-px w-10" style={{ background: preset.colors.accent }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: preset.colors.mutedText }}>
                {preset.coverStyle === "framed" ? "ingekaderde cover" : "full-bleed cover"}
              </span>
            </div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="font-semibold">{preset.name}</h2>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                Actief
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/55">{preset.description}</p>
            <p className="mt-3 text-[11px] text-white/40">Staand (210×297 mm) · Liggend (297×210 mm)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
