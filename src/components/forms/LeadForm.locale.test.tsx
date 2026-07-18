import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { LeadForm } from "./LeadForm";

describe("LeadForm region labels", () => {
  it("uses English region labels while preserving stable Dutch region IDs", () => {
    const html = renderToStaticMarkup(<LeadForm variant="contact" locale="en" />);

    expect(html).toContain('<option value="limburg" class="bg-neutral-900 text-white">Limburg, Belgium</option>');
    expect(html).toContain('<option value="vlaanderen" class="bg-neutral-900 text-white">Flanders</option>');
    expect(html).toContain('<option value="antwerpen" class="bg-neutral-900 text-white">Antwerp province</option>');
    expect(html).toContain('<option value="nederlands-limburg" class="bg-neutral-900 text-white">Dutch Limburg</option>');
    expect(html).not.toContain(">Vlaanderen</option>");
    expect(html).not.toContain(">Nederlands-Limburg</option>");
  });

  it("keeps the existing Dutch labels on the Dutch form", () => {
    const html = renderToStaticMarkup(<LeadForm variant="offerte" locale="nl" />);

    expect(html).toContain('<option value="vlaanderen" class="bg-neutral-900 text-white">Vlaanderen</option>');
    expect(html).toContain('<option value="antwerpen" class="bg-neutral-900 text-white">Antwerpen</option>');
    expect(html).toContain('<option value="nederlands-limburg" class="bg-neutral-900 text-white">Nederlands-Limburg</option>');
  });
});
