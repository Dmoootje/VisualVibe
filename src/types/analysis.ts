// Contract voor de gratis websiteanalyse met leadcapture, e-mailverificatie
// en server-side quotabewaking. Dit bestand is de bron van waarheid voor alle
// analyse-modules (lib/analyse/*, API-routes, UI-flow, admin).

export const ANALYSIS_LEAD_STATUSES = [
  "pending_verification",
  "verified",
  "quota_checked",
  "queued",
  "analysing",
  "completed",
  "failed",
  "limit_reached",
  "expired",
] as const;

export type AnalysisLeadStatus = (typeof ANALYSIS_LEAD_STATUSES)[number];

export type AnalysisQuotaDecision =
  | "allowed"
  | "allowed_extra_credit"
  | "reused_recent"
  | "limit_email"
  | "limit_device"
  | "limit_domain_recent"
  | "limit_ip_daily"
  | "limit_ip_monthly"
  | "duplicate_request";

/** Firestore: analysis_leads. Ruwe IP's en device-ID's worden NOOIT opgeslagen, alleen HMAC-hashes. */
export type AnalysisLead = {
  id: string;
  /** Gekoppelde lead in het bestaande leadplatform (formType "website_analysis"). */
  leadId?: string;
  leadNumber?: string;
  status: AnalysisLeadStatus;
  firstName: string;
  companyName?: string;
  email: string;
  emailNormalized: string;
  emailVerifiedAt?: string;
  newsletterConsent: boolean;
  newsletterConsentAt?: string;
  /** Letterlijke consenttekst-versie op moment van aanvinken. */
  newsletterConsentTextVersion?: string;
  submittedUrl: string;
  normalizedDomain: string;
  deviceHash?: string;
  ipHash?: string;
  sourcePage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Reservering/run-id in analysis_reservations. */
  analysisId?: string;
  analysisStatus?: "queued" | "running" | "completed" | "failed" | "reused";
  analysisScore?: number;
  criticalIssues?: string[];
  analysisSummary?: string;
  /** Niet-voorspelbaar toegangstoken voor het rapport (base64url, 32 bytes). */
  reportToken?: string;
  /** Bij hergebruik: de analysis_lead waarvan het rapport komt. */
  reusedFromId?: string;
  /** Bezoeker vroeg expliciet een nieuwe analyse aan binnen de cooldown; admin kan forceren. */
  forceRequested?: boolean;
  quotaDecision?: AnalysisQuotaDecision;
  quotaReason?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  expiredAt?: string;
};

/** Firestore: analysis_settings/default. Beheerbaar in /admin/settings/analyse. */
export type AnalysisQuotaConfig = {
  enabled: boolean;
  /** Succesvol afgeronde analyses per geverifieerd e-mailadres per 90 dagen. */
  maxPerEmail90d: number;
  /** Succesvol afgeronde analyses per device per 90 dagen. */
  maxPerDevice90d: number;
  /** Dagen waarin hetzelfde domein niet opnieuw wordt geanalyseerd. */
  domainCooldownDays: number;
  /** Analyseaanvragen per IP per 24 uur. */
  maxPerIp24h: number;
  /** Analyses per IP per 30 dagen. */
  maxPerIp30d: number;
  /** Verificatiecodes per e-mailadres per uur. */
  maxCodesPerEmailPerHour: number;
  /** Minuten waarbinnen dezelfde e-mail+device+domein-combinatie niet opnieuw mag. */
  duplicateWindowMinutes: number;
  /** Geldigheid van een verificatiecode in minuten. */
  codeTtlMinutes: number;
  /** Maximaal aantal invoerpogingen per code. */
  maxCodeAttempts: number;
};

export const DEFAULT_ANALYSIS_QUOTA_CONFIG: AnalysisQuotaConfig = {
  enabled: true,
  maxPerEmail90d: 3,
  maxPerDevice90d: 3,
  domainCooldownDays: 7,
  maxPerIp24h: 10,
  maxPerIp30d: 25,
  maxCodesPerEmailPerHour: 5,
  duplicateWindowMinutes: 10,
  codeTtlMinutes: 15,
  maxCodeAttempts: 5,
};

/** Resultaat van de externe analyse-engine (Replit partner-API). */
export type AnalysisRunResult =
  | { status: "completed"; score: number; criticalIssues: string[]; summary?: string; raw?: unknown }
  | { status: "failed"; errorCode: string }
  | { status: "unavailable"; errorCode: string };

// ---------------------------------------------------------------------------
// API-contracten (client <-> /api/analyse/*)
// ---------------------------------------------------------------------------

export type AnalysisStartRequest = {
  firstName: string;
  email: string;
  companyName?: string;
  url: string;
  privacyAccepted: boolean;
  newsletterOptIn?: boolean;
  sourcePage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Honeypot; ingevuld = stil succes zonder lead. */
  website?: string;
};

export type AnalysisStartResponse =
  | { status: "code_sent"; analysisLeadId: string }
  | { status: "error"; error: string };

export type AnalysisVerifyRequest = {
  analysisLeadId: string;
  code: string;
};

export type AnalysisVerifyResponse =
  | { status: "completed"; reportUrl: string; score: number; criticalIssues: string[] }
  | { status: "reused"; reportUrl: string; score: number; criticalIssues: string[] }
  | { status: "limit_reached"; message: string }
  | { status: "failed"; message: string }
  | { status: "invalid_code"; attemptsLeft: number }
  | { status: "code_expired" }
  | { status: "error"; error: string };

export type AnalysisResendRequest = { analysisLeadId: string };
export type AnalysisResendResponse = { status: "code_sent" } | { status: "error"; error: string };

export type AnalysisRequestNewRequest = { analysisLeadId: string };
export type AnalysisRequestNewResponse = { status: "requested" } | { status: "error"; error: string };
