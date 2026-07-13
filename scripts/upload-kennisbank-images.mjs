// Uploadt de kennisbank-afbeeldingen naar Firebase Storage en genereert
// src/data/kennisbankImages.ts met de echte download-URL's.
//
// Twee soorten beelden (bron: ./visualvibe-og-images):
//   - OG (vierkant, met tekst)  -> images/og-images/kennisbank/<cat>/<file>.webp   (social)
//   - Featured (zonder tekst)   -> images/kennisbank-featured/<blog-cat-slug>.webp (hero + cards)
//
// Draaien (met je Firebase-credentials):
//   node scripts/upload-kennisbank-images.mjs
// Credentials: FIREBASE_SERVICE_ACCOUNT_KEY (JSON op één regel) of
// GOOGLE_APPLICATION_CREDENTIALS (pad naar service-account key), plus optioneel
// FIREBASE_STORAGE_BUCKET. .env.local wordt automatisch ingelezen.

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

/** Minimale .env.local-loader zodat dit los van Next dezelfde config gebruikt. */
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

function initFirebase() {
  const bucket = (process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_BUCKET).trim();
  if (getApps().length === 0) {
    const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
    if (rawKey) {
      initializeApp({ credential: cert(JSON.parse(rawKey)), storageBucket: bucket });
    } else {
      // Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS of gcloud auth).
      initializeApp({ storageBucket: bucket });
    }
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

function serialize(ogMap, featuredMap) {
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

  return `// GEGENEREERD door scripts/upload-kennisbank-images.mjs - niet met de hand
// bewerken. Draai dat script (met Firebase-credentials) om de afbeeldingen naar
// de bucket te uploaden en dit bestand met de echte download-URL's te vullen.
//
// Twee soorten beelden per kennisbankartikel/-categorie:
//  - OG: vierkante deelafbeelding met tekst erop -> alleen social (og:image).
//  - Featured: uitgelichte afbeelding zonder tekst -> hero + alle cards.

import type { OgImage } from "./ogImages";

/** Canonieke path (met leidende + sluitende slash) -> OG-deelafbeelding. */
export const KENNISBANK_OG: Record<string, OgImage> = {
${ogLines}
};

/** "categorySlug/slug" -> uitgelichte afbeelding (zonder tekst). */
export const KENNISBANK_FEATURED: Record<string, string> = {
${featuredLines}
};

/** Uitgelichte afbeelding voor een artikel, op categorySlug + slug. */
export function kennisbankFeatured(categorySlug: string, slug: string): string | undefined {
  return KENNISBANK_FEATURED[\`\${categorySlug}/\${slug}\`];
}
`;
}

async function main() {
  loadEnvLocal();
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Bronmap ontbreekt: ${SOURCE_DIR}`);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, "manifest.json"), "utf8"));
  const { storage, bucket } = initFirebase();
  console.log(`Bucket: ${bucket}`);

  const ogMap = {};
  const featuredMap = {};
  const missing = [];
  let ogCount = 0;
  let featuredCount = 0;

  for (const entry of manifest) {
    // OG-afbeelding: manifest noemt .png, de echte bestanden zijn .webp.
    const relWebp = entry.filename.replace(/\.png$/i, ".webp");
    const ogLocal = path.join(SOURCE_DIR, relWebp);
    if (fs.existsSync(ogLocal)) {
      const storagePath = `images/og-images/kennisbank/${relWebp}`;
      const result = await uploadWebp(storage, bucket, ogLocal, storagePath);
      ogMap[entry.url] = result;
      ogCount += 1;
      console.log(`OG  ${entry.url} -> ${storagePath}`);
    } else {
      missing.push(ogLocal);
    }

    // Featured-afbeelding: alleen voor artikels (blog-<cat>-<slug>.webp).
    if (entry.type === "article") {
      const parts = entry.url.split("/").filter(Boolean); // ["kennisbank", cat, slug]
      const categorySlug = parts[1];
      const slug = parts[2];
      const featuredName = `blog-${categorySlug}-${slug}.webp`;
      const featuredLocal = path.join(FEATURED_DIR, featuredName);
      if (fs.existsSync(featuredLocal)) {
        const storagePath = `images/kennisbank-featured/${featuredName}`;
        const result = await uploadWebp(storage, bucket, featuredLocal, storagePath);
        featuredMap[`${categorySlug}/${slug}`] = result.url;
        featuredCount += 1;
        console.log(`FEAT ${categorySlug}/${slug} -> ${storagePath}`);
      } else {
        missing.push(featuredLocal);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, serialize(ogMap, featuredMap), "utf8");
  console.log(`\nKlaar. ${ogCount} OG-beelden, ${featuredCount} featured-beelden geupload.`);
  console.log(`Geschreven: ${path.relative(ROOT, OUTPUT_FILE)}`);
  if (missing.length > 0) {
    console.warn(`\nLET OP - ${missing.length} bronbestand(en) niet gevonden:`);
    for (const file of missing) console.warn(`  - ${path.relative(ROOT, file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
