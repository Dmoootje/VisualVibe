import Anthropic from "@anthropic-ai/sdk";
import { coupleName, type WeddingAlbumTexts, type WeddingProject } from "@/features/trouwstudio/types";

// Genereert warme, verzorgde starttekst voor een trouwboek: ondertitel, quote,
// een persoonlijke boodschap (in de stem van het koppel) en een woord vooraf
// (in de stem van de fotograaf). Wordt bij het aanmaken van een project gebruikt
// en achter de "Maak andere inhoud"-knop in de wizard. Server-only (Node).

const SCHEMA = {
  type: "object",
  properties: {
    subtitle: {
      type: "string",
      description: "Korte, sfeervolle ondertitel voor onder de albumtitel (max ~6 woorden).",
    },
    quote: {
      type: "string",
      description: "Een korte, tijdloze quote of dichtregel voor de openingspagina (1 zin).",
    },
    personalMessage: {
      type: "string",
      description: "Warme persoonlijke boodschap in de stem van het koppel (2 tot 4 zinnen).",
    },
    foreword: {
      type: "string",
      description: "Woord vooraf in de stem van de fotograaf, terugblikkend op de dag (3 tot 5 zinnen).",
    },
  },
  required: ["subtitle", "quote", "personalMessage", "foreword"],
  additionalProperties: false,
} as const;

// Em-dash (U+2014) en horizontale balk (U+2015) zijn projectbreed verboden; het
// patroon wordt uit de codepoints opgebouwd zodat die tekens niet in de source staan.
const FORBIDDEN_DASHES = new RegExp(`[${String.fromCharCode(0x2014, 0x2015)}]`, "g");

function stripEmDash(value: string): string {
  return value.replace(FORBIDDEN_DASHES, "-");
}

export function hasAnthropic(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function languageInstruction(language: string): string {
  const code = language.toLowerCase().slice(0, 2);
  if (code === "fr") return "Schrijf ALLE teksten in vlot, natuurlijk FRANS.";
  if (code === "en") return "Write ALL texts in fluent, natural ENGLISH.";
  return "Schrijf ALLE teksten in vlot, natuurlijk NEDERLANDS.";
}

function buildSystemPrompt(project: WeddingProject): string {
  const couple = coupleName(project) || "het koppel";
  const photographer = project.photographerName?.trim() || "de fotograaf";
  const facts = [
    `Koppel: ${couple}`,
    project.weddingDate ? `Trouwdatum: ${project.weddingDate}` : null,
    project.city ? `Plaats: ${project.city}` : null,
    project.ceremonyLocation ? `Ceremonielocatie: ${project.ceremonyLocation}` : null,
    project.receptionLocation ? `Feestlocatie: ${project.receptionLocation}` : null,
    `Fotograaf: ${photographer}`,
    project.notes ? `Interne notities: ${project.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `Je bent een tekstschrijver voor een trouwfotograaf en schrijft de starttekst voor een luxueus trouwboek (fotoalbum). De teksten mogen warm en romantisch zijn, maar blijven smaakvol, tijdloos en oprecht. Vermijd cliches en overdreven bloemrijke taal.

${languageInstruction(project.language)}

Gegevens van dit trouwboek:
${facts}

Schrijf vier teksten:
- subtitle: een korte, sfeervolle ondertitel die onder de albumtitel "${couple}" past (bijvoorbeeld "Ons trouwverhaal"). Maximaal een handvol woorden, geen leestekens op het einde.
- quote: een korte, tijdloze quote of dichtregel voor de openingspagina. Een enkele zin. Verzin geen valse auteursvermelding.
- personalMessage: een warme, persoonlijke boodschap geschreven in de stem van het koppel (wij-vorm), die zij bovenaan het album kunnen plaatsen. Twee tot vier zinnen. Blijf algemeen genoeg zodat het koppel het makkelijk kan personaliseren.
- foreword: een woord vooraf in de stem van de fotograaf (${photographer}), die met genegenheid terugblikt op de trouwdag en het album inleidt. Drie tot vijf zinnen.

Belangrijke regels:
- Verzin GEEN concrete feiten die niet hierboven staan (geen namen van gasten, geen weer, geen specifieke gebeurtenissen).
- Gebruik de echte voornamen van het koppel waar dat natuurlijk voelt.
- Gebruik NOOIT een em-dash (lang streepje); gebruik een gewoon koppelteken, een komma of herschrijf.
- Lever uitsluitend de vier velden; geen extra uitleg.`;
}

export async function generateAlbumTexts(project: WeddingProject): Promise<WeddingAlbumTexts> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ontbreekt in de omgeving.");

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 900,
    system: buildSystemPrompt(project),
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Schrijf de starttekst voor het trouwboek van ${coupleName(project) || "dit koppel"}.`,
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

  const str = (value: unknown, max: number): string =>
    typeof value === "string" ? stripEmDash(value.trim()).slice(0, max) : "";

  return {
    subtitle: str(parsed.subtitle, 80),
    quote: str(parsed.quote, 240),
    personalMessage: str(parsed.personalMessage, 600),
    foreword: str(parsed.foreword, 900),
  };
}
