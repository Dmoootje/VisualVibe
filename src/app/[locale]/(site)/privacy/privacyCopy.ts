export const ANALYSIS_RETENTION_COPY =
  "Voor de quota gebruiken we pseudonieme HMAC-identifiers voor e-mail, toestel en IP-adres. Voor e-mail en toestel tellen alleen gebeurtenissen uit de afgelopen 24 uur. Voor IP-adressen zijn de actieve telvensters 24 uur en 30 dagen. Technische quotagegevens kunnen voor beveiliging en beheer maximaal 91 dagen bewaard blijven; die langere bewaartermijn verlengt de actieve telvensters niet. Verificatiecodes vervallen na 15 minuten.";

export const ANALYSIS_RETENTION_COPY_EN =
  "To enforce the usage limits, we use pseudonymous HMAC identifiers for email addresses, devices and IP addresses. Only events from the preceding 24 hours count for email addresses and devices. The active counting windows for IP addresses are 24 hours and 30 days. Technical quota data may be retained for up to 91 days for security and administration. This longer retention period does not extend the active counting windows. Verification codes expire after 15 minutes.";

export function getPrivacyCopy(locale: string, companyName: string) {
  if (locale === "en") {
    return {
      label: "Legal",
      title: "Privacy policy",
      metaTitle: `Privacy policy | ${companyName}`,
      metaDescription: `Learn how ${companyName} processes personal data, why we use it, how long we retain it and which rights you have under the GDPR.`,
      updated: "15 July 2026",
      introduction: `${companyName} respects your privacy and processes personal data in accordance with the General Data Protection Regulation (GDPR). This policy explains what data we collect, why we collect it, how long we retain it and which rights you have.`,
      analysisRetention: ANALYSIS_RETENTION_COPY_EN,
    };
  }
  return {
    label: "Juridisch",
    title: "Privacybeleid",
    metaTitle: `Privacybeleid | ${companyName}`,
    metaDescription: `Lees hoe ${companyName} omgaat met persoonsgegevens: welke gegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten je hebt volgens de AVG.`,
    updated: "15 juli 2026",
    introduction: `${companyName} respecteert je privacy en verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR). In dit privacybeleid lees je welke gegevens we verzamelen, waarom we dat doen, hoe lang we ze bewaren en welke rechten je hebt.`,
    analysisRetention: ANALYSIS_RETENTION_COPY,
  };
}
