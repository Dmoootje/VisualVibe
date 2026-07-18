"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AnalysisLimitState } from "@/components/analyse/AnalysisLimitState";
import { analysisLocale } from "@/lib/analyse/locale";
import type {
  AnalysisQuotaDecision,
  AnalysisResendRequest,
  AnalysisResendResponse,
  AnalysisStartRequest,
  AnalysisStartResponse,
  AnalysisVerifyRequest,
  AnalysisVerifyResponse,
} from "@/types/analysis";

const inputClasses =
  "w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 text-[15px] text-white placeholder:text-[#5c564f] [color-scheme:dark] transition-colors focus:border-[#ff8a2a]/60 focus:outline-none focus:ring-2 focus:ring-[#ff8a2a]/15";

const urlInputClasses =
  "h-[58px] rounded-xl px-5 text-base";

const gradientButtonClasses =
  "h-[50px] w-full shrink-0 gap-2 rounded-xl border-0 bg-gradient-to-r from-[#ff4b3a] to-[#ff9124] px-7 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,110,30,0.55)] transition hover:brightness-110 sm:w-auto";

/** Letterlijke nieuwsbrief-consenttekst; gaat mee als newsletterConsentTextVersion. */
const FLOW_COPY = {
  nl: {
    step1: "STAP 1 VAN 3", urlHeading: "Jouw website-URL", urlIntro: "Start hier. Binnen een minuut weet je waar je staat.", urlPlaceholder: "www.jouwwebsite.be", start: "Gratis analyse starten", freeNote: "Gratis en vrijblijvend. Je ontvangt een score en concrete verbeterpunten.", stats: ["score op basis van kernsignalen", "gratis analyses per 24 uur", "techniek, content en snelheid"],
    step2: "STAP 2 VAN 3", detailsHeading: "Bijna klaar - waar mogen we het rapport naartoe?", firstName: "Voornaam*", email: "E-mailadres*", company: "Bedrijfsnaam (optioneel)", websiteUrl: "Website-URL*", privacyConsent: "Ik ga akkoord met de verwerking van mijn gegevens volgens het", privacyLink: "privacybeleid", newsletterConsent: "Ja, ik ontvang graag de VisualVibe-nieuwsbrief met praktische tips over websites, SEO en online zichtbaarheid. Uitschrijven kan op elk moment.", privacyUsage: "We gebruiken je gegevens om de analyse uit te voeren, het rapport te bezorgen, misbruik te voorkomen en contact over je aanvraag mogelijk te maken.", sending: "Bezig met versturen...", sendCode: "Verstuur verificatiecode", back: "Terug",
    step3: "STAP 3 VAN 3", verifyHeading: "Bevestig je e-mailadres", verifyIntro: (email: string) => `We stuurden een 6-cijferige code naar ${email}. Vul die hieronder in om de analyse te starten.`, verifyCode: "Verificatiecode", confirm: "Code bevestigen en analyseren", resend: "Code opnieuw versturen", resendCooldown: (seconds: number) => `Opnieuw versturen kan over ${seconds}s`, noEmail: "Geen mail ontvangen? Kijk even in je spamfolder of vraag een nieuwe code aan.", resendSuccess: "Nieuwe code verstuurd. Kijk ook even in je spamfolder.",
    loadingPhases: ["Pagina ophalen en renderen", "Snelheid & Core Web Vitals meten", "Techniek & structuur controleren", "Content & zoekintentie analyseren", "AI-vindbaarheid beoordelen"], progressHeading: "We analyseren je website", busySlow: "Dit duurt iets langer dan gewoonlijk. Sommige moderne sites vragen een diepere crawl. Laat deze pagina open staan - lukt het niet meteen, dan sturen we het rapport naar je e-mailadres.", usualTime: "Dit duurt meestal 30 tot 45 seconden. Laat deze pagina open staan.",
    failedHeading: "De analyse is niet gelukt", retry: "Analyse opnieuw proberen", retrySending: "Nieuwe code versturen...", pendingHeading: "Je analyse loopt nog even door", pendingText: (email: string) => `Deze website vraagt een wat diepere crawl, bijvoorbeeld door JavaScript of server-side rendering. Daarom duurt de analyse langer dan gewoonlijk. Ze loopt op de achtergrond verder en je ontvangt het volledige rapport op ${email} zodra het klaar is. Je kunt dit venster sluiten.`,
    genericError: "Er ging iets mis. Probeer het opnieuw.", connectionError: "Er ging iets mis. Controleer je verbinding en probeer het opnieuw.", analysisConnectionError: "De verbinding viel weg tijdens de analyse. Probeer het opnieuw.", resendError: "Versturen mislukt. Probeer het zo opnieuw.", resendConnectionError: "Versturen mislukt. Controleer je verbinding en probeer het opnieuw.", failedError: "De analyse is niet gelukt. Probeer het opnieuw.", completeCode: "Vul de volledige 6-cijferige code in.", expiredCode: "Deze code is verlopen. Vraag hieronder een nieuwe code aan.", invalidCode: (attempts: number) => attempts > 0 ? `De code klopt niet. Je hebt nog ${attempts} ${attempts === 1 ? "poging" : "pogingen"}.` : "De code klopt niet en je pogingen zijn op. Vraag hieronder een nieuwe code aan.",
  },
  en: {
    step1: "STEP 1 OF 3", urlHeading: "Your website URL", urlIntro: "Start here. In under a minute, you will have a clearer picture of your website.", urlPlaceholder: "www.yourwebsite.com", start: "Start free analysis", freeNote: "Free, with no obligation. You receive a score and practical improvements.", stats: ["score based on key signals", "free analyses every 24 hours", "technical quality, content and speed"],
    step2: "STEP 2 OF 3", detailsHeading: "Almost there. Where should we send your report?", firstName: "First name*", email: "Email address*", company: "Company name (optional)", websiteUrl: "Website URL*", privacyConsent: "I agree to the processing of my personal data in accordance with the", privacyLink: "privacy policy", newsletterConsent: "Yes, I would like to receive the VisualVibe newsletter with practical advice on websites, SEO and online visibility. I can unsubscribe at any time.", privacyUsage: "We use your details to run the analysis, deliver the report, prevent misuse and contact you about your request.", sending: "Sending...", sendCode: "Send verification code", back: "Back",
    step3: "STEP 3 OF 3", verifyHeading: "Confirm your email address", verifyIntro: (email: string) => `We sent a 6-digit code to ${email}. Enter it below to start the analysis.`, verifyCode: "Verification code", confirm: "Confirm code and start analysis", resend: "Resend code", resendCooldown: (seconds: number) => `You can resend the code in ${seconds}s`, noEmail: "No email yet? Check your spam folder or request a new code.", resendSuccess: "We sent a new code. Please check your spam folder too.",
    loadingPhases: ["Loading and rendering the page", "Measuring speed and Core Web Vitals", "Checking technical quality and structure", "Reviewing content and search intent", "Assessing AI search visibility"], progressHeading: "We are analysing your website", busySlow: "This is taking a little longer than usual. Some modern websites require a deeper crawl. Keep this page open. If the analysis cannot finish here, we will email you the report.", usualTime: "This usually takes 30 to 45 seconds. Keep this page open.",
    failedHeading: "We could not complete the analysis", retry: "Try the analysis again", retrySending: "Sending a new code...", pendingHeading: "Your analysis is still running", pendingText: (email: string) => `This website requires a deeper crawl, for example because it uses JavaScript or server-side rendering, so the analysis is taking longer than usual. It will continue in the background, and we will send the full report to ${email} as soon as it is ready. You can close this window.`,
    genericError: "Something went wrong. Please try again.", connectionError: "Something went wrong. Check your connection and try again.", analysisConnectionError: "The connection was interrupted during the analysis. Please try again.", resendError: "We could not resend the code. Please try again shortly.", resendConnectionError: "We could not resend the code. Check your connection and try again.", failedError: "We could not complete the analysis. Please try again.", completeCode: "Enter the complete 6-digit code.", expiredCode: "This code has expired. Request a new code below.", invalidCode: (attempts: number) => attempts > 0 ? `That code is not correct. You have ${attempts} ${attempts === 1 ? "attempt" : "attempts"} left.` : "That code is not correct, and you have no attempts left. Request a new code below.",
  },
} as const;

