import type { AnalysisQuotaDecision } from "@/types/analysis";

export const PAGE_ANALYZER_URL = "https://seowebsites.be/nl/seo-website-analyse";
export const COMPLETE_AUDIT_URL = "https://seowebsites.be/AIGEOprofiler/";

type LimitContentInput = {
  decision?: AnalysisQuotaDecision;
  message: string;
  resetsAt?: string;
  locale?: "nl" | "en";
};

function formatResetMoment(value: string, locale: "nl" | "en"): string | null {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const day = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Brussels",
  }).format(date);
  const time = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Brussels",
  }).format(date);
  return locale === "en" ? `${day} at ${time}` : `${day} om ${time}`;
}

export function getAnalysisLimitContent(input: LimitContentInput): {
  heading: string;
  description: string;
} {
  const locale = input.locale ?? "nl";
  const resetMoment = input.resetsAt ? formatResetMoment(input.resetsAt, locale) : null;
  if (input.decision === "limit_email" || input.decision === "limit_device") {
    if (locale === "en") return {
      heading: "You have used your free analyses",
      description: resetMoment
        ? `You have used your 3 free analyses. Your allowance resets automatically on ${resetMoment}. You will then have 3 free analyses again.`
        : "You have used your 3 free analyses. You can run another test once your allowance resets.",
    };
    return {
      heading: "Je gratis analyses zijn gebruikt",
      description: resetMoment
        ? `Je hebt je 3 gratis analyses gebruikt. Je tegoed wordt automatisch vernieuwd op ${resetMoment}. Daarna krijg je opnieuw 3 gratis analyses.`
        : "Je hebt je 3 gratis analyses gebruikt. Zodra je tegoed vernieuwd is, kun je opnieuw testen.",
    };
  }
  if (locale === "en") return {
    heading: "The request limit has been reached",
    description: resetMoment
      ? `You can submit another request on ${resetMoment}.`
      : "You cannot submit another analysis right now. Please try again later.",
  };
  return {
    heading: "De aanvraaglimiet is bereikt",
    description: resetMoment
      ? `${input.message} Je kunt opnieuw aanvragen op ${resetMoment}.`
      : input.message,
  };
}
