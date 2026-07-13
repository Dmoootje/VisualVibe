import type { AlbumLayoutDefinition, WeddingAlbumTemplate } from "../types";

// Ivory Editorial: luxe, rustig, gebroken wit met champagne-accent. Alle
// posities in procenten van de pagina zodat dezelfde definities zowel de
// HTML-builderpreview als de PDF-renderer voeden (datagedreven, geen
// hardgecodeerde PDF-layout).

const M = 10; // standaard binnenmarge in %

const cover: AlbumLayoutDefinition = {
  id: "ivory-cover",
  kind: "cover",
  name: "Cover met venster",
  frameCount: 1,
  frames: [{ x: 18, y: 14, width: 64, height: 52 }],
  textBlocks: [
    { role: "title", text: "", x: 10, y: 72, width: 80, align: "center" },
    { role: "subtitle", text: "", x: 10, y: 82, width: 80, align: "center" },
    { role: "meta", text: "", x: 10, y: 90, width: 80, align: "center" },
  ],
};

const chapterOpener: AlbumLayoutDefinition = {
  id: "ivory-hoofdstuk",
  kind: "hoofdstukopener",
  name: "Hoofdstukopener",
  frameCount: 1,
  frames: [{ x: 34, y: 34, width: 56, height: 56 }],
  textBlocks: [
    { role: "meta", text: "", x: M, y: 16, width: 40, align: "left" },
    { role: "title", text: "", x: M, y: 22, width: 44, align: "left" },
  ],
};

const hero: AlbumLayoutDefinition = {
  id: "ivory-hero",
  kind: "hero",
  name: "Eén grote foto",
  frameCount: 1,
  frames: [{ x: M, y: M, width: 100 - 2 * M, height: 100 - 2 * M }],
  textBlocks: [],
};

const spreadVol: AlbumLayoutDefinition = {
  id: "ivory-spread-vol",
  kind: "spread-vol",
  name: "Volledige pagina (aflopend)",
  frameCount: 1,
  frames: [{ x: 0, y: 0, width: 100, height: 100 }],
  textBlocks: [],
};

const tweeLiggend: AlbumLayoutDefinition = {
  id: "ivory-twee-liggend",
  kind: "twee-liggend",
  name: "Twee liggende foto's",
  frameCount: 2,
  frames: [
    { x: M, y: 8, width: 100 - 2 * M, height: 40 },
    { x: M, y: 52, width: 100 - 2 * M, height: 40 },
  ],
  textBlocks: [],
};

const tweeStaand: AlbumLayoutDefinition = {
  id: "ivory-twee-staand",
  kind: "twee-staand",
  name: "Twee staande foto's",
  frameCount: 2,
  frames: [
    { x: 7, y: 12, width: 41, height: 76 },
    { x: 52, y: 12, width: 41, height: 76 },
  ],
  textBlocks: [],
};

const grootMetDetails: AlbumLayoutDefinition = {
  id: "ivory-groot-details",
  kind: "groot-met-details",
  name: "Groot beeld met twee details",
  frameCount: 3,
  frames: [
    { x: 7, y: 8, width: 60, height: 84 },
    { x: 71, y: 8, width: 22, height: 40 },
    { x: 71, y: 52, width: 22, height: 40 },
  ],
  textBlocks: [],
};

const drieBeelden: AlbumLayoutDefinition = {
  id: "ivory-drie",
  kind: "drie-beelden",
  name: "Drie beelden",
  frameCount: 3,
  frames: [
    { x: 7, y: 10, width: 28, height: 80 },
    { x: 37, y: 10, width: 28, height: 80 },
    { x: 67, y: 10, width: 28, height: 80 },
  ],
  textBlocks: [],
};

const rasterVier: AlbumLayoutDefinition = {
  id: "ivory-raster-vier",
  kind: "raster-vier",
  name: "Vierbeeldenraster",
  frameCount: 4,
  frames: [
    { x: 8, y: 8, width: 41, height: 41 },
    { x: 51, y: 8, width: 41, height: 41 },
    { x: 8, y: 51, width: 41, height: 41 },
    { x: 51, y: 51, width: 41, height: 41 },
  ],
  textBlocks: [],
};

