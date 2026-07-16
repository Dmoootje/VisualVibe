import "server-only";

import {
  getAiRuntimeConfig,
  type AiRuntimeConfig,
} from "@/lib/firestore/aiSettings";
import { AI_PROVIDER_LABELS } from "@/types/aiSettings";

const REQUEST_TIMEOUT_MS = 90_000;

type GenerateAiJsonInput = {
  system: string;
  prompt: string;
  schemaName: string;
  schema: unknown;
  maxOutputTokens: number;
  image?: { url: string; mimeType?: string };
  runtime?: AiRuntimeConfig;
};

type JsonRecord = Record<string, unknown>;

export class AiProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiProviderError";
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function portableJsonSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(portableJsonSchema);
  if (!isRecord(value)) return value;
  const unsupported = new Set([
    "$schema",
    "format",
    "minLength",
    "maxLength",
    "pattern",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    "minItems",
    "maxItems",
    "uniqueItems",
  ]);
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !unsupported.has(key))
      .map(([key, child]) => [key, portableJsonSchema(child)]),
  );
}

function safeSchemaName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) || "structured_result";
}

async function providerFetch(
  runtime: AiRuntimeConfig,
  url: string,
  init: RequestInit,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new AiProviderError(`${AI_PROVIDER_LABELS[runtime.provider]} antwoordde niet op tijd.`);
    }
    throw new AiProviderError(`Verbinding met ${AI_PROVIDER_LABELS[runtime.provider]} mislukt.`);
  }

  if (!response.ok) {
    const label = AI_PROVIDER_LABELS[runtime.provider];
    if (response.status === 401 || response.status === 403) {
      throw new AiProviderError(`${label} heeft de API-sleutel geweigerd.`);
    }
    if (response.status === 404) {
      throw new AiProviderError(`${label} kon model "${runtime.model}" niet vinden.`);
    }
    if (response.status === 429) {
      throw new AiProviderError(`${label} heeft de gebruikslimiet bereikt. Probeer later opnieuw.`);
    }
    throw new AiProviderError(`${label} gaf een API-fout (${response.status}).`);
  }

  try {
    return await response.json();
  } catch {
    throw new AiProviderError(`${AI_PROVIDER_LABELS[runtime.provider]} gaf geen geldig antwoord.`);
  }
}

function parseJsonText<T>(runtime: AiRuntimeConfig, text: string): T {
  try {
    return JSON.parse(text.trim()) as T;
  } catch {
    throw new AiProviderError(`${AI_PROVIDER_LABELS[runtime.provider]} gaf geen geldige JSON terug.`);
  }
}

function geminiText(payload: unknown): string {
  if (!isRecord(payload)) return "";
  const direct = typeof payload.output_text === "string" ? payload.output_text : "";
  if (direct.trim()) return direct.trim();
  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index];
    if (!isRecord(step) || step.type !== "model_output" || !Array.isArray(step.content)) continue;
    const text = step.content
      .map((part) => (isRecord(part) && part.type === "text" && typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();
    if (text) return text;
  }
  return "";
}

async function generateWithGemini<T>(runtime: AiRuntimeConfig, input: GenerateAiJsonInput): Promise<T> {
  // Multimodale input moet als user_input-STAP met content-parts; losse parts
  // op topniveau wijst de interactions-API af (400: 'image' not supported).
  const promptInput: unknown = input.image
    ? [
        {
          type: "user_input",
          content: [
            { type: "text", text: input.prompt },
            { type: "image", uri: input.image.url, mime_type: input.image.mimeType ?? "image/webp" },
          ],
        },
      ]
    : input.prompt;
  // v1beta: het v1-endpoint kent de preview-modellen (bv. gemini-3.1-pro-preview)
  // niet en geeft daarop 404 "model not found"; v1beta bedient beide.
  const payload = await providerFetch(runtime, "https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": runtime.apiKey,
    },
    body: JSON.stringify({
      model: runtime.model,
      input: promptInput,
      system_instruction: input.system,
      generation_config: { max_output_tokens: input.maxOutputTokens },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: portableJsonSchema(input.schema),
      },
      store: false,
    }),
  });
  if (!isRecord(payload) || payload.status !== "completed") {
    throw new AiProviderError("Gemini kon de aanvraag niet volledig afronden.");
  }
  const text = geminiText(payload);
  if (!text) throw new AiProviderError("Gemini gaf geen tekst terug.");
  return parseJsonText<T>(runtime, text);
}

