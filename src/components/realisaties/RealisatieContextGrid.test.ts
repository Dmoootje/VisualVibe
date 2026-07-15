import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RealisatieContextGrid } from "./RealisatieContextGrid";

vi.mock("@/i18n/navigation", () => ({ Link: () => null }));

describe("RealisatieContextGrid", () => {
  it("uses the existing project description for the context image", () => {
    const html = renderToStaticMarkup(
      createElement(RealisatieContextGrid, {
        items: [
          {
            slug: "bedrijven",
            title: "Bedrijven",
            description: "Projecten voor bedrijven",
            image: {
              src: "/portfolio/bm-jumpfun-cover.webp",
              alt: "BM Jumpfun maatwerkplatform door VisualVibe",
            },
            count: 1,
          },
        ],
      }),
    );

    expect(html).toContain('alt="BM Jumpfun maatwerkplatform door VisualVibe"');
  });
});