export function getAnalyseFlowCopy(locale: unknown) {
  return locale === "nl" || locale === "en" ? FLOW_COPY[locale] : null;
}

export function getSafeAnalyseError(locale: "nl" | "en", _raw: unknown, kind: "start" | "verify" | "resend") {
  const copy = FLOW_COPY[locale];
  return kind === "resend" ? copy.resendError : copy.genericError;
}

const RESEND_COOLDOWN_SECONDS = 60;

/** Na 1 minuut melden we dat een diepere (JS/SSR) crawl langer kan duren. */
const BUSY_SLOW_AFTER_MS = 60_000;
/**
 * De client kapt zijn eigen verify-verzoek net onder Cloudflare's ~100s
 * edge-timeout af. De server loopt dan gewoon door en mailt het rapport; de
 * bezoeker krijgt een nette "volgt per e-mail"-melding i.p.v. een 524-fout.
 */
const CLIENT_VERIFY_TIMEOUT_MS = 90_000;

const LOADING_TARGET_MS = 45_000;

type FlowState =
  | { step: "url" }
  | { step: "gegevens" }
  | { step: "code" }
  | { step: "bezig" }
  | {
      step: "limit";
      message: string;
      quotaDecision?: AnalysisQuotaDecision;
      resetsAt?: string;
    }
  | { step: "failed"; message: string }
  | { step: "pending_email" };