function claudeText(payload: unknown): string {
  if (!isRecord(payload) || !Array.isArray(payload.content)) return "";
  return payload.content
    .map((block) => (isRecord(block) && block.type === "text" && typeof block.text === "string" ? block.text : ""))
    .join("")
    .trim();
}

async function generateWithClaude<T>(runtime: AiRuntimeConfig, input: GenerateAiJsonInput): Promise<T> {
  const userContent = input.image
    ? [
        { type: "image", source: { type: "url", url: input.image.url } },
        { type: "text", text: input.prompt },
      ]
    : input.prompt;
  const payload = await providerFetch(runtime, "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": runtime.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: runtime.model,
      max_tokens: input.maxOutputTokens,
      system: input.system,
      messages: [{ role: "user", content: userContent }],
      output_config: {
        format: { type: "json_schema", schema: portableJsonSchema(input.schema) },
      },
    }),
  });
  if (!isRecord(payload) || payload.stop_reason === "refusal") {
    throw new AiProviderError("Claude weigerde deze aanvraag.");
  }
  if (payload.stop_reason !== "end_turn") {
    throw new AiProviderError("Claude kon de aanvraag niet volledig afronden.");
  }
  const text = claudeText(payload);
  if (!text) throw new AiProviderError("Claude gaf geen tekst terug.");
  return parseJsonText<T>(runtime, text);
}

function openAiText(payload: unknown): string {
  if (!isRecord(payload) || !Array.isArray(payload.output)) return "";
  return payload.output
    .flatMap((item) => (isRecord(item) && Array.isArray(item.content) ? item.content : []))
    .map((block) => (isRecord(block) && block.type === "output_text" && typeof block.text === "string" ? block.text : ""))
    .join("")
    .trim();
}

async function generateWithOpenAi<T>(runtime: AiRuntimeConfig, input: GenerateAiJsonInput): Promise<T> {
  const userInput = input.image
    ? [{
        role: "user",
        content: [
          { type: "input_text", text: input.prompt },
          { type: "input_image", image_url: input.image.url },
        ],
      }]
    : input.prompt;
  const payload = await providerFetch(runtime, "https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${runtime.apiKey}`,
    },
    body: JSON.stringify({
      model: runtime.model,
      instructions: input.system,
      input: userInput,
      max_output_tokens: input.maxOutputTokens,
      text: {
        format: {
          type: "json_schema",
          name: safeSchemaName(input.schemaName),
          schema: portableJsonSchema(input.schema),
          strict: true,
        },
      },
      store: false,
    }),
  });
  if (!isRecord(payload) || payload.status !== "completed") {
    throw new AiProviderError("OpenAI kon de aanvraag niet volledig afronden.");
  }
  const text = openAiText(payload);
  if (!text) throw new AiProviderError("OpenAI gaf geen tekst terug.");
  return parseJsonText<T>(runtime, text);
}

/** Generates schema-constrained JSON through the globally selected provider. */
export async function generateAiJson<T>(input: GenerateAiJsonInput): Promise<T> {
  const runtime = input.runtime ?? await getAiRuntimeConfig();
  if (runtime.provider === "gemini") return generateWithGemini<T>(runtime, input);
  if (runtime.provider === "claude") return generateWithClaude<T>(runtime, input);
  return generateWithOpenAi<T>(runtime, input);
}

const CONNECTION_TEST_SCHEMA = {
  type: "object",
  properties: { status: { type: "string", enum: ["ok"] } },
  required: ["status"],
  additionalProperties: false,
} as const;

const CONNECTION_TEST_IMAGE_URL =
  "https://visualvibe.media/api/home-feature-image/Webdesign.webp/";

/** Tests authentication, vision and structured output in one small call. */
export async function testAiProviderConnection(runtime: AiRuntimeConfig): Promise<void> {
  const result = await generateAiJson<{ status?: unknown }>({
    runtime,
    system: "Je voert een technische verbindingstest uit.",
    prompt: 'Bekijk de afbeelding en geef exact het gevraagde resultaat met status "ok".',
    schemaName: "connection_test",
    schema: CONNECTION_TEST_SCHEMA,
    // Redenerende modellen (Gemini 3.x, o.a.) verbruiken thought-tokens uit dit
    // budget; 1024 was soms al op voor er output kwam ("incomplete").
    maxOutputTokens: 2048,
    image: { url: CONNECTION_TEST_IMAGE_URL, mimeType: "image/webp" },
  });
  if (result.status !== "ok") {
    throw new AiProviderError(`${AI_PROVIDER_LABELS[runtime.provider]} gaf een onverwacht testresultaat.`);
  }
}
