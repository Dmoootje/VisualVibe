import type { ReactNode } from "react";
import { ApplicationPortfolioCarousel } from "@/components/realisaties/ApplicationPortfolioCarousel";
import {
  getApplicationCaseImages,
  getApplicationCases,
} from "@/lib/firestore/applicationCases";
import { getApplicationCaseByLocalizedSlug, getLocalizedApplicationCaseById } from "@/data/applicationCases";
import type { SupportedLocale } from "@/i18n/locales";

export const revalidate = 60;

export default async function ApplicationCaseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as SupportedLocale;
  const [projects, images] = await Promise.all([
    getApplicationCases(),
    getApplicationCaseImages(),
  ]);

  let currentId = slug;
  try { currentId = getApplicationCaseByLocalizedSlug(slug, locale).id; } catch { /* page handles 404 */ }
  const relatedProjects = projects.flatMap((project) => {
    if (!project.published || project.id === currentId) return [];
    if (locale === "nl") return [project];
    try { return [getLocalizedApplicationCaseById(project.id, locale)]; } catch { return []; }
  });

  return (
    <>
      {children}
      <ApplicationPortfolioCarousel projects={relatedProjects} images={images} locale={locale} />
    </>
  );
}
