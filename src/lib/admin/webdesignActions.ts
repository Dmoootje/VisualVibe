"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { setWebdesignImage } from "@/lib/firestore/webdesignImages";
import { setWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { revalidateWebdesign } from "@/lib/admin/revalidateWebdesign";
import type { WebdesignProject } from "@/data/webdesignShowcase";

export type ImageActionResult = { ok: boolean; error?: string };

/** Persist (url) or clear ("") one webdesign showcase image key. */
export async function saveWebdesignImage(key: string, url: string): Promise<ImageActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!key) return { ok: false, error: "Ongeldige sleutel." };

  try {
    await setWebdesignImage(key, url);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }

  revalidateWebdesign();
  return { ok: true };
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strList = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];

function sanitizeProject(p: WebdesignProject): WebdesignProject {
  const id = str(p.id);
  return {
    id: id || `p-${str(p.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` || "project",
    name: str(p.name),
    client: str(p.client),
    url: str(p.url),
    tags: strList(p.tags).slice(0, 3),
    teaser: str(p.teaser),
    text: str(p.text),
    features: strList(p.features),
    terms: strList(p.terms),
  };
}

/** Replace the full ordered list of webdesign showcase projects. */
export async function saveWebdesignProjects(
  projects: WebdesignProject[],
): Promise<ImageActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Niet ingelogd." };
  if (!Array.isArray(projects)) return { ok: false, error: "Ongeldige gegevens." };

  const clean = projects.map(sanitizeProject).filter((p) => p.name);
  const ids = new Set(clean.map((p) => p.id));
  if (ids.size !== clean.length) {
    return { ok: false, error: "Elke realisatie heeft een unieke naam nodig." };
  }

  try {
    await setWebdesignProjects(clean);
  } catch {
    return { ok: false, error: "Opslaan mislukt." };
  }

  revalidateWebdesign();
  return { ok: true };
}
