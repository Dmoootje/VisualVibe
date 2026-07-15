"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AnalysisLimitState } from "@/components/analyse/AnalysisLimitState";
import { RequestNewAnalysisButton } from "@/components/analyse/RequestNewAnalysisButton";
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
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 [color-scheme:dark] transition-colors focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

const gradientButtonClasses =
  "h-11 w-full shrink-0 gap-2 border-0 bg-gradient-to-r from-red-500 to-amber-500 px-6 text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 sm:w-auto";

/** Letterlijke nieuwsbrief-consenttekst; gaat mee als newsletterConsentTextVersion. */
const NEWSLETTER_CONSENT_TEXT =
  "Ja, ik ontvang graag de VisualVibe-nieuwsbrief met praktische tips over websites, SEO en online zichtbaarheid. Uitschrijven kan op elk moment.";

/** Letterlijke privacytekst direct onder het gegevensformulier (vereist). */
const PRIVACY_USAGE_TEXT =
  "We gebruiken je gegevens om de analyse uit te voeren, het rapport te bezorgen, misbruik te voorkomen en contact over je aanvraag mogelijk te maken.";

const RESEND_COOLDOWN_SECONDS = 60;

/** Na 1 minuut melden we dat een diepere (JS/SSR) crawl langer kan duren. */
const BUSY_SLOW_AFTER_MS = 60_000;
/**
 * De client kapt zijn eigen verify-verzoek net onder Cloudflare's ~100s
 * edge-timeout af. De server loopt dan gewoon door en mailt het rapport; de
 * bezoeker krijgt een nette "volgt per e-mail"-melding i.p.v. een 524-fout.
 */
const CLIENT_VERIFY_TIMEOUT_MS = 90_000;

/** Voortgangsteksten tijdens de analyse (kan tot ~45 seconden duren). */
const BUSY_MESSAGES = [
  "We halen je website op en scannen de belangrijkste pagina's...",
  "We meten snelheid, techniek en mobiele weergave...",
  "We controleren SEO-basis, structuur en vindbaarheid...",
  "Bijna klaar - we stellen je rapport samen...",
];

type FlowState =
  | { step: "url" }
  | { step: "gegevens" }
  | { step: "code" }
  | { step: "bezig" }
  | {
      step: "resultaat";
      kind: "completed" | "reused";
      reportUrl: string;
      score: number;
      criticalIssues: string[];
    }
  | {
      step: "limit";
      message: string;
      quotaDecision?: AnalysisQuotaDecision;
      resetsAt?: string;
    }
  | { step: "failed"; message: string }
  | { step: "pending_email" };

