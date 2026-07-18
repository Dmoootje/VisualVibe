import type { EmailLocale } from "@/types/email";

export function analysisLocale(value: unknown): EmailLocale {
  return value === "en" || value === "fr" || value === "nl" ? value : "nl";
}
