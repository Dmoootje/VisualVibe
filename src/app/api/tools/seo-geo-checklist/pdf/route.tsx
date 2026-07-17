import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import {
  buildChecklistPdfModel,
  type ChecklistPdfModel,
} from "@/lib/tools/seoGeoChecklistPdf";

export const runtime = "nodejs";

type PdfPayload = {
  checkedItemIds: string[];
};

const styles = StyleSheet.create({
  page: {
    padding: 42,
    paddingBottom: 66,
    backgroundColor: "#fffaf5",
    color: "#181412",
    fontFamily: "Helvetica",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#f2d7c3",
    paddingBottom: 18,
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  brandVisual: {
    fontSize: 24,
    fontWeight: 700,
    color: "#181412",
  },
  brandVibe: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ff7500",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "#ff7500",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.18,
    marginBottom: 8,
  },
  intro: {
    fontSize: 10.5,
    lineHeight: 1.55,
    color: "#5d504b",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  pill: {
    borderWidth: 1,
    borderColor: "#f4c49e",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#8b3f00",
    fontSize: 9,
    fontWeight: 700,
  },
  section: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f2d7c3",
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#181412",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  check: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#34d399",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 9,
    fontWeight: 700,
    paddingTop: 1,
  },
  uncheckedCheck: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d9b59a",
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#181412",
  },
  itemHelp: {
    marginTop: 2,
    fontSize: 9.2,
    lineHeight: 1.45,
    color: "#645954",
  },
  emptyBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f2d7c3",
    backgroundColor: "#ffffff",
  },
  footer: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#f2d7c3",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  footerText: {
    fontSize: 8.5,
    color: "#756965",
  },
});

function isValidPayload(value: unknown): value is PdfPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { checkedItemIds?: unknown }).checkedItemIds) &&
    (value as { checkedItemIds: unknown[] }).checkedItemIds.every((id) => typeof id === "string")
  );
}

function ChecklistPdfDocument({
  model,
  generatedAt,
}: {
  model: ChecklistPdfModel;
  generatedAt: string;
}): ReactElement {
  return (
    <Document
      title="VisualVibe SEO/GEO checklist"
      author="VisualVibe"
      creator="VisualVibe"
      producer="VisualVibe"
      language="nl-BE"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandVisual}>Visual</Text>
            <Text style={styles.brandVibe}>Vibe</Text>
          </View>
          <Text style={styles.eyebrow}>SEO, GEO & AI-vindbaarheid</Text>
          <Text style={styles.title}>Jouw SEO/GEO checklist</Text>
          <Text style={styles.intro}>
            Deze PDF bevat de volledige VisualVibe checklist. Aangevinkte punten zijn gemarkeerd;
            de overige punten blijven als printbare checklist beschikbaar voor thuis, je team of je
            klant.
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.pill}>{generatedAt}</Text>
            <Text style={styles.pill}>{model.checkedCount} aangevinkt</Text>
            <Text style={styles.pill}>visualvibe.media</Text>
          </View>
        </View>

        {model.hasEmptySelectionNotice ? (
          <View style={styles.emptyBox}>
            <Text style={styles.sectionTitle}>Nog geen punten aangevinkt</Text>
            <Text style={styles.intro}>
              Je hebt nog niets aangevinkt. Daarom tonen we hieronder de volledige checklist met
              lege vakjes, zodat je ze thuis of op kantoor verder kunt invullen.
            </Text>
          </View>
        ) : null}

        {model.groups.map(({ category, items }) => (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={item.checked ? styles.check : [styles.check, styles.uncheckedCheck]}>
                  {item.checked ? "✓" : ""}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemHelp}>{item.help}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>© VisualVibe - webdesign, SEO, fotografie, video en digitale beleving.</Text>
          <Text style={styles.footerText}>visualvibe.media · /be/tools/seo-geo-checklist/</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const model = buildChecklistPdfModel(payload.checkedItemIds);
  const generatedAt = new Intl.DateTimeFormat("nl-BE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const blob = await pdf(
    <ChecklistPdfDocument model={model} generatedAt={generatedAt} />,
  ).toBlob();

  return new Response(await blob.arrayBuffer(), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="visualvibe-seo-geo-checklist.pdf"',
      "cache-control": "no-store",
    },
  });
}
