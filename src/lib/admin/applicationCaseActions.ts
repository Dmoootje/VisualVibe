"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
  setApplicationCaseImage,
  setApplicationCases,
} from "@/lib/firestore/applicationCases";
import type { ApplicationCase, ApplicationCaseStatus } from "@/data/applicationCases";

export type ApplicationCaseActionResult = { ok: boolean; error?: string };

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => str(item)).filter(Boolean) : [];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function status(value: unknown): ApplicationCaseStatus {
  return value === "in-development" ? "in-development" : "live";
}

function sanitize(project: ApplicationCase): ApplicationCase {
  const title = str(project.title);
  const id = str(project.id) || slugify(title) || `case-${Date.now()}`;
  const slug = slugify(str(project.slug) || title || id);
  return {
    id,
    slug,
    title,
    client: str(project.client),
    websiteUrl: str(project.websiteUrl),
    status: status(project.status),
    published: project.published !== false,
    featured: project.featured === true,
    tags: list(project.tags).slice(0, 4),
    tagline: str(project.tagline),
    excerpt: str(project.excerpt),
    challenge: str(project.challenge),
    solution: str(project.solution),
    capabilities: list(project.capabilities),
    technology: list(project.technology),
    results: list(project.results),
    ssr: {
      title: str(project.ssr?.title),
      description: str(project.ssr?.description),
      points: list(project.ssr?.points),
    },
    seoTitle: str(project.seoTitle),
    seoDescription: str(project.seoDescription),
  };
}

function revalidate(projects?: ApplicationCase[]) {
  revalidatePath("/realisaties/");
  revalidatePath("/realisaties/applicaties/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap/");
  for (const project of projects ?? []) {
    revalidatePath(`/realisaties/applicaties/${project.slug}/`);
  }
}

export async function saveApplicationCases(
  projects: ApplicationCase[],
): Promise<ApplicationCaseActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!Array.isArray(projects)) return { ok: false, error: "Ongeldige gegevens." };

  const clean = projects.map(sanitize).filter((project) => project.title && project.slug);
  const ids = new Set(clean.map((project) => project.id));
  const slugs = new Set(clean.map((project) => project.slug));
  if (ids.size !== clean.length || slugs.size !== clean.length) {
    return { ok: false, error: "Elke case heeft een unieke ID en URL-slug nodig." };
  }

  try {
    await setApplicationCases(clean);
    revalidate(clean);
    return { ok: true };
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }
}

export async function saveApplicationCaseImage(
  key: string,
  url: string,
): Promise<ApplicationCaseActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!key) return { ok: false, error: "Ongeldige afbeeldingssleutel." };

  try {
    await setApplicationCaseImage(key, url);
    revalidate();
    return { ok: true };
  } catch {
    return { ok: false, error: "Afbeelding opslaan mislukt." };
  }
}
