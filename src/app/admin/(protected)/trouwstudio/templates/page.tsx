import { WEDDING_ALBUM_TEMPLATES } from "@/features/trouwstudio/templates/ivoryEditorial";

export const dynamic = "force-dynamic";

export default function TrouwstudioTemplatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Albumtemplates</h1>
      <p className="mb-8 max-w-2xl text-sm text-white/55">
        Datagedreven templates voor het trouwboek. Ivory Editorial is actief; de overige stijlen
        staan gepland en zijn hier alvast aangekondigd.
      </p>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {WEDDING_ALBUM_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`rounded-lg border p-5 ${
              template.available ? "border-amber-500/40 bg-white/[0.04]" : "border-white/10 bg-white/[0.02] opacity-70"
            }`}
          >
            {/* Miniatuur: kleurstaal + typografie uit de templatedata zelf */}
            <div
              className="mb-4 flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-md border"
              style={{ background: template.colors.background, borderColor: template.colors.hairline }}
            >
              <div className="h-16 w-24 rounded-sm" style={{ background: template.colors.surface }} />
              <span className="text-lg" style={{ color: template.colors.text, fontFamily: "var(--font-cormorant), serif" }}>
                {template.name}
              </span>
              <span className="h-px w-10" style={{ background: template.colors.accent }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: template.colors.mutedText }}>
                {template.format} · {template.orientation === "portrait" ? "staand" : "liggend"}
              </span>
            </div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="font-semibold">{template.name}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  template.available ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"
                }`}
              >
                {template.available ? "Actief" : "Binnenkort"}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/55">{template.description}</p>
            <p className="mt-3 text-[11px] text-white/40">
              {template.pageWidth}×{template.pageHeight} mm · marge {template.margins} mm
              {template.bleed ? ` · afloop ${template.bleed} mm` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
