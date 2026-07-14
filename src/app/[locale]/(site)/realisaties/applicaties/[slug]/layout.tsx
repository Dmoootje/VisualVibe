import type { ReactNode } from "react";
import { ApplicationPortfolioCarousel } from "@/components/realisaties/ApplicationPortfolioCarousel";
import {
  getApplicationCaseImages,
  getApplicationCases,
} from "@/lib/firestore/applicationCases";

export const revalidate = 60;

export default async function ApplicationCaseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [projects, images] = await Promise.all([
    getApplicationCases(),
    getApplicationCaseImages(),
  ]);

  const relatedProjects = projects.filter(
    (project) => project.published && project.slug !== slug,
  );

  return (
    <>
      {children}
      <ApplicationPortfolioCarousel projects={relatedProjects} images={images} />
    </>
  );
}
