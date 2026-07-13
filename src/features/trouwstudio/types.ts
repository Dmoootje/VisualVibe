// Trouwstudio: datamodellen voor trouwprojecten, foto's, AI-analyse en
// trouwboeken. Provider-onafhankelijk: de service-interfaces staan in
// ./services/*, de Firestore-repositories in @/lib/firestore/trouwstudio.

/* ========================= Project ========================= */

export const WEDDING_PROJECT_STATUSES = [
  "concept",
  "fotos_toegevoegd",
  "analyse_bezig",
  "controle_nodig",
  "fotos_afgewerkt",
  "album_in_opmaak",
  "klaar_voor_export",
  "afgerond",
] as const;
export type WeddingProjectStatus = (typeof WEDDING_PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<WeddingProjectStatus, string> = {
  concept: "Concept",
  fotos_toegevoegd: "Foto's toegevoegd",
  analyse_bezig: "Analyse bezig",
  controle_nodig: "Controle nodig",
  fotos_afgewerkt: "Foto's afgewerkt",
  album_in_opmaak: "Album in opmaak",
  klaar_voor_export: "Klaar voor export",
  afgerond: "Afgerond",
};

export const WEDDING_EDITING_STYLES = [
  "natuurlijk",
  "warm-romantisch",
  "licht-en-luchtig",
  "editorial",
  "filmisch",
  "klassiek",
  "zwart-wit",
  "eigen-stijl",
] as const;
export type WeddingEditingStyle = (typeof WEDDING_EDITING_STYLES)[number];

export const EDITING_STYLE_LABELS: Record<WeddingEditingStyle, string> = {
  natuurlijk: "Natuurlijk",
  "warm-romantisch": "Warm romantisch",
  "licht-en-luchtig": "Licht en luchtig",
  editorial: "Editorial",
  filmisch: "Filmisch",
  klassiek: "Klassiek",
  "zwart-wit": "Zwart-wit",
  "eigen-stijl": "Eigen stijl",
};

/**
 * AI-gegenereerde starttekst voor het trouwboek. Wordt bij het aanmaken van
 * het project ingevuld en is in de Trouwboek-wizard vrij bewerkbaar. De
 * fotograaf kan met een knop een nieuwe set laten genereren.
 */
export type WeddingAlbumTexts = {
  subtitle: string;
  quote: string;
  personalMessage: string;
  foreword: string;
};

export type WeddingProject = {
  id: string;
  partnerOneName: string;
  partnerTwoName: string;
  weddingDate: string;
  ceremonyLocation?: string;
  receptionLocation?: string;
  city?: string;
  photographerName?: string;
  internalName: string;
  language: string;
  editingStyle: WeddingEditingStyle;
  status: WeddingProjectStatus;
  notes?: string;
  /** AI-starttekst voor het trouwboek (bewerkbaar in de wizard). */
  albumTexts?: WeddingAlbumTexts;
  coverPhotoUrl?: string;
  photoCount: number;
  optimizedPhotoCount: number;
  albumPhotoCount: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

/* ========================= Foto ========================= */

export const WEDDING_PHOTO_STATUSES = [
  "geupload",
  "wacht_op_analyse",
  "wordt_geanalyseerd",
  "voorstel_beschikbaar",
  "goedgekeurd",
  "handmatig_aangepast",
  "afgekeurd",
  "afgewerkt",
  "export_klaar",
  "fout",
] as const;
export type WeddingPhotoStatus = (typeof WEDDING_PHOTO_STATUSES)[number];

export const PHOTO_STATUS_LABELS: Record<WeddingPhotoStatus, string> = {
  geupload: "Geüpload",
  wacht_op_analyse: "Wacht op analyse",
  wordt_geanalyseerd: "Wordt geanalyseerd",
  voorstel_beschikbaar: "Voorstel beschikbaar",
  goedgekeurd: "Goedgekeurd",
  handmatig_aangepast: "Handmatig aangepast",
  afgekeurd: "Afgekeurd",
  afgewerkt: "Afgewerkt",
  export_klaar: "Export klaar",
  fout: "Fout",
};

export const WEDDING_SCENES = [
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
] as const;
export type WeddingScene = (typeof WEDDING_SCENES)[number];

export const SCENE_LABELS: Record<WeddingScene, string> = {
  voorbereiding: "Voorbereiding",
  aankomst: "Aankomst",
  ceremonie: "Ceremonie",
  groepsfoto: "Groepsfoto",
  koppelshoot: "Koppelshoot",
  receptie: "Receptie",
  diner: "Diner",
  openingsdans: "Openingsdans",
  feest: "Feest",
  detailfoto: "Detailfoto",
  locatie: "Locatie",
  onbekend: "Onbekend",
};

export const PHOTO_ISSUES = [
  "onscherp",
  "onderbelicht",
  "overbelicht",
  "gesloten_ogen",
  "ruis",
  "scheve_horizon",
  "afgesneden_onderwerp",
  "kleurzweem",
  "mogelijk_duplicaat",
  "lage_resolutie",
] as const;
export type PhotoIssue = (typeof PHOTO_ISSUES)[number];

export const PHOTO_ISSUE_LABELS: Record<PhotoIssue, string> = {
  onscherp: "Mogelijk onscherp",
  onderbelicht: "Onderbelicht",
  overbelicht: "Overbelicht",
  gesloten_ogen: "Gesloten ogen",
  ruis: "Ruis",
  scheve_horizon: "Scheve horizon",
  afgesneden_onderwerp: "Afgesneden onderwerp",
  kleurzweem: "Kleurzweem",
  mogelijk_duplicaat: "Mogelijk duplicaat",
  lage_resolutie: "Lage resolutie",
};

export type PhotoOrientation = "portrait" | "landscape" | "square";

/** Niet-destructieve correcties; alle waarden -100..100 (0 = neutraal), behalve straighten in graden. */
export type PhotoAdjustments = {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  gamma: number;
  temperature: number;
  tint: number;
  vibrance: number;
  saturation: number;
  clarity: number;
  texture: number;
  sharpness: number;
  noiseReduction: number;
  vignette: number;
  grain: number;
  /** Graden, -15..15. */
  straighten: number;
};

export const NEUTRAL_ADJUSTMENTS: PhotoAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  gamma: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
  clarity: 0,
  texture: 0,
  sharpness: 0,
  noiseReduction: 0,
  vignette: 0,
  grain: 0,
  straighten: 0,
};

export const CROP_RATIOS = [
  { id: "vrij", label: "Vrij / origineel", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:5", label: "4:5", ratio: 4 / 5 },
  { id: "3:2", label: "3:2", ratio: 3 / 2 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
  { id: "a4-staand", label: "A4 staand", ratio: 210 / 297 },
  { id: "a4-liggend", label: "A4 liggend", ratio: 297 / 210 },
  { id: "albumspread", label: "Albumspread", ratio: 2 * (297 / 210) },
] as const;
export type CropRatioId = (typeof CROP_RATIOS)[number]["id"];

/** Crop als fracties van het (rechtgezette) bronbeeld: 0..1. */
export type CropConfiguration = {
  ratioId: CropRatioId;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: 0 | 90 | 180 | 270;
  flipHorizontal: boolean;
};

export type CropSuggestion = {
  ratioId: CropRatioId;
  x: number;
  y: number;
  width: number;
  height: number;
  reason: string;
};

export type PhotoAnalysisResult = {
  /** 0..100. */
  qualityScore: number;
  /** 0..1: hoe zeker de analyse is. */
  confidence: number;
  scene: WeddingScene;
  orientation: PhotoOrientation;
  detectedIssues: PhotoIssue[];
  strengths: string[];
  adjustmentProposal: PhotoAdjustments;
  cropSuggestions: CropSuggestion[];
  /** 0..100: geschiktheid voor het trouwboek. */
  albumSuitabilityScore: number;
  suggestedAlbumSection?: WeddingScene;
  possibleDuplicateGroupId?: string;
  reviewRequired: boolean;
  /** Korte NL-toelichting van de analyse. */
  summary: string;
  /** Provider-id (bv. "claude" of "mock"); mock = Demonstratiemodus. */
  provider: string;
  analyzedAt: string;
};

export type WeddingPhoto = {
  id: string;
  projectId: string;
  originalUrl: string;
  previewUrl: string;
  thumbUrl: string;
  processedUrl?: string;
  filename: string;
  mimeType: string;
  width: number;
  height: number;
  /** Hash van de originele bytes (duplicaatdetectie). */
  contentHash: string;
  sizeBytes: number;
  orientation: PhotoOrientation;
  status: WeddingPhotoStatus;
  favorite: boolean;
  selectedForAlbum: boolean;
  analysis?: PhotoAnalysisResult;
  /** Voorstel dat nog niet is geaccepteerd of geweigerd. */
  adjustmentProposal?: PhotoAdjustments;
  appliedAdjustments?: PhotoAdjustments;
  crop?: CropConfiguration;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

/* ========================= Album ========================= */

export type AlbumFrame = {
  /** Positie in procenten van de pagina (0..100). */
  x: number;
  y: number;
  width: number;
  height: number;
  photoId?: string;
  /** Dunne haarlijn-kader rond het beeld (framed cover-stijl). */
  framed?: boolean;
  /** Donkere verloop-scrim over dit kader zodat overlaytekst leesbaar blijft (full-bleed cover). */
  scrim?: boolean;
};

export type AlbumTextBlock = {
  role: "title" | "subtitle" | "body" | "quote" | "caption" | "meta";
  text: string;
  x: number;
  y: number;
  width: number;
  align: "left" | "center" | "right";
  /** Overschrijft de rolkleur (bv. witte covertekst over een full-bleed foto). */
  color?: string;
  /** Overschrijft de rol-lettersoort (bv. script-namen op de cover). */
  font?: "heading" | "body" | "accent";
};

/** Curated accentkleuren uit de albumtemplate-handoff; los instelbaar per album. */
export const ALBUM_ACCENT_SWATCHES = [
  "#C29A4B",
  "#A6603C",
  "#9A8C6E",
  "#C79A6A",
  "#8C9A7B",
  "#8DA3B0",
] as const;

export const ALBUM_LAYOUT_KINDS = [
  "cover",
  "hoofdstukopener",
  "hero",
  "spread-vol",
  "twee-liggend",
  "twee-staand",
  "groot-met-details",
  "drie-beelden",
  "raster-vier",
  "tekst-met-beeld",
  "tijdlijn",
  "quote",
  "slot",
] as const;
export type AlbumLayoutKind = (typeof ALBUM_LAYOUT_KINDS)[number];

export type AlbumLayoutDefinition = {
  id: string;
  kind: AlbumLayoutKind;
  name: string;
  /** Aantal fotokaders in deze lay-out. */
  frameCount: number;
  frames: AlbumFrame[];
  textBlocks: AlbumTextBlock[];
};

export type WeddingAlbumTemplate = {
  id: string;
  name: string;
  description: string;
  available: boolean;
  format: "A4" | "square" | "landscape";
  orientation: "portrait" | "landscape";
  /** mm. */
  pageWidth: number;
  pageHeight: number;
  margins: number;
  bleed?: number;
  colors: {
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    accent: string;
    hairline: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent?: string;
  };
  coverLayouts: AlbumLayoutDefinition[];
  chapterLayouts: AlbumLayoutDefinition[];
  galleryLayouts: AlbumLayoutDefinition[];
  textLayouts: AlbumLayoutDefinition[];
  closingLayouts: AlbumLayoutDefinition[];
};

export type WeddingAlbumChapter = {
  id: string;
  title: string;
  scene?: WeddingScene;
  hidden: boolean;
};

export type WeddingAlbumPage = {
  id: string;
  chapterId?: string;
  layoutId: string;
  frames: AlbumFrame[];
  textBlocks: AlbumTextBlock[];
};

export type WeddingAlbum = {
  id: string;
  projectId: string;
  title: string;
  subtitle?: string;
  templateId: string;
  /** Overschrijft de accentkleur van de template (hex); leeg = template-standaard. */
  accentColor?: string;
  language: string;
  quote?: string;
  personalMessage?: string;
  foreword?: string;
  photographerName?: string;
  chapters: WeddingAlbumChapter[];
  pages: WeddingAlbumPage[];
  status: "draft" | "review" | "ready" | "exported";
  createdAt: string;
  updatedAt: string;
};

/* ========================= Instellingen ========================= */

export type TrouwstudioSettings = {
  /** Algemeen */
  defaultLanguage: string;
  defaultEditingStyle: WeddingEditingStyle;
  defaultTemplateId: string;
  confirmBulkActions: boolean;
  /** AI */
  aiProvider: "claude" | "mock";
  analysisModel: string;
  /** 0..1: onder deze confidence komt een foto in "Controle nodig". */
  confidenceThreshold: number;
  autoOptimize: boolean;
  generativeEnabled: boolean;
  batchSize: number;
  maxConcurrent: number;
  /** Export */
  exportJpegQuality: number;
  exportFilenameTemplate: string;
};

export const DEFAULT_TROUWSTUDIO_SETTINGS: TrouwstudioSettings = {
  defaultLanguage: "nl",
  defaultEditingStyle: "warm-romantisch",
  defaultTemplateId: "ivoire-portret",
  confirmBulkActions: true,
  aiProvider: "claude",
  analysisModel: "claude-opus-4-8",
  confidenceThreshold: 0.75,
  autoOptimize: false,
  generativeEnabled: false,
  batchSize: 4,
  maxConcurrent: 2,
  exportJpegQuality: 90,
  exportFilenameTemplate: "{project}-{nummer}",
};

/* ========================= Helpers ========================= */

export function orientationFor(width: number, height: number): PhotoOrientation {
  if (Math.abs(width - height) / Math.max(width, height) < 0.02) return "square";
  return width > height ? "landscape" : "portrait";
}

export function coupleName(project: Pick<WeddingProject, "partnerOneName" | "partnerTwoName">): string {
  return [project.partnerOneName, project.partnerTwoName].filter(Boolean).join(" & ");
}
