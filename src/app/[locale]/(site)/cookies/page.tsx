import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/firestore/siteSettings";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";

// ISR: contactgegevens komen uit de admin-instellingen.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return pageMetadata({
    title: `Cookiebeleid | ${settings.companyName}`,
    description: `Ontdek welke cookies ${settings.companyName} gebruikt: alleen functionele cookies, geen tracking. Lees ook hoe ingesloten inhoud van derden werkt en hoe je cookies beheert.`,
    path: "/cookies/",
  });
}

const LAST_UPDATED = "12 juli 2026";

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
              Wij houden het bewust minimaal. Deze website gebruikt{" "}
              <strong className="text-white">geen tracking-, analyse- of marketingcookies</strong> en
              toont geen advertenties. We plaatsen zelf alleen strikt noodzakelijke, functionele
              cookies:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Beveiligings- en sessiecookies voor het beheer:</strong>{" "}
                uitsluitend gebruikt wanneer een beheerder van {settings.companyName} inlogt op de
                afgeschermde beheeromgeving. Gewone bezoekers krijgen deze cookie niet.
              </li>
            </ul>
            <p>
              Omdat we geen niet-noodzakelijke cookies plaatsen bij een gewoon bezoek, tonen we ook geen
              cookiebanner: er valt niets te weigeren.
            </p>

            <H2>3. Ingesloten inhoud van derden</H2>
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

            <H2>4. Cookies beheren of verwijderen</H2>
            <p>
              Via de instellingen van je browser kun je cookies bekijken, blokkeren en verwijderen, ook
              per website. Hoe dat werkt lees je in de hulp-pagina&apos;s van je browser (Chrome,
              Safari, Firefox of Edge). Het blokkeren van onze functionele cookies heeft voor gewone
              bezoekers geen merkbaar effect op de website.
            </p>

            <H2>5. Vragen of wijzigingen</H2>
            <p>
              Vragen over dit cookiebeleid? Mail ons via{" "}
              <a className="text-[#ff9a45] hover:underline" href={`mailto:${settings.mainEmail}`}>
                {settings.mainEmail}
              </a>
              . Wijzigt onze werkwijze (bijvoorbeeld als we ooit statistieken zouden toevoegen), dan
              passen we deze pagina aan en vragen we waar nodig eerst je toestemming. Lees ook ons{" "}
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
