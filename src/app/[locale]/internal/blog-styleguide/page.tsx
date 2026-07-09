import type { Metadata } from "next";
import {
  Camera,
  Gauge,
  MapPin,
  PenTool,
  Rocket,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import {
  BlogCTA,
  BlogHero,
  BlogImage,
  BlogProse,
  ChecklistBlock,
  ComparisonTable,
  ContentSection,
  DoDontGrid,
  FaqAccordion,
  FeatureCard,
  FeatureGrid,
  LeadIntro,
  NoticeBox,
  QuoteBlock,
  RelatedArticles,
  RelatedRegions,
  RelatedServices,
  RoadmapBlock,
  StatGrid,
  StickyBlogSidebar,
  type TocItem,
} from "@/components/blog";

export const metadata: Metadata = {
  title: { absolute: "Blog styleguide (intern) | VisualVibe" },
  robots: { index: false, follow: false },
};

const HERO_MAP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Fwebsite-laten-maken-limburg-hero.webp?alt=media&token=2434bbf7-60c1-48c6-bca4-7b55e29a8f31";
const HERO_LAPTOP =
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fblog%2Flokale-seo-limburg-kmo-hero.webp?alt=media&token=6787c961-f80d-4fb6-8464-dea9c43037fc";

const TOC: TocItem[] = [
  { id: "intro", label: "Inleiding", level: 2 },
  { id: "wat-is-geo", label: "Wat is GEO?", level: 2 },
  { id: "voordelen", label: "Voordelen", level: 3 },
  { id: "aanpak", label: "Onze aanpak", level: 2 },
  { id: "vergelijking", label: "Vergelijking", level: 2 },
  { id: "faq", label: "Veelgestelde vragen", level: 2 },
];

/** Small label wrapper so every block is annotated in the reference grid. */
function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
          {label}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      {children}
    </section>
  );
}

