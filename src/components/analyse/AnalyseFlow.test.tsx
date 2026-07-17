import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import * as AnalyseFlowModule from "./AnalyseFlow";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AnalyseFlow", () => {
  it("renders the redesigned first step with the trust stats inside the animated card", () => {
    const html = renderToStaticMarkup(<AnalyseFlowModule.AnalyseFlow />);

    expect(html).toContain("STAP 1 VAN 3");
    expect(html).toContain("Start hier");
    expect(html).toContain("score op basis van kernsignalen");
    expect(html).toContain("gratis analyses per 24 uur");
    expect(html).toContain("techniek, content en snelheid");
    expect(html).toContain("vvaf-border-shell");
  });

  it("redirects completed and reused analyses directly to the existing report page", () => {
    const getReportRedirectTarget = (
      AnalyseFlowModule as typeof AnalyseFlowModule & {
        getReportRedirectTarget?: (response: unknown) => string | null;
      }
    ).getReportRedirectTarget;

    expect(getReportRedirectTarget?.({ status: "completed", reportUrl: "/website-analyse/rapport/abc" })).toBe(
      "/website-analyse/rapport/abc",
    );
    expect(getReportRedirectTarget?.({ status: "reused", reportUrl: "/website-analyse/rapport/reused" })).toBe(
      "/website-analyse/rapport/reused",
    );
    expect(getReportRedirectTarget?.({ status: "invalid_code" })).toBeNull();
  });
});