function scoreColorClass(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

/**
 * Meerstaps-flow voor de gratis websiteanalyse: URL -> gegevens ->
 * e-mailverificatie met 6-cijferige code -> analyse -> resultaat.
 * Praat met /api/analyse/* volgens het contract in src/types/analysis.ts.
 */
export function AnalyseFlow() {
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
  const [busyIndex, setBusyIndex] = useState(0);
  const [busySlow, setBusySlow] = useState(false);

  // Cooldown-teller voor "Code opnieuw versturen".
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Wissel de voortgangstekst terwijl de analyse loopt.
  useEffect(() => {
    if (flow.step !== "bezig") {
      setBusyIndex(0);
      return;
    }
    const timer = setInterval(
      () => setBusyIndex((index) => Math.min(index + 1, BUSY_MESSAGES.length - 1)),
      9000,
    );
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
      // Letterlijke consenttekst op moment van aanvinken (contract: AnalysisLead).
      ...(newsletterOptIn ? { newsletterConsentTextVersion: NEWSLETTER_CONSENT_TEXT } : {}),
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
          message: data.message,
          quotaDecision: data.quotaDecision,
          resetsAt: data.resetsAt,
        });
        setIsPending(false);
        return;
      }

      if (!response.ok || data.status !== "code_sent") {
        setStartError(
          data.status === "error" ? data.error : "Er ging iets mis. Probeer het opnieuw.",
        );
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
      setStartError("Er ging iets mis. Controleer je verbinding en probeer het opnieuw.");
      setIsPending(false);
    }
  }

  /** Roept /api/analyse/verify/ aan vanuit de codestap. */
  async function runVerify(codeValue: string) {
    if (!analysisLeadId) return;
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

      switch (data.status) {
        case "completed":
        case "reused":
          setFlow({
            step: "resultaat",
            kind: data.status,
            reportUrl: data.reportUrl,
            score: data.score,
            criticalIssues: data.criticalIssues,
          });
          return;
        case "limit_reached":
          setFlow({
            step: "limit",
            message: data.message,
            quotaDecision: data.quotaDecision,
            resetsAt: data.resetsAt,
          });
          setIsPending(false);
          return;
        case "failed":
          setFlow({
            step: "failed",
            message: data.message || "De analyse is niet gelukt. Probeer het opnieuw.",
          });
          return;
        case "invalid_code":
          setCode("");
          setCodeError(
            data.attemptsLeft > 0
              ? `De code klopt niet. Je hebt nog ${data.attemptsLeft} ${
                  data.attemptsLeft === 1 ? "poging" : "pogingen"
                }.`
              : "De code klopt niet en je pogingen zijn op. Vraag hieronder een nieuwe code aan.",
          );
          setFlow({ step: "code" });
          return;
        case "code_expired":
          setCode("");
          setCodeError("Deze code is verlopen. Vraag hieronder een nieuwe code aan.");
          setFlow({ step: "code" });
          return;
        default:
          setCodeError(data.error || "Er ging iets mis. Probeer het opnieuw.");
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
          message: "De verbinding viel weg tijdens de analyse. Probeer het opnieuw.",
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
      setCodeError("Vul de volledige 6-cijferige code in.");
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
        setResendNotice("Nieuwe code verstuurd. Kijk ook even in je spamfolder.");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        if (fromFailure) setFlow({ step: "code" });
      } else {
        const message =
          data.status === "error" ? data.error : "Versturen mislukt. Probeer het zo opnieuw.";
        if (fromFailure) {
          setFlow({ step: "failed", message });
        } else {
          setCodeError(message);
        }
      }
    } catch {
      const message = "Versturen mislukt. Controleer je verbinding en probeer het opnieuw.";
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
    <div className="max-w-2xl rounded-[18px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
      {/* Stap 1: URL invullen */}
      {flow.step === "url" && (
        <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            Stap 1 van 3
          </p>
          <label htmlFor="analyse-url" className="text-sm font-medium text-white/80">
            Jouw website-URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="analyse-url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="www.jouwwebsite.be"
              className={`${inputClasses} sm:flex-1`}
            />
            <Button type="submit" className={gradientButtonClasses}>
              Gratis analyse starten
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="text-sm text-white/50">
            Gratis en vrijblijvend. Je ontvangt een score en concrete verbeterpunten.
          </p>
        </form>
      )}

      {/* Stap 2: gegevens (compacte tussenstap) */}
      {flow.step === "gegevens" && (
        <div>
          <form onSubmit={handleStartSubmit} className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              Stap 2 van 3
            </p>
            <h2 className="text-xl font-bold">Bijna klaar - waar mogen we het rapport naartoe?</h2>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="analyse-firstname" className="text-sm font-medium text-white/80">
                  Voornaam*
                </label>
                <input
                  id="analyse-firstname"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="analyse-email" className="text-sm font-medium text-white/80">
                  E-mailadres*
                </label>
                <input
                  id="analyse-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="analyse-company" className="text-sm font-medium text-white/80">
                  Bedrijfsnaam (optioneel)
                </label>
                <input
                  id="analyse-company"
                  name="companyName"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="analyse-url-edit" className="text-sm font-medium text-white/80">
                  Website-URL*
                </label>
                <input
                  id="analyse-url-edit"
                  name="url"
                  type="text"
                  inputMode="url"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-sm text-white/60">
              <input
                type="checkbox"
                name="privacyAccepted"
                required
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
              />
              <span>
                Ik ga akkoord met de verwerking van mijn gegevens volgens het{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
                  privacybeleid
                </Link>
                .*
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-sm text-white/60">
              <input
                type="checkbox"
                name="newsletterOptIn"
                checked={newsletterOptIn}
                onChange={(event) => setNewsletterOptIn(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
              />
              <span>{NEWSLETTER_CONSENT_TEXT}</span>
            </label>

            {startError && (
              <p className="text-sm text-red-400" role="alert">
                {startError}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" disabled={isPending} className={gradientButtonClasses}>
                {isPending ? "Bezig met versturen..." : "Verstuur verificatiecode"}
                {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <button
                type="button"
                onClick={() => setFlow({ step: "url" })}
                className="w-full text-sm text-white/50 transition-colors hover:text-white sm:w-auto"
              >
                Terug
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs leading-relaxed text-white/50">{PRIVACY_USAGE_TEXT}</p>
        </div>
      )}

      {/* Stap 3: verificatiecode */}
      {flow.step === "code" && (
        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            Stap 3 van 3
          </p>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
              <MailCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Bevestig je e-mailadres</h2>
              <p className="mt-1 text-sm text-white/60">
                We stuurden een 6-cijferige code naar <strong className="text-white/85">{email}</strong>.
                Vul die hieronder in om de analyse te starten.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="analyse-code" className="text-sm font-medium text-white/80">
              Verificatiecode
            </label>
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
              className={`${inputClasses} max-w-[220px] text-center text-2xl font-bold tracking-[0.5em]`}
            />
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isPending} className={gradientButtonClasses}>
              Code bevestigen en analyseren
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={resendCooldown > 0 || isPending}
              className="w-full text-sm text-white/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:hover:text-white/50 sm:w-auto"
            >
              {resendCooldown > 0
                ? `Opnieuw versturen kan over ${resendCooldown}s`
                : "Code opnieuw versturen"}
            </button>
          </div>
          <p className="text-xs text-white/40">
            Geen mail ontvangen? Kijk even in je spamfolder of vraag een nieuwe code aan.
          </p>
        </form>
      )}

      {/* Stap 4: analyse loopt */}
      {flow.step === "bezig" && (
        <div className="flex flex-col items-start gap-4 py-4" role="status" aria-live="polite">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold">We analyseren je website</h2>
          <p className="text-sm text-white/70">{BUSY_MESSAGES[busyIndex]}</p>
          {busySlow ? (
            <p className="max-w-md text-xs leading-relaxed text-amber-300/80">
              Dit duurt iets langer dan gewoonlijk. Sommige moderne sites (met veel JavaScript
              of server-side rendering) vragen een diepere crawl, wat tot enkele minuten kan
              oplopen. Laat dit venster open - lukt het niet meteen, dan sturen we het rapport
              naar je e-mailadres.
            </p>
          ) : (
            <p className="text-xs text-white/40">
              Dit duurt meestal 30 tot 45 seconden. Laat deze pagina open staan.
            </p>
          )}
        </div>
      )}

      {/* Eindstate: resultaat (completed of reused) */}
      {flow.step === "resultaat" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">
                {flow.kind === "reused"
                  ? "Deze website is recent al geanalyseerd"
                  : "Je analyse is klaar"}
              </h2>
              {flow.kind === "reused" && (
                <p className="mt-1 text-sm text-white/60">
                  Om dubbele analyses te vermijden krijg je het bestaande, recente rapport te zien.
                  Wil je toch een verse analyse? Vraag die hieronder aan.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-6xl font-bold ${scoreColorClass(flow.score)}`}>
              {flow.score}
            </span>
            <span className="text-lg text-white/40">/ 100</span>
          </div>

          {flow.criticalIssues.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white/70">
                Belangrijkste bevindingen
              </h3>
              <ul className="flex flex-col gap-2">
                {flow.criticalIssues.slice(0, 3).map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className={gradientButtonClasses}>
              <a href={flow.reportUrl}>
                Bekijk het volledige rapport
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            {flow.kind === "reused" && analysisLeadId && (
              <RequestNewAnalysisButton />
            )}
          </div>
        </div>
      )}

      {/* Eindstate: quotum bereikt */}
      {flow.step === "limit" && (
        <AnalysisLimitState
          message={flow.message}
          decision={flow.quotaDecision}
          resetsAt={flow.resetsAt}
        />
      )}

      {/* Eindstate: analyse mislukt. Het tegoed is gereleased; een nieuwe poging
          krijgt een verse code (de vorige is verbruikt) en gaat weer via de
          codestap, zodat heranalyse nooit zonder geldige verificatie draait. */}
      {flow.step === "failed" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">De analyse is niet gelukt</h2>
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
            {isPending ? "Nieuwe code versturen..." : "Analyse opnieuw proberen"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Eindstate: analyse duurt langer dan de client wacht; het rapport volgt per
          e-mail. De server rondt de analyse af nadat de client zijn eigen verzoek
          net onder Cloudflare's edge-timeout heeft afgekapt. */}
      {flow.step === "pending_email" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
              <MailCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Je analyse loopt nog even door</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                Deze website vraagt een wat diepere crawl (bijvoorbeeld door JavaScript of
                server-side rendering), dus de analyse duurt langer dan gewoonlijk. Ze loopt op
                de achtergrond af en je ontvangt het volledige rapport op{" "}
                <strong className="text-white/85">{email}</strong> zodra het klaar is. Je kunt
                dit venster sluiten.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
