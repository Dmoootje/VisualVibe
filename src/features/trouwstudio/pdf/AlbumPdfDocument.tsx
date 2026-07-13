import { Document, Font, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactElement } from "react";
import { getLayoutDefinition } from "@/features/trouwstudio/templates/ivoryEditorial";
import type {
  AlbumFrame,
  AlbumTextBlock,
  WeddingAlbum,
  WeddingAlbumPage,
  WeddingAlbumTemplate,
  WeddingPhoto,
} from "@/features/trouwstudio/types";

// PDF-renderer voor het trouwboek. Volledig datagedreven: alle posities komen
// als procenten uit de template-lay-outs, dezelfde bron als de builderpreview.
// De accentkleur zit al in de doorgegeven template (resolveAlbumTemplate past
// album.accentColor toe). Dit bestand wordt uitsluitend dynamisch geimporteerd
// vanuit de ExportTab zodat @react-pdf/renderer buiten de gewone adminbundel blijft.

const MM_TO_PT = 2.8346;

// Statische TTF's (geverifieerde CORS-vriendelijke bronnen). Elk lettertype
// wordt apart geregistreerd zodat één mislukte registratie de andere niet
// uitschakelt; bij falen valt die familie terug op een ingebouwd PDF-font.
const CORMORANT_REGULAR =
  "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf";
const CORMORANT_SEMIBOLD =
  "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9GnM.ttf";
const LORA_REGULAR = "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuyJG.ttf";
const GREAT_VIBES_REGULAR =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf";

function registerFamily(register: () => void): boolean {
  try {
    register();
    return true;
  } catch {
    return false;
  }
}

const headingRegistered = registerFamily(() =>
  Font.register({
    family: "AlbumHeading",
    fonts: [
      { src: CORMORANT_REGULAR, fontWeight: 400 },
      { src: CORMORANT_SEMIBOLD, fontWeight: 600 },
    ],
  }),
);
const bodyRegistered = registerFamily(() => Font.register({ family: "AlbumBody", src: LORA_REGULAR }));
const scriptRegistered = registerFamily(() =>
  Font.register({ family: "AlbumScript", src: GREAT_VIBES_REGULAR }),
);

const HEADING_FAMILY = headingRegistered ? "AlbumHeading" : "Times-Roman";
const BODY_FAMILY = bodyRegistered ? "AlbumBody" : "Helvetica";
const SCRIPT_FAMILY = scriptRegistered ? "AlbumScript" : HEADING_FAMILY;

/** Kies de PDF-fontfamilie voor een expliciete font-rol of tekstrol. */
function familyFor(font: AlbumTextBlock["font"] | undefined, roleDefault: string): string {
  if (font === "heading") return HEADING_FAMILY;
  if (font === "body") return BODY_FAMILY;
  if (font === "accent") return SCRIPT_FAMILY;
  return roleDefault;
}

export type AlbumPdfInput = {
  album: WeddingAlbum;
  template: WeddingAlbumTemplate;
  photosById: Record<string, WeddingPhoto>;
  quality: "preview" | "hoog";
  /** Overschrijft de bron-URL per foto (bv. server-side gereduceerde beelden). */
  photoUrlOverride?: Record<string, string>;
};

/** Procentwaarde als react-pdf-stijlstring ("42%"). */
function pct(value: number): `${number}%` {
  return `${value}%` as `${number}%`;
}

function photoSource(photo: WeddingPhoto, input: AlbumPdfInput): string {
  const override = input.photoUrlOverride?.[photo.id];
  if (override) return override;
  return input.quality === "preview" ? photo.previewUrl : photo.processedUrl ?? photo.originalUrl;
}

const styles = StyleSheet.create({
  frameImage: { width: "100%", height: "100%", objectFit: "cover" },
  titleHairline: { height: 1, width: 42, marginTop: 8 },
  quoteHairline: { height: 1, width: 42, marginBottom: 10 },
});