export function getReportRedirectTarget(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;

  const status = (response as { status?: unknown }).status;
  const reportUrl = (response as { reportUrl?: unknown }).reportUrl;

  if ((status === "completed" || status === "reused") && typeof reportUrl === "string" && reportUrl.trim()) {
    return reportUrl;
  }

  return null;
}

function phaseStatus(progress: number, index: number): "done" | "active" | "pending" {
  const phaseSize = 100 / 5;
  if (progress >= (index + 1) * phaseSize - 1) return "done";
  if (progress >= index * phaseSize) return "active";
  return "pending";
}

/**
 * Meerstaps-flow voor de gratis websiteanalyse: URL -> gegevens ->
 * e-mailverificatie met 6-cijferige code -> analyse -> directe redirect
 * naar het bestaande rapport.
 * Praat met /api/analyse/* volgens het contract in src/types/analysis.ts.
 */
export function AnalyseFlow({ locale = "nl" }: { locale?: "nl" | "en" }) {
  const copy = FLOW_COPY[locale];
  const [flow, setFlow] = useState<FlowState>({ step: "url" });

  // Formuliervelden (controlled, zodat de URL uit stap 1 voorgevuld blijft).
  const [url, setUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Verificatie-stap.
  const [analysisLeadId, setAnalysisLeadId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [startError, setStartError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [busySlow, setBusySlow] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Cooldown-teller voor "Code opnieuw versturen".
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Zachte voortgang terwijl de echte server-side analyse loopt.
  useEffect(() => {
    if (flow.step !== "bezig") {
      setAnalysisProgress(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - startedAt) / LOADING_TARGET_MS);
      const eased = 100 * (1 - Math.pow(1 - t, 1.8));
      setAnalysisProgress((current) => Math.max(current, Math.min(96, eased)));
    }, 160);

    return () => clearInterval(timer);
  }, [flow.step]);

  // Na 1 minuut melden dat een diepere crawl (JS/SSR) langer kan duren.
  useEffect(() => {
    if (flow.step !== "bezig") {
      setBusySlow(false);
      return;
    }
    const timer = setTimeout(() => setBusySlow(true), BUSY_SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [flow.step]);

  function handleUrlSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    setFlow({ step: "gegevens" });
  }

  async function handleStartSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setStartError(null);

    const searchParams = new URLSearchParams(window.location.search);
    const payload: AnalysisStartRequest & { newsletterConsentTextVersion?: string } = {
      firstName: firstName.trim(),
      email: email.trim(),
      companyName: companyName.trim() || undefined,
      url: url.trim(),
      privacyAccepted,
      newsletterOptIn,
      locale: analysisLocale(window.location.pathname.split("/").filter(Boolean)[0]),
      // Letterlijke consenttekst op moment van aanvinken (contract: AnalysisLead).
      ...(newsletterOptIn ? { newsletterConsentTextVersion: copy.newsletterConsent } : {}),
      sourcePage: window.location.pathname,
      referrer: document.referrer || undefined,
      utmSource: searchParams.get("utm_source") || undefined,
      utmMedium: searchParams.get("utm_medium") || undefined,
      utmCampaign: searchParams.get("utm_campaign") || undefined,
      // Honeypot: blijft leeg bij echte bezoekers.
      website: honeypot || undefined,
    };

    try {
      const response = await fetch("/api/analyse/start/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AnalysisStartResponse;

      if (data.status === "limit_reached") {
        setFlow({
          step: "limit",
          message: copy.genericError,
          quotaDecision: data.quotaDecision,
          resetsAt: data.resetsAt,
        });
        setIsPending(false);
        return;
      }

      if (!response.ok || data.status !== "code_sent") {
        setStartError(getSafeAnalyseError(locale, data, "start"));
        setIsPending(false);
        return;
      }

      setAnalysisLeadId(data.analysisLeadId);
      setCode("");
      setCodeError(null);
      setResendNotice(null);
      setFlow({ step: "code" });
      setIsPending(false);
    } catch {
      setStartError(copy.connectionError);
      setIsPending(false);
    }
  }

  /** Roept /api/analyse/verify/ aan vanuit de codestap. */
  async function runVerify(codeValue: string) {
    if (!analysisLeadId) return;
    setAnalysisProgress(0);
    setFlow({ step: "bezig" });

    const payload: AnalysisVerifyRequest = { analysisLeadId, code: codeValue };
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), CLIENT_VERIFY_TIMEOUT_MS);

    try {
      const response = await fetch("/api/analyse/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = (await response.json()) as AnalysisVerifyResponse;
      const reportRedirectTarget = getReportRedirectTarget(data);

      if (reportRedirectTarget) {
        setAnalysisProgress(100);
        window.setTimeout(() => {
          window.location.href = reportRedirectTarget;
        }, 650);
        return;
      }

      switch (data.status) {
        case "limit_reached":
          setFlow({
            step: "limit",
            message: copy.genericError,
            quotaDecision: data.quotaDecision,
            resetsAt: data.resetsAt,
          });
          setIsPending(false);
          return;
        case "failed":
          setFlow({
            step: "failed",
            message: copy.failedError,
          });
          return;
        case "invalid_code":
          setCode("");
          setCodeError(copy.invalidCode(data.attemptsLeft));
          setFlow({ step: "code" });
          return;
        case "code_expired":
          setCode("");
          setCodeError(copy.expiredCode);
          setFlow({ step: "code" });
          return;
        default:
          setCodeError(getSafeAnalyseError(locale, data, "verify"));
          setFlow({ step: "code" });
          return;
      }
    } catch (error) {
      // Client-abort na de time-out: de analyse loopt server-side gewoon door en
      // het rapport wordt gemaild. Andere fouten = een echte verbindingsfout.
      if (error instanceof DOMException && error.name === "AbortError") {
        setFlow({ step: "pending_email" });
      } else {
        setFlow({
          step: "failed",
          message: copy.analysisConnectionError,
        });
      }
    } finally {
      clearTimeout(abortTimer);
    }
  }

  function handleCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = code.trim();
    if (!/^\d{6}$/.test(clean)) {
      setCodeError(copy.completeCode);
      return;
    }
    setCodeError(null);
    void runVerify(clean);
  }

  /**
   * Vraagt een nieuwe verificatiecode aan. `fromFailure` stuurt de bezoeker na
   * een mislukte analyse terug naar de codestap: een heranalyse vereist altijd
   * een nieuwe, geldige code (de vorige is verbruikt), zodat de engine nooit
   * ongelimiteerd zonder verificatie opnieuw kan draaien.
   */
  async function handleResend(fromFailure = false) {
    if (!analysisLeadId || (!fromFailure && (resendCooldown > 0 || isPending))) return;
    setIsPending(true);
    setResendNotice(null);
    setCodeError(null);

    const payload: AnalysisResendRequest = { analysisLeadId };

    try {
      const response = await fetch("/api/analyse/resend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AnalysisResendResponse;

      if (response.ok && data.status === "code_sent") {
        setCode("");
        setResendNotice(copy.resendSuccess);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        if (fromFailure) setFlow({ step: "code" });
      } else {
        const message = getSafeAnalyseError(locale, data, "resend");
        if (fromFailure) {
          setFlow({ step: "failed", message });
        } else {
          setCodeError(message);
        }
      }
    } catch {
      const message = copy.resendConnectionError;
      if (fromFailure) {
        setFlow({ step: "failed", message });
      } else {
        setCodeError(message);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="vvaf-root relative mx-auto w-full max-w-[1120px] px-0 sm:px-6">
      <div className="vvaf-glow" aria-hidden="true" />
      <div className="vvaf-border-shell relative rounded-[26px] p-[1.5px]">
        <div className="rounded-[24.5px] bg-[linear-gradient(180deg,#161210_0%,#100d0b_100%)] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-11">
          {/* Stap 1: URL invullen */}
          {flow.step === "url" && (
            <form onSubmit={handleUrlSubmit} className="vvaf-step text-center">
              <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-[#ff8a2a]">
                {copy.step1}
              </p>
              <h2 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-white">
                {copy.urlHeading}
              </h2>
              <p className="mt-1 text-[15px] text-[#8f8880]">
                {copy.urlIntro}
              </p>

              <div className="mx-auto mt-7 flex max-w-[620px] flex-col gap-3 sm:flex-row">
                <input
                  id="analyse-url"
                  name="url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={copy.urlPlaceholder}
                  aria-label={copy.websiteUrl}
                  className={`${inputClasses} ${urlInputClasses} sm:flex-1`}
                />
                <Button type="submit" className={`${gradientButtonClasses} h-[58px]`}>
                  {copy.start}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <p className="mt-5 text-[13px] text-[#6b6259]">
                {copy.freeNote}
              </p>

              <div className="mt-8 grid gap-3.5 text-center sm:grid-cols-3">
                {[
                  { value: "100", label: copy.stats[0] },
                  { value: "3", label: copy.stats[1] },
                  { value: "SEO", label: copy.stats[2] },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.09] bg-white/[0.028] px-5 py-5"
                  >
                    <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                    <p className="mt-1 text-[13px] leading-snug text-[#8f8880]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </form>
          )}

          {/* Stap 2: gegevens */}
          {flow.step === "gegevens" && (
            <div className="vvaf-step">
              <form onSubmit={handleStartSubmit} className="flex flex-col gap-5">
                <div>
                  <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-[#ff8a2a]">
                    {copy.step2}
                  </p>
                  <h2 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-white">
                    {copy.detailsHeading}
                  </h2>
                </div>

                {/* Honeypot: verborgen voor echte bezoekers, bots vullen elk veld in. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="analyse-website">Website</label>
                  <input
                    id="analyse-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-5">
                  <FormField label={copy.firstName} htmlFor="analyse-firstname">
                    <input
                      id="analyse-firstname"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className={`${inputClasses} h-12`}
                    />
                  </FormField>
                  <FormField label={copy.email} htmlFor="analyse-email">
                    <input
                      id="analyse-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={`${inputClasses} h-12`}
                    />
                  </FormField>
                  <FormField label={copy.company} htmlFor="analyse-company">
                    <input
                      id="analyse-company"
                      name="companyName"
                      autoComplete="organization"
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      className={`${inputClasses} h-12`}
                    />
                  </FormField>
                  <FormField label={copy.websiteUrl} htmlFor="analyse-url-edit">
                    <input
                      id="analyse-url-edit"
                      name="url"
                      type="text"
                      inputMode="url"
                      required
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      className={`${inputClasses} h-12`}
                    />
                  </FormField>
                </div>

                <label className="flex items-start gap-2.5 text-sm leading-relaxed text-white/62">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    required
                    checked={privacyAccepted}
                    onChange={(event) => setPrivacyAccepted(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#ff8a2a]"
                  />
                  <span>
                    {copy.privacyConsent}{" "}
                    <Link href="/privacy" className="text-[#ff9a4d] underline underline-offset-2 hover:text-[#ffb066]">
                      {copy.privacyLink}
                    </Link>
                    .*
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-sm leading-relaxed text-white/62">
                  <input
                    type="checkbox"
                    name="newsletterOptIn"
                    checked={newsletterOptIn}
                    onChange={(event) => setNewsletterOptIn(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#ff8a2a]"
                  />
                  <span>{copy.newsletterConsent}</span>
                </label>

                {startError && (
                  <p className="text-sm text-red-400" role="alert">
                    {startError}
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button type="submit" disabled={isPending} className={gradientButtonClasses}>
                    {isPending ? copy.sending : copy.sendCode}
                    {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setFlow({ step: "url" })}
                    className="w-full text-sm font-semibold text-[#e8e2db] transition-colors hover:text-[#ffb066] sm:w-auto"
                  >
                    {copy.back}
                  </button>
                </div>
              </form>

              <p className="mt-4 text-[13px] leading-relaxed text-[#6b6259]">{copy.privacyUsage}</p>
            </div>
          )}

          {/* Stap 3: verificatiecode */}
          {flow.step === "code" && (
            <form onSubmit={handleCodeSubmit} className="vvaf-step flex flex-col gap-5">
              <p className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-[#ff8a2a]">
                {copy.step3}
              </p>

              <div className="flex items-center gap-3.5 text-left">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ff8a2a]/50 bg-[#ff8a2a]/12 text-[#FF9A45]">
                  <MailCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-white">{copy.verifyHeading}</h2>
              </div>

              <p className="text-sm leading-relaxed text-white/62">
                {copy.verifyIntro(email)}
              </p>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <FormField label={copy.verifyCode} htmlFor="analyse-code" className="lg:w-[220px]">
                  <input
                    id="analyse-code"
                    name="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    aria-invalid={codeError ? true : undefined}
                    aria-describedby={codeError ? "analyse-code-error" : undefined}
                    placeholder="000000"
                    className={`${inputClasses} h-[54px] text-center text-[22px] font-bold tracking-[0.45em]`}
                  />
                </FormField>

                <Button type="submit" disabled={isPending} className={`${gradientButtonClasses} h-[54px]`}>
                  {copy.confirm}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>

                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={resendCooldown > 0 || isPending}
                  className="inline-flex h-[54px] items-center justify-center text-sm font-semibold text-[#e8e2db] transition-colors hover:text-[#ffb066] disabled:cursor-not-allowed disabled:text-white/40"
                >
                  {resendCooldown > 0
                    ? copy.resendCooldown(resendCooldown)
                    : copy.resend}
                </button>
              </div>

              {codeError && (
                <p id="analyse-code-error" className="text-sm text-red-400" role="alert">
                  {codeError}
                </p>
              )}
              {resendNotice && (
                <p className="text-sm text-green-400" role="status">
                  {resendNotice}
                </p>
              )}

              <p className="text-[13px] text-[#6b6259]">
                {copy.noEmail}
              </p>
            </form>
          )}

          {/* Laadfase: analyse loopt. Geen tussen-resultaat; daarna direct naar rapport. */}
          {flow.step === "bezig" && (
            <LoadingState progress={analysisProgress} busySlow={busySlow} copy={copy} />
          )}

          {/* Eindstate: quotum bereikt */}
          {flow.step === "limit" && (
            <div className="vvaf-step">
              <AnalysisLimitState
                message={flow.message}
                decision={flow.quotaDecision}
                resetsAt={flow.resetsAt}
                locale={locale}
              />
            </div>
          )}

          {/* Eindstate: analyse mislukt. Het tegoed is gereleased; een nieuwe poging
              krijgt een verse code (de vorige is verbruikt) en gaat weer via de
              codestap, zodat heranalyse nooit zonder geldige verificatie draait. */}
          {flow.step === "failed" && (
            <div className="vvaf-step flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{copy.failedHeading}</h2>
                  <p className="mt-1 text-sm text-white/60" role="alert">
                    {flow.message}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => void handleResend(true)}
                disabled={!analysisLeadId || isPending}
                className={gradientButtonClasses}
              >
                {isPending ? copy.retrySending : copy.retry}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* Eindstate: analyse duurt langer dan de client wacht; het rapport volgt per
              e-mail. De server rondt de analyse af nadat de client zijn eigen verzoek
              net onder Cloudflare's edge-timeout heeft afgekapt. */}
          {flow.step === "pending_email" && (
            <div className="vvaf-step flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ff8a2a]/30 bg-[#ff8a2a]/12 text-[#FF9A45]">
                  <MailCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">{copy.pendingHeading}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {copy.pendingText(email)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#e8e2db]">
        {label}
      </label>
      {children}
    </div>
  );
}

function LoadingState({ progress, busySlow, copy }: { progress: number; busySlow: boolean; copy: (typeof FLOW_COPY)["nl" | "en"] }) {
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="vvaf-step grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-11" role="status" aria-live="polite">
      <div className="relative mx-auto h-[170px] w-[170px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 170 170" aria-hidden="true">
          <defs>
            <linearGradient id="vvaf-progress-gradient" x1="20" x2="150" y1="20" y2="150">
              <stop stopColor="#ff4b3a" />
              <stop offset="1" stopColor="#ffb066" />
            </linearGradient>
          </defs>
          <circle cx="85" cy="85" r="76" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5" />
          <circle
            className="vvaf-ring-spin"
            cx="85"
            cy="85"
            r="76"
            fill="none"
            stroke="url(#vvaf-progress-gradient)"
            strokeLinecap="round"
            strokeWidth="6"
            strokeDasharray="120 358"
          />
        </svg>
        <div className="vvaf-orb absolute inset-0 m-auto h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,138,42,0.28),rgba(255,138,42,0.06)_62%,transparent_72%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[34px] font-extrabold text-white">{roundedProgress}</span>
          <span className="ml-1 text-base font-semibold text-[#8f8880]">%</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">{copy.progressHeading}</h2>
        <div className="mt-5 flex flex-col gap-3">
          {copy.loadingPhases.map((phase, index) => (
            <LoadingPhase key={phase} label={phase} status={phaseStatus(roundedProgress, index)} />
          ))}
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="vvaf-progress-fill h-full rounded-full"
            style={{ width: `${roundedProgress}%` }}
          />
        </div>

        {busySlow ? (
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-amber-300/80">
            {copy.busySlow}
          </p>
        ) : (
          <p className="mt-4 text-[13px] text-[#6b6259]">
            {copy.usualTime}
          </p>
        )}
      </div>
    </div>
  );
}

function LoadingPhase({
  label,
  status,
}: {
  label: string;
  status: "done" | "active" | "pending";
}) {
  return (
    <div className="flex items-center gap-3">
      {status === "done" ? (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#3ddc84]/15 text-[#3ddc84]">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      ) : status === "active" ? (
        <span className="vvaf-dot h-[9px] w-[9px] rounded-full bg-[#ff8a2a]" aria-hidden="true" />
      ) : (
        <span className="h-[13px] w-[13px] rounded-full border border-white/20" aria-hidden="true" />
      )}
      <span
        className={
          status === "done"
            ? "text-sm text-[#8f8880]"
            : status === "active"
              ? "text-sm font-semibold text-white"
              : "text-sm text-[#5c564f]"
        }
      >
        {label}
      </span>
    </div>
  );
}