const tekstMetBeeld: AlbumLayoutDefinition = {
  id: "ivory-tekst",
  kind: "tekst-met-beeld",
  name: "Tekstpagina met klein beeld",
  frameCount: 1,
  frames: [{ x: 58, y: 26, width: 32, height: 48 }],
  textBlocks: [
    { role: "meta", text: "", x: M, y: 22, width: 40, align: "left" },
    { role: "body", text: "", x: M, y: 30, width: 42, align: "left" },
  ],
};

const tijdlijn: AlbumLayoutDefinition = {
  id: "ivory-tijdlijn",
  kind: "tijdlijn",
  name: "Tijdlijn van de dag",
  frameCount: 0,
  frames: [],
  textBlocks: [
    { role: "meta", text: "HET VERHAAL VAN DE DAG", x: M, y: 14, width: 80, align: "left" },
    { role: "body", text: "", x: M, y: 24, width: 68, align: "left" },
  ],
};

const quote: AlbumLayoutDefinition = {
  id: "ivory-quote",
  kind: "quote",
  name: "Quote-pagina",
  frameCount: 0,
  frames: [],
  textBlocks: [{ role: "quote", text: "", x: 16, y: 40, width: 68, align: "center" }],
};

const slot: AlbumLayoutDefinition = {
  id: "ivory-slot",
  kind: "slot",
  name: "Slotwoord",
  frameCount: 1,
  frames: [{ x: 34, y: 12, width: 32, height: 40 }],
  textBlocks: [
    { role: "body", text: "", x: 20, y: 60, width: 60, align: "center" },
    { role: "meta", text: "", x: 20, y: 84, width: 60, align: "center" },
  ],
};

export const IVORY_EDITORIAL: WeddingAlbumTemplate = {
  id: "ivory-editorial",
  name: "Ivory Editorial",
  description:
    "Luxe en rustig: gebroken wit, veel witruimte, elegante serif-titels en een champagnekleurig accent. Fotografie staat centraal.",
  available: true,
  format: "A4",
  orientation: "portrait",
  pageWidth: 210,
  pageHeight: 297,
  margins: 14,
  bleed: 3,
  colors: {
    background: "#FBF9F4",
    surface: "#F4F0E6",
    text: "#3A342C",
    mutedText: "#8C8375",
    accent: "#B9A15E",
    hairline: "rgba(185,161,94,0.4)",
  },
  fonts: {
    heading: "Cormorant Garamond",
    body: "Lora",
    accent: "Great Vibes",
  },
  coverLayouts: [cover],
  chapterLayouts: [chapterOpener],
  galleryLayouts: [hero, spreadVol, tweeLiggend, tweeStaand, grootMetDetails, drieBeelden, rasterVier],
  textLayouts: [tekstMetBeeld, tijdlijn, quote],
  closingLayouts: [slot],
};

/** Alle templates; alleen Ivory Editorial is nu actief, de rest is aangekondigd. */
export const WEDDING_ALBUM_TEMPLATES: WeddingAlbumTemplate[] = [
  IVORY_EDITORIAL,
  {
    ...IVORY_EDITORIAL,
    id: "romantic-botanical",
    name: "Romantic Botanical",
    description: "Zachte groentinten en botanische accenten. Binnenkort beschikbaar.",
    available: false,
  },
  {
    ...IVORY_EDITORIAL,
    id: "black-tie-luxury",
    name: "Black Tie Luxury",
    description: "Diep zwart met goud, formeel en statig. Binnenkort beschikbaar.",
    available: false,
  },
  {
    ...IVORY_EDITORIAL,
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Strak wit, sans-serif, maximale rust. Binnenkort beschikbaar.",
    available: false,
  },
  {
    ...IVORY_EDITORIAL,
    id: "cinematic-dark",
    name: "Cinematic Dark",
    description: "Donker en filmisch, voor avondreportages. Binnenkort beschikbaar.",
    available: false,
  },
];

export function getAlbumTemplate(id: string): WeddingAlbumTemplate {
  return WEDDING_ALBUM_TEMPLATES.find((t) => t.id === id) ?? IVORY_EDITORIAL;
}

export function getLayoutDefinition(template: WeddingAlbumTemplate, layoutId: string): AlbumLayoutDefinition | undefined {
  return [
    ...template.coverLayouts,
    ...template.chapterLayouts,
    ...template.galleryLayouts,
    ...template.textLayouts,
    ...template.closingLayouts,
  ].find((layout) => layout.id === layoutId);
}
