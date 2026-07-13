"use client";

import { useRef, useState } from "react";
import { Upload, RotateCcw, ImageOff } from "lucide-react";
import type { WeddingVibeContent } from "@/lib/firestore/weddingvibe";
import {
  WEDDINGVIBE_IMAGE_SLOTS,
  DEFAULT_WEDDINGVIBE_IMAGES,
  type WeddingVibePricing,
} from "@/features/weddingvibe/config/imageSlots";
import { saveWeddingVibeImage, saveWeddingVibePricingAction } from "@/lib/admin/weddingvibeActions";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-amber-500/70";

async function uploadOne(file: File, key: string): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("key", key);
  body.append("scope", "weddingvibe");
  const res = await fetch("/api/admin/upload/", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload mislukt.");
  return data.url;
}

export function WeddingVibeManager({ initialContent }: { initialContent: WeddingVibeContent }) {
  const [pricing, setPricing] = useState<WeddingVibePricing>(initialContent.pricing);
  const [prijzenTonen, setPrijzenTonen] = useState(initialContent.prijzenTonen);
  const [pricingStatus, setPricingStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pricingBusy, setPricingBusy] = useState(false);

  const [overrides, setOverrides] = useState<Record<string, string>>(initialContent.images);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<{ slot: string; text: string } | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const savePricing = async () => {
    setPricingBusy(true);
    setPricingStatus(null);
    const result = await saveWeddingVibePricingAction(pricing, prijzenTonen);
    setPricingBusy(false);
    setPricingStatus(
      result.ok
        ? { type: "ok", text: "Prijzen opgeslagen. Binnen een minuut live." }
        : { type: "error", text: result.error ?? "Opslaan mislukt." },
    );
  };

  const handleFile = async (slot: string, file: File | undefined) => {
    if (!file) return;
    setBusySlot(slot);
    setSlotError(null);
    try {
      const url = await uploadOne(file, `weddingvibe-${slot}`);
      const result = await saveWeddingVibeImage(slot, url);
      if (!result.ok) throw new Error(result.error ?? "Opslaan mislukt.");
      setOverrides((prev) => ({ ...prev, [slot]: url }));
    } catch (err) {
      setSlotError({ slot, text: err instanceof Error ? err.message : "Upload mislukt." });
    } finally {
      setBusySlot(null);
      const input = fileInputs.current[slot];
      if (input) input.value = "";
    }
  };

  const resetSlot = async (slot: string) => {
    setBusySlot(slot);
    setSlotError(null);
    const result = await saveWeddingVibeImage(slot, "");
    if (result.ok) {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
    } else {
      setSlotError({ slot, text: result.error ?? "Terugzetten mislukt." });
    }
    setBusySlot(null);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ===== Prijzen ===== */}
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold mb-1">Investeringstabel</h2>
        <p className="mb-5 text-sm text-white/50">
          Vanaf-prijzen van de drie pakketten. Uitgeschakeld toont de pagina &quot;Prijs op aanvraag&quot;.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["fotografie", "Fotografie"],
              ["film", "Film"],
              ["combo", "Foto & video"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1.5 text-sm text-white/70">
              {label}
              <input
                type="text"
                value={pricing[key]}
                onChange={(e) => setPricing((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="bv. €2.150"
                className={inputClasses}
              />
            </label>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2.5 text-sm text-white/70">
          <input
            type="checkbox"
            checked={prijzenTonen}
            onChange={(e) => setPrijzenTonen(e.target.checked)}
            className="h-4 w-4 accent-amber-500"
          />
          Vanaf-prijzen tonen (uit = &quot;Prijs op aanvraag&quot;)
        </label>
        <div className="mt-5 flex items-center gap-4">
          <button
            type="button"
            onClick={savePricing}
            disabled={pricingBusy}
            className="rounded-md bg-amber-500/90 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
          >
            {pricingBusy ? "Opslaan..." : "Prijzen opslaan"}
          </button>
          {pricingStatus && (
            <span className={`text-sm ${pricingStatus.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
              {pricingStatus.text}
            </span>
          )}
        </div>
      </section>

      {/* ===== Beelden ===== */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Beelden op de pagina</h2>
        <p className="mb-5 max-w-2xl text-sm text-white/50">
          Elk vak is één beeld op de pagina, in volgorde van boven naar beneden. Upload een foto
          (max 8 MB; wordt automatisch webp) of zet een vak terug naar het standaardbeeld.
        </p>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {WEDDINGVIBE_IMAGE_SLOTS.map((def) => {
            const override = overrides[def.slot];
            const src = override || DEFAULT_WEDDINGVIBE_IMAGES[def.slot] || "";
            const busy = busySlot === def.slot;
            return (
              <div key={def.slot} className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-white/5">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={def.label} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/30">
                      <ImageOff className="h-6 w-6" />
                      <span className="text-[11px]">Nog geen beeld</span>
                    </div>
                  )}
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      override
                        ? "bg-emerald-500/20 text-emerald-300"
                        : src
                          ? "bg-white/10 text-white/55"
                          : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {override ? "Eigen" : src ? "Standaard" : "Leeg"}
                  </span>
                  {busy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white/80">
                      Bezig...
                    </div>
                  )}
                </div>
                <div className="mb-1 text-[13px] font-semibold leading-snug text-white/85">{def.label}</div>
                <div className="mb-3 text-[11px] text-white/40">Verhouding op pagina: {def.ratio}</div>
                <div className="mt-auto flex items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10">
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                    <input
                      ref={(el) => {
                        fileInputs.current[def.slot] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={busy}
                      onChange={(e) => handleFile(def.slot, e.target.files?.[0])}
                    />
                  </label>
                  {override && (
                    <button
                      type="button"
                      onClick={() => resetSlot(def.slot)}
                      disabled={busy}
                      title="Terug naar standaardbeeld"
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 disabled:opacity-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  )}
                </div>
                {slotError?.slot === def.slot && (
                  <p className="mt-2 text-[11.5px] text-red-400">{slotError.text}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
