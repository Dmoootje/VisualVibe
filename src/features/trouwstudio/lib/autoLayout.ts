import type {
  AlbumFrame,
  AlbumLayoutDefinition,
  AlbumTextBlock,
  WeddingAlbum,
  WeddingAlbumChapter,
  WeddingAlbumPage,
  WeddingAlbumTemplate,
  WeddingPhoto,
  WeddingScene,
} from "../types";
import { coupleName, SCENE_LABELS, type WeddingProject } from "../types";

// Automatische pagina-indeling: verdeelt de albumselectie over hoofdstukken
// en kiest per pagina een lay-out met voldoende variatie. Regels uit de
// opdracht: foto's nooit vervormen (kaders croppen alleen), oriëntatie
// respecteren, rustige en drukkere pagina's afwisselen, hero's groot laten.

const SCENE_ORDER: WeddingScene[] = [
  "voorbereiding",
  "aankomst",
  "ceremonie",
  "groepsfoto",
  "koppelshoot",
  "receptie",
  "diner",
  "openingsdans",
  "feest",
  "detailfoto",
  "locatie",
  "onbekend",
];

export const DEFAULT_CHAPTERS: { title: string; scene?: WeddingScene }[] = [
  { title: "Voorbereidingen", scene: "voorbereiding" },
  { title: "De ceremonie", scene: "ceremonie" },
  { title: "Familie en vrienden", scene: "groepsfoto" },
  { title: "De koppelshoot", scene: "koppelshoot" },
  { title: "De receptie", scene: "receptie" },
  { title: "Het diner", scene: "diner" },
  { title: "De openingsdans", scene: "openingsdans" },
  { title: "Het avondfeest", scene: "feest" },
];

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function fillFrames(layout: AlbumLayoutDefinition, photos: WeddingPhoto[]): AlbumFrame[] {
  return layout.frames.map((frame, i) => ({ ...frame, photoId: photos[i]?.id }));
}

function textBlocks(layout: AlbumLayoutDefinition, values: Partial<Record<AlbumTextBlock["role"], string>>): AlbumTextBlock[] {
  return layout.textBlocks.map((block) => ({ ...block, text: values[block.role] ?? block.text }));
}

function frameOrientation(frame: AlbumFrame, template: WeddingAlbumTemplate): "portrait" | "landscape" | "square" {
  const w = (frame.width / 100) * template.pageWidth;
  const h = (frame.height / 100) * template.pageHeight;
  if (Math.abs(w - h) / Math.max(w, h) < 0.15) return "square";
  return w > h ? "landscape" : "portrait";
}

/**
 * Kies foto's die qua oriëntatie bij de kaders van de lay-out passen; de
 * best scorende (album-geschiktheid) eerst zodat hero-kaders sterke beelden
 * krijgen.
 */
function pickForLayout(layout: AlbumLayoutDefinition, template: WeddingAlbumTemplate, pool: WeddingPhoto[]): WeddingPhoto[] | null {
  if (pool.length < layout.frameCount) return null;
  const remaining = [...pool];
  const picked: WeddingPhoto[] = [];
  for (const frame of layout.frames) {
    const wanted = frameOrientation(frame, template);
    let index = remaining.findIndex((photo) => photo.orientation === wanted);
    if (index === -1) index = remaining.findIndex((photo) => photo.orientation === "square");
    if (index === -1) index = 0;
    picked.push(remaining.splice(index, 1)[0]);
  }
  return picked;
}

function scoreOf(photo: WeddingPhoto): number {
  return photo.analysis?.albumSuitabilityScore ?? photo.analysis?.qualityScore ?? 50;
}

/**
 * Bouwt de pagina's voor één hoofdstuk: opener + afwisselend rustige (1
 * beeld) en drukkere (2-4 beelden) lay-outs.
 */
function buildChapterPages(
  chapter: WeddingAlbumChapter,
  photos: WeddingPhoto[],
  template: WeddingAlbumTemplate,
): WeddingAlbumPage[] {
  const pages: WeddingAlbumPage[] = [];
  const sorted = [...photos].sort((a, b) => scoreOf(b) - scoreOf(a));

  const openerLayout = template.chapterLayouts[0];
  const openerPhoto = sorted.shift();
  pages.push({
    id: nextId("pagina"),
    chapterId: chapter.id,
    layoutId: openerLayout.id,
    frames: fillFrames(openerLayout, openerPhoto ? [openerPhoto] : []),
    textBlocks: textBlocks(openerLayout, {
      meta: chapter.scene ? SCENE_LABELS[chapter.scene].toUpperCase() : "HOOFDSTUK",
      title: chapter.title,
    }),
  });

  // Afwisseling: rustig (hero) -> drukker (2-4 beelden) -> rustig -> ...
  const calm = template.galleryLayouts.filter((l) => l.frameCount === 1);
  const busy = template.galleryLayouts.filter((l) => l.frameCount > 1);
  let useCalm = true;
  let busyIndex = 0;

  while (sorted.length > 0) {
    let layout: AlbumLayoutDefinition;
    if (useCalm || sorted.length === 1) {
      layout = calm[pages.length % calm.length] ?? template.galleryLayouts[0];
    } else {
      // Cycle door de drukkere lay-outs voor variatie; nooit meer kaders dan foto's.
      const candidates = busy.filter((l) => l.frameCount <= sorted.length);
      layout = candidates.length > 0 ? candidates[busyIndex % candidates.length] : calm[0];
      busyIndex += 1;
    }
    const picked = pickForLayout(layout, template, sorted);
    if (!picked) break;
    for (const photo of picked) {
      const index = sorted.findIndex((p) => p.id === photo.id);
      if (index !== -1) sorted.splice(index, 1);
    }
    pages.push({
      id: nextId("pagina"),
      chapterId: chapter.id,
      layoutId: layout.id,
      frames: fillFrames(layout, picked),
      textBlocks: textBlocks(layout, {}),
    });
    useCalm = !useCalm;
  }

  return pages;
}

