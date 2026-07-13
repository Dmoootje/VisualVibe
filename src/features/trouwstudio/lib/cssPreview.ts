import { NEUTRAL_ADJUSTMENTS, type PhotoAdjustments } from "../types";

// Client-side livepreview van de niet-destructieve instellingen als
// CSS-filterketen. Dit is een BENADERING van de sharp-exportpipeline
// (imageProcessing.ts): belichting, contrast, verzadiging, temperatuur en
// vignet komen goed overeen; clarity/texture/ruis zijn in de preview niet
// zichtbaar. De definitieve weergave is de server-side "Afwerken"-render.

export function adjustmentsToCssFilter(adjustments: Partial<PhotoAdjustments>): string {
  const a = { ...NEUTRAL_ADJUSTMENTS, ...adjustments };
  const brightness = 1 + a.exposure / 200 + a.whites / 600 - a.blacks / 600 + a.gamma / 400;
  const contrast = 1 + a.contrast / 150 + a.highlights / 500 - a.shadows / 500;
  const saturate = Math.max(0, 1 + (a.saturation + a.vibrance * 0.6) / 100);
  const filters = [
    `brightness(${brightness.toFixed(3)})`,
    `contrast(${Math.max(0.2, contrast).toFixed(3)})`,
    `saturate(${saturate.toFixed(3)})`,
  ];
  if (a.temperature !== 0) {
    // Warm = licht sepia + hue naar oranje; koel = hue naar blauw.
    if (a.temperature > 0) {
      filters.push(`sepia(${(a.temperature / 400).toFixed(3)})`);
      filters.push(`hue-rotate(${(-a.temperature / 25).toFixed(1)}deg)`);
    } else {
      filters.push(`hue-rotate(${(-a.temperature / 12).toFixed(1)}deg)`);
    }
  }
  if (a.tint !== 0) filters.push(`hue-rotate(${(a.tint / 10).toFixed(1)}deg)`);
  if (a.sharpness > 0 || a.clarity > 0) {
    // Geen echte sharpen in CSS; kleine contrastboost als hint.
    filters.push(`contrast(${(1 + (a.sharpness + a.clarity) / 800).toFixed(3)})`);
  }
  return filters.join(" ");
}

/** Vignet als inzet-boxshadow (op een overlay-element te zetten). */
export function vignetteShadow(adjustments: Partial<PhotoAdjustments>): string | undefined {
  const vignette = adjustments.vignette ?? 0;
  if (vignette <= 0) return undefined;
  const spread = Math.round(20 + vignette * 1.2);
  const alpha = Math.min(0.75, vignette / 130);
  return `inset 0 0 ${spread}px ${Math.round(spread / 2)}px rgba(0,0,0,${alpha.toFixed(2)})`;
}

/** Transform voor rechtzetten/rotatie/spiegelen in de preview. */
export function compositionTransform(
  adjustments: Partial<PhotoAdjustments>,
  crop?: { rotate: 0 | 90 | 180 | 270; flipHorizontal: boolean },
): string {
  const parts: string[] = [];
  const rotate = (crop?.rotate ?? 0) + (adjustments.straighten ?? 0);
  if (rotate !== 0) parts.push(`rotate(${rotate}deg)`);
  if (crop?.flipHorizontal) parts.push("scaleX(-1)");
  if ((adjustments.straighten ?? 0) !== 0) {
    // Klein inzoomen zodat rechtzetten geen witte hoeken toont.
    parts.push(`scale(${(1 + Math.abs(adjustments.straighten ?? 0) / 40).toFixed(3)})`);
  }
  return parts.join(" ") || "none";
}
