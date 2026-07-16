import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { ANALYSIS_RETENTION_COPY } from "./privacyCopy";

// ISR: adres- en contactgegevens komen uit de admin-instellingen.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata({
    title: `Privacybeleid | ${settings.companyName}`,
    description: `Lees hoe ${settings.companyName} omgaat met persoonsgegevens: welke gegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten je hebt volgens de AVG.`,
    path: "/privacy/",
  });
}

const LAST_UPDATED = "15 juli 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-10 text-xl font-bold text-white sm:text-2xl">{children}</h2>;
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const streetLine = [settings.street, settings.houseNumber].filter(Boolean).join(" ");
  const cityLine = [settings.postalCode, settings.city].filter(Boolean).join(" ");
  const address = [streetLine, cityLine, settings.country].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen pb-20 pt-28 text-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Privacybeleid", path: "/privacy" }]}
      />

      <div className="container mx-auto">
        <article className="mx-auto max-w-[760px]">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Juridisch
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">Privacybeleid</h1>
          <p className="mt-4 text-white/50">Laatst bijgewerkt: {LAST_UPDATED}</p>

          <div className="mt-8 space-y-4 text-[15.5px] leading-relaxed text-white/70">
            <p>
              {settings.companyName} respecteert je privacy en verwerkt persoonsgegevens in
              overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR). In dit
              privacybeleid lees je welke gegevens we verzamelen, waarom we dat doen, hoe lang we ze
              bewaren en welke rechten je hebt.
            </p>

            <H2>1. Wie is verantwoordelijk voor je gegevens?</H2>
            <p>
              De verwerkingsverantwoordelijke is {settings.companyName}
              {address ? `, gevestigd te ${address}` : ""}. Voor vragen over dit beleid of over je
              gegevens kun je ons bereiken via{" "}
              <a className="text-[#ff9a45] hover:underline" href={`mailto:${settings.mainEmail}`}>
                {settings.mainEmail}
              </a>
              {settings.phone ? ` of telefonisch op ${settings.phone}` : ""}.
            </p>

            <H2>2. Welke gegevens verwerken we en waarom?</H2>
            <p>We verwerken alleen gegevens die je zelf aan ons bezorgt of die technisch nodig zijn om de website te laten werken:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Contact- en offerteformulier:</strong> naam, e-mailadres,
                telefoonnummer en de projectinformatie die je invult, samen met de pagina waarvandaan je
                het formulier verstuurde. We gebruiken deze gegevens uitsluitend om je aanvraag te
                beantwoorden en op te volgen (rechtsgrond: precontractuele maatregelen op jouw verzoek).
              </li>
              <li>
                <strong className="text-white">Nieuwsbrief:</strong> je e-mailadres en de pagina waar je
                je inschreef. We gebruiken dit om je onze nieuwsbrief te sturen (rechtsgrond:
                toestemming). Uitschrijven kan op elk moment via de link in elke e-mail of door ons te
                mailen.
              </li>
              <li>
                <strong className="text-white">Gratis websiteanalyse:</strong> je voornaam,
                e-mailadres (dat we via een verificatiecode bevestigen), optioneel je bedrijfsnaam en
                de website-URL die je laat analyseren. We gebruiken deze gegevens om je het
                analyserapport te bezorgen en je aanvraag op te volgen (rechtsgrond: precontractuele
                maatregelen op jouw verzoek). Om misbruik van deze gratis dienst te voorkomen bewaren
                we daarnaast een gehasht toestel-ID via een first-party cookie, een gehasht IP-adres
                en een analyselogboek; ruwe IP-adressen of toestel-ID&apos;s slaan we nooit op
                (rechtsgrond: gerechtvaardigd belang).
              </li>
              <li>
                <strong className="text-white">Technische loggegevens:</strong> zoals IP-adres en
                browserinformatie in serverlogs, nodig voor de beveiliging en goede werking van de
                website (rechtsgrond: gerechtvaardigd belang).
              </li>
              <li>
                <strong className="text-white">Websitestatistieken (Google Analytics 4):</strong>{" "}
                enkel wanneer je onze analytische cookies aanvaardt, verwerkt Google Analytics
                pseudonieme gebruiksgegevens (bekeken pagina&apos;s, klik- en navigatiegedrag,
                apparaat- en browsertype en je regio bij benadering op basis van een ingekort
                IP-adres). We gebruiken dit uitsluitend om te begrijpen hoe de site gebruikt wordt en
                die te verbeteren, niet voor advertenties of profilering (rechtsgrond: toestemming).
                Zolang je geen toestemming geeft, worden deze cookies niet geplaatst en vindt deze
                verwerking niet plaats. Je kunt je toestemming op elk moment intrekken via ons{" "}
                <Link href="/cookies" className="text-[#ff9a45] hover:underline">
                  cookiebeleid
                </Link>
                .
              </li>
            </ul>
            <p>
              We verzamelen geen gegevens voor advertentiedoeleinden en verkopen je gegevens nooit aan
              derden.
            </p>

            <H2>3. Hoe lang bewaren we je gegevens?</H2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Aanvragen via het contact- of offerteformulier bewaren we zolang dat nodig is om je
                aanvraag en de eventuele samenwerking op te volgen, en daarna maximaal 3 jaar.
              </li>
              <li>
                Je inschrijving op de nieuwsbrief bewaren we tot je je uitschrijft.
              </li>
              <li>
                Analyseleads en analyserapporten bewaren we zolang ze relevant zijn voor de
                opvolging van je aanvraag. {ANALYSIS_RETENTION_COPY}
              </li>
              <li>Technische logs worden na een beperkte periode automatisch verwijderd.</li>
            </ul>

            <H2>4. Met wie delen we gegevens?</H2>
            <p>
              We delen je gegevens alleen met dienstverleners die ze in onze opdracht verwerken en die
              contractueel aan de AVG gebonden zijn:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Google Cloud / Firebase:</strong> veilige opslag van
                formulierinzendingen, nieuwsbriefinschrijvingen en mediabestanden.
              </li>
              <li>
                <strong className="text-white">Onze hostingpartner:</strong> het technisch draaien van
                deze website.
              </li>
              <li>
                <strong className="text-white">Google Analytics (Google Ireland Ltd.):</strong>{" "}
                pseudonieme websitestatistieken, uitsluitend nadat je onze analytische cookies hebt
                aanvaard. Google verwerkt deze gegevens als verwerker in onze opdracht; er kan daarbij
                doorgifte buiten de EER plaatsvinden onder de gepaste waarborgen (o.a. het EU-US Data
                Privacy Framework en standaardcontractbepalingen).
              </li>
            </ul>
            <p>
              Sommige pagina&apos;s bevatten ingesloten inhoud van derden (YouTube-video&apos;s, Google
              Maps, Matterport 3D-tours). Zodra je zulke inhoud bekijkt of ermee interageert, kan die
              partij gegevens verwerken volgens haar eigen privacybeleid. Meer daarover lees je in ons{" "}
              <Link href="/cookies" className="text-[#ff9a45] hover:underline">
                cookiebeleid
              </Link>
              .
            </p>

            <H2>5. Beveiliging</H2>
            <p>
              We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen:
              versleutelde verbindingen (HTTPS), toegangsbeheer op onze systemen en opslag bij
              gecertificeerde cloudproviders.
            </p>

            <H2>6. Jouw rechten</H2>
            <p>Je hebt op elk moment het recht om:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>inzage te vragen in de gegevens die we van je hebben;</li>
              <li>onjuiste gegevens te laten verbeteren;</li>
              <li>je gegevens te laten wissen;</li>
              <li>de verwerking te beperken of er bezwaar tegen te maken;</li>
              <li>je gegevens in een overdraagbaar formaat te ontvangen;</li>
              <li>een eerder gegeven toestemming in te trekken.</li>
            </ul>
            <p>
              Stuur daarvoor een e-mail naar{" "}
              <a className="text-[#ff9a45] hover:underline" href={`mailto:${settings.mainEmail}`}>
                {settings.mainEmail}
              </a>
              . We reageren binnen 30 dagen. Ben je niet tevreden met onze afhandeling, dan kun je een
              klacht indienen bij de{" "}
              <a
                className="text-[#ff9a45] hover:underline"
                href="https://www.gegevensbeschermingsautoriteit.be/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Belgische Gegevensbeschermingsautoriteit
              </a>
              .
            </p>

            <H2>7. Wijzigingen</H2>
            <p>
              We kunnen dit privacybeleid aanpassen wanneer onze diensten of de wetgeving veranderen. De
              meest recente versie staat altijd op deze pagina, met bovenaan de datum van de laatste
              wijziging.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
