import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import {
  decryptAiProviderKey,
  encryptAiProviderKey,
  hasValidEncryptionKey,
} from "@/lib/security/encryption";
import {
  AI_PROVIDER_IDS,
  AI_PROVIDER_LABELS,
  DEFAULT_AI_MODELS,
  type AiProviderId,
  type AiSettingsAdminView,
  type AiSettingsUpdate,
} from "@/types/aiSettings";

const COLLECTION = "ai_settings";
const SETTINGS_ID = "default";

type StoredProviderSettings = {
  model: string;
  encryptedApiKey?: string;
  keyHint?: string;
};

type StoredAiSettings = {
  activeProvider: AiProviderId;
  providers: Record<AiProviderId, StoredProviderSettings>;
};

export type AiRuntimeConfig = {
  provider: AiProviderId;
  model: string;
  apiKey: string;
};

export class AiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiConfigurationError";
  }
}

function defaultStoredSettings(): StoredAiSettings {
  return {
    activeProvider: "gemini",
    providers: {
      gemini: { model: DEFAULT_AI_MODELS.gemini },
      claude: { model: DEFAULT_AI_MODELS.claude },
      openai: { model: DEFAULT_AI_MODELS.openai },
    },
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function providerFromData(value: unknown, provider: AiProviderId): StoredProviderSettings {
  const data = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const model = stringValue(data.model) || DEFAULT_AI_MODELS[provider];
  const encryptedApiKey = stringValue(data.encryptedApiKey);
  const keyHint = stringValue(data.keyHint).slice(-4);
  return {
    model,
    ...(encryptedApiKey ? { encryptedApiKey } : {}),
    ...(keyHint ? { keyHint } : {}),
  };
}

function storedAiSettingsFromData(
  rawData: FirebaseFirestore.DocumentData | undefined,
): StoredAiSettings {
  const defaults = defaultStoredSettings();
  const data = rawData ?? {};
  const rawProviders = data.providers && typeof data.providers === "object"
    ? (data.providers as Record<string, unknown>)
    : {};
  const activeProvider = AI_PROVIDER_IDS.includes(data.activeProvider as AiProviderId)
    ? (data.activeProvider as AiProviderId)
    : defaults.activeProvider;
  return {
    activeProvider,
    providers: {
      gemini: providerFromData(rawProviders.gemini, "gemini"),
      claude: providerFromData(rawProviders.claude, "claude"),
      openai: providerFromData(rawProviders.openai, "openai"),
    },
  };
}

async function readStoredAiSettings(): Promise<StoredAiSettings> {
  const snapshot = await adminDb.collection(COLLECTION).doc(SETTINGS_ID).get();
  return storedAiSettingsFromData(snapshot.data());
}

/** Returns only masked/configured state; ciphertext never leaves this module. */
export async function getAiSettingsAdminView(): Promise<AiSettingsAdminView> {
  const stored = await readStoredAiSettings();
  const providers = Object.fromEntries(
    AI_PROVIDER_IDS.map((provider) => {
      const settings = stored.providers[provider];
      const hasDatabaseKey = Boolean(settings.encryptedApiKey);
      return [
        provider,
        {
          model: settings.model,
          keyConfigured: hasDatabaseKey,
          keyHint: hasDatabaseKey ? settings.keyHint ?? "" : "",
          credentialSource: hasDatabaseKey ? "database" : "none",
        },
      ];
    }),
  ) as AiSettingsAdminView["providers"];

  return {
    activeProvider: stored.activeProvider,
    encryptionConfigured: hasValidEncryptionKey(),
    providers,
  };
}

/** Resolves and decrypts one provider entirely server-side. */
export async function getAiRuntimeConfig(providerOverride?: AiProviderId): Promise<AiRuntimeConfig> {
  const stored = await readStoredAiSettings();
  const provider = providerOverride ?? stored.activeProvider;
  const providerSettings = stored.providers[provider];
  let apiKey = "";

  if (providerSettings.encryptedApiKey) {
    try {
      apiKey = decryptAiProviderKey(provider, providerSettings.encryptedApiKey).trim();
    } catch {
      throw new AiConfigurationError(
        `De opgeslagen sleutel voor ${AI_PROVIDER_LABELS[provider]} kon niet veilig worden ontsleuteld. Controleer APP_ENCRYPTION_KEY.`,
      );
    }
  }

  if (!apiKey) {
    throw new AiConfigurationError(
      `Er is geen API-sleutel ingesteld voor ${AI_PROVIDER_LABELS[provider]}.`,
    );
  }

  return { provider, model: providerSettings.model, apiKey };
}

export async function hasConfiguredAiProvider(providerOverride?: AiProviderId): Promise<boolean> {
  try {
    await getAiRuntimeConfig(providerOverride);
    return true;
  } catch {
    return false;
  }
}

function validateModel(provider: AiProviderId, value: string): string {
  const model = value.trim();
  if (!model || model.length > 120 || /[\r\n]/.test(model)) {
    throw new Error(`Vul een geldig model in voor ${AI_PROVIDER_LABELS[provider]}.`);
  }
  return model;
}

function validateApiKey(provider: AiProviderId, value: string): string {
  const apiKey = value.trim();
  if (!apiKey) return "";
  if (apiKey.length > 512 || /\s/.test(apiKey)) {
    throw new Error(`De API-sleutel voor ${AI_PROVIDER_LABELS[provider]} is ongeldig.`);
  }
  return apiKey;
}

/** Saves models and provider keys. Blank key fields retain existing ciphertext. */
export async function updateAiSettings(input: AiSettingsUpdate): Promise<void> {
  if (!AI_PROVIDER_IDS.includes(input.activeProvider)) {
    throw new Error("Kies een geldige actieve AI-provider.");
  }

  const ref = adminDb.collection(COLLECTION).doc(SETTINGS_ID);
  const normalizedUpdates = Object.fromEntries(
    AI_PROVIDER_IDS.map((provider) => [
      provider,
      {
        model: validateModel(provider, input.providers[provider].model),
        apiKey: validateApiKey(provider, input.providers[provider].apiKey ?? ""),
        removeApiKey: Boolean(input.providers[provider].removeApiKey),
      },
    ]),
  ) as Record<AiProviderId, { model: string; apiKey: string; removeApiKey: boolean }>;

  for (const provider of AI_PROVIDER_IDS) {
    const update = normalizedUpdates[provider];
    if (update.apiKey && update.removeApiKey) {
      throw new Error(
        `Kies voor ${AI_PROVIDER_LABELS[provider]} tussen de sleutel vervangen of verwijderen.`,
      );
    }
  }

  await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = storedAiSettingsFromData(snapshot.data());
    const providers = {} as Record<AiProviderId, StoredProviderSettings>;

    for (const provider of AI_PROVIDER_IDS) {
      const update = normalizedUpdates[provider];
      const next: StoredProviderSettings = {
        ...current.providers[provider],
        model: update.model,
      };

      if (update.removeApiKey) {
        delete next.encryptedApiKey;
        delete next.keyHint;
      } else if (update.apiKey) {
        next.encryptedApiKey = encryptAiProviderKey(provider, update.apiKey);
        next.keyHint = update.apiKey.slice(-4);
      }
      providers[provider] = next;
    }

    const now = new Date();
    // This singleton contains only AI settings. Replace it atomically so a key
    // removed in the admin UI is also removed from Firestore, including its hint.
    transaction.set(ref, {
      activeProvider: input.activeProvider,
      providers,
      updatedAt: now,
      createdAt: snapshot.data()?.createdAt ?? now,
    });
  });
}
