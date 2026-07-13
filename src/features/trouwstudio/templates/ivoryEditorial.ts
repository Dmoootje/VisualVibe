import type {
  AlbumLayoutDefinition,
  AlbumTextBlock,
  WeddingAlbumTemplate,
} from "../types";

// Albumtemplates voor de trouwstudio. Vijf print-klare A4-stijlen (uit de
// WeddingVibe-handoff) in liggend én staand = tien selecteerbare templates.
// Alles is datagedreven: posities in procenten van de pagina, kleuren en fonts
// als tokens. Dezelfde data voedt de HTML-builderpreview en de PDF-renderer.
// De accentkleur is per album los instelbaar (album.accentColor overschrijft
// template.colors.accent).

const IN = 25.4; // mm per inch

/* ------------------------------------------------------------------ presets */

type Preset = {
  key: string;
  name: string;
  description: string;
  /** Paginamarge in inch (uit de handoff --pad / --frame-pad). */
  padIn: number;
  coverStyle: "framed" | "bleed";
  /** Uitlijning van de covertekst bij een full-bleed cover. */
  coverAlign: "left" | "center";
  /** Namen in een script-lettertype (Great Vibes) i.p.v. gespatieerde kapitalen. */
  scriptName: boolean;
  colors: WeddingAlbumTemplate["colors"];
  fonts: WeddingAlbumTemplate["fonts"];
};

