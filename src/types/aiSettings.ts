export const AI_PROVIDER_IDS = ["gemini", "claude", "openai"] as const;

export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

export const AI_PROVIDER_LABELS: Record<AiProviderId, string> = {
  gemini: "Gemini",
  claude: "Claude",
  openai: "OpenAI",
};

/** Stable, editable defaults. Gemini is the platform-wide default provider. */
export const DEFAULT_AI_MODELS: Record<AiProviderId, string> = {
  gemini: "gemini-3.5-flash",
  claude: "claude-sonnet-5",
  openai: "gpt-5.4-mini",
};

export type AiCredentialSource = "database" | "none";

/** Safe provider state that may cross the server/client boundary. */
export type AiProviderAdminSettings = {
  model: string;
  keyConfigured: boolean;
  keyHint: string;
  credentialSource: AiCredentialSource;
};

/** Safe admin view. Encrypted values and plaintext keys are deliberately absent. */
export type AiSettingsAdminView = {
  activeProvider: AiProviderId;
  encryptionConfigured: boolean;
  providers: Record<AiProviderId, AiProviderAdminSettings>;
};

export type AiProviderSettingsUpdate = {
  model: string;
  /** Empty or omitted means: retain the currently stored key. */
  apiKey?: string;
  /** Removes the encrypted database key. */
  removeApiKey?: boolean;
};

export type AiSettingsUpdate = {
  activeProvider: AiProviderId;
  providers: Record<AiProviderId, AiProviderSettingsUpdate>;
};

export function isAiProviderId(value: unknown): value is AiProviderId {
  return typeof value === "string" && AI_PROVIDER_IDS.includes(value as AiProviderId);
}
