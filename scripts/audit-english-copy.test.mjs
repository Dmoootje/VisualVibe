import { describe, expect, it } from "vitest";
import {
  analyzeRenderedEnglishPage,
  auditEnglishCopy,
  formatEnglishCopyAudit,
} from "./audit-english-copy.mjs";

const goodPage = `<!doctype html><html lang="en"><head>
  <meta property="og:locale" content="en_BE">
</head><body>
  <p>Bouw Realisaties is a company name.</p>
  <code>https://visualvibe.media/en/kennisbank/example/</code>
  <script type="application/ld+json">{"inLanguage":"en-BE"}</script>
</body></html>`;

describe("English rendered copy audit", () => {
  it("accepts English Belgian metadata, proper names and published route namespaces", () => {
    expect(analyzeRenderedEnglishPage(goodPage)).toEqual([]);
    expect(analyzeRenderedEnglishPage(goodPage.replace("en_BE", "en_GB"))).toEqual([]);
  });

  it("accepts English Open Graph metadata streamed after the initial head", () => {
    const streamedPage = goodPage
      .replace('  <meta property="og:locale" content="en_BE">\n', "")
      .replace("</body>", '  <meta property="og:locale" content="en_GB">\n</body>');

    expect(analyzeRenderedEnglishPage(streamedPage)).toEqual([]);
  });

  it("reports visitor copy, attributes and metadata that remain Dutch", () => {
    const issues = analyzeRenderedEnglishPage(`<!doctype html><html lang="nl"><head>
      <meta content="nl_BE" property="og:locale">
    </head><body>
      <a href="/be/contact/" aria-label="Kruimelpad">Offerte aanvragen</a>
      <code>/diensten/fotografie/</code>
      <script type="application/ld+json">{"inLanguage":"nl-BE","genre":"Maatwerk softwareproject"}</script>
    </body></html>`);

    expect(issues).toEqual(expect.arrayContaining([
      "visible:dutch-quotation-cta",
      "visible:visible-dutch-route-example",
      "attribute:dutch-breadcrumb-aria",
      "attribute:dutch-same-site-anchor",
      "meta:html-lang",
      "meta:og-locale",
      "meta:jsonld-dutch-language",
      "meta:jsonld-dutch-copy",
    ]));
  });

  it("crawls only English sitemap routes and groups failures by route", async () => {
    const baseUrl = "https://audit.test";
    const fetchImpl = async (input) => {
      const url = String(input);
      if (url === `${baseUrl}/sitemap.xml`) {
        return new Response(`<urlset>
          <url><loc>https://visualvibe.media/en/</loc></url>
          <url><loc>https://visualvibe.media/en/about/</loc></url>
          <url><loc>https://visualvibe.media/be/</loc></url>
        </urlset>`);
      }
      if (url === `${baseUrl}/en/`) return new Response(goodPage);
      if (url === `${baseUrl}/en/about/`) {
        return new Response(goodPage.replace("Bouw Realisaties", "Offerte aanvragen"));
      }
      return new Response("Not found", { status: 404 });
    };

    const result = await auditEnglishCopy({ baseUrl, fetchImpl });

    expect(result.paths).toEqual(["/en/", "/en/about/"]);
    expect(result.failures).toEqual([{
      pathname: "/en/about/",
      issues: ["visible:dutch-quotation-cta"],
    }]);
    expect(formatEnglishCopyAudit(result)).toContain(
      "2 route(s), 1 issue(s) across 1 route(s)",
    );
  });
});