const PRESETS: Preset[] = [
  {
    key: "blanc",
    name: "Blanc",
    description:
      "Puur wit, gespatieerde kapitalen en een champagne-accent. Ingekaderde cover met dunne haarlijn. Rustig en tijdloos.",
    padIn: 0.7,
    coverStyle: "framed",
    coverAlign: "center",
    scriptName: false,
    colors: {
      background: "#FFFFFF",
      surface: "#F4F1EA",
      text: "#211C18",
      mutedText: "#6B6157",
      accent: "#C0983F",
      hairline: "rgba(180,150,90,0.4)",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lora", accent: "Great Vibes" },
  },
  {
    key: "ivoire",
    name: "Ivoire",
    description:
      "Gebroken wit met namen in sierlijk script en een warme goudtoon. Full-bleed cover met tekst links onderaan. Klassiek-romantisch.",
    padIn: 0.6,
    coverStyle: "bleed",
    coverAlign: "left",
    scriptName: true,
    colors: {
      background: "#F7F1E7",
      surface: "#EFE7D8",
      text: "#2A2320",
      mutedText: "#7A6E5E",
      accent: "#C29A4B",
      hairline: "rgba(194,154,75,0.4)",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lora", accent: "Great Vibes" },
  },
  {
    key: "editorial",
    name: "Editorial",
    description:
      "Strak en modern: wijd gespatieerde kapitalen, terracotta-accent en een full-bleed cover. Fotografie op de voorgrond.",
    padIn: 0.55,
    coverStyle: "bleed",
    coverAlign: "left",
    scriptName: false,
    colors: {
      background: "#FBFAF7",
      surface: "#F1EFE9",
      text: "#17140F",
      mutedText: "#6E655A",
      accent: "#A6603C",
      hairline: "rgba(23,20,15,0.16)",
    },
    fonts: { heading: "Cormorant", body: "Lora", accent: "Great Vibes" },
  },
  {
    key: "galerie",
    name: "Galerie",
    description:
      "Zeer ruime marges, mini gespatieerde kapitalen en een zacht taupe-accent. Ingekaderde cover. Museaal en luchtig.",
    padIn: 1.15,
    coverStyle: "framed",
    coverAlign: "center",
    scriptName: false,
    colors: {
      background: "#FFFFFF",
      surface: "#F3F1EC",
      text: "#2B2824",
      mutedText: "#8A8378",
      accent: "#9A8C6E",
      hairline: "rgba(43,40,36,0.14)",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lora", accent: "Great Vibes" },
  },
  {
    key: "romance",
    name: "Romance",
    description:
      "Zachte blush-tinten, namen in script en een gecentreerde full-bleed cover. Warm en gevoelig.",
    padIn: 0.7,
    coverStyle: "bleed",
    coverAlign: "center",
    scriptName: true,
    colors: {
      background: "#FBF3F1",
      surface: "#F3E7E4",
      text: "#3A2C2A",
      mutedText: "#8A6F6A",
      accent: "#C79A6A",
      hairline: "rgba(199,154,106,0.42)",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lora", accent: "Great Vibes" },
  },
];

/* ------------------------------------------------------------ geometrie */

function r(value: number): number {
  return Math.round(value * 100) / 100;
}

type Geo = {
  /** Marge links/rechts en boven/onder in % (per as, want A4 is niet vierkant). */
  mx: number;
  my: number;
  /** Binnenbox. */
  iw: number;
  ih: number;
};

function geometry(pageW: number, pageH: number, padIn: number): Geo {
  const padMm = padIn * IN;
  const mx = (padMm / pageW) * 100;
  const my = (padMm / pageH) * 100;
  return { mx, my, iw: 100 - 2 * mx, ih: 100 - 2 * my };
}

const COVER_WHITE = "#FFFFFF";
const COVER_SOFT_WHITE = "#ECE7DF";

function coverLayout(id: string, preset: Preset, g: Geo): AlbumLayoutDefinition {
  const scriptFont: AlbumTextBlock["font"] = preset.scriptName ? "accent" : "heading";
  if (preset.coverStyle === "bleed") {
    const left = preset.coverAlign === "center" ? r(g.mx) : r(g.mx);
    const width = r(g.iw);
    const align = preset.coverAlign;
    return {
      id,
      kind: "cover",
      name: "Cover (full-bleed)",
      frameCount: 1,
      frames: [{ x: 0, y: 0, width: 100, height: 100, scrim: true }],
      textBlocks: [
        { role: "subtitle", text: "", x: left, y: 57, width, align, color: COVER_SOFT_WHITE },
        { role: "title", text: "", x: left, y: 63, width, align, color: COVER_WHITE, font: scriptFont },
        { role: "meta", text: "", x: left, y: 85, width, align, color: COVER_SOFT_WHITE },
      ],
    };
  }
  // Ingekaderde cover: beeld bovenaan met haarlijn, tekst gecentreerd eronder.
  const frameBottom = 64;
  return {
    id,
    kind: "cover",
    name: "Cover (ingekaderd)",
    frameCount: 1,
    frames: [
      { x: r(g.mx), y: r(g.my), width: r(g.iw), height: r(frameBottom - g.my), framed: true },
    ],
    textBlocks: [
      { role: "subtitle", text: "", x: 8, y: 70, width: 84, align: "center" },
      { role: "title", text: "", x: 8, y: 76, width: 84, align: "center", font: scriptFont },
      { role: "meta", text: "", x: 8, y: 90, width: 84, align: "center" },
    ],
  };
}

function landscapeLayouts(prefix: string, preset: Preset): {
  cover: AlbumLayoutDefinition;
  chapter: AlbumLayoutDefinition;
  gallery: AlbumLayoutDefinition[];
  text: AlbumLayoutDefinition[];
  closing: AlbumLayoutDefinition;
} {
  const g = geometry(297, 210, preset.padIn);
  const { mx, my, iw, ih } = g;

  const chapter: AlbumLayoutDefinition = {
    id: `${prefix}-hoofdstuk`,
    kind: "hoofdstukopener",
    name: "Hoofdstukopener",
    frameCount: 1,
    frames: [{ x: r(52), y: r(my), width: r(100 - 52 - mx), height: r(ih) }],
    textBlocks: [
      { role: "meta", text: "", x: r(mx), y: 34, width: 40, align: "left" },
      { role: "title", text: "", x: r(mx), y: 40, width: 42, align: "left" },
    ],
  };

  const hero: AlbumLayoutDefinition = {
    id: `${prefix}-hero`,
    kind: "hero",
    name: "Eén groot beeld",
    frameCount: 1,
    frames: [{ x: r(mx), y: r(my), width: r(iw), height: r(ih) }],
    textBlocks: [],
  };

  const spreadVol: AlbumLayoutDefinition = {
    id: `${prefix}-spread-vol`,
    kind: "spread-vol",
    name: "Volledige pagina (aflopend)",
    frameCount: 1,
    frames: [{ x: 0, y: 0, width: 100, height: 100 }],
    textBlocks: [],
  };

  const halfH = (ih - my) / 2;
  const tweeLiggend: AlbumLayoutDefinition = {
    id: `${prefix}-twee-liggend`,
    kind: "twee-liggend",
    name: "Twee beelden boven elkaar",
    frameCount: 2,
    frames: [
      { x: r(mx), y: r(my), width: r(iw), height: r(halfH) },
      { x: r(mx), y: r(my + halfH + my), width: r(iw), height: r(halfH) },
    ],
    textBlocks: [],
  };

  const halfW = (iw - mx) / 2;
  const tweeStaand: AlbumLayoutDefinition = {
    id: `${prefix}-twee-staand`,
    kind: "twee-staand",
    name: "Twee beelden naast elkaar",
    frameCount: 2,
    frames: [
      { x: r(mx), y: r(my), width: r(halfW), height: r(ih) },
      { x: r(mx + halfW + mx), y: r(my), width: r(halfW), height: r(ih) },
    ],
    textBlocks: [],
  };

  const bigW = iw * 0.58;
  const rightX = mx + bigW + mx;
  const rightW = 100 - rightX - mx;
  const detH = (ih - my) / 2;
  const grootMetDetails: AlbumLayoutDefinition = {
    id: `${prefix}-groot-details`,
    kind: "groot-met-details",
    name: "Groot beeld met twee details",
    frameCount: 3,
    frames: [
      { x: r(mx), y: r(my), width: r(bigW), height: r(ih) },
      { x: r(rightX), y: r(my), width: r(rightW), height: r(detH) },
      { x: r(rightX), y: r(my + detH + my), width: r(rightW), height: r(detH) },
    ],
    textBlocks: [],
  };

  const colW = (iw - 2 * mx) / 3;
  const drieBeelden: AlbumLayoutDefinition = {
    id: `${prefix}-drie`,
    kind: "drie-beelden",
    name: "Drie beelden (raster)",
    frameCount: 3,
    frames: [0, 1, 2].map((i) => ({
      x: r(mx + i * (colW + mx)),
      y: r(my),
      width: r(colW),
      height: r(ih),
    })),
    textBlocks: [],
  };

  const qW = (iw - mx) / 2;
  const qH = (ih - my) / 2;
  const rasterVier: AlbumLayoutDefinition = {
    id: `${prefix}-raster-vier`,
    kind: "raster-vier",
    name: "Vier beelden (raster)",
    frameCount: 4,
    frames: [
      { x: r(mx), y: r(my), width: r(qW), height: r(qH) },
      { x: r(mx + qW + mx), y: r(my), width: r(qW), height: r(qH) },
      { x: r(mx), y: r(my + qH + my), width: r(qW), height: r(qH) },
      { x: r(mx + qW + mx), y: r(my + qH + my), width: r(qW), height: r(qH) },
    ],
    textBlocks: [],
  };

  const photoW = iw * 0.42;
  const textX = mx + photoW + mx;
  const textW = 100 - textX - mx;
  const tekstMetBeeld: AlbumLayoutDefinition = {
    id: `${prefix}-tekst`,
    kind: "tekst-met-beeld",
    name: "Woord vooraf (beeld + tekst)",
    frameCount: 1,
    frames: [{ x: r(mx), y: r(my), width: r(photoW), height: r(ih) }],
    textBlocks: [
      { role: "meta", text: "", x: r(textX), y: 26, width: r(textW), align: "left" },
      { role: "body", text: "", x: r(textX), y: 33, width: r(textW), align: "left" },
    ],
  };

  const tijdlijn: AlbumLayoutDefinition = {
    id: `${prefix}-tijdlijn`,
    kind: "tijdlijn",
    name: "Tijdlijn van de dag",
    frameCount: 0,
    frames: [],
    textBlocks: [
      { role: "meta", text: "HET VERHAAL VAN DE DAG", x: r(mx), y: 16, width: 70, align: "left" },
      { role: "body", text: "", x: r(mx), y: 26, width: r(Math.min(70, iw)), align: "left" },
    ],
  };

  const quote: AlbumLayoutDefinition = {
    id: `${prefix}-quote`,
    kind: "quote",
    name: "Quote-pagina",
    frameCount: 0,
    frames: [],
    textBlocks: [{ role: "quote", text: "", x: 18, y: 42, width: 64, align: "center" }],
  };

  const closing: AlbumLayoutDefinition = {
    id: `${prefix}-slot`,
    kind: "slot",
    name: "Slotwoord",
    frameCount: 1,
    frames: [{ x: 38, y: 14, width: 24, height: 44 }],
    textBlocks: [
      { role: "body", text: "", x: 22, y: 64, width: 56, align: "center" },
      { role: "meta", text: "", x: 22, y: 86, width: 56, align: "center" },
    ],
  };

  return {
    cover: coverLayout(`${prefix}-cover`, preset, g),
    chapter,
    gallery: [hero, spreadVol, tweeLiggend, tweeStaand, grootMetDetails, drieBeelden, rasterVier],
    text: [tekstMetBeeld, tijdlijn, quote],
    closing,
  };
}

function portraitLayouts(prefix: string, preset: Preset): {
  cover: AlbumLayoutDefinition;
  chapter: AlbumLayoutDefinition;
  gallery: AlbumLayoutDefinition[];
  text: AlbumLayoutDefinition[];
  closing: AlbumLayoutDefinition;
} {
  const g = geometry(210, 297, preset.padIn);
  const { mx, my, iw, ih } = g;

  const chapter: AlbumLayoutDefinition = {
    id: `${prefix}-hoofdstuk`,
    kind: "hoofdstukopener",
    name: "Hoofdstukopener",
    frameCount: 1,
    frames: [{ x: r(mx), y: 46, width: r(iw), height: r(100 - 46 - my) }],
    textBlocks: [
      { role: "meta", text: "", x: r(mx), y: 16, width: 80, align: "left" },
      { role: "title", text: "", x: r(mx), y: 22, width: 80, align: "left" },
    ],
  };

  const hero: AlbumLayoutDefinition = {
    id: `${prefix}-hero`,
    kind: "hero",
    name: "Eén groot beeld",
    frameCount: 1,
    frames: [{ x: r(mx), y: r(my), width: r(iw), height: r(ih) }],
    textBlocks: [],
  };

  const spreadVol: AlbumLayoutDefinition = {
    id: `${prefix}-spread-vol`,
    kind: "spread-vol",
    name: "Volledige pagina (aflopend)",
    frameCount: 1,
    frames: [{ x: 0, y: 0, width: 100, height: 100 }],
    textBlocks: [],
  };

  const halfH = (ih - my) / 2;
  const tweeLiggend: AlbumLayoutDefinition = {
    id: `${prefix}-twee-liggend`,
    kind: "twee-liggend",
    name: "Twee beelden boven elkaar",
    frameCount: 2,
    frames: [
      { x: r(mx), y: r(my), width: r(iw), height: r(halfH) },
      { x: r(mx), y: r(my + halfH + my), width: r(iw), height: r(halfH) },
    ],
    textBlocks: [],
  };

  const halfW = (iw - mx) / 2;
  const tweeStaand: AlbumLayoutDefinition = {
    id: `${prefix}-twee-staand`,
    kind: "twee-staand",
    name: "Twee beelden naast elkaar",
    frameCount: 2,
    frames: [
      { x: r(mx), y: r(my), width: r(halfW), height: r(ih) },
      { x: r(mx + halfW + mx), y: r(my), width: r(halfW), height: r(ih) },
    ],
    textBlocks: [],
  };

  const bigH = ih * 0.58;
  const bottomY = my + bigH + my;
  const bottomH = 100 - bottomY - my;
  const detW = (iw - mx) / 2;
  const grootMetDetails: AlbumLayoutDefinition = {
    id: `${prefix}-groot-details`,
    kind: "groot-met-details",
    name: "Groot beeld met twee details",
    frameCount: 3,
    frames: [
      { x: r(mx), y: r(my), width: r(iw), height: r(bigH) },
      { x: r(mx), y: r(bottomY), width: r(detW), height: r(bottomH) },
      { x: r(mx + detW + mx), y: r(bottomY), width: r(detW), height: r(bottomH) },
    ],
    textBlocks: [],
  };

  const rowH = (ih - 2 * my) / 3;
  const drieBeelden: AlbumLayoutDefinition = {
    id: `${prefix}-drie`,
    kind: "drie-beelden",
    name: "Drie beelden (raster)",
    frameCount: 3,
    frames: [0, 1, 2].map((i) => ({
      x: r(mx),
      y: r(my + i * (rowH + my)),
      width: r(iw),
      height: r(rowH),
    })),
    textBlocks: [],
  };

  const qW = (iw - mx) / 2;
  const qH = (ih - my) / 2;
  const rasterVier: AlbumLayoutDefinition = {
    id: `${prefix}-raster-vier`,
    kind: "raster-vier",
    name: "Vier beelden (raster)",
    frameCount: 4,
    frames: [
      { x: r(mx), y: r(my), width: r(qW), height: r(qH) },
      { x: r(mx + qW + mx), y: r(my), width: r(qW), height: r(qH) },
      { x: r(mx), y: r(my + qH + my), width: r(qW), height: r(qH) },
      { x: r(mx + qW + mx), y: r(my + qH + my), width: r(qW), height: r(qH) },
    ],
    textBlocks: [],
  };

  const photoTop = 52;
  const tekstMetBeeld: AlbumLayoutDefinition = {
    id: `${prefix}-tekst`,
    kind: "tekst-met-beeld",
    name: "Woord vooraf (tekst + beeld)",
    frameCount: 1,
    frames: [{ x: r(mx), y: photoTop, width: r(iw), height: r(100 - photoTop - my) }],
    textBlocks: [
      { role: "meta", text: "", x: r(mx), y: 12, width: r(iw), align: "left" },
      { role: "body", text: "", x: r(mx), y: 18, width: r(iw), align: "left" },
    ],
  };

  const tijdlijn: AlbumLayoutDefinition = {
    id: `${prefix}-tijdlijn`,
    kind: "tijdlijn",
    name: "Tijdlijn van de dag",
    frameCount: 0,
    frames: [],
    textBlocks: [
      { role: "meta", text: "HET VERHAAL VAN DE DAG", x: r(mx), y: 12, width: r(iw), align: "left" },
      { role: "body", text: "", x: r(mx), y: 20, width: r(iw), align: "left" },
    ],
  };

  const quote: AlbumLayoutDefinition = {
    id: `${prefix}-quote`,
    kind: "quote",
    name: "Quote-pagina",
    frameCount: 0,
    frames: [],
    textBlocks: [{ role: "quote", text: "", x: 14, y: 42, width: 72, align: "center" }],
  };

  const closing: AlbumLayoutDefinition = {
    id: `${prefix}-slot`,
    kind: "slot",
    name: "Slotwoord",
    frameCount: 1,
    frames: [{ x: 34, y: 12, width: 32, height: 34 }],
    textBlocks: [
      { role: "body", text: "", x: 18, y: 54, width: 64, align: "center" },
      { role: "meta", text: "", x: 18, y: 82, width: 64, align: "center" },
    ],
  };

  return {
    cover: coverLayout(`${prefix}-cover`, preset, g),
    chapter,
    gallery: [hero, spreadVol, tweeLiggend, tweeStaand, grootMetDetails, drieBeelden, rasterVier],
    text: [tekstMetBeeld, tijdlijn, quote],
    closing,
  };
}

function buildTemplate(preset: Preset, orientation: "landscape" | "portrait"): WeddingAlbumTemplate {
  const id = `${preset.key}-${orientation === "landscape" ? "landscape" : "portret"}`;
  const layouts =
    orientation === "landscape" ? landscapeLayouts(id, preset) : portraitLayouts(id, preset);
  const pageWidth = orientation === "landscape" ? 297 : 210;
  const pageHeight = orientation === "landscape" ? 210 : 297;
  return {
    id,
    name: `${preset.name} - ${orientation === "landscape" ? "liggend" : "staand"}`,
    description: preset.description,
    available: true,
    format: "A4",
    orientation: orientation === "landscape" ? "landscape" : "portrait",
    pageWidth,
    pageHeight,
    margins: Math.round(preset.padIn * IN),
    bleed: 3,
    colors: preset.colors,
    fonts: preset.fonts,
    coverLayouts: [layouts.cover],
    chapterLayouts: [layouts.chapter],
    galleryLayouts: layouts.gallery,
    textLayouts: layouts.text,
    closingLayouts: [layouts.closing],
  };
}

/* ---------------------------------------------------------------- export */

/** Tien templates: vijf presets in liggend en staand. */
export const WEDDING_ALBUM_TEMPLATES: WeddingAlbumTemplate[] = PRESETS.flatMap((preset) => [
  buildTemplate(preset, "landscape"),
  buildTemplate(preset, "portrait"),
]);

/** Presetgroepen (voor een gegroepeerde keuze-UI: preset + formaat). */
export const ALBUM_PRESETS = PRESETS.map((preset) => ({
  key: preset.key,
  name: preset.name,
  description: preset.description,
  coverStyle: preset.coverStyle,
  colors: preset.colors,
  fonts: preset.fonts,
  landscapeId: `${preset.key}-landscape`,
  portretId: `${preset.key}-portret`,
}));

// Oudere albums verwezen naar "ivory-editorial"; die blijven werken.
const LEGACY_TEMPLATE_ALIASES: Record<string, string> = {
  "ivory-editorial": "ivoire-portret",
};

export const DEFAULT_ALBUM_TEMPLATE_ID = "ivoire-portret";

/** Backward-compat alias voor de vroegere enige template. */
export const IVORY_EDITORIAL: WeddingAlbumTemplate =
  WEDDING_ALBUM_TEMPLATES.find((t) => t.id === DEFAULT_ALBUM_TEMPLATE_ID) ?? WEDDING_ALBUM_TEMPLATES[0];

export function getAlbumTemplate(id: string): WeddingAlbumTemplate {
  const direct = WEDDING_ALBUM_TEMPLATES.find((t) => t.id === id);
  if (direct) return direct;
  const alias = LEGACY_TEMPLATE_ALIASES[id];
  if (alias) {
    const aliased = WEDDING_ALBUM_TEMPLATES.find((t) => t.id === alias);
    if (aliased) return aliased;
  }
  return IVORY_EDITORIAL;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Template met een optionele accent-override toegepast (album.accentColor). */
export function resolveAlbumTemplate(id: string, accentColor?: string): WeddingAlbumTemplate {
  const template = getAlbumTemplate(id);
  if (accentColor && HEX.test(accentColor.trim())) {
    return { ...template, colors: { ...template.colors, accent: accentColor.trim() } };
  }
  return template;
}

export function getLayoutDefinition(
  template: WeddingAlbumTemplate,
  layoutId: string,
): AlbumLayoutDefinition | undefined {
  return [
    ...template.coverLayouts,
    ...template.chapterLayouts,
    ...template.galleryLayouts,
    ...template.textLayouts,
    ...template.closingLayouts,
  ].find((layout) => layout.id === layoutId);
}
