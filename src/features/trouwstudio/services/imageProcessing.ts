import "server-only";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { adminStorageBucket, STORAGE_BUCKET } from "@/lib/firebase/admin";
import { NEUTRAL_ADJUSTMENTS, type CropConfiguration, type PhotoAdjustments } from "../types";

// Deterministische beeldverwerking (geen generatieve AI): past de
// niet-destructieve instellingen toe op het ORIGINEEL en schrijft het
// resultaat als nieuw bestand naar Storage. Het origineel wordt nooit
// overschreven. Sharp ondersteunt een deel van de parameters exact
// (belichting/verzadiging/gamma/scherpte/ruis/rotatie/crop); de overige
// worden benaderd via lineaire curves. De editorpreview in de browser is een
// CSS-benadering van dezelfde parameters (zie lib/cssPreview.ts).

export type ImageProcessingInput = {
  originalUrl: string;
  adjustments: PhotoAdjustments;
  crop?: CropConfiguration;
  /** Uitvoerbreedte (px); origineel formaat als undefined. */
  maxWidth?: number;
  jpegQuality?: number;
  storagePathPrefix: string;
};

export type ProcessedImageResult = {
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export interface ImageProcessingProvider {
  readonly id: string;
  exportImage(input: ImageProcessingInput): Promise<ProcessedImageResult>;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export class SharpImageProcessingProvider implements ImageProcessingProvider {
  readonly id = "sharp";

  async exportImage(input: ImageProcessingInput): Promise<ProcessedImageResult> {
    const response = await fetch(input.originalUrl);
    if (!response.ok) throw new Error(`Origineel niet bereikbaar (${response.status}).`);
    const source = Buffer.from(await response.arrayBuffer());
    const a = { ...NEUTRAL_ADJUSTMENTS, ...input.adjustments };

    let pipeline = sharp(source, { failOn: "none" }).rotate(); // EXIF-oriëntatie

    // Compositie: rechtzetten + kwartslagen + spiegelen + crop.
    if (input.crop) {
      const { rotate, flipHorizontal } = input.crop;
      if (a.straighten !== 0) {
        pipeline = pipeline.rotate(a.straighten, { background: "#ffffff" });
      }
      if (rotate) pipeline = pipeline.rotate(rotate);
      if (flipHorizontal) pipeline = pipeline.flop();
      const meta = await pipeline.toBuffer({ resolveWithObject: true });
      const { width: w = 1, height: h = 1 } = meta.info;
      const left = Math.round(clamp01(input.crop.x) * w);
      const top = Math.round(clamp01(input.crop.y) * h);
      const cw = Math.max(16, Math.min(w - left, Math.round(clamp01(input.crop.width) * w)));
      const ch = Math.max(16, Math.min(h - top, Math.round(clamp01(input.crop.height) * h)));
      pipeline = sharp(meta.data).extract({ left, top, width: cw, height: ch });
    } else if (a.straighten !== 0) {
      pipeline = pipeline.rotate(a.straighten, { background: "#ffffff" });
    }

    // Licht en kleur. modulate: brightness/saturation/hue; linear: contrast;
    // gamma: 1.0..3.0 (sharp-eis); temperatuur/tint via kanaal-multiplicatie.
    const brightness = 1 + a.exposure / 200 + a.whites / 600 - a.blacks / 600;
    const saturation = clamp01((100 + a.saturation + a.vibrance * 0.6) / 100 / 2) * 2;
    pipeline = pipeline.modulate({
      brightness: Math.max(0.2, brightness),
      saturation: Math.max(0, saturation),
    });
    if (a.contrast !== 0 || a.highlights !== 0 || a.shadows !== 0) {
      // Lineaire benadering: a*x + b. Hooglichten/schaduwen schuiven het
      // zwarte/witte punt licht op.
      const slope = 1 + a.contrast / 150 + a.highlights / 500 - a.shadows / 500;
      const offset = (-a.contrast / 150) * 128 + (a.shadows / 500) * 128;
      pipeline = pipeline.linear(Math.max(0.2, slope), offset);
    }
    if (a.gamma !== 0) {
      pipeline = pipeline.gamma(Math.min(3, Math.max(1, 2.2 + a.gamma / 100)));
    }
    if (a.temperature !== 0 || a.tint !== 0) {
      const r = 1 + a.temperature / 400 + a.tint / 800;
      const g = 1 - Math.abs(a.tint) / 800 + a.tint / 1600;
      const b = 1 - a.temperature / 400 + a.tint / 800;
      pipeline = pipeline.recomb([
        [r, 0, 0],
        [0, g, 0],
        [0, 0, b],
      ]);
    }

    // Detail.
    if (a.sharpness > 0 || a.clarity > 0 || a.texture > 0) {
      const sigma = 0.5 + (a.sharpness + a.clarity * 0.5 + a.texture * 0.3) / 60;
      pipeline = pipeline.sharpen({ sigma: Math.min(4, sigma) });
    }
    if (a.noiseReduction > 0) {
      pipeline = pipeline.median(a.noiseReduction > 60 ? 5 : 3);
    }

    if (input.maxWidth) {
      pipeline = pipeline.resize({ width: input.maxWidth, withoutEnlargement: true });
    }

    // Vignet als radiale overlay (compositen na resize).
    let output = await pipeline.jpeg({ quality: input.jpegQuality ?? 90, mozjpeg: true }).toBuffer({ resolveWithObject: true });
    if (a.vignette > 0) {
      const { width = 1, height = 1 } = output.info;
      const strength = Math.min(0.85, a.vignette / 120);
      const svg = Buffer.from(
        `<svg width="${width}" height="${height}"><defs><radialGradient id="v" cx="50%" cy="50%" r="72%">` +
          `<stop offset="55%" stop-color="black" stop-opacity="0"/>` +
          `<stop offset="100%" stop-color="black" stop-opacity="${strength}"/>` +
          `</radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`,
      );
      output = await sharp(output.data)
        .composite([{ input: svg }])
        .jpeg({ quality: input.jpegQuality ?? 90, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
    }

    const token = randomUUID();
    const path = `${input.storagePathPrefix}/${token}.jpg`;
    await adminStorageBucket.file(path).save(output.data, {
      resumable: false,
      metadata: {
        contentType: "image/jpeg",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    return {
      url: `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`,
      width: output.info.width ?? 0,
      height: output.info.height ?? 0,
      sizeBytes: output.data.byteLength,
    };
  }
}

export const imageProcessingProvider: ImageProcessingProvider = new SharpImageProcessingProvider();

/* ---------------- Generatieve AI (nog niet aangesloten) ---------------- */

export type ExtendImageInput = { originalUrl: string; targetRatio: string; direction: string };
export type GeneratedImageResult = { url: string };

export interface GenerativeImageProvider {
  readonly id: string;
  readonly available: boolean;
  /** Uitleg voor de UI waarom de functie (nog) niet beschikbaar is. */
  readonly unavailableReason?: string;
  extendImage(input: ExtendImageInput): Promise<GeneratedImageResult>;
  removeObject(input: ExtendImageInput): Promise<GeneratedImageResult>;
}

/**
 * Er is nog geen generatief beeldmodel aangesloten. De UI toont deze functies
 * zichtbaar uitgeschakeld met deze uitleg; er bestaan geen nepresultaten.
 */
export class GenerativeNotConfiguredProvider implements GenerativeImageProvider {
  readonly id = "not-configured";
  readonly available = false;
  readonly unavailableReason =
    "Generatieve beeldbewerking (achtergrond uitbreiden, objecten verwijderen) is nog niet aangesloten. Zodra een beeldmodel is geconfigureerd in de Trouwstudio-instellingen wordt deze functie actief.";

  async extendImage(): Promise<GeneratedImageResult> {
    throw new Error(this.unavailableReason);
  }
  async removeObject(): Promise<GeneratedImageResult> {
    throw new Error(this.unavailableReason);
  }
}

export const generativeImageProvider: GenerativeImageProvider = new GenerativeNotConfiguredProvider();
