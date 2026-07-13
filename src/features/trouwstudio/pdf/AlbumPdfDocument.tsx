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
// Dit bestand wordt uitsluitend dynamisch geimporteerd vanuit de ExportTab
// zodat @react-pdf/renderer buiten de gewone adminbundel blijft.

const MM_TO_PT = 2.8346;

// Statische TTF's van Google Fonts (fonts.gstatic.com, geverifieerde URL's).
const CORMORANT_REGULAR =
  "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf";
const CORMORANT_SEMIBOLD =
  "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9GnM.ttf";
const LORA_REGULAR = "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuyJG.ttf";

// Registratie kan in uitzonderlijke omgevingen falen; dan vallen we terug op
// de ingebouwde PDF-fonts zodat de export nooit strandt op typografie.
let customFontsRegistered = false;
try {
  Font.register({
    family: "Cormorant",
    fonts: [
      { src: CORMORANT_REGULAR, fontWeight: 400 },
      { src: CORMORANT_SEMIBOLD, fontWeight: 600 },
    ],
  });
  Font.register({ family: "Lora", src: LORA_REGULAR });
  customFontsRegistered = true;
} catch {
  customFontsRegistered = false;
}

const HEADING_FAMILY = customFontsRegistered ? "Cormorant" : "Times-Roman";
const BODY_FAMILY = customFontsRegistered ? "Lora" : "Helvetica";

export type AlbumPdfInput = {
  album: WeddingAlbum;
  template: WeddingAlbumTemplate;
  photosById: Record<string, WeddingPhoto>;
  quality: "preview" | "hoog";
};

/** Procentwaarde als react-pdf-stijlstring ("42%"). */
function pct(value: number): `${number}%` {
  return `${value}%` as `${number}%`;
}

function photoSource(photo: WeddingPhoto, quality: AlbumPdfInput["quality"]): string {
  return quality === "preview" ? photo.previewUrl : photo.processedUrl ?? photo.originalUrl;
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

function textStyle(role: AlbumTextBlock["role"], template: WeddingAlbumTemplate): Style {
  const { colors } = template;
  switch (role) {
    case "title":
      return {
        fontFamily: HEADING_FAMILY,
        fontSize: 30,
        color: colors.text,
        ...(customFontsRegistered ? { fontWeight: 600 } : {}),
      };
    case "subtitle":
      return {
        fontFamily: HEADING_FAMILY,
        fontSize: 14,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: colors.mutedText,
      };
    case "body":
      return { fontFamily: BODY_FAMILY, fontSize: 10.5, lineHeight: 1.7, color: colors.text };
    case "quote":
      return { fontFamily: HEADING_FAMILY, fontSize: 18, lineHeight: 1.5, color: colors.text };
    case "caption":
    case "meta":
      return {
        fontFamily: BODY_FAMILY,
        fontSize: 8,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: colors.mutedText,
      };
  }
}

function PdfFrame({
  frame,
  template,
  photosById,
  quality,
}: {
  frame: AlbumFrame;
  template: WeddingAlbumTemplate;
  photosById: Record<string, WeddingPhoto>;
  quality: AlbumPdfInput["quality"];
}): ReactElement {
  const photo = frame.photoId ? photosById[frame.photoId] : undefined;
  const box: Style = {
    position: "absolute",
    left: pct(frame.x),
    top: pct(frame.y),
    width: pct(frame.width),
    height: pct(frame.height),
  };
  if (!photo) {
    // Leeg kader: subtiel vlak in de surfacekleur met een dunne haarlijn.
    return (
      <View
        style={{
          ...box,
          backgroundColor: template.colors.surface,
          borderWidth: 0.5,
          borderStyle: "solid",
          borderColor: template.colors.hairline,
        }}
      />
    );
  }
  return (
    <View style={box}>
      {/* react-pdf's Image kent geen alt-prop; dit is geen DOM-element. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={photoSource(photo, quality)} style={styles.frameImage} />
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
      <Text style={{ ...textStyle(block.role, template), textAlign: block.align }}>{block.text}</Text>
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
  photosById,
  quality,
}: {
  page: WeddingAlbumPage;
  template: WeddingAlbumTemplate;
  photosById: Record<string, WeddingPhoto>;
  quality: AlbumPdfInput["quality"];
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
        <PdfFrame key={`frame-${index}`} frame={frame} template={template} photosById={photosById} quality={quality} />
      ))}
      {page.textBlocks.map((block, index) => (
        <PdfTextBlock key={`text-${index}`} block={block} template={template} showTitleHairline={showTitleHairline} />
      ))}
    </Page>
  );
}

export function AlbumPdfDocument(props: AlbumPdfInput): ReactElement {
  const { album, template, photosById, quality } = props;
  return (
    <Document
      title={album.title}
      author={album.photographerName || "VisualVibe"}
      creator="VisualVibe Trouwstudio"
      producer="VisualVibe Trouwstudio"
      language={album.language}
    >
      {album.pages.map((page) => (
        <PdfAlbumPage key={page.id} page={page} template={template} photosById={photosById} quality={quality} />
      ))}
    </Document>
  );
}

/** Rendert het album naar een PDF-blob (browser). */
export async function generateAlbumPdf(input: AlbumPdfInput): Promise<Blob> {
  return pdf(<AlbumPdfDocument {...input} />).toBlob();
}