export default function BlogStyleguidePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-amber-500/[0.06] to-transparent px-4 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Intern · niet indexeren
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Blog styleguide
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Herbruikbare bouwblokken voor lange SEO/AEO/GEO-artikels - in de
            VisualVibe dark neon orange stijl. Alle blokken zijn MDX-klaar.
          </p>
        </div>
      </div>

      {/* ===================================================================
          Live article demo - sidebar + real sections (scrollspy works here)
          =================================================================== */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
            Live artikel-layout · BlogHero + StickyBlogSidebar + ContentSection
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_16rem]">
          <article>
            <BlogHero
              category="SEO & GEO"
              title="GEO en AEO voor KMO's:"
              titleAccent="gevonden worden in AI-zoekresultaten"
              excerpt="Een voorbeeldartikel dat elk blok in context toont - van lead-intro tot FAQ met schema."
              author="VisualVibe"
              publishedAt="2026-07-08"
              readingTime="12 min"
              image={HERO_LAPTOP}
              imageAlt="AI-zoekresultaten voorbeeld"
            />

            <div className="mt-10 space-y-12">
              <ContentSection id="intro">
                <LeadIntro>
                  <strong>GEO (Generative Engine Optimization)</strong> zorgt dat AI-zoekmachines
                  zoals ChatGPT en Google AI Overviews jouw bedrijf begrijpen én citeren. Voor
                  KMO&apos;s in Limburg is dit dé kans om vroeg zichtbaar te zijn.
                </LeadIntro>

                <div className="mt-6">
                  <BlogProse>
                    <p>
                      Dit is standaard <strong>bodytekst</strong> binnen{" "}
                      <code>BlogProse</code>. Links zoals{" "}
                      <a href="#">deze naar een dienstenpagina</a> krijgen automatisch de
                      amber-stijl. Zo ziet gewone content uit een MDX-bestand eruit zonder losse
                      styling.
                    </p>
                  </BlogProse>
                </div>

                <NoticeBox variant="tip" title="GEO-tip">
                  Herhaal je kernclaims woord-voor-woord over meerdere pagina&apos;s. AI-systemen
                  vertrouwen consistente, herhaalde feiten meer.
                </NoticeBox>
              </ContentSection>

              <ContentSection id="wat-is-geo" title="Wat is GEO?">
                <BlogProse>
                  <p>
                    GEO is de praktijk van content optimaliseren zodat generatieve AI-modellen
                    ze correct kunnen samenvatten en citeren. Waar klassieke SEO mikt op de
                    tien blauwe links, mikt GEO op het antwoord zelf.
                  </p>
                </BlogProse>

                <StatGrid
                  columns={3}
                  stats={[
                    { value: "58%", label: "Zoekopdrachten", description: "eindigt zonder klik" },
                    { value: "3×", label: "Meer citaties", description: "met structured data" },
                    { value: "2026", label: "Kantelpunt", description: "AI-first zoeken" },
                  ]}
                />

                <ContentSection id="voordelen" title="Voordelen" className="mt-8">
                  <ChecklistBlock
                    items={[
                      "Zichtbaar in AI Overviews én klassieke resultaten",
                      "Meer autoriteit door consistente feiten",
                      "Lokale vindbaarheid in Limburg versterkt",
                    ]}
                  />
                </ContentSection>
              </ContentSection>

              <ContentSection id="aanpak" title="Onze aanpak">
                <RoadmapBlock
                  steps={[
                    { title: "Analyse", description: "We brengen zoekintenties en AI-antwoorden in kaart." },
                    { title: "Structuur", description: "Direct-answer paragrafen, FAQ-schema en interne links." },
                    { title: "Content", description: "Herbruikbare blokken, consistente claims, sterke koppen." },
                    { title: "Meten", description: "Zichtbaarheid in Google én AI-engines opvolgen." },
                  ]}
                />

                <BlogImage
                  src={HERO_MAP}
                  alt="Lokale vindbaarheid in Limburg"
                  caption="Voorbeeld van een in-content afbeelding met glow-border en caption."
                />

                <QuoteBlock author="Team VisualVibe" role="Creatief mediabureau">
                  Wie vandaag begrijpelijk is voor AI, wint morgen de klik - of het antwoord.
                </QuoteBlock>
              </ContentSection>

              <ContentSection id="vergelijking" title="SEO vs. GEO">
                <ComparisonTable
                  highlightFirstColumn
                  headers={["Aspect", "Klassieke SEO", "GEO / AEO"]}
                  rows={[
                    ["Doel", "Ranking in 10 links", "Het antwoord zijn"],
                    ["Format", "Keywords & backlinks", "Direct-answer & schema"],
                    ["Meeteenheid", "Positie", "Citaties & zichtbaarheid"],
                  ]}
                />

                <DoDontGrid
                  dos={[
                    "Beantwoord de vraag in de eerste alinea",
                    "Gebruik FAQ-schema en heldere koppen",
                    "Herhaal feiten consistent",
                  ]}
                  donts={[
                    "Vaag inleiden zonder antwoord",
                    "Keyword stuffing",
                    "Tegenstrijdige cijfers per pagina",
                  ]}
                />
              </ContentSection>

              <ContentSection id="faq" title="Veelgestelde vragen">
                <FaqAccordion
                  items={[
                    {
                      question: "Wat is het verschil tussen SEO en GEO?",
                      answer:
                        "SEO optimaliseert voor klassieke zoekresultaten; GEO optimaliseert je content zodat AI-zoekmachines ze correct samenvatten en citeren.",
                    },
                    {
                      question: "Heeft mijn KMO GEO nodig?",
                      answer:
                        "Ja. Steeds meer zoekopdrachten worden door AI beantwoord. Vroeg zichtbaar zijn geeft een blijvende voorsprong.",
                    },
                    {
                      question: "Werkt GEO samen met lokale SEO?",
                      answer:
                        "Absoluut. Consistente NAP-gegevens en lokale content versterken zowel je Google- als je AI-zichtbaarheid in Limburg.",
                    },
                  ]}
                />
              </ContentSection>

              <BlogCTA
                title="Klaar om vindbaar te worden in AI?"
                description="Vraag een vrijblijvende GEO-scan aan voor je website."
                buttonLabel="Offerte aanvragen"
                href="/offerte-aanvragen"
                secondaryLabel="Bekijk SEO-dienst"
                secondaryHref="/diensten/seo"
              />
            </div>
          </article>

          <aside className="hidden lg:block">
            <StickyBlogSidebar
              toc={TOC}
              cta={{
                title: "Gratis GEO-scan",
                description: "Ontdek hoe AI-proof je website is.",
                label: "Vraag scan aan",
                href: "/offerte-aanvragen",
              }}
              service={{
                title: "SEO & GEO",
                description: "Lokale én AI-vindbaarheid voor KMO's in Limburg.",
                href: "/diensten/seo",
                icon: <Search className="h-5 w-5" aria-hidden="true" />,
              }}
            />
          </aside>
        </div>
      </div>

      {/* ===================================================================
          Component reference - every remaining block, annotated
          =================================================================== */}
      <div className="mx-auto max-w-4xl space-y-14 px-4 pb-24">
        <div className="border-t border-white/10 pt-12">
          <h2 className="text-2xl font-bold">Componentreferentie</h2>
          <p className="mt-2 text-white/60">Losse blokken en alle varianten.</p>
        </div>

        <Demo label="NoticeBox · alle varianten">
          <div className="space-y-3">
            <NoticeBox variant="info">Neutrale context of achtergrondinformatie.</NoticeBox>
            <NoticeBox variant="success">Iets is gelukt of aanbevolen.</NoticeBox>
            <NoticeBox variant="warning">Let op - een valkuil of aandachtspunt.</NoticeBox>
            <NoticeBox variant="danger">Belangrijk - dit mag je niet negeren.</NoticeBox>
            <NoticeBox variant="tip">Een praktische tip van het team.</NoticeBox>
          </div>
        </Demo>

        <Demo label="FeatureGrid + FeatureCard">
          <FeatureGrid columns={3}>
            <FeatureCard icon={PenTool} title="Webdesign">
              Snelle, converterende websites op maat.
            </FeatureCard>
            <FeatureCard icon={Camera} title="Fotografie">
              Beeld dat je merk versterkt.
            </FeatureCard>
            <FeatureCard icon={Video} title="Videografie">
              Video, drone en FPV productie.
            </FeatureCard>
          </FeatureGrid>
        </Demo>

        <Demo label="RelatedServices">
          <RelatedServices
            title="Gerelateerde diensten"
            items={[
              { title: "SEO & GEO", href: "/diensten/seo", description: "Vindbaar in Google én AI.", icon: Search },
              { title: "Webdesign", href: "/diensten/webdesign", description: "Snelle websites op maat.", icon: PenTool },
              { title: "Performance", href: "/diensten/webdesign", description: "Core Web Vitals first.", icon: Gauge },
              { title: "Groei", href: "/diensten/seo", description: "Structureel meer aanvragen.", icon: Rocket },
            ]}
          />
        </Demo>

        <Demo label="RelatedRegions">
          <RelatedRegions
            items={[
              { name: "Hasselt", href: "/regio/hasselt" },
              { name: "Genk", href: "/regio/genk" },
              { name: "Bilzen-Hoeselt", href: "/regio/bilzen-hoeselt" },
              { name: "Tongeren", href: "/regio/tongeren-borgloon" },
              { name: "Sint-Truiden", href: "/regio/sint-truiden" },
            ]}
          />
        </Demo>

        <Demo label="RelatedArticles">
          <RelatedArticles
            items={[
              { title: "Lokale SEO voor KMO's in Limburg", href: "/kennisbank/seo-geo/lokale-seo-voor-kmos-in-limburg/", category: "SEO & GEO", readingTime: "14 min", image: HERO_MAP },
              { title: "Website laten maken in Limburg", href: "/kennisbank/webdesign/website-laten-maken-limburg-complete-gids/", category: "Webdesign", readingTime: "22 min", image: HERO_MAP },
              { title: "Gevonden worden in AI-zoekresultaten", href: "/kennisbank/seo-geo/gevonden-worden-in-ai-zoekresultaten-geo-aeo/", category: "SEO & GEO", readingTime: "15 min", image: HERO_LAPTOP },
            ]}
          />
        </Demo>

        <Demo label="BlogProse · h1-hr">
          <BlogProse>
            <h2>Voorbeeldkop niveau 2</h2>
            <p>
              Bodytekst met <strong>bold</strong>, <em>italic</em>, een{" "}
              <a href="#">link</a> en <code>inline code</code>. Zo leest lange content
              comfortabel op donkere achtergrond.
            </p>
            <h3>Kop niveau 3</h3>
            <ul>
              <li>Ongeordend lijstitem één</li>
              <li>Ongeordend lijstitem twee</li>
            </ul>
            <ol>
              <li>Geordend item één</li>
              <li>Geordend item twee</li>
            </ol>
            <blockquote>Een citaat binnen prose met amber accentrand.</blockquote>
            <pre>
              <code>{`const geo = "generative engine optimization";`}</code>
            </pre>
            <table>
              <thead>
                <tr>
                  <th>Kolom A</th>
                  <th>Kolom B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Waarde 1</td>
                  <td>Waarde 2</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <p>Tekst na een horizontale scheidingslijn.</p>
          </BlogProse>
        </Demo>
      </div>
    </div>
  );
}