function alignSelfFor(align: AlbumTextBlock["align"]): "flex-start" | "center" | "flex-end" {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

function textStyle(block: AlbumTextBlock, template: WeddingAlbumTemplate): Style {
  const { colors } = template;
  const color = block.color ?? undefined;
  switch (block.role) {
    case "title":
      return {
        fontFamily: familyFor(block.font, HEADING_FAMILY),
        fontSize: 30,
        color: color ?? colors.text,
        ...(headingRegistered && block.font !== "accent" ? { fontWeight: 600 } : {}),
      };
    case "subtitle":
      return {
        fontFamily: familyFor(block.font, BODY_FAMILY),
        fontSize: 12,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: color ?? colors.mutedText,
      };
    case "body":
      return {
        fontFamily: familyFor(block.font, BODY_FAMILY),
        fontSize: 10.5,
        lineHeight: 1.7,
        color: color ?? colors.text,
      };
    case "quote":
      return {
        fontFamily: familyFor(block.font, HEADING_FAMILY),
        fontSize: 18,
        lineHeight: 1.5,
        color: color ?? colors.text,
      };
    case "caption":
    case "meta":
      return {
        fontFamily: familyFor(block.font, BODY_FAMILY),
        fontSize: 8,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: color ?? colors.mutedText,
      };
  }
}

function PdfFrame({
  frame,
  template,
  input,
}: {
  frame: AlbumFrame;
  template: WeddingAlbumTemplate;
  input: AlbumPdfInput;
}): ReactElement {
  const photo = frame.photoId ? input.photosById[frame.photoId] : undefined;
  const box: Style = {
    position: "absolute",
    left: pct(frame.x),
    top: pct(frame.y),
    width: pct(frame.width),
    height: pct(frame.height),
    ...(frame.framed
      ? { borderWidth: 0.75, borderStyle: "solid", borderColor: template.colors.hairline, padding: 3 }
      : {}),
  };
  if (!photo) {
    // Leeg kader: subtiel vlak in de surfacekleur met een dunne haarlijn.
    return (
      <View
        style={{
          ...box,
          backgroundColor: template.colors.surface,
          ...(frame.framed
            ? {}
            : { borderWidth: 0.5, borderStyle: "solid", borderColor: template.colors.hairline }),
        }}
      />
    );
  }
  return (
    <View style={box}>
      {/* react-pdf's Image kent geen alt-prop; dit is geen DOM-element. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={photoSource(photo, input)} style={styles.frameImage} />
      {frame.scrim ? (
        <>
          {/* Benadering van een verloop-scrim: een lichte volledige laag plus een
              donkerdere onderband zodat witte overlaytekst leesbaar blijft. */}
          <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(18,13,8,0.16)" }} />
          <View style={{ position: "absolute", left: 0, right: 0, top: "45%", bottom: 0, backgroundColor: "rgba(18,13,8,0.42)" }} />
        </>
      ) : null}
    </View>
  );
}

function PdfTextBlock({
  block,
  template,
  showTitleHairline,
}: {
  block: AlbumTextBlock;
  template: WeddingAlbumTemplate;
  showTitleHairline: boolean;
}): ReactElement | null {
  if (!block.text.trim()) return null;
  return (
    <View style={{ position: "absolute", left: pct(block.x), top: pct(block.y), width: pct(block.width) }}>
      {block.role === "quote" ? (
        <View
          style={[
            styles.quoteHairline,
            { backgroundColor: template.colors.accent, alignSelf: alignSelfFor(block.align) },
          ]}
        />
      ) : null}
      <Text style={{ ...textStyle(block, template), textAlign: block.align }}>{block.text}</Text>
      {block.role === "title" && showTitleHairline ? (
        <View
          style={[
            styles.titleHairline,
            { backgroundColor: template.colors.accent, alignSelf: alignSelfFor(block.align) },
          ]}
        />
      ) : null}
    </View>
  );
}

function PdfAlbumPage({
  page,
  template,
  input,
}: {
  page: WeddingAlbumPage;
  template: WeddingAlbumTemplate;
  input: AlbumPdfInput;
}): ReactElement {
  // Lay-out alleen nodig voor de paginasoort (accentlijn onder covertitels);
  // de kaders en tekstblokken zelf komen altijd uit de pagina-data, dus een
  // onbekende lay-out-id rendert gewoon verder.
  const layout = getLayoutDefinition(template, page.layoutId);
  const showTitleHairline = layout?.kind === "cover" || layout?.kind === "hoofdstukopener";

  return (
    <Page
      size={[template.pageWidth * MM_TO_PT, template.pageHeight * MM_TO_PT]}
      style={{ backgroundColor: template.colors.background }}
    >
      {page.frames.map((frame, index) => (
        <PdfFrame key={`frame-${index}`} frame={frame} template={template} input={input} />
      ))}
      {page.textBlocks.map((block, index) => (
        <PdfTextBlock key={`text-${index}`} block={block} template={template} showTitleHairline={showTitleHairline} />
      ))}
    </Page>
  );
}

export function AlbumPdfDocument(props: AlbumPdfInput): ReactElement {
  const { album, template } = props;
  return (
    <Document
      title={album.title}
      author={album.photographerName || "VisualVibe"}
      creator="VisualVibe Trouwstudio"
      producer="VisualVibe Trouwstudio"
      language={album.language}
    >
      {album.pages.map((page) => (
        <PdfAlbumPage key={page.id} page={page} template={template} input={props} />
      ))}
    </Document>
  );
}

/** Rendert het album naar een PDF-blob (browser). */
export async function generateAlbumPdf(input: AlbumPdfInput): Promise<Blob> {
  return pdf(<AlbumPdfDocument {...input} />).toBlob();
}
