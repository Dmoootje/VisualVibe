import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: React.ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => createElement("img", props),
}));
vi.mock("@/components/fotografie", () => ({ FiIcon: () => null }));

import { RealisatieDroneMedia } from "./RealisatieDroneMedia";

const media = [{ kind: "video", youtubeId: "example", title: "Aerial project", category: "Business" }] as const;
const categories = [{ name: "Business", description: "" }];

describe("drone realisation copy", () => {
  it("renders complete English featured and filter copy", () => {
    const html = renderToStaticMarkup(<RealisatieDroneMedia media={[...media]} categories={categories} locale="en" />);

    expect(html).toContain("Featured");
    expect(html).toContain("Featured case study");
    expect(html).toContain("Smooth aerial footage");
    expect(html).toContain("Filter by category or view all footage");
    expect(html).not.toContain("UITGELICHT");
    expect(html).not.toContain("Filter op categorie");
    expect(html).not.toContain("Vloeiende luchtbeelden");
  });

  it("keeps the Dutch featured and filter copy", () => {
    const html = renderToStaticMarkup(<RealisatieDroneMedia media={[...media]} categories={categories} locale="nl" />);

    expect(html).toContain("UITGELICHT");
    expect(html).toContain("Filter op categorie");
  });
});
