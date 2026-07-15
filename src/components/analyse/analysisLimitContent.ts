import type { AnalysisQuotaDecision } from "@/types/analysis";

export const PAGE_ANALYZER_URL = "https://seowebsites.be/nl/seo-website-analyse";
export const COMPLETE_AUDIT_URL = "https://seowebsites.be/AIGEOprofiler/";

type LimitContentInput = {
  decision?: AnalysisQuotaDecision;
  message: string;
  resetsAt?: string;
};

function formatResetMoment(value: string): string | null {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const day = new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Brussels",
  }).format(date);
  const time = new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Brussels",
  }).format(date);
  return `${day} om ${time}`;
}

export function getAnalysisLimitContent(input: LimitContentInput): {
  heading: string;
  description: string;
} {
  const resetMoment = input.resetsAt ? formatResetMoment(input.resetsAt) : null;
  if (input.decision === "limit_email" || input.decision === "limit_device") {
    return {
      heading: "Je gratis analyses zijn gebruikt",
      description: resetMoment
        ? `Je hebt je 3 gratis analyses gebruikt. Je tegoed wordt automatisch vernieuwd op ${resetMoment}. Daarna krijg je opnieuw 3 gratis analyses.`
        : "Je hebt je 3 gratis analyses gebruikt. Zodra je tegoed vernieuwd is, kun je opnieuw testen.",
    };
  }
  return {
    heading: "De aanvraaglimiet is bereikt",
    description: resetMoment
      ? `${input.message} Je kunt opnieuw aanvragen op ${resetMoment}.`
      : input.message,
  };
}
