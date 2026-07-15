import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import * as serviceRelatedPosts from "./ServiceRelatedPosts";

vi.mock("@/i18n/navigation", () => ({ Link: () => null }));

type AuthorMetaProps = {
  author?: string;
  authorImage?: string;
  readingTime?: string;
};

describe("AuthorMeta", () => {
  it("uses the approved accessible foreground for author and reading time", () => {
    const AuthorMeta = Reflect.get(
      serviceRelatedPosts,
      "AuthorMeta",
    ) as ComponentType<AuthorMetaProps> | undefined;

    expect(AuthorMeta).toBeTypeOf("function");
    if (!AuthorMeta) return;

    const html = renderToStaticMarkup(
      createElement(AuthorMeta, {
        author: "Jens Hardy",
        readingTime: "22 min",
      }),
    );

    expect(html).toContain("text-white/65");
    expect(html).not.toContain("text-white/40");
    expect(html).toContain("Jens Hardy");
    expect(html).toContain("22 min");
  });

  it("renders a relevant alt for the author photo", () => {
    const AuthorMeta = Reflect.get(
      serviceRelatedPosts,
      "AuthorMeta",
    ) as ComponentType<AuthorMetaProps> | undefined;

    expect(AuthorMeta).toBeTypeOf("function");
    if (!AuthorMeta) return;

    const html = renderToStaticMarkup(
      createElement(AuthorMeta, {
        author: "Jens Hardy",
        authorImage: "/images/team/profielfoto.webp",
        readingTime: "22 min",
      }),
    );

    expect(html).toContain('alt="Profielfoto van Jens Hardy"');
  });
});
