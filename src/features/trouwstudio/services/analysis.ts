import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
// De SDK-helper verwacht zod v4-schema's; zod 3.25+ levert die via "zod/v4".
import { z } from "zod/v4";
import {
  NEUTRAL_ADJUSTMENTS,
  PHOTO_ISSUES,
  WEDDING_SCENES,
  type PhotoAdjustments,
  type PhotoAnalysisResult,
  type TrouwstudioSettings,
  type WeddingPhoto,
} from "../types";

// Provider-onafhankelijke foto-analyse. De Claude-provider gebruikt vision +
// structured outputs; de mockprovider is uitsluitend voor omgevingen zonder
// ANTHROPIC_API_KEY en markeert zijn resultaten expliciet als
// "Demonstratiemodus" (provider: "mock") zodat er nooit nep-analyse als echte
// analyse wordt gepresenteerd.

export type PhotoAnalysisInput = {
  photo: Pick<WeddingPhoto, "id" | "previewUrl" | "filename" | "width" | "height" | "orientation">;
  editingStyle: string;
};

export interface PhotoAnalysisProvider {
  readonly id: string;
  analyzePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult>;
}

/* ---------------- Claude vision provider ---------------- */

const adjustmentsSchema = z.object({
  exposure: z.number(),
  contrast: z.number(),
  highlights: z.number(),
  shadows: z.number(),
  whites: z.number(),
  blacks: z.number(),
  gamma: z.number(),
  temperature: z.number(),
  tint: z.number(),
  vibrance: z.number(),
  saturation: z.number(),
  clarity: z.number(),
  texture: z.number(),
  sharpness: z.number(),
  noiseReduction: z.number(),
  vignette: z.number(),
  grain: z.number(),
  straighten: z.number(),
});

const analysisSchema = z.object({
  qualityScore: z.number().describe("Technische kwaliteit 0-100"),
  confidence: z.number().describe("Zekerheid van deze analyse, 0-1"),
  scene: z.enum(WEDDING_SCENES),
  detectedIssues: z.array(z.enum(PHOTO_ISSUES)),
  strengths: z.array(z.string()).describe("Sterke punten, kort, Nederlands"),
  adjustmentProposal: adjustmentsSchema,
  albumSuitabilityScore: z.number().describe("Geschiktheid voor het trouwboek 0-100"),
  suggestedAlbumSection: z.enum(WEDDING_SCENES),
  reviewRequired: z.boolean(),
  summary: z.string().describe("Korte Nederlandse samenvatting van de analyse (1-2 zinnen)"),
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function clampAdjustments(raw: z.infer<typeof adjustmentsSchema>): PhotoAdjustments {
  const out = { ...NEUTRAL_ADJUSTMENTS };
  for (const key of Object.keys(out) as (keyof PhotoAdjustments)[]) {
    const value = raw[key];
    out[key] = key === "straighten" ? clamp(value ?? 0, -15, 15) : clamp(value ?? 0, -100, 100);
  }
  return out;
}

export class ClaudeVisionAnalysisProvider implements PhotoAnalysisProvider {
  readonly id = "claude";

  constructor(private readonly model: string) {}

  async analyzePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: this.model,
      max_tokens: 4096,
      system:
        "Je bent een professionele trouwfotografie-retoucheur. Analyseer de foto technisch en inhoudelijk " +
        "en stel deterministische correcties voor (belichting, kleur, detail) als waarden van -100 tot 100 " +
        "(0 = geen aanpassing, straighten in graden -15..15). Wees conservatief: kleine, natuurlijke " +
        `correcties passend bij de fotostijl "${input.editingStyle}". Verander nooit de identiteit of inhoud ` +
        "van de foto. Zet reviewRequired op true bij twijfel (lage kwaliteit, gesloten ogen, sterke afwijkingen).",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: input.photo.previewUrl } },
            {
              type: "text",
              text: `Analyseer deze trouwfoto (bestand: ${input.photo.filename}, ${input.photo.width}x${input.photo.height}).`,
            },
          ],
        },
      ],
      output_config: { format: zodOutputFormat(analysisSchema) },
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      throw new Error("Analyse geweigerd of ongeldig resultaat van het model.");
    }
    const parsed = response.parsed_output;

    return {
      qualityScore: clamp(parsed.qualityScore, 0, 100),
      confidence: clamp(parsed.confidence, 0, 1),
      scene: parsed.scene,
      orientation: input.photo.orientation,
      detectedIssues: parsed.detectedIssues,
      strengths: parsed.strengths.slice(0, 5),
      adjustmentProposal: clampAdjustments(parsed.adjustmentProposal),
      cropSuggestions: [],
      albumSuitabilityScore: clamp(parsed.albumSuitabilityScore, 0, 100),
      suggestedAlbumSection: parsed.suggestedAlbumSection,
      reviewRequired: parsed.reviewRequired,
      summary: parsed.summary,
      provider: this.id,
      analyzedAt: new Date().toISOString(),
    };
  }
}

/* ---------------- Mockprovider (Demonstratiemodus) ---------------- */

export class MockAnalysisProvider implements PhotoAnalysisProvider {
  readonly id = "mock";

  async analyzePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
    // Deterministisch op basis van bestandsnaam zodat het gedrag stabiel en
    // duidelijk niet-willekeurig is; het label "Demonstratiemodus" wordt in
    // de UI getoond op basis van provider === "mock".
    let seed = 0;
    for (const char of input.photo.filename) seed = (seed * 31 + char.charCodeAt(0)) % 997;
    const quality = 55 + (seed % 40);
    return {
      qualityScore: quality,
      confidence: 0.5,
      scene: "onbekend",
      orientation: input.photo.orientation,
      detectedIssues: [],
      strengths: ["Demonstratiemodus: geen echte analyse uitgevoerd."],
      adjustmentProposal: { ...NEUTRAL_ADJUSTMENTS, exposure: 5, contrast: 4, vibrance: 6 },
      cropSuggestions: [],
      albumSuitabilityScore: quality,
      suggestedAlbumSection: "onbekend",
      reviewRequired: true,
      summary:
        "Demonstratiemodus: er is geen AI-provider geconfigureerd (ANTHROPIC_API_KEY ontbreekt). Dit is een placeholderresultaat, geen echte analyse.",
      provider: this.id,
      analyzedAt: new Date().toISOString(),
    };
  }
}

/** Kiest de provider op basis van instellingen en beschikbare credentials. */
export function resolveAnalysisProvider(settings: TrouwstudioSettings): PhotoAnalysisProvider {
  if (settings.aiProvider === "claude" && process.env.ANTHROPIC_API_KEY) {
    return new ClaudeVisionAnalysisProvider(settings.analysisModel);
  }
  return new MockAnalysisProvider();
}
