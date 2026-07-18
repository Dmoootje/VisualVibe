export function getCookieCopy(locale: string, companyName: string) {
  if (locale === "en") {
    return {
      label: "Legal",
      title: "Cookie policy",
      metaTitle: `Cookie policy | ${companyName}`,
      metaDescription: `See which essential and analytics cookies ${companyName} uses, how Google Analytics depends on your consent and how to change your preferences.`,
      updated: "13 July 2026",
      introduction: `This page explains which cookies and similar technologies ${companyName} uses on this website and how you can control them.`,
      consent: "Until you make a choice, or if you select Reject, analytics cookies remain disabled through Google Consent Mode and no analytics cookies are stored on your device. If you select Accept, we enable Google Analytics. We remember your preference so that the banner does not reappear on every visit.",
    };
  }
  return {
    label: "Juridisch",
    title: "Cookiebeleid",
    metaTitle: `Cookiebeleid | ${companyName}`,
    metaDescription: `Welke cookies gebruikt ${companyName}? Functionele cookies en analytische cookies (Google Analytics), pas actief na jouw toestemming. Beheer hier je voorkeuren.`,
    updated: "13 juli 2026",
    introduction: `Deze pagina legt uit welke cookies en vergelijkbare technieken ${companyName} gebruikt op deze website, en hoe je daar zelf controle over houdt.`,
    consent: "Zolang je niets kiest of op Weigeren klikt, worden geen analysecookies op je apparaat geplaatst. Kies je Accepteren, dan schakelen we Google Analytics in.",
  };
}
