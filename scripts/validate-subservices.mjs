import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import ts from "typescript";

const ROOT = process.cwd();
const CONTENT_FILES = [
  "webdesign.ts",
  "seo.ts",
  "fotografie.ts",
  "videografie.ts",
  "drone.ts",
  "xr.ts",
  "podcasting.ts",
  "masterclasses.ts",
];

const errors = [];
const warnings = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function normalize(value) {
  return value
    .toLocaleLowerCase("nl-BE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function includesPhrase(haystack, needle) {
  const normalizedHaystack = normalize(haystack);
  const normalizedNeedle = normalize(needle);
  return normalizedHaystack.includes(normalizedNeedle);
}

function words(value) {
  return value.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
}

function stringsIn(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

function evaluateEditorialFile(relativePath) {
  const source = read(relativePath);
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: relativePath,
    reportDiagnostics: true,
  });

  for (const diagnostic of transpiled.diagnostics ?? []) {
    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      errors.push(`${relativePath}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
    }
  }

  const compiledModule = { exports: {} };
  const unsupportedRequire = (specifier) => {
    throw new Error(`Unexpected runtime import ${specifier} in ${relativePath}`);
  };
  try {
    Function("exports", "module", "require", transpiled.outputText)(
      compiledModule.exports,
      compiledModule,
      unsupportedRequire,
    );
  } catch (error) {
    errors.push(`${relativePath}: kon niet worden ingelezen (${error.message})`);
    return {};
  }

  const records = Object.values(compiledModule.exports).filter(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  );
  if (records.length !== 1) {
    errors.push(`${relativePath}: verwacht exact één geëxporteerde editorial map, kreeg ${records.length}`);
    return {};
  }
  return records[0];
}

function parseCatalog() {
  const source = read("src/data/subservices.ts");
  const entryPattern = /title:\s*"([^"]+)"[\s\S]{0,180}?slug:\s*"([^"]+)"[\s\S]{0,100}?parentSlug:\s*"([^"]+)"/g;
  return [...source.matchAll(entryPattern)].map((match) => ({
    title: match[1],
    slug: match[2],
    parentSlug: match[3],
  }));
}

function parseIndentedSlugs(relativePath) {
  return new Set([...read(relativePath).matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((match) => match[1]));
}

function jaccard(left, right) {
  const a = new Set(normalize(left).split(" ").filter(Boolean));
  const b = new Set(normalize(right).split(" ").filter(Boolean));
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

const catalog = parseCatalog();
const catalogBySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
const parentSlugs = parseIndentedSlugs("src/data/services.ts");
const regionSlugs = parseIndentedSlugs("src/data/regions.ts");
const allServiceSlugs = new Set([...parentSlugs, ...catalogBySlug.keys()]);

const editorial = {};
for (const file of CONTENT_FILES) {
  const relativePath = `src/data/subservice-content/${file}`;
  if (!fs.existsSync(path.join(ROOT, relativePath))) {
    errors.push(`${relativePath}: bestand ontbreekt`);
    continue;
  }
  Object.assign(editorial, evaluateEditorialFile(relativePath));
}

const editorialSlugs = Object.keys(editorial);
for (const slug of catalogBySlug.keys()) {
  if (!editorial[slug]) errors.push(`${slug}: editorial content ontbreekt`);
}
for (const slug of editorialSlugs) {
  if (!catalogBySlug.has(slug)) errors.push(`${slug}: editorial key heeft geen bestaande subdienstroute`);
}
if (catalog.length !== 46) errors.push(`catalogus bevat ${catalog.length} subdiensten in plaats van 46`);
if (editorialSlugs.length !== 46) errors.push(`editorial map bevat ${editorialSlugs.length} subdiensten in plaats van 46`);

const directlyLinkedFromKennisbank = new Set();
const kennisbankDir = path.join(ROOT, "content", "kennisbank");
if (fs.existsSync(kennisbankDir)) {
  for (const filename of fs.readdirSync(kennisbankDir).filter((name) => name.endsWith(".mdx"))) {
    const { data } = matter(fs.readFileSync(path.join(kennisbankDir, filename), "utf8"));
    const isDutch = data.locale == null || data.locale === "nl";
    const isPublished = data.status == null || data.status === "published";
    if (!isDutch || !isPublished || !Array.isArray(data.relatedServices)) continue;
    for (const servicePath of data.relatedServices) {
      if (typeof servicePath !== "string") continue;
      const serviceSlug = servicePath.split("/").filter(Boolean).at(-1);
      if (serviceSlug && catalogBySlug.has(serviceSlug)) directlyLinkedFromKennisbank.add(serviceSlug);
    }
  }
}

const seenTitles = new Map();
const seenDescriptions = new Map();
const seenPrimaryKeywords = new Map();
const intros = [];
const wordCounts = [];

for (const [slug, entry] of Object.entries(editorial)) {
  const catalogEntry = catalogBySlug.get(slug);
  if (!catalogEntry) continue;

  if (!parentSlugs.has(catalogEntry.parentSlug)) {
    errors.push(`${slug}: parentSlug ${catalogEntry.parentSlug} bestaat niet als hoofddienst`);
  }

  const requiredArrays = [
    ["process", entry.process, 4],
    ["faqs", entry.faqs, 5],
    ["relatedServices", entry.relatedServices, 3],
    ["seo.keywords", entry.seo?.keywords, 2],
    ["searchIntent.supportingKeywords", entry.content?.searchIntent?.supportingKeywords, 2],
    ["overview.paragraphs", entry.content?.overview?.paragraphs, 2],
    ["overview.highlights", entry.content?.overview?.highlights, 3],
    ["outcomes.items", entry.content?.outcomes?.items, 3],
    ["idealFor.items", entry.content?.idealFor?.items, 3],
    ["deliverables.items", entry.content?.deliverables?.items, 4],
    ["pricing.paragraphs", entry.content?.pricing?.paragraphs, 2],
    ["pricing.factors", entry.content?.pricing?.factors, 5],
    ["whyVisualVibe.items", entry.content?.whyVisualVibe?.items, 3],
    ["regional.regionSlugs", entry.content?.regional?.regionSlugs, 1],
  ];
  for (const [field, value, minimum] of requiredArrays) {
    if (!Array.isArray(value) || value.length < minimum) {
      errors.push(`${slug}: ${field} vereist minimaal ${minimum} items`);
    }
  }

  const requiredStrings = [
    ["intro", entry.intro],
    ["excerpt", entry.excerpt],
    ["seo.title", entry.seo?.title],
    ["seo.description", entry.seo?.description],
    ["primaryKeyword", entry.content?.searchIntent?.primaryKeyword],
    ["overview.title", entry.content?.overview?.title],
    ["outcomes.title", entry.content?.outcomes?.title],
    ["idealFor.title", entry.content?.idealFor?.title],
    ["deliverables.title", entry.content?.deliverables?.title],
    ["pricing.title", entry.content?.pricing?.title],
    ["whyVisualVibe.title", entry.content?.whyVisualVibe?.title],
    ["regional.title", entry.content?.regional?.title],
    ["regional.description", entry.content?.regional?.description],
    ["cta.title", entry.content?.cta?.title],
    ["cta.description", entry.content?.cta?.description],
    ["cta.label", entry.content?.cta?.label],
    ["cta.href", entry.content?.cta?.href],
  ];
  for (const [field, value] of requiredStrings) {
    if (typeof value !== "string" || !value.trim()) errors.push(`${slug}: ${field} ontbreekt`);
  }

  const seoTitle = entry.seo?.title ?? "";
  const seoDescription = entry.seo?.description ?? "";
  if (seoTitle.length < 50 || seoTitle.length > 60) {
    errors.push(`${slug}: SEO-titel heeft ${seoTitle.length} tekens, verwacht 50-60`);
  }
  if (seoDescription.length < 145 || seoDescription.length > 160) {
    errors.push(`${slug}: metaomschrijving heeft ${seoDescription.length} tekens, verwacht 145-160`);
  }

  const titleKey = normalize(seoTitle);
  const descriptionKey = normalize(seoDescription);
  if (seenTitles.has(titleKey)) errors.push(`${slug}: dubbele SEO-titel met ${seenTitles.get(titleKey)}`);
  if (seenDescriptions.has(descriptionKey)) {
    errors.push(`${slug}: dubbele metaomschrijving met ${seenDescriptions.get(descriptionKey)}`);
  }
  seenTitles.set(titleKey, slug);
  seenDescriptions.set(descriptionKey, slug);

  const primaryKeyword = entry.content?.searchIntent?.primaryKeyword ?? "";
  const primaryKey = normalize(primaryKeyword);
  if (seenPrimaryKeywords.has(primaryKey)) {
    errors.push(`${slug}: dubbel primair zoekwoord met ${seenPrimaryKeywords.get(primaryKey)}`);
  }
  seenPrimaryKeywords.set(primaryKey, slug);
  for (const [field, value] of [
    ["intro", entry.intro ?? ""],
    ["overview.title", entry.content?.overview?.title ?? ""],
    ["seo.title", seoTitle],
    ["seo.description", seoDescription],
  ]) {
    if (primaryKeyword && !includesPhrase(value, primaryKeyword)) {
      errors.push(`${slug}: primair zoekwoord ontbreekt letterlijk in ${field}`);
    }
  }

  const h1 = normalize(catalogEntry.title);
  const keyword = normalize(primaryKeyword);
  if (keyword && !h1.includes(keyword) && !keyword.includes(h1)) {
    const h1Tokens = new Set(h1.split(" "));
    const keywordTokens = keyword.split(" ");
    const overlap = keywordTokens.filter((token) => h1Tokens.has(token)).length / keywordTokens.length;
    if (overlap < 0.6) errors.push(`${slug}: primair zoekwoord sluit niet aan op de bestaande H1`);
  }

  for (const relatedSlug of entry.relatedServices ?? []) {
    if (!allServiceSlugs.has(relatedSlug)) errors.push(`${slug}: gerelateerde dienst ${relatedSlug} bestaat niet`);
    if (relatedSlug === slug) errors.push(`${slug}: verwijst naar zichzelf als gerelateerde dienst`);
  }
  if (new Set(entry.relatedServices ?? []).size !== (entry.relatedServices ?? []).length) {
    errors.push(`${slug}: dubbele gerelateerde diensten`);
  }

  for (const regionSlug of entry.content?.regional?.regionSlugs ?? []) {
    if (!regionSlugs.has(regionSlug)) errors.push(`${slug}: regiolink ${regionSlug} bestaat niet`);
  }
  const expectedRegionSlugs = ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"];
  const editorialRegionSlugs = entry.content?.regional?.regionSlugs ?? [];
  if (
    editorialRegionSlugs.length !== expectedRegionSlugs.length ||
    expectedRegionSlugs.some((regionSlug) => !editorialRegionSlugs.includes(regionSlug))
  ) {
    errors.push(`${slug}: regional.regionSlugs moet exact de vier bestaande regiohubs bevatten`);
  }

  const ctaHref = entry.content?.cta?.href;
  if (ctaHref && ctaHref !== "/offerte-aanvragen") {
    errors.push(`${slug}: CTA-link ${ctaHref} is geen bestaande toegestane route`);
  }
  if (entry.content?.cta?.label !== "Offerte aanvragen") {
    errors.push(`${slug}: CTA-label moet "Offerte aanvragen" zijn`);
  }

  const allStrings = stringsIn(entry);
  if (allStrings.some((value) => !value.trim())) {
    errors.push(`${slug}: bevat een leeg tekstveld`);
  }
  if (allStrings.some((value) => /[\u2014\u2015]/u.test(value))) {
    errors.push(`${slug}: bevat een verboden em dash of horizontale balk`);
  }
  if (allStrings.some((value) => /^\s/u.test(value))) {
    errors.push(`${slug}: bevat tekst met voorloopspatie`);
  }

  const wordCount = words(allStrings.join(" ")).length;
  wordCounts.push({ slug, wordCount });
  const minimumWords = slug === "website-laten-maken" ? 950 : 700;
  if (wordCount < minimumWords) {
    errors.push(`${slug}: slechts ${wordCount} inhoudswoorden, verwacht minimaal ${minimumWords}`);
  }

  const faqQuestions = (entry.faqs ?? []).map((faq) => normalize(faq.question));
  if (new Set(faqQuestions).size !== faqQuestions.length) errors.push(`${slug}: dubbele FAQ-vragen`);
  const processTitles = (entry.process ?? []).map((step) => normalize(step.title));
  if (new Set(processTitles).size !== processTitles.length) errors.push(`${slug}: dubbele procestitels`);
  for (const sectionName of ["outcomes", "idealFor", "deliverables", "whyVisualVibe"]) {
    const itemTitles = (entry.content?.[sectionName]?.items ?? []).map((item) => normalize(item.title));
    if (new Set(itemTitles).size !== itemTitles.length) {
      errors.push(`${slug}: dubbele kaarttitels in ${sectionName}`);
    }
  }
  intros.push({ slug, intro: entry.intro ?? "" });
}

for (let left = 0; left < intros.length; left += 1) {
  for (let right = left + 1; right < intros.length; right += 1) {
    const similarity = jaccard(intros[left].intro, intros[right].intro);
    if (similarity >= 0.72) {
      errors.push(
        `${intros[left].slug} en ${intros[right].slug}: intro's zijn te vergelijkbaar (${similarity.toFixed(2)})`,
      );
    }
  }
}

if (warnings.length > 0) {
  console.warn(`Subdienst-audit: ${warnings.length} waarschuwing(en)`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`Subdienst-audit mislukt met ${errors.length} fout(en):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Subdienst-audit geslaagd: ${editorialSlugs.length} unieke pagina's, geldige metadata, contentsecties, FAQ's, processen en interne links. Woordbereik: ${Math.min(...wordCounts.map((entry) => entry.wordCount))}-${Math.max(...wordCounts.map((entry) => entry.wordCount))}. Kennisbank: ${directlyLinkedFromKennisbank.size} direct, ${catalog.length - directlyLinkedFromKennisbank.size} via parentfallback.`,
);
