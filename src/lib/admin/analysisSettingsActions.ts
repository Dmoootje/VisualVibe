"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateAnalysisQuotaConfig } from "@/lib/analyse/config";
import type { AnalysisQuotaConfig } from "@/types/analysis";

export type AnalysisSettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Nederlandse labels voor foutmeldingen per numeriek veld.
const NUMERIC_FIELDS = [
  { key: "maxPerEmail90d", label: "Analyses per e-mailadres (90 dagen)" },
  { key: "maxPerDevice90d", label: "Analyses per toestel (90 dagen)" },
  { key: "domainCooldownDays", label: "Cooldown per domein (dagen)" },
  { key: "maxPerIp24h", label: "Aanvragen per IP (24 uur)" },
  { key: "maxPerIp30d", label: "Analyses per IP (30 dagen)" },
  { key: "maxCodesPerEmailPerHour", label: "Verificatiecodes per e-mailadres per uur" },
  { key: "duplicateWindowMinutes", label: "Duplicaatvenster (minuten)" },
  { key: "codeTtlMinutes", label: "Geldigheid verificatiecode (minuten)" },
  { key: "maxCodeAttempts", label: "Invoerpogingen per code" },
] as const satisfies readonly { key: keyof AnalysisQuotaConfig; label: string }[];

type NumericFieldKey = (typeof NUMERIC_FIELDS)[number]["key"];

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function parseQuotaSettings(formData: FormData): {
  data?: Partial<AnalysisQuotaConfig>;
  error?: string;
} {
  const patch: Partial<AnalysisQuotaConfig> = {
    enabled: formData.get("enabled") === "on",
  };

  for (const field of NUMERIC_FIELDS) {
    const raw = String(formData.get(field.key) ?? "").trim();
    if (!raw) {
      return { error: `Vul een waarde in voor '${field.label}'.` };
    }
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) {
      return { error: `'${field.label}' moet een geheel getal van 0 of hoger zijn.` };
    }
    patch[field.key as NumericFieldKey] = value;
  }

  return { data: patch };
}

export async function saveAnalysisSettingsAction(
  _previousState: AnalysisSettingsActionState,
  formData: FormData,
): Promise<AnalysisSettingsActionState> {
  let admin: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", message: "Je sessie is verlopen. Meld je opnieuw aan." };
  }

  const parsed = parseQuotaSettings(formData);
  if (!parsed.data) {
    return { status: "error", message: parsed.error ?? "Controleer de instellingen." };
  }

  try {
    await updateAnalysisQuotaConfig(parsed.data, admin.email);
    revalidatePath("/admin/settings/analyse");
    return { status: "success", message: "Analyse-instellingen opgeslagen." };
  } catch {
    return { status: "error", message: "Opslaan mislukt. Controleer de waarden en probeer opnieuw." };
  }
}
