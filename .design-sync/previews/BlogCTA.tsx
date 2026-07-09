import { BlogCTA } from "nova";

export const Default = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogCTA
      title="Klaar om vindbaar te worden in AI?"
      description="Vraag een vrijblijvende GEO-scan aan voor je website en ontdek hoe AI-proof je bedrijf in Limburg is."
      buttonLabel="Offerte aanvragen"
      href="/offerte-aanvragen"
      secondaryLabel="Bekijk SEO-dienst"
      secondaryHref="/diensten/seo"
    />
  </div>
);

export const PrimaryOnly = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogCTA
      title="Website laten maken in Hasselt of Genk?"
      description="Van strategie tot livegang: wij bouwen snelle, converterende websites voor KMO's in heel Limburg."
      buttonLabel="Plan een gratis kennismaking"
      href="/contact"
    />
  </div>
);

export const NoDescription = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogCTA
      title="Laat je merk in beeld schitteren met fotografie en drone"
      buttonLabel="Bekijk onze realisaties"
      href="/realisaties"
      secondaryLabel="Neem contact op"
      secondaryHref="/contact"
    />
  </div>
);
