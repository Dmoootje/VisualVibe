// IndexNow laat zoekmachines (Bing, Yandex, Seznam, Naver, Yep) meteen weten
// welke URL's zijn toegevoegd of gewijzigd. De sleutel is publiek van opzet: hij
// wordt als tekstbestand op het domein gehost (/{sleutel}.txt), dus hij hoeft
// niet versleuteld te worden zoals de AI- of analyse-API-sleutels.

/** Resultaat van de laatste aanmelding, getoond in het beheerpaneel. */
export type IndexNowSubmissionRecord = {
  /** ISO-tijdstip van de aanmelding. */
  submittedAt: string;
  /** Aantal unieke URL's dat is aangemeld. */
  urlCount: number;
  /** True zodra IndexNow 200/202 gaf voor alle batches. */
  ok: boolean;
  /** Laatste HTTP-status van de IndexNow-endpoint (0 bij netwerkfout). */
  statusCode: number;
  /** Nederlandse samenvatting voor het beheerpaneel. */
  message: string;
};

/** Gemaskeerde/afgeleide staat voor het IndexNow-beheerpaneel. */
export type IndexNowSettingsAdminView = {
  keyConfigured: boolean;
  /** De publieke sleutel (veilig om te tonen; staat toch op het domein). */
  key: string;
  /** Volledige URL van het sleutelbestand, of "" als er nog geen sleutel is. */
  keyFileUrl: string;
  /** Host waarvoor wordt aangemeld, bv. visualvibe.media. */
  host: string;
  /** De gedeelde IndexNow-endpoint. */
  endpoint: string;
  lastSubmission: IndexNowSubmissionRecord | null;
};

export type IndexNowSubmitResult = {
  ok: boolean;
  statusCode: number;
  urlCount: number;
  message: string;
};
