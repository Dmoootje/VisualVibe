import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BlogHeader } from "./BlogHeader";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => createElement("a", { href }, children),
}));

describe("BlogHeader", () => {
  it("uses the owned English knowledge route and preserves the Dutch path", () => {
    const english = renderToStaticMarkup(createElement(BlogHeader, { locale: "en" }));
    const dutch = renderToStaticMarkup(createElement(BlogHeader));
    expect(english).toContain('href="/en/kennisbank"');
    expect(english).not.toContain("/en/knowledge-base/");
    expect(dutch).toContain('href="/kennisbank"');
  });
});
