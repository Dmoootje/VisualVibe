import { describe, expect, it } from "vitest";
import nl from "../../messages/nl.json";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";
import { readFileSync } from "node:fs";

function paths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => paths(child, prefix ? `${prefix}.${key}` : key));
}

describe("shared locale messages", () => {
  it.each([
    ["en", en],
    ["fr", fr],
    ["de", de],
  ])("keeps %s key paths in parity with Dutch", (_locale, messages) => {
    expect(paths(messages).sort()).toEqual(paths(nl).sort());
  });

  it("keeps shared components wired to locale messages", () => {
    const quote = readFileSync("src/components/quote/QuoteModal.tsx", "utf8");
    const lead = readFileSync("src/components/forms/LeadForm.tsx", "utf8");
    const nav = readFileSync("src/components/nav/Nav.tsx", "utf8");
    const mobileNav = readFileSync("src/components/nav/MobileNavDrawer.tsx", "utf8");
    expect(quote).toContain('t("detailsIntro")');
    expect(quote).toContain('t("trustStored")');
    expect(quote).toContain('t("stored", { email: email.trim() })');
    expect(quote).toContain('placeholder={t("descriptionPlaceholder")}');
    expect(quote).not.toContain("data.error");
    expect(lead).not.toContain("data.error");
    expect(lead).toContain('message: t("error")');
    expect(lead).toContain('aria-label={t("service")}');
    expect(nav).toContain('label={t("caseStudies")}');
    expect(nav).toContain('t("allRegions")');
    expect(nav).toContain('t("homeRegion")');
    expect(mobileNav).toContain('t("weddingTitle")');
    expect(mobileNav).toContain('t("mobileProposal")');
    expect(en.footer.description).toMatch(/videography.*drone.*3D.*VR.*AR.*podcasting/i);
  });

  it("does not reintroduce reviewed Dutch literals in shared components", () => {
    const files = [
      "src/components/quote/QuoteModal.tsx",
      "src/components/forms/LeadForm.tsx",
      "src/components/nav/Nav.tsx",
      "src/components/nav/MobileNavDrawer.tsx",
    ].map((file) => readFileSync(file, "utf8")).join("\n");
    for (const literal of [">Vrijblijvend gesprek<", 'aria-label="Menu openen"', ">Onze regio&apos;s<", 'aria-label="Regio / doelgroep"']) {
      expect(files).not.toContain(literal);
    }
  });

  it("localizes the complete mobile navigation chrome", () => {
    const mobile = readFileSync("src/components/nav/MobileNavDrawer.tsx", "utf8");
    for (const literal of [
      '"Diensten",', '"Realisaties",', '"Sectoren",', '"Kennisbank",',
      '"Over ons"', '"Contact"', "gratis tools", "categorieën", "artikels",
      ">Ontdek <", ">Offerte aanvragen <", "Trouwfotografie &amp; huwelijksvideo",
    ]) {
      expect(mobile).not.toContain(literal);
    }
    for (const key of [
      "services", "disciplineCount", "caseStudies", "categoryCount", "sectors",
      "sectorCount", "freeToolCount", "knowledgeBase", "knowledgeCounts", "about",
      "contact", "discover", "quotation",
    ]) {
      expect(mobile).toContain(`t("${key}"`);
    }
  });
});