export type AutoLayoutInput = {
  project: WeddingProject;
  photos: WeddingPhoto[];
  template: WeddingAlbumTemplate;
  chapters?: WeddingAlbumChapter[];
  title?: string;
  subtitle?: string;
  quote?: string;
  foreword?: string;
};

/** Genereert een volledig album (hoofdstukken + pagina's) uit de selectie. */
export function buildAlbumLayout(input: AutoLayoutInput): Pick<WeddingAlbum, "chapters" | "pages"> {
  const { project, template } = input;
  const selection = input.photos.filter((photo) => photo.selectedForAlbum && photo.status !== "afgekeurd");

  // Hoofdstukken: opgegeven set, of standaardset beperkt tot scènes met foto's.
  const chapters: WeddingAlbumChapter[] =
    input.chapters && input.chapters.length > 0
      ? input.chapters
      : DEFAULT_CHAPTERS.filter((entry) =>
          selection.some((photo) => (photo.analysis?.scene ?? "onbekend") === entry.scene),
        ).map((entry) => ({ id: nextId("hoofdstuk"), title: entry.title, scene: entry.scene, hidden: false }));
  if (chapters.length === 0) {
    chapters.push({ id: nextId("hoofdstuk"), title: "Jullie dag", hidden: false });
  }

  const pages: WeddingAlbumPage[] = [];
  const couple = coupleName(project);

  // Cover
  const coverLayout = template.coverLayouts[0];
  const coverPhoto = [...selection].sort((a, b) => scoreOf(b) - scoreOf(a))[0];
  pages.push({
    id: nextId("pagina"),
    layoutId: coverLayout.id,
    frames: fillFrames(coverLayout, coverPhoto ? [coverPhoto] : []),
    textBlocks: textBlocks(coverLayout, {
      title: input.title || couple,
      subtitle: input.subtitle || "Ons trouwalbum",
      meta: project.weddingDate,
    }),
  });

  // Openingsquote
  if (input.quote) {
    const quoteLayout = template.textLayouts.find((l) => l.kind === "quote");
    if (quoteLayout) {
      pages.push({
        id: nextId("pagina"),
        layoutId: quoteLayout.id,
        frames: [],
        textBlocks: textBlocks(quoteLayout, { quote: input.quote }),
      });
    }
  }

  // Woord vooraf
  if (input.foreword) {
    const textLayout = template.textLayouts.find((l) => l.kind === "tekst-met-beeld");
    if (textLayout) {
      const photo = selection.find((p) => (p.analysis?.scene ?? "onbekend") === "detailfoto") ?? selection[1];
      pages.push({
        id: nextId("pagina"),
        layoutId: textLayout.id,
        frames: fillFrames(textLayout, photo ? [photo] : []),
        textBlocks: textBlocks(textLayout, { meta: "WOORD VOORAF", body: input.foreword }),
      });
    }
  }

  // Hoofdstukken op chronologische scènevolgorde.
  const used = new Set<string>(pages.flatMap((page) => page.frames.map((f) => f.photoId)).filter(Boolean) as string[]);
  const remaining = selection.filter((photo) => !used.has(photo.id));
  const visibleChapters = chapters.filter((chapter) => !chapter.hidden);
  const byChapter = new Map<string, WeddingPhoto[]>(visibleChapters.map((chapter) => [chapter.id, []]));
  const fallbackChapter = visibleChapters[visibleChapters.length - 1];

  for (const photo of remaining) {
    const scene = photo.analysis?.suggestedAlbumSection ?? photo.analysis?.scene ?? "onbekend";
    const chapter =
      visibleChapters.find((c) => c.scene === scene) ??
      visibleChapters.find((c) => c.scene && SCENE_ORDER.indexOf(c.scene) >= SCENE_ORDER.indexOf(scene)) ??
      fallbackChapter;
    if (chapter) byChapter.get(chapter.id)?.push(photo);
  }

  for (const chapter of visibleChapters) {
    const photos = byChapter.get(chapter.id) ?? [];
    if (photos.length === 0) continue;
    pages.push(...buildChapterPages(chapter, photos, template));
  }

  // Slotwoord + achtercover-tekst.
  const slotLayout = template.closingLayouts[0];
  if (slotLayout) {
    const photo = [...selection].sort((a, b) => scoreOf(b) - scoreOf(a))[1];
    pages.push({
      id: nextId("pagina"),
      layoutId: slotLayout.id,
      frames: fillFrames(slotLayout, photo ? [photo] : []),
      textBlocks: textBlocks(slotLayout, {
        body: input.foreword ? "Bedankt om deze dag met ons te delen." : `${couple} - ${project.weddingDate}`,
        meta: input.subtitle || project.city || "",
      }),
    });
  }

  return { chapters, pages };
}
