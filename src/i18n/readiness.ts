import type { SupportedLocale } from "./locales";

export type LocaleReadinessIssueCode =
  | "missing_message"
  | "missing_content"
  | "missing_metadata"
  | "missing_alt"
  | "missing_translation_partner"
  | "cross_locale_link"
  | "published_route_leak";

export type LocaleReadinessIssue = {
  code: LocaleReadinessIssueCode;
  locale: SupportedLocale;
  source: string;
  message: string;
};

export type LocaleReadinessContent = {
  source: string;
  present?: boolean;
  metadata?: Record<string, string | undefined>;
  requiredMetadata?: string[];
  images?: Array<{
    source: string;
    alt?: string;
    decorative?: boolean;
  }>;
  requiresTranslationPartner?: boolean;
  translationPartner?: string;
  links?: string[];
};

export type LocaleReadinessInput = {
  locale: SupportedLocale;
  requiredMessageKeys?: string[];
  messageKeys?: string[];
  content?: LocaleReadinessContent[];
  publishedRouteLeaks?: string[];
};

const localePrefixes: Record<SupportedLocale, string> = {
  nl: "/be",
  en: "/en",
  fr: "/fr",
  de: "/de",
};

function isCrossLocaleLink(link: string, locale: SupportedLocale): boolean {
  if (!link.startsWith("/")) return false;

  return Object.entries(localePrefixes).some(
    ([candidate, prefix]) =>
      candidate !== locale &&
      (link === prefix ||
        ["/", "?", "#"].some((separator) =>
          link.startsWith(`${prefix}${separator}`),
        )),
  );
}

export function evaluateLocaleReadiness(
  input: LocaleReadinessInput,
): { ready: boolean; issues: LocaleReadinessIssue[] } {
  const issues: LocaleReadinessIssue[] = [];
  const addIssue = (
    code: LocaleReadinessIssueCode,
    source: string,
    message: string,
  ) => issues.push({ code, locale: input.locale, source, message });

  const messageKeys = new Set(input.messageKeys ?? []);
  for (const key of input.requiredMessageKeys ?? []) {
    if (!messageKeys.has(key)) {
      addIssue("missing_message", key, `Missing ${input.locale} message: ${key}`);
    }
  }

  for (const item of input.content ?? []) {
    if (item.present === false) {
      addIssue("missing_content", item.source, `Missing ${input.locale} content`);
      continue;
    }

    for (const key of item.requiredMetadata ?? []) {
      if (!item.metadata?.[key]?.trim()) {
        addIssue(
          "missing_metadata",
          `${item.source}:${key}`,
          `Missing ${input.locale} metadata field: ${key}`,
        );
      }
    }

    for (const image of item.images ?? []) {
      if (!image.decorative && !image.alt?.trim()) {
        addIssue(
          "missing_alt",
          `${item.source}:${image.source}`,
          `Missing ${input.locale} alt text`,
        );
      }
    }

    if (item.requiresTranslationPartner && !item.translationPartner?.trim()) {
      addIssue(
        "missing_translation_partner",
        item.source,
        `Missing translation partner for ${input.locale} content`,
      );
    }

    for (const link of item.links ?? []) {
      if (isCrossLocaleLink(link, input.locale)) {
        addIssue(
          "cross_locale_link",
          `${item.source}:${link}`,
          `${input.locale} content links to another locale: ${link}`,
        );
      }
    }
  }

  for (const route of input.publishedRouteLeaks ?? []) {
    addIssue(
      "published_route_leak",
      route,
      `Unpublished ${input.locale} route is publicly reachable: ${route}`,
    );
  }

  issues.sort(
    (left, right) =>
      left.code.localeCompare(right.code) || left.source.localeCompare(right.source),
  );

  return { ready: issues.length === 0, issues };
}
