import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RequestNewAnalysisButton } from "./RequestNewAnalysisButton";

describe("RequestNewAnalysisButton routes", () => {
  it("keeps the Dutch public analysis route", () => {
    expect(renderToStaticMarkup(<RequestNewAnalysisButton locale="nl" />)).toContain('href="/be/website-analyse"');
  });

  it("uses the owned English analysis alias", () => {
    expect(renderToStaticMarkup(<RequestNewAnalysisButton locale="en" />)).toContain('href="/en/website-analysis"');
  });
});
