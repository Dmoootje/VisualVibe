// Uploadt de kennisbank-afbeeldingen naar Firebase Storage en genereert
// src/data/kennisbankImages.ts met de echte download-URL's.
//
// File-driven: uploadt ALLE beelden uit ./visualvibe-og-images. Twee soorten:
//   - OG (vierkant, met tekst): per categoriemap <cat>/<file>.webp
//       * kennisbank-<cat>.webp           -> categorie-OG
//       * <cat>-<slug>.webp               -> artikel-OG
//       * blog-<cat>-<slug>.webp          -> artikel-OG (bestaande naamconventie)
//     naar images/og-images/kennisbank/<cat>/<file>.webp
//   - Featured (zonder tekst): map "Featured blog images/blog-<...>.webp"
//       * blog-kennisbank-<cat>.webp      -> categorie-featured
//       * blog-<cat>-<slug>.webp          -> artikel-featured
//     naar images/kennisbank-featured/<file>.webp
//
// Draaien (met je Firebase-credentials in .env.local of de omgeving):
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
const SOURCE_DIR = path.join(ROOT, "visualvibe-og-images");
const FEATURED_DIR = path.join(SOURCE_DIR, "Featured blog images");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "kennisbankImages.ts");
const DEFAULT_BUCKET = "gen-lang-client-0235296023";

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
  const bucket = (process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_BUCKET).trim();
  if (getApps().length === 0) {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
    if (rawKey) initializeApp({ credential: cert(JSON.parse(rawKey)), storageBucket: bucket });
    else initializeApp({ storageBucket: bucket });
  }
  return { storage: getStorage().bucket(bucket), bucket };
}

async function uploadWebp(storage, bucket, localPath, storagePath) {
  const bytes = fs.readFileSync(localPath);
  const meta = await sharp(bytes).metadata();
  const token = randomUUID();
  await storage.file(storagePath).save(bytes, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
  return { url, width: meta.width ?? 0, height: meta.height ?? 0 };
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
// bewerken. Draai dat script (met Firebase-credentials) om de afbeeldingen naar
// de bucket te uploaden en dit bestand met de echte download-URL's te vullen.
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
  return KENNISBANK_FEATURED[\`${"${categorySlug}/${slug}"}\`];
}

/** Uitgelichte afbeelding voor een categorie. */
export function kennisbankCategoryFeatured(categorySlug: string): string | undefined {
  return KENNISBANK_CATEGORY_FEATURED[categorySlug];
}
`;
}

async function main() {
  loadEnvLocal();
  if (!fs.existsSync(SOURCE_DIR)) throw new Error(`Bronmap ontbreekt: ${SOURCE_DIR}`);

  const categories = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "Featured blog images")
    .map((entry) => entry.name)
    .sort((a, b) => b.length - a.length);

  const { storage, bucket } = initFirebase();
  console.log(`Bucket: ${bucket}\nCategorieen: ${categories.join(", ")}\n`);

  const ogMap = {};
  const featuredMap = {};
  const featuredVersion = {};
  const categoryFeaturedMap = {};
  let ogCount = 0;
  let featCount = 0;

  for (const cat of categories) {
    const dir = path.join(SOURCE_DIR, cat);
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".webp"))) {
      const base = file.replace(/\.webp$/i, "");
      const normalizedBase = base.startsWith("blog-") ? base.slice("blog-".length) : base;
      let canonical;

      if (normalizedBase === `kennisbank-${cat}`) {
        canonical = `/kennisbank/${cat}/`;
      } else if (normalizedBase.startsWith(`${cat}-`)) {
        canonical = `/kennisbank/${cat}/${normalizedBase.slice(cat.length + 1)}/`;
      } else {
        console.warn(`OG overgeslagen (onverwachte naam): ${cat}/${file}`);
        continue;
      }

      const result = await uploadWebp(
        storage,
        bucket,
        path.join(dir, file),
        `images/og-images/kennisbank/${cat}/${file}`
      );
      ogMap[canonical] = result;
      ogCount += 1;
      console.log(`OG   ${canonical}`);
    }
  }

  if (fs.existsSync(FEATURED_DIR)) {
    for (const file of fs.readdirSync(FEATURED_DIR).filter((name) => name.endsWith(".webp"))) {
      const rest = file.replace(/^blog-/, "").replace(/\.webp$/i, "");
      const storagePath = `images/kennisbank-featured/${file}`;

      if (rest.startsWith("kennisbank-")) {
        const cat = rest.slice("kennisbank-".length);
        const result = await uploadWebp(storage, bucket, path.join(FEATURED_DIR, file), storagePath);
        categoryFeaturedMap[cat] = result.url;
        featCount += 1;
        console.log(`CAT  ${cat}`);
        continue;
      }

      const cat = categories.find((category) => rest.startsWith(`${category}-`));
      if (!cat) {
        console.warn(`Featured overgeslagen (geen categorie herkend): ${file}`);
        continue;
      }

      const rawSlug = rest.slice(cat.length + 1);
      const versionMatch = rawSlug.match(/-v(\d+)$/);
      const version = versionMatch ? Number(versionMatch[1]) : 0;
      const slug = versionMatch ? rawSlug.slice(0, -versionMatch[0].length) : rawSlug;
      const key = `${cat}/${slug}`;
      const result = await uploadWebp(storage, bucket, path.join(FEATURED_DIR, file), storagePath);
      featCount += 1;

      if (featuredVersion[key] === undefined || version >= featuredVersion[key]) {
        featuredVersion[key] = version;
        featuredMap[key] = result.url;
      }
      console.log(`FEAT ${key}${version ? ` (v${version})` : ""}`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, serialize(ogMap, featuredMap, categoryFeaturedMap), "utf8");
  console.log(
    `\nKlaar. ${ogCount} OG-beelden, ${featCount} featured-bestanden geupload ` +
      `(${Object.keys(featuredMap).length} artikels, ${Object.keys(categoryFeaturedMap).length} categorieen).`
  );
  console.log(`Geschreven: ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
