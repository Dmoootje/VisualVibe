import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ManageCookiesButton } from "@/components/consent";
import { getCookieCopy } from "./cookieCopy";
import type { SupportedLocale } from "@/i18n/locales";

// ISR: contactgegevens komen uit de admin-instellingen.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings(locale as SupportedLocale);
  const copy = getCookieCopy(locale, settings.companyName);
  return pageMetadata({
    locale: locale as SupportedLocale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/cookies/",
    languagePaths: { nl: "/cookies/", en: "/cookies/" },
  });
}

const LAST_UPDATED = "13 juli 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-10 text-xl font-bold text-white sm:text-2xl">{children}</h2>;
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings(locale as SupportedLocale);
  if (locale === "en") return <EnglishCookies settings={settings} />;

  return (
    <div className="min-h-screen pb-20 pt-28 text-white">
      <BreadcrumbJsonLd
        locale="nl"
        items={[{ name: "Home", path: "/" }, { name: "Cookiebeleid", path: "/cookies" }]}
      />

      <div className="container mx-auto">
        <article className="mx-auto max-w-[760px]">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Juridisch
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Cookiebeleid</h1>
          <p className="mt-4 text-white/50">Laatst bijgewerkt: {LAST_UPDATED}</p>

          <div className="mt-8 space-y-4 text-[15.5px] leading-relaxed text-white/70">
            <p>
              Deze pagina legt uit welke cookies en vergelijkbare technieken {settings.companyName}{" "}
              gebruikt op deze website, en hoe je daar zelf controle over houdt.
            </p>

            <H2>1. Wat zijn cookies?</H2>
            <p>
              Cookies zijn kleine tekstbestanden die een website op je apparaat plaatst. Ze kunnen nodig
              zijn om een website goed te laten werken (functionele cookies) of gebruikt worden om
              bezoekers te volgen (tracking- of marketingcookies).
            </p>

            <H2>2. Welke cookies gebruikt deze website?</H2>
            <p>
              Wij houden het bewust minimaal. We tonen geen advertenties en verkopen geen gegevens.
              Er zijn twee soorten cookies:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Strikt noodzakelijke, functionele cookies:</strong>{" "}
                beveiligings- en sessiecookies die uitsluitend worden gebruikt wanneer een beheerder
                van {settings.companyName} inlogt op de afgeschermde beheeromgeving. Gewone bezoekers
                krijgen deze cookie niet. Deze cookies zijn nodig om de site veilig te laten werken en
                vragen geen toestemming.
              </li>
              <li>
                <strong className="text-white">Analytische cookies (Google Analytics 4):</strong> we
                gebruiken Google Analytics om anoniem te meten hoe bezoekers onze site gebruiken
                (bekeken pagina&apos;s, apparaattype, bij benadering de regio) zodat we de site kunnen
                verbeteren. Analytics plaatst hiervoor cookies zoals <code>_ga</code> en{" "}
                <code>_ga_&lt;id&gt;</code>. Deze cookies worden{" "}
                <strong className="text-white">pas geplaatst nadat je ze aanvaardt</strong> in onze
                cookiebanner. We gebruiken de analysegegevens niet voor advertenties of profilering.
              </li>
            </ul>

            <H2>3. Toestemming en je voorkeuren beheren</H2>
            <p>
              Bij je eerste bezoek tonen we een cookiebanner. Zolang je niets kiest of op{" "}
              <em>Weigeren</em> klikt, staan alle analytische cookies uit dankzij Google Consent Mode:
              er worden dan geen analysecookies op je apparaat geplaatst. Kies je{" "}
              <em>Accepteren</em>, dan schakelen we Google Analytics in. Je keuze onthouden we, zodat
              de banner niet bij elk bezoek terugkomt.
            </p>
            <p>
              Je kunt je keuze op elk moment wijzigen of intrekken:
            </p>
            <div className="pt-1">
              <ManageCookiesButton />
            </div>

            <H2>4. Ingesloten inhoud van derden</H2>
            <p>
              Op sommige pagina&apos;s tonen we inhoud die rechtstreeks van een externe dienst wordt
              geladen. Zodra die inhoud op je scherm verschijnt of je ermee interageert, kan die partij
              zelf cookies plaatsen of gegevens verwerken volgens haar eigen beleid:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">YouTube (Google):</strong> video&apos;s op onder meer de
                videografie-pagina&apos;s.
              </li>
              <li>
                <strong className="text-white">Google Maps:</strong> de kaart op de contactpagina.
              </li>
              <li>
                <strong className="text-white">Matterport:</strong> de 3D-tours en virtuele
                rondleidingen.
              </li>
            </ul>
            <p>
              Raadpleeg het privacy- en cookiebeleid van deze diensten voor de details van hun
              verwerking. Wil je dit vermijden, bezoek die pagina&apos;s dan niet of blokkeer cookies
              van derden in je browser.
            </p>

            <H2>5. Cookies beheren of verwijderen</H2>
            <p>
              Naast de cookiebanner kun je ook via de instellingen van je browser cookies bekijken,
              blokkeren en verwijderen, ook per website. Hoe dat werkt lees je in de
              hulp-pagina&apos;s van je browser (Chrome, Safari, Firefox of Edge). Het blokkeren van
              onze functionele cookies heeft voor gewone bezoekers geen merkbaar effect op de website.
            </p>

            <H2>6. Vragen of wijzigingen</H2>
            <p>
              Vragen over dit cookiebeleid? Mail ons via{" "}
              <a className="text-[#ff9a45] hover:underline" href={`mailto:${settings.mainEmail}`}>
                {settings.mainEmail}
              </a>
              . Wijzigt onze werkwijze, dan passen we deze pagina aan en vragen we waar nodig eerst je
              toestemming. Lees ook ons{" "}
              <Link href="/privacy" className="text-[#ff9a45] hover:underline">
                privacybeleid
              </Link>{" "}
              voor de volledige uitleg over hoe we met persoonsgegevens omgaan.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

function EnglishCookies({ settings }: { settings: Awaited<ReturnType<typeof getSiteSettings>> }) {
  const copy = getCookieCopy("en", settings.companyName);
  return (
    <div className="min-h-screen pb-20 pt-28 text-white">
      <BreadcrumbJsonLd
        locale="en"
        items={[{ name: "Home", path: "/" }, { name: copy.title, path: "/cookies" }]}
      />
      <div className="container mx-auto">
        <article className="mx-auto max-w-[760px]">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            {copy.label}
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">{copy.title}</h1>
          <p className="mt-4 text-white/50">Last updated: {copy.updated}</p>
          <div className="mt-8 space-y-4 text-[15.5px] leading-relaxed text-white/70">
            <p>{copy.introduction}</p>
            <H2>1. What are cookies?</H2>
            <p>Cookies are small text files that a website stores on your device. Some are necessary for a website to work properly, while others may be used to track visitors for analytics or marketing.</p>
            <H2>2. Which cookies does this website use?</H2>
            <p>We deliberately keep cookie use to a minimum. We do not display advertising or sell data. We use two types of cookies:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-white">Strictly necessary functional cookies:</strong> security and session cookies used only when a {settings.companyName} administrator signs in to the protected administration area. Regular visitors do not receive these cookies. These cookies are necessary for security and do not require consent.</li>
              <li><strong className="text-white">Analytics cookies (Google Analytics 4):</strong> with your consent, we use Google Analytics to measure anonymously how visitors use the site, including viewed pages, device type and approximate region. Cookies include <code>_ga</code> and <code>_ga_&lt;id&gt;</code>. They are only stored after you accept them in the cookie banner. We do not use analytics data for advertising or profiling.</li>
            </ul>
            <H2>3. Consent and preference management</H2>
            <p>On your first visit, we display a cookie banner. {copy.consent} You can change or withdraw your choice at any time:</p>
            <div className="pt-1"><ManageCookiesButton /></div>
            <H2>4. Embedded third-party content</H2>
            <p>Some pages load content directly from external services. Once it appears or you interact with it, the provider may store cookies or process data under its own policy:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-white">YouTube (Google):</strong> videos, including those on our video production pages.</li>
              <li><strong className="text-white">Google Maps:</strong> the map on our contact page.</li>
              <li><strong className="text-white">Matterport:</strong> 3D tours and virtual walkthroughs.</li>
            </ul>
            <p>Consult each provider's privacy and cookie policies for details. To avoid this processing, do not visit those pages or block third-party cookies in your browser.</p>
            <H2>5. Managing or deleting cookies</H2>
            <p>You can use the cookie banner or your browser settings to view, block and delete cookies, including on a site-by-site basis. See the help pages for Chrome, Safari, Firefox or Edge. Blocking our functional cookies has no noticeable effect for regular visitors.</p>
            <H2>6. Questions and changes</H2>
            <p>For questions, email <a className="text-[#ff9a45] hover:underline" href={`mailto:${settings.mainEmail}`}>{settings.mainEmail}</a>. If our practices change, we will update this page and request consent first where required. Our <Link href="/privacy" className="text-[#ff9a45] hover:underline">privacy policy</Link> explains how we process personal data.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
