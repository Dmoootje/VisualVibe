import Anthropic from "@anthropic-ai/sdk";
import { WEDDING_EDITING_STYLES, EDITING_STYLE_LABELS } from "@/features/trouwstudio/types";
import type { WeddingEditingStyle } from "@/features/trouwstudio/types";

// AI-invulhulp voor een nieuw trouwproject. De fotograaf vertelt (of typt) in
// het Nederlands de gegevens; Claude haalt daar de gestructureerde velden uit.
// Alleen wat expliciet genoemd wordt, wordt ingevuld; onbekende velden blijven
// leeg. De admin controleert altijd voor het aanmaken. Server-only (Node).

export type ParsedWeddingProject = {
  partnerOneName: string;
  partnerTwoName: string;
  /** ISO YYYY-MM-DD, of leeg. */
  weddingDate: string;
  ceremonyLocation: string;
  receptionLocation: string;
  city: string;
  photographerName: string;
  /** Een van WEDDING_EDITING_STYLES, of leeg. */
  editingStyle: WeddingEditingStyle | "";
  notes: string;
};

const SCHEMA = {
  type: "object",
  properties: {
    partnerOneName: { type: "string" },
    partnerTwoName: { type: "string" },
    weddingDate: { type: "string", description: "ISO-datum YYYY-MM-DD, of lege string als onbekend" },
    ceremonyLocation: { type: "string" },
    receptionLocation: { type: "string" },
    city: { type: "string" },
    photographerName: { type: "string" },
    editingStyle: { type: "string", enum: [...WEDDING_EDITING_STYLES, ""] },
    notes: { type: "string" },
  },
  required: [
    "partnerOneName",
    "partnerTwoName",
    "weddingDate",
    "ceremonyLocation",
    "receptionLocation",
    "city",
    "photographerName",
    "editingStyle",
    "notes",
  ],
  additionalProperties: false,
} as const;

export function hasAnthropic(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Em-dash (U+2014) en horizontale balk (U+2015) zijn projectbreed verboden; het
// patroon wordt uit de codepoints opgebouwd zodat die tekens niet in de source staan.
const FORBIDDEN_DASHES = new RegExp(`[${String.fromCharCode(0x2014, 0x2015)}]`, "g");

function stripEmDash(value: string): string {
  return value.replace(FORBIDDEN_DASHES, "-");
}

function buildSystemPrompt(today: string): string {
  const styleList = WEDDING_EDITING_STYLES.map((style) => `- "${style}" (${EDITING_STYLE_LABELS[style]})`).join("\n");
  return `Je bent een assistent voor een trouwfotograaf. Uit een gesproken of getypte NEDERLANDSE beschrijving haal je de gegevens van een nieuw trouwproject en zet je die in de juiste velden.

Belangrijke regels:
- Vul ALLEEN in wat duidelijk uit de tekst blijkt. Weet je iets niet, laat dat veld dan een LEGE string.
- Verzin niets: geen namen, datums of locaties die niet genoemd worden.
- partnerOneName en partnerTwoName: de voornamen van het koppel (bijvoorbeeld "Lien" en "Thomas").
- weddingDate: de trouwdatum als ISO-datum YYYY-MM-DD. De huidige datum is ${today}; reken relatieve aanduidingen ("volgend jaar", "over drie weken", "komende zaterdag") daarnaartoe om. Kan je de datum niet met zekerheid bepalen, laat leeg.
- city: stad of regio van de trouw. ceremonyLocation: waar de ceremonie is (stadhuis, kerk, ...). receptionLocation: feest-/receptielocatie (kasteel, zaal, ...).
- photographerName: naam van de fotograaf als die genoemd wordt.
- editingStyle: kies alleen een van onderstaande waarden als de stijl duidelijk genoemd wordt, anders leeg:
${styleList}
- notes: korte interne notitie met overige afspraken, wensen of aandachtspunten die niet in een ander veld passen.

Gebruik NOOIT een em-dash (lang streepje); gebruik een gewoon koppelteken, een komma of herschrijf.`;
}

export async function parseWeddingProject(transcript: string): Promise<ParsedWeddingProject> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ontbreekt in de omgeving.");

  const client = new Anthropic({ apiKey });
  const today = new Date().toISOString().slice(0, 10);

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 800,
    system: buildSystemPrompt(today),
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Beschrijving van het trouwproject:\n${transcript.slice(0, 6000)}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("De AI weigerde deze aanvraag.");
  }

  const jsonText = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("De AI gaf geen bruikbaar resultaat terug.");
  }

  const str = (value: unknown): string => (typeof value === "string" ? stripEmDash(value.trim()) : "");
  const rawDate = str(parsed.weddingDate);
  const weddingDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : "";
  const rawStyle = str(parsed.editingStyle);
  const editingStyle = (WEDDING_EDITING_STYLES as readonly string[]).includes(rawStyle)
    ? (rawStyle as WeddingEditingStyle)
    : "";

  return {
    partnerOneName: str(parsed.partnerOneName).slice(0, 80),
    partnerTwoName: str(parsed.partnerTwoName).slice(0, 80),
    weddingDate,
    ceremonyLocation: str(parsed.ceremonyLocation).slice(0, 200),
    receptionLocation: str(parsed.receptionLocation).slice(0, 200),
    city: str(parsed.city).slice(0, 80),
    photographerName: str(parsed.photographerName).slice(0, 80),
    editingStyle,
    notes: str(parsed.notes).slice(0, 2000),
  };
}
