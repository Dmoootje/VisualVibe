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

  it("provides complete, natural English copy for every API flow state", () => {
    const copy = AnalyseFlowModule.getAnalyseFlowCopy?.("en");

    expect(copy).toMatchObject({
      step1: "STEP 1 OF 3",
      urlHeading: "Your website URL",
      start: "Start free analysis",
      step2: "STEP 2 OF 3",
      firstName: "First name*",
      email: "Email address*",
      privacyLink: "privacy policy",
      sendCode: "Send verification code",
      step3: "STEP 3 OF 3",
      verifyHeading: "Confirm your email address",
      verifyCode: "Verification code",
      progressHeading: "We are analysing your website",
      failedHeading: "We could not complete the analysis",
      retry: "Try the analysis again",
      pendingHeading: "Your analysis is still running",
    });
    expect(copy?.loadingPhases).toHaveLength(5);
    expect(copy?.privacyConsent).toContain("processing of my personal data");
    expect(copy?.privacyUsage).toContain("deliver the report");
  });

  it("renders the English initial form without Dutch visitor copy", () => {
    const html = renderToStaticMarkup(<AnalyseFlowModule.AnalyseFlow locale="en" />);

    expect(html).toContain("STEP 1 OF 3");
    expect(html).toContain("Your website URL");
    expect(html).toContain("Start free analysis");
    expect(html).not.toContain("Gratis analyse starten");
    expect(html).not.toContain("Jouw website-URL");
  });

  it("keeps Dutch copy unchanged and selects locales strictly", () => {
    expect(AnalyseFlowModule.getAnalyseFlowCopy?.("nl")?.start).toBe("Gratis analyse starten");
    expect(AnalyseFlowModule.getAnalyseFlowCopy?.("fr")).toBeNull();
  });

  it("localises validation, verification attempts, resend and progress messages", () => {
    const copy = AnalyseFlowModule.getAnalyseFlowCopy?.("en");

    expect(copy?.invalidCode(1)).toContain("1 attempt left");
    expect(copy?.invalidCode(2)).toContain("2 attempts left");
    expect(copy?.completeCode).toBe("Enter the complete 6-digit code.");
    expect(copy?.resendSuccess).toContain("new code");
    expect(copy?.resendCooldown(42)).toBe("You can resend the code in 42s");
    expect(copy?.busySlow).toContain("deeper crawl");
  });

  it("suppresses raw API and internal errors in every public locale", () => {
    const raw = "FirebaseError: permission-denied at analyseLead/secret";

    expect(AnalyseFlowModule.getSafeAnalyseError?.("en", raw, "start")).toBe(
      "Something went wrong. Please try again.",
    );
    expect(AnalyseFlowModule.getSafeAnalyseError?.("nl", raw, "verify")).toBe(
      "Er ging iets mis. Probeer het opnieuw.",
    );
    expect(AnalyseFlowModule.getSafeAnalyseError?.("en", raw, "resend")).not.toContain(raw);
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
