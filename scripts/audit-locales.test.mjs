import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { afterEach, describe, expect, it } from "vitest";

const auditScript = path.resolve("scripts/audit-locales.mjs");
const fixtures = [];

afterEach(() => {
  for (const fixture of fixtures.splice(0)) {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

function createFixture(localeSource) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "visualvibe-locale-audit-"));
  fixtures.push(fixture);
  fs.mkdirSync(path.join(fixture, "src/i18n"), { recursive: true });
  fs.mkdirSync(path.join(fixture, "messages"), { recursive: true });
  fs.writeFileSync(path.join(fixture, "src/i18n/locales.ts"), localeSource);
  for (const locale of ["nl", "en", "fr", "de"]) {
    fs.writeFileSync(
      path.join(fixture, `messages/${locale}.json`),
      JSON.stringify({ common: { locale } }),
    );
  }
  return fixture;
}

function runAudit(fixture) {
  return spawnSync(process.execPath, [auditScript], {
    cwd: fixture,
    encoding: "utf8",
  });
}

const validLocaleSource = `
export const LOCALE_CONFIG = {
  nl: {
    status: "published",
  },
  en: { status: "published" },
  fr: { status: "disabled" },
  de: { status: "disabled" },
};
`;

describe("audit-locales locale configuration", () => {
  it("accepts harmless formatting changes and discovers every supported locale", () => {
    const fixture = createFixture(validLocaleSource);
    fs.rmSync(path.join(fixture, "messages/de.json"));
    fs.writeFileSync(
      path.join(fixture, "messages/nl.json"),
      JSON.stringify({ common: { locale: "nl", navigation: "Navigatie" } }),
    );
    fs.writeFileSync(
      path.join(fixture, "messages/en.json"),
      JSON.stringify({ common: { locale: "en", navigation: "Navigation" } }),
    );

    const result = runAudit(fixture);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("missing_content de messages/de.json");
    expect(result.stdout).toContain("missing_message fr common.navigation");
  });

  it("fails closed when the supported locale set is incomplete", () => {
    const fixture = createFixture(validLocaleSource.replace('  de: { status: "disabled" },\n', ""));

    const result = runAudit(fixture);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Invalid locale configuration");
  });

  it("fails closed unless Dutch and English are the only published locales", () => {
    const fixture = createFixture(validLocaleSource.replace(
      'fr: { status: "disabled" }',
      'fr: { status: "published" }',
    ));

    const result = runAudit(fixture);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(
      "nl and en must be published; fr and de must be disabled",
    );
  });
});

describe("audit-locales cross-locale links", () => {
  it("reports root query, root fragment, Markdown reference, and HTML links", () => {
    const fixture = createFixture(validLocaleSource);
    const content = path.join(fixture, "content/kennisbank");
    fs.mkdirSync(content, { recursive: true });
    fs.writeFileSync(path.join(content, "english.mdx"), `---
locale: en
translationKey: shared
seoTitle: English
seoDescription: English description
---
[query](/be?x=1)
[fragment](/be#section)
[reference][dutch]
[dutch]: /be/reference
<a href="/be/html">HTML</a>
`);
    fs.writeFileSync(path.join(content, "dutch.mdx"), `---
locale: nl
translationKey: shared
seoTitle: Nederlands
seoDescription: Nederlandse beschrijving
---
Nederlands
`);

    const result = runAudit(fixture);

    expect(result.stdout).toContain("english.mdx:/be?x=1");
    expect(result.stdout).toContain("english.mdx:/be#section");
    expect(result.stdout).toContain("english.mdx:/be/reference");
    expect(result.stdout).toContain("english.mdx:/be/html");
  });
});
