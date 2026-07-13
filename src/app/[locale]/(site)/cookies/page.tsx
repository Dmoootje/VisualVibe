import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ManageCookiesButton } from "@/components/consent";

// ISR: contactgegevens komen uit de admin-instellingen.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata({
    title: `Cookiebeleid | ${settings.companyName}`,
    description: `Welke cookies gebruikt ${settings.companyName}? Functionele cookies plus analytische cookies (Google Analytics) die pas na jouw toestemming worden geplaatst. Lees hoe je je voorkeuren beheert.`,
    path: "/cookies/",
  });
}

const LAST_UPDATED = "13 juli 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-10 text-xl font-bold text-white sm:text-2xl">{children}</h2>;
}

export default async function CookiesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen pb-20 pt-28 text-white">
      <BreadcrumbJsonLd
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
