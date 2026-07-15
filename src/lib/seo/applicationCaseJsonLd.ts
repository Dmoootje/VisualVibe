import { businessConfig } from "@/config/business.config";
import type { ApplicationCase } from "@/data/applicationCases";

export type ApplicationCaseJsonLdInput = {
  project: ApplicationCase;
  canonical: string;
  cover?: string;
};

export function buildApplicationCaseJsonLd({
  project,
  canonical,
  cover,
}: ApplicationCaseJsonLdInput): Record<string, unknown> {
  const organizationId = `${businessConfig.url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: project.seoTitle,
    description: project.seoDescription,
    inLanguage: "nl-BE",
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
      genre: "Maatwerk softwareproject",
      creativeWorkStatus: project.status === "live" ? "Published" : "In development",
      creator: { "@id": organizationId },
      keywords: project.capabilities,
      ...(cover ? { image: cover } : {}),
    },
  };
}
