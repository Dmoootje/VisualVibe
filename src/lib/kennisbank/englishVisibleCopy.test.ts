import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("English knowledge-base visible route examples", () => {
  it("uses English labels instead of exposing legacy Dutch path words in code blocks", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "content/kennisbank/en/complete-guide-to-building-a-website-in-limburg.mdx",
      ),
      "utf8",
    );
    const visibleCode = [...source.matchAll(/```txt\s*([\s\S]*?)```/g)]
      .map((match) => match[1])
      .join("\n");

    expect(visibleCode).not.toMatch(/\/en\/(?:diensten|over-ons|offerte-aanvragen)(?:\/|\b)/);
    expect(visibleCode).toContain("Request a quotation");
    expect(visibleCode).toContain("Business website design");
  });

  it("uses English labels in the local SEO article's visible route example", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "content/kennisbank/en/local-seo-for-smes-in-limburg.mdx",
      ),
      "utf8",
    );
    const visibleCode = [...source.matchAll(/```txt\s*([\s\S]*?)```/g)]
      .map((match) => match[1])
      .join("\n");

    expect(visibleCode).not.toMatch(/(?:^|\s)\/(?:diensten|regio)\//m);
    expect(visibleCode).not.toMatch(/\/(?:fotografie|videografie)\//);
    expect(visibleCode).toContain("/en/diensten/web-design/");
    expect(visibleCode).toContain("/en/diensten/photography/");
    expect(visibleCode).toContain("/en/diensten/videography/");
    expect(visibleCode).toContain("/en/regio/limburg-belgium/");
  });
});
