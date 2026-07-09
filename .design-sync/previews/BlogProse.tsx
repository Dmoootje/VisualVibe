import { BlogProse } from "nova";

export const RichContent = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogProse>
      <h2>Waarom lokale SEO onmisbaar is voor Limburgse KMO&apos;s</h2>
      <p>
        Wie in Hasselt, Genk of Tongeren gevonden wil worden, heeft meer nodig dan
        een mooie website. Met <strong>lokale SEO</strong> zorgen we dat je bedrijf
        bovenaan verschijnt wanneer klanten in de buurt zoeken. Lees meer over onze{" "}
        <a href="/diensten/seo">SEO- en GEO-aanpak</a>.
      </p>
      <h3>Waar we op inzetten</h3>
      <ul>
        <li>Een consistent Google Bedrijfsprofiel met correcte NAP-gegevens</li>
        <li>Snelle laadtijden en sterke Core Web Vitals</li>
        <li>Content die zowel Google als AI-zoekmachines begrijpen</li>
      </ul>
      <p>
        Het verschil zit vaak in de <em>details</em>, van een schema-markup tot een
        goed gekozen <code>title</code>-tag.
      </p>
    </BlogProse>
  </div>
);

export const AllElements = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogProse>
      <h2>Bouwblokken van een sterk artikel</h2>
      <p>
        Bodytekst met <strong>bold</strong>, <em>italic</em>, een{" "}
        <a href="#">link</a> en <code>inline code</code>. Zo leest lange content
        comfortabel op donkere achtergrond.
      </p>
      <ol>
        <li>Bepaal de zoekintentie</li>
        <li>Beantwoord de vraag in de eerste alinea</li>
        <li>Onderbouw met feiten en interne links</li>
      </ol>
      <blockquote>
        Wie vandaag begrijpelijk is voor AI, wint morgen de klik.
      </blockquote>
      <pre>
        <code>{`const geo = "generative engine optimization";`}</code>
      </pre>
      <hr />
      <p>Tekst na een horizontale scheidingslijn sluit de sectie netjes af.</p>
    </BlogProse>
  </div>
);

export const ProseTable = () => (
  <div style={{ padding: 24, maxWidth: 720 }}>
    <BlogProse>
      <h3>Diensten en typische doorlooptijd</h3>
      <table>
        <thead>
          <tr>
            <th>Dienst</th>
            <th>Doorlooptijd</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Webdesign KMO-site</td>
            <td>4 tot 6 weken</td>
          </tr>
          <tr>
            <td>Fotoreportage bedrijf</td>
            <td>1 dag op locatie</td>
          </tr>
          <tr>
            <td>Drone- en FPV-video</td>
            <td>2 tot 3 weken</td>
          </tr>
        </tbody>
      </table>
    </BlogProse>
  </div>
);
