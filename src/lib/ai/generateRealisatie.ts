import Anthropic from "@anthropic-ai/sdk";

// AI copywriter for a webdesign realisatie. Given the scraped page text, Claude
// drafts the Dutch beschrijving, badges, SEO-termen and "Wat we leverden" list
// in VisualVibe's house style. The admin reviews and edits before saving; this
// never publishes on its own. Server-only (Node runtime).

export type GeneratedRealisatie = {
  text: string;
  tags: string[];
  terms: string[];
  features: string[];
};

const REALISATIE_SCHEMA = {
  type: "object",
  properties: {
    text: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    terms: { type: "array", items: { type: "string" } },
    features: { type: "array", items: { type: "string" } },
  },
  required: ["text", "tags", "terms", "features"],
  additionalProperties: false,
} as const;

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

/** True when the Anthropic API is configured, so the route can fail early. */
export function hasAnthropic(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Strip em dash (U+2014) and horizontal bar (U+2015): a hard project rule. The
// en dash (U+2013) is allowed and left untouched.
function stripEmDash(s: string): string {
  return s.replace(/[—―]/g, "-");
}

const SYSTEM = `Je bent copywriter voor VisualVibe, een creatief mediabureau uit Limburg (Belgie) dat webdesign, SEO, fotografie en videografie levert. Je schrijft een korte realisatie-omschrijving voor een klantwebsite die VisualVibe heeft gebouwd.

Schrijf in het Nederlands, zakelijk en concreet, in de huisstijl van VisualVibe. Baseer je uitsluitend op de aangeleverde paginatekst; verzin geen cijfers, prijzen of feiten.

Lever exact deze velden:
- text: een vloeiende paragraaf van 2 tot 3 zinnen die beschrijft wat voor website dit is en wat VisualVibe leverde (bijvoorbeeld eigen huisstijl en webdesign, professionele fotografie, een reservatiesysteem, SEO). Voorbeeldstijl: "Website met eigen creatie van huisstijl en webdesign inclusief professionele foto's. Geoptimaliseerd voor zoekmachines, met op maat gemaakte pagina's."
- tags: maximaal 3 korte badges van 1 of 2 woorden die het project typeren (bijvoorbeeld "Horeca", "Reservatie", "SEO", "Webshop", "Fotografie").
- terms: 1 tot 3 SEO-zoektermen waarop de site gericht is (bijvoorbeeld "restaurant Bilzen", "zonnepanelen").
- features: 3 tot 5 korte punten voor de checklist "Wat we leverden" (bijvoorbeeld "Eigen huisstijl en webdesign", "Professionele fotografie", "SEO-optimalisatie").

Belangrijke regel: gebruik NOOIT een em-dash (het lange streepje). Gebruik altijd een gewoon koppelteken, een komma of herschrijf de zin.`;

/**
 * Draft realisatie copy from scraped page text. `siteName` and `url` give the
 * model context; `markdown` is the scraped content (truncated to keep the
 * request cheap).
 */
export async function generateRealisatie({
  siteName,
  url,
  markdown,
}: {
  siteName: string;
  url: string;
  markdown: string;
}): Promise<GeneratedRealisatie> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ontbreekt in de omgeving.");
  }

  const client = new Anthropic({ apiKey });
  const content = markdown.slice(0, 12000);

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1500,
    system: SYSTEM,
    output_config: { format: { type: "json_schema", schema: REALISATIE_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Website: ${siteName || url}\nURL: ${url}\n\nPaginatekst:\n${content}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("De AI weigerde deze aanvraag.");
  }

  const jsonText = response.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("De AI gaf geen bruikbaar resultaat terug.");
  }

  const clean = (s: string) => stripEmDash(s.trim());
  return {
    text: typeof parsed.text === "string" ? clean(parsed.text) : "",
    tags: asStrings(parsed.tags).map(clean).filter(Boolean).slice(0, 3),
    terms: asStrings(parsed.terms).map(clean).filter(Boolean),
    features: asStrings(parsed.features).map(clean).filter(Boolean),
  };
}
