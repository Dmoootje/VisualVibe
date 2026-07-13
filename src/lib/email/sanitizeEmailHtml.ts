import "server-only";

import sanitizeHtml from "sanitize-html";

// Server-side sanitization van onbetrouwbare e-mail-HTML. Alles wat hier
// doorheen komt wordt daarna nog geisoleerd gerenderd in een sandboxed iframe
// zonder scripts; deze laag verwijdert scripts, event handlers, formulieren en
// gevaarlijke URL-schema's al voor opslag.

const MAX_HTML_LENGTH = 400_000;

const ALLOWED_STYLE_VALUE = [/^[^;{}<>]*$/];

const ALLOWED_STYLES: Record<string, RegExp[]> = {
  color: ALLOWED_STYLE_VALUE,
  "background-color": ALLOWED_STYLE_VALUE,
  "font-family": ALLOWED_STYLE_VALUE,
  "font-size": ALLOWED_STYLE_VALUE,
  "font-weight": ALLOWED_STYLE_VALUE,
  "font-style": ALLOWED_STYLE_VALUE,
  "line-height": ALLOWED_STYLE_VALUE,
  "letter-spacing": ALLOWED_STYLE_VALUE,
  "text-align": ALLOWED_STYLE_VALUE,
  "text-decoration": ALLOWED_STYLE_VALUE,
  "text-transform": ALLOWED_STYLE_VALUE,
  "vertical-align": ALLOWED_STYLE_VALUE,
  margin: ALLOWED_STYLE_VALUE,
  "margin-top": ALLOWED_STYLE_VALUE,
  "margin-bottom": ALLOWED_STYLE_VALUE,
  "margin-left": ALLOWED_STYLE_VALUE,
  "margin-right": ALLOWED_STYLE_VALUE,
  padding: ALLOWED_STYLE_VALUE,
  "padding-top": ALLOWED_STYLE_VALUE,
  "padding-bottom": ALLOWED_STYLE_VALUE,
  "padding-left": ALLOWED_STYLE_VALUE,
  "padding-right": ALLOWED_STYLE_VALUE,
  border: ALLOWED_STYLE_VALUE,
  "border-top": ALLOWED_STYLE_VALUE,
  "border-bottom": ALLOWED_STYLE_VALUE,
  "border-left": ALLOWED_STYLE_VALUE,
  "border-right": ALLOWED_STYLE_VALUE,
  "border-radius": ALLOWED_STYLE_VALUE,
  "border-collapse": ALLOWED_STYLE_VALUE,
  "border-spacing": ALLOWED_STYLE_VALUE,
  "border-color": ALLOWED_STYLE_VALUE,
  "border-width": ALLOWED_STYLE_VALUE,
  "border-style": ALLOWED_STYLE_VALUE,
  width: ALLOWED_STYLE_VALUE,
  "max-width": ALLOWED_STYLE_VALUE,
  "min-width": ALLOWED_STYLE_VALUE,
  height: ALLOWED_STYLE_VALUE,
  "max-height": ALLOWED_STYLE_VALUE,
  display: [/^(block|inline|inline-block|table|table-row|table-cell|none)$/],
  overflow: [/^(hidden|auto|visible)$/],
  "white-space": ALLOWED_STYLE_VALUE,
  "word-break": ALLOWED_STYLE_VALUE,
  "list-style": ALLOWED_STYLE_VALUE,
  "list-style-type": ALLOWED_STYLE_VALUE,
};

/**
 * Ontsmet e-mail-HTML tot een veilige subset (geen scripts, geen event
 * handlers, geen formulieren, geen externe stylesheets, geen cid:-resten).
 */
export function sanitizeEmailHtml(html: string): string {
  const input = (html ?? "").slice(0, MAX_HTML_LENGTH);
  if (!input.trim()) return "";

  return sanitizeHtml(input, {
    allowedTags: [
      "a", "abbr", "b", "bdi", "bdo", "blockquote", "br", "caption", "center",
      "cite", "code", "col", "colgroup", "dd", "del", "details", "div", "dl",
      "dt", "em", "figcaption", "figure", "font", "h1", "h2", "h3", "h4", "h5",
      "h6", "hr", "i", "img", "ins", "kbd", "li", "mark", "ol", "p", "pre",
      "q", "s", "small", "span", "strike", "strong", "sub", "summary", "sup",
      "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul", "wbr",
    ],
    allowedAttributes: {
      "*": ["style", "dir", "align", "valign", "width", "height", "cellpadding", "cellspacing", "border", "bgcolor", "colspan", "rowspan"],
      a: ["href", "title", "style", "name"],
      img: ["src", "alt", "title", "width", "height", "style"],
      font: ["color", "face", "size"],
      td: ["style", "align", "valign", "width", "height", "colspan", "rowspan", "bgcolor", "nowrap"],
      th: ["style", "align", "valign", "width", "height", "colspan", "rowspan", "bgcolor"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowProtocolRelative: false,
    allowedStyles: { "*": ALLOWED_STYLES },
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      img: (tagName, attribs) => {
        const src = attribs.src ?? "";
        // cid:-afbeeldingen (inline bijlagen) kunnen hier niet resolven; toon alt-tekst.
        if (src.toLowerCase().startsWith("cid:")) {
          const { src: _omit, ...rest } = attribs;
          return { tagName: "img", attribs: rest };
        }
        // Alleen data-URI's van afbeeldingsformaten toestaan.
        if (src.toLowerCase().startsWith("data:") && !/^data:image\/(png|jpe?g|gif|webp|bmp);base64,/i.test(src)) {
          const { src: _omit, ...rest } = attribs;
          return { tagName: "img", attribs: rest };
        }
        return { tagName: "img", attribs };
      },
    },
  });
}

/** Zeer eenvoudige HTML-naar-tekstconversie voor snippets en tekstversies. */
export function emailHtmlToText(html: string): string {
  return (html ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6]|blockquote|table)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Kort tekstfragment voor de berichtenlijst. */
export function makeSnippet(text: string, maxLength = 180): string {
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
