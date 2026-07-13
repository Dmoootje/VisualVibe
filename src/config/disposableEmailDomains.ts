// Curated lijst van bekende wegwerp-e-maildomeinen voor de websiteanalyse-poort.
// Bewust klein en onderhoudbaar gehouden: dit is een eerste filter, geen
// sluitende lijst. Voeg nieuwe domeinen alfabetisch toe zodra ze in de
// praktijk opduiken (admin ziet geweigerde aanvragen terug in de leadflow).
export const DISPOSABLE_EMAIL_DOMAINS: readonly string[] = [
  "10minutemail.com",
  "10minutemail.net",
  "20minutemail.com",
  "33mail.com",
  "anonaddy.me",
  "burnermail.io",
  "byom.de",
  "crazymailing.com",
  "dispostable.com",
  "dropmail.me",
  "emailfake.com",
  "emailondeck.com",
  "emailtemporario.com.br",
  "fakeinbox.com",
  "fakemail.net",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "harakirimail.com",
  "inboxkitten.com",
  "incognitomail.org",
  "jetable.org",
  "linshiyouxiang.net",
  "mail-temp.com",
  "mail7.io",
  "mailcatch.com",
  "maildrop.cc",
  "mailexpire.com",
  "mailinator.com",
  "mailinator.net",
  "mailnesia.com",
  "mailpoof.com",
  "mailsac.com",
  "mailtemp.info",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "nada.email",
  "no-spam.ws",
  "nowmymail.com",
  "sharklasers.com",
  "spam4.me",
  "spamgourmet.com",
  "temp-mail.io",
  "temp-mail.org",
  "tempail.com",
  "tempinbox.com",
  "tempmail.dev",
  "tempmail.plus",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "trash-mail.com",
  "trashmail.com",
  "trashmail.de",
  "tutye.com",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
] as const;

const DISPOSABLE_SET = new Set(DISPOSABLE_EMAIL_DOMAINS);

/**
 * Controleert of een e-maildomein (lowercase of niet) op de wegwerplijst
 * staat, inclusief subdomeinen (bv. "mx.mailinator.com" matcht "mailinator.com").
 */
export function isDisposableEmailDomain(domain: string): boolean {
  const normalized = domain.trim().toLowerCase().replace(/\.$/, "");
  if (!normalized) return false;
  if (DISPOSABLE_SET.has(normalized)) return true;
  return DISPOSABLE_EMAIL_DOMAINS.some((blocked) => normalized.endsWith(`.${blocked}`));
}
