import { businessConfig } from "@/config/business.config";
import type { ApplicationCase } from "@/data/applicationCases";
import type { SupportedLocale } from "@/i18n/locales";

export type ApplicationCaseJsonLdInput = {
  project: ApplicationCase;
  canonical: string;
  cover?: string;
  locale?: SupportedLocale;
};

export function buildApplicationCaseJsonLd({
  project,
  canonical,
  cover,
  locale = "nl",
}: ApplicationCaseJsonLdInput): Record<string, unknown> {
  const organizationId = `${businessConfig.url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: project.seoTitle,
    description: project.seoDescription,
    inLanguage: locale === "en" ? "en-BE" : "nl-BE",
    isPartOf: { "@id": `${businessConfig.url}/#website` },
    publisher: { "@id": organizationId },
    ...(cover
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: cover,
          },
        }
      : {}),
    mainEntity: {
      "@type": "CreativeWork",
      "@id": `${canonical}#project`,
      name: project.title,
      description: project.seoDescription,
      genre: locale === "en" ? "Custom software project" : "Maatwerk softwareproject",
      creativeWorkStatus: project.status === "live" ? "Published" : "In development",
      creator: { "@id": organizationId },
      keywords: project.capabilities,
      ...(cover ? { image: cover } : {}),
    },
  };
}
