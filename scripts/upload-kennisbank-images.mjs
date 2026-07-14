// Leest de bestaande kennisbank-afbeeldingen rechtstreeks uit Firebase Storage
// en genereert src/data/kennisbankImages.ts met de echte download-URL's.
//
// Er is GEEN lokale bronmap nodig en er worden geen afbeeldingen opnieuw
// geupload. Het script scant deze bestaande Storage-mappen:
//   - images/og-images/kennisbank/<categorie>/<bestand>.webp
//       * kennisbank-<categorie>.webp          -> categorie-OG
//       * <categorie>-<slug>.webp              -> artikel-OG
//       * blog-<categorie>-<slug>.webp         -> artikel-OG
//   - images/kennisbank-featured/<bestand>.webp
//       * blog-kennisbank-<categorie>.webp     -> categorie-featured
//       * blog-<categorie>-<slug>.webp          -> artikel-featured
//
// Draaien met Firebase-credentials in .env.local of de omgeving:
//   node scripts/upload-kennisbank-images.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "kennisbankImages.ts");
const DEFAULT_BUCKET = "gen-lang-client-0235296023";
const OG_PREFIX = "images/og-images/kennisbank/";
const FEATURED_PREFIX = "images/kennisbank-featured/";

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function initFirebase() {
  const bucketName = (process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_BUCKET).trim();

  if (getApps().length === 0) {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
    if (rawKey) {
      initializeApp({
        credential: cert(JSON.parse(rawKey)),
        storageBucket: bucketName,
      });
    } else {
      initializeApp({ storageBucket: bucketName });
    }
  }

  return {
    storage: getStorage().bucket(bucketName),
    bucketName,
  };
}

function firstDownloadToken(metadata) {
  const raw = metadata.metadata?.firebaseStorageDownloadTokens;
  if (typeof raw !== "string") return undefined;

  return raw
    .split(",")
    .map((token) => token.trim())
    .find(Boolean);
}

async function getStorageImage(file, bucketName, includeDimensions = false) {
  const [metadata] = await file.getMetadata();
  let token = firstDownloadToken(metadata);

  // Bestaande downloadtokens blijven behouden. Alleen wanneer een bestand er
  // geen heeft, voegen we een token aan de metadata toe. De afbeelding zelf
  // wordt daarbij niet opnieuw geupload of aangepast.
  if (!token) {
    token = randomUUID();
    await file.setMetadata({
      metadata: {
        ...(metadata.metadata ?? {}),
        firebaseStorageDownloadTokens: token,
      },
    });
    console.log(`TOKEN toegevoegd: ${file.name}`);
  }

  const result = {
    url: `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`,
  };

  if (includeDimensions) {
    const [bytes] = await file.download();
    const imageMetadata = await sharp(bytes).metadata();
    result.width = imageMetadata.width ?? 0;
    result.height = imageMetadata.height ?? 0;
  }

  return result;
}

function serialize(ogMap, featuredMap, categoryFeaturedMap) {
  const ogLines = Object.keys(ogMap)
    .sort()
    .map((key) => {
      const value = ogMap[key];
      return `  ${JSON.stringify(key)}: { url: ${JSON.stringify(value.url)}, width: ${value.width}, height: ${value.height} },`;
    })
    .join("\n");

  const featuredLines = Object.keys(featuredMap)
    .sort()
    .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(featuredMap[key])},`)
    .join("\n");

  const categoryLines = Object.keys(categoryFeaturedMap)
    .sort()
    .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(categoryFeaturedMap[key])},`)
    .join("\n");

  return `// GEGENEREERD door scripts/upload-kennisbank-images.mjs - niet met de hand
// bewerken. Het script leest bestaande bestanden rechtstreeks uit Firebase Storage
// en vult dit bestand met hun vaste Firebase-download-URL's.
//
// Drie soorten beelden:
//  - OG: vierkante deelafbeelding met tekst erop -> alleen social (og:image).
//  - Featured (artikel): uitgelichte afbeelding zonder tekst -> hero + alle cards.
//  - Featured (categorie): beeld zonder tekst voor de categoriehero.

import type { OgImage } from "./ogImages";

/** Canonieke path (met leidende + sluitende slash) -> OG-deelafbeelding. */
export const KENNISBANK_OG: Record<string, OgImage> = {
${ogLines}
};

/** "categorySlug/slug" -> uitgelichte artikelafbeelding (zonder tekst). */
export const KENNISBANK_FEATURED: Record<string, string> = {
${featuredLines}
};

/** categorySlug -> uitgelichte categorie-afbeelding (zonder tekst). */
export const KENNISBANK_CATEGORY_FEATURED: Record<string, string> = {
${categoryLines}
};

/** Uitgelichte afbeelding voor een artikel, op categorySlug + slug. */
export function kennisbankFeatured(categorySlug: string, slug: string): string | undefined {
  return KENNISBANK_FEATURED[\`\${categorySlug}/\${slug}\`];
}

/** Uitgelichte afbeelding voor een categorie. */
export function kennisbankCategoryFeatured(categorySlug: string): string | undefined {
  return KENNISBANK_CATEGORY_FEATURED[categorySlug];
}
`;
}

