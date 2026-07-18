import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: vi.fn(async () => ({})) }));

describe("English preview release blockers", () => {
  it("renders the services hub title, heading and CTA in English without Dutch visitor copy", async () => {
    const page = await import("./diensten/page");
    const html = renderToStaticMarkup(
      await page.default({ params: Promise.resolve({ locale: "en" }) }),
    );
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("Services") });
    expect(html).toContain("Creative services for businesses");
    expect(html).toContain("Request a quotation");
    expect(html).not.toMatch(/Diensten|Offerte aanvragen|Bekijk realisaties|Welke diensten/);
  });

  it("renders the knowledge-base title and heading in English without Dutch visitor copy", async () => {
    const page = await import("./kennisbank/page");
    const html = renderToStaticMarkup(
      await page.default({ params: Promise.resolve({ locale: "en" }) }),
    );
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "en" }) });

    expect(metadata.title).toMatchObject({ absolute: expect.stringContaining("Knowledge base") });
    expect(html).toContain("Grow smarter");
    expect(html).toContain("online as an SME");
    expect(html).not.toMatch(/Kennisbank|Slim online|Nieuwste artikels|Zoeken in/);
  });
});
