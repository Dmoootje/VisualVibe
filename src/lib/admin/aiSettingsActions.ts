"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
  getAiRuntimeConfig,
  getAiSettingsAdminView,
  updateAiSettings,
} from "@/lib/firestore/aiSettings";
import { testAiProviderConnection } from "@/lib/ai/provider";
import {
  AI_PROVIDER_IDS,
  AI_PROVIDER_LABELS,
  isAiProviderId,
  type AiProviderId,
  type AiSettingsUpdate,
} from "@/types/aiSettings";

export type AiSettingsActionResult = {
  ok: boolean;
  message: string;
};

function formString(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function saveAiSettingsAction(formData: FormData): Promise<AiSettingsActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, message: "Niet ingelogd." };

  const activeValue = formString(formData, "activeProvider");
  if (!isAiProviderId(activeValue)) {
    return { ok: false, message: "Kies een geldige actieve AI-provider." };
  }

  const current = await getAiSettingsAdminView();
  const input = {
    activeProvider: activeValue,
    providers: Object.fromEntries(
      AI_PROVIDER_IDS.map((provider) => [
        provider,
        {
          model: formString(formData, `${provider}Model`),
          apiKey: formString(formData, `${provider}ApiKey`),
          removeApiKey: formData.get(`${provider}RemoveApiKey`) === "on",
        },
      ]),
    ),
  } as AiSettingsUpdate;

  const activeUpdate = input.providers[input.activeProvider];
  const activeCurrent = current.providers[input.activeProvider];
  const activeKeepsDatabaseKey =
    activeCurrent.credentialSource === "database" && !activeUpdate.removeApiKey;
  const activeKeepsEnvironmentKey = activeCurrent.credentialSource === "environment";
  if (!activeUpdate.apiKey && !activeKeepsDatabaseKey && !activeKeepsEnvironmentKey) {
    return {
      ok: false,
      message: `Vul eerst een API-sleutel in voor ${AI_PROVIDER_LABELS[input.activeProvider]}.`,
    };
  }

  try {
    await updateAiSettings(input);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "AI-instellingen opslaan mislukt.",
    };
  }

  revalidatePath("/admin/settings/ai");
  revalidatePath("/admin/trouwstudio/instellingen");
  revalidatePath("/admin/trouwstudio");
  return { ok: true, message: "AI-instellingen veilig opgeslagen." };
}

export async function testAiProviderAction(provider: AiProviderId): Promise<AiSettingsActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, message: "Niet ingelogd." };
  if (!AI_PROVIDER_IDS.includes(provider)) {
    return { ok: false, message: "Onbekende AI-provider." };
  }

  try {
    const runtime = await getAiRuntimeConfig(provider);
    await testAiProviderConnection(runtime);
    return {
      ok: true,
      message: `${AI_PROVIDER_LABELS[provider]} (${runtime.model}) is bereikbaar en geeft geldige structured output.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Verbindingstest mislukt.",
    };
  }
}