async function main() {
  loadEnvLocal();
  const { storage, bucketName } = initFirebase();

  console.log(`Bucket: ${bucketName}`);
  console.log(`OG-map: ${OG_PREFIX}`);
  console.log(`Featured-map: ${FEATURED_PREFIX}\n`);

  const [allOgFiles] = await storage.getFiles({ prefix: OG_PREFIX });
  const ogFiles = allOgFiles.filter((file) => file.name.toLowerCase().endsWith(".webp"));

  if (ogFiles.length === 0) {
    throw new Error(
      `Geen WebP-bestanden gevonden in gs://${bucketName}/${OG_PREFIX}. ` +
        "Controleer FIREBASE_STORAGE_BUCKET en je service-accountrechten."
    );
  }

  const categories = Array.from(
    new Set(
      ogFiles
        .map((file) => file.name.slice(OG_PREFIX.length).split("/")[0])
        .filter(Boolean)
    )
  ).sort((a, b) => b.length - a.length);

  console.log(`Categorieen: ${categories.join(", ")}\n`);

  const ogMap = {};
  const featuredMap = {};
  const featuredVersion = {};
  const categoryFeaturedMap = {};

  for (const file of ogFiles) {
    const relativePath = file.name.slice(OG_PREFIX.length);
    const parts = relativePath.split("/").filter(Boolean);
    if (parts.length < 2) {
      console.warn(`OG overgeslagen (geen categoriemap): ${file.name}`);
      continue;
    }

    const category = parts[0];
    const filename = parts.at(-1);
    const base = filename.replace(/\.webp$/i, "");
    const normalizedBase = base.startsWith("blog-") ? base.slice("blog-".length) : base;
    let canonical;

    if (normalizedBase === `kennisbank-${category}`) {
      canonical = `/kennisbank/${category}/`;
    } else if (normalizedBase.startsWith(`${category}-`)) {
      canonical = `/kennisbank/${category}/${normalizedBase.slice(category.length + 1)}/`;
    } else {
      console.warn(`OG overgeslagen (onverwachte naam): ${file.name}`);
      continue;
    }

    ogMap[canonical] = await getStorageImage(file, bucketName, true);
    console.log(`OG   ${canonical} <- ${file.name}`);
  }

  const [allFeaturedFiles] = await storage.getFiles({ prefix: FEATURED_PREFIX });
  const featuredFiles = allFeaturedFiles.filter((file) =>
    file.name.toLowerCase().endsWith(".webp")
  );

  for (const file of featuredFiles) {
    const filename = path.posix.basename(file.name);
    const rest = filename.replace(/^blog-/, "").replace(/\.webp$/i, "");
    const image = await getStorageImage(file, bucketName, false);

    if (rest.startsWith("kennisbank-")) {
      const category = rest.slice("kennisbank-".length);
      categoryFeaturedMap[category] = image.url;
      console.log(`CAT  ${category} <- ${file.name}`);
      continue;
    }

    const category = categories.find((candidate) => rest.startsWith(`${candidate}-`));
    if (!category) {
      console.warn(`Featured overgeslagen (geen categorie herkend): ${file.name}`);
      continue;
    }

    const rawSlug = rest.slice(category.length + 1);
    const versionMatch = rawSlug.match(/-v(\d+)$/);
    const version = versionMatch ? Number(versionMatch[1]) : 0;
    const slug = versionMatch ? rawSlug.slice(0, -versionMatch[0].length) : rawSlug;
    const key = `${category}/${slug}`;

    if (featuredVersion[key] === undefined || version >= featuredVersion[key]) {
      featuredVersion[key] = version;
      featuredMap[key] = image.url;
    }

    console.log(`FEAT ${key}${version ? ` (v${version})` : ""} <- ${file.name}`);
  }

  fs.writeFileSync(OUTPUT_FILE, serialize(ogMap, featuredMap, categoryFeaturedMap), "utf8");
  console.log(
    `\nKlaar. ${Object.keys(ogMap).length} OG-beelden en ${featuredFiles.length} featured-bestanden gelezen ` +
      `(${Object.keys(featuredMap).length} artikels, ${Object.keys(categoryFeaturedMap).length} categorieen).`
  );
  console.log(`Geschreven: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
