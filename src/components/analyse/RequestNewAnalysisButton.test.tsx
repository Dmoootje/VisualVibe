import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", async () => {
  const React = await import("react");
  return {
    Link: ({ href, children, ...props }: { href: string; children: ReactNode }) =>
      React.createElement("a", { href, ...props }, children),
  };
});

import { RequestNewAnalysisButton } from "./RequestNewAnalysisButton";

describe("RequestNewAnalysisButton", () => {
  it("links customers directly to a fresh analysis flow", () => {
    const html = renderToStaticMarkup(
      <RequestNewAnalysisButton />,
    );

    expect(html).toContain('href="/website-analyse"');
    expect(html).toContain("Nieuwe analyse starten");
  });
});
