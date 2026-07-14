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
// SEO Supercharged integratie (widget-embed of directe partner-API)
// Beheerbaar in /admin/settings/analyse. Sleutels worden versleuteld opgeslagen
// (AES-256-GCM, zelfde patroon als de AI-providersleutels).
// ---------------------------------------------------------------------------

/**
 * "api"    = eigen flow (e-mailcode + quota) die de partner-API server-side
 *            aanroept met de private key.
 * "widget" = de externe widget van SEO Supercharged (client-side script) met de
 *            public key.
 */
export const ANALYSIS_MODES = ["api", "widget"] as const;
export type AnalysisMode = (typeof ANALYSIS_MODES)[number];

export const DEFAULT_ANALYSIS_MODE: AnalysisMode = "api";

/**
 * Huidige (tijdelijke) Replit-endpoints. Overschrijfbaar in de admin zodra de
 * partner-omgeving een definitieve URL krijgt; de public key hieronder is de
 * bestaande live testsleutel en blijft de fallback tot er een key is ingesteld.
 */
export const DEFAULT_ANALYSIS_WIDGET_SCRIPT_URL =
  "https://ea419e43-59c9-4427-a03b-b1c41c8dde97-00-36ujlt5w28br5.worf.replit.dev/widgets/website-analyse.v1.js";
export const DEFAULT_ANALYSIS_API_BASE_URL =
  "https://ea419e43-59c9-4427-a03b-b1c41c8dde97-00-36ujlt5w28br5.worf.replit.dev/api/partner/v1";
export const DEFAULT_ANALYSIS_PUBLIC_KEY =
  "pk_live_45d448a7ef76b67d1e8d82d4_8fxi7Cmi5Lf2lxwO_a_sBQ0Rs3SeaYLB";

export function isAnalysisMode(value: unknown): value is AnalysisMode {
  return typeof value === "string" && ANALYSIS_MODES.includes(value as AnalysisMode);
}

/** Veilige adminweergave: bevat nooit plaintext of ciphertext van de sleutels. */
export type AnalysisIntegrationAdminView = {
  mode: AnalysisMode;
  encryptionConfigured: boolean;
  publicKeyConfigured: boolean;
  publicKeyHint: string;
  privateKeyConfigured: boolean;
  privateKeyHint: string;
  widgetScriptUrl: string;
  apiBaseUrl: string;
};

export type AnalysisIntegrationUpdate = {
  mode: AnalysisMode;
  /** Leeg of weggelaten = de huidige sleutel behouden. */
  publicKey?: string;
  removePublicKey?: boolean;
  privateKey?: string;
  removePrivateKey?: boolean;
  widgetScriptUrl?: string;
  apiBaseUrl?: string;
};

/**
 * Volledige server-side runtime met ontsleutelde sleutels. Verlaat de server
 * nooit ongefilterd; de publieke pagina krijgt enkel AnalysisIntegrationPublic.
 */
export type AnalysisIntegrationRuntime = {
  mode: AnalysisMode;
  publicKey: string;
  privateKey: string;
  widgetScriptUrl: string;
  apiBaseUrl: string;
};

/** Client-veilige subset voor de publieke /website-analyse pagina (geen private key). */
export type AnalysisIntegrationPublic = {
  mode: AnalysisMode;
  publicKey: string;
  widgetScriptUrl: string;
};

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
