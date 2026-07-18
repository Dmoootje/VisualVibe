import { describe, expect, it } from "vitest";

import {
  auditEnglishPublication,
  extractDocumentSignals,
  parseSitemapUrls,
  requiredRepresentativePaths,
} from "./audit-english-production.mjs";

const baseUrl = "https://publication.test";

function response(url, body, { status = 200, headers = {} } = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    url,
    headers: new Headers(headers),
    text: async () => body,
  };
}

function page(url, extra = "", publicOrigin = baseUrl) {
  return `<!doctype html><html><head>
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="nl-BE" href="${publicOrigin}/be/">
    <link rel="alternate" hreflang="en-BE" href="${url}">
    <link rel="alternate" hreflang="x-default" href="${publicOrigin}/be/">
  </head><body><img src="/hero.webp" alt=""><a href="/en/contact/">Contact</a>${extra}</body></html>`;
}

function validFixtureFetch() {
  const sitemapUrls = requiredRepresentativePaths.map((path) => `${baseUrl}${path}`);
  const sitemap = `<urlset>${sitemapUrls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;

  return async (input, options = {}) => {
    const url = String(input);
    if (url === `${baseUrl}/sitemap.xml`) return response(url, sitemap);
    if (url === `${baseUrl}/fr/` || url === `${baseUrl}/de/`) {
      return response(url, "", { status: 308, headers: { location: "/be/" } });
    }
    if (url === `${baseUrl}/be/`) return response(url, page(url));
    if (sitemapUrls.includes(url)) return response(url, page(url));
    return response(url, "Not found", { status: 404 });
  };
}

describe("English production audit parsing", () => {
  it("extracts sitemap URLs and document crawl signals", () => {
    expect(parseSitemapUrls(`
      <urlset>
        <url><loc>${baseUrl}/en/</loc></url>
        <url><loc>${baseUrl}/be/</loc></url>
      </urlset>
    `)).toEqual([`${baseUrl}/en/`, `${baseUrl}/be/`]);

    expect(extractDocumentSignals(page(`${baseUrl}/en/`))).toMatchObject({
      canonical: `${baseUrl}/en/`,
      hreflangs: expect.arrayContaining([
        { language: "en-BE", href: `${baseUrl}/en/` },
        { language: "nl-BE", href: `${baseUrl}/be/` },
      ]),
      internalLinks: ["/en/contact/"],
      missingImageAltCount: 0,
    });
  });

  it("passes a complete bilingual canonical fixture", async () => {
    const result = await auditEnglishPublication({
      baseUrl,
      fetchImpl: validFixtureFetch(),
    });

    expect(result.issues).toEqual([]);
    expect(result.counts).toMatchObject({
      englishSitemapUrls: requiredRepresentativePaths.length,
      crawledEnglishPages: requiredRepresentativePaths.length,
      disabledLocaleRedirects: 2,
    });
  });

  it("fetches production-origin sitemap paths through the local audit server", async () => {
    const publicOrigin = "https://visualvibe.media";
    const localBaseUrl = "http://127.0.0.1:3210";
    const sitemapUrls = requiredRepresentativePaths.map((path) => `${publicOrigin}${path}`);
    const requested = [];
    const fetchImpl = async (input) => {
      const url = String(input);
      requested.push(url);
      if (url === `${localBaseUrl}/sitemap.xml`) {
        return response(url, `<urlset>${sitemapUrls.map((item) => `<url><loc>${item}</loc></url>`).join("")}</urlset>`);
      }
      if (url === `${localBaseUrl}/fr/` || url === `${localBaseUrl}/de/`) {
        return response(url, "", { status: 308, headers: { location: "/be/" } });
      }
      const path = new URL(url).pathname;
      if (path === "/be/" || requiredRepresentativePaths.includes(path)) {
        return response(url, page(`${publicOrigin}${path}`, "", publicOrigin));
      }
      return response(url, "Not found", { status: 404 });
    };

    const result = await auditEnglishPublication({ baseUrl: localBaseUrl, fetchImpl });

    expect(result.issues).toEqual([]);
    expect(result.counts.englishSitemapUrls).toBe(requiredRepresentativePaths.length);
    expect(requested).toContain(`${localBaseUrl}/en/diensten/web-design/`);
    expect(requested).not.toContain(`${publicOrigin}/en/diensten/web-design/`);
  });

  it("groups canonical, hreflang, image and internal-link failures by route", async () => {
    const baseFetch = validFixtureFetch();
    const fetchImpl = async (input, options) => {
      const url = String(input);
      if (url === `${baseUrl}/en/contact/`) {
        return response(url, `<!doctype html><html><head>
          <link rel="canonical" href="${baseUrl}/be/contact/">
          <link rel="alternate" hreflang="en-BE" href="${baseUrl}/en/missing/">
        </head><body><img src="/missing-alt.webp"><a href="/en/broken/">Broken</a></body></html>`);
      }
      return baseFetch(input, options);
    };

    const result = await auditEnglishPublication({ baseUrl, fetchImpl });
    const contactIssues = result.issues.filter(({ route }) => route === "/en/contact/");

    expect(contactIssues.map(({ code }) => code)).toEqual(expect.arrayContaining([
      "missing_self_canonical",
      "invalid_hreflang_target",
      "missing_image_alt",
      "broken_internal_link",
    ]));
  });

  it("rejects successful internal English links whose canonical points elsewhere", async () => {
    const baseFetch = validFixtureFetch();
    const fetchImpl = async (input, options) => {
      const url = String(input);
      if (url === `${baseUrl}/en/about/`) {
        return response(url, page(url, '<a href="/en/alias/">Alias</a>'));
      }
      if (url === `${baseUrl}/en/alias/`) {
        return response(url, page(`${baseUrl}/en/contact/`));
      }
      return baseFetch(input, options);
    };

    const result = await auditEnglishPublication({ baseUrl, fetchImpl });

    expect(result.issues).toContainEqual(expect.objectContaining({
      route: "/en/about/",
      code: "noncanonical_internal_link",
      target: `${baseUrl}/en/alias/`,
    }));
  });

  it("rejects same-site Dutch links rendered on English pages", async () => {
    const baseFetch = validFixtureFetch();
    const fetchImpl = async (input, options) => {
      const url = String(input);
      if (url === `${baseUrl}/en/about/`) {
        return response(url, page(url, '<a href="/be/contact/">Dutch contact</a>'));
      }
      return baseFetch(input, options);
    };

    const result = await auditEnglishPublication({ baseUrl, fetchImpl });

    expect(result.issues).toContainEqual(expect.objectContaining({
      route: "/en/about/",
      code: "dutch_internal_link",
      target: `${baseUrl}/be/contact/`,
    }));
  });
});
