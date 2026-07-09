import { NoticeBox } from "nova";

export const AllVariants = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <NoticeBox variant="info">Neutrale context of achtergrondinformatie.</NoticeBox>
    <NoticeBox variant="success">Iets is gelukt of aanbevolen.</NoticeBox>
    <NoticeBox variant="warning">Let op - een valkuil of aandachtspunt.</NoticeBox>
    <NoticeBox variant="danger">Belangrijk - dit mag je niet negeren.</NoticeBox>
    <NoticeBox variant="tip">Een praktische tip van het team.</NoticeBox>
  </div>
);

export const WithTitle = () => (
  <div style={{ display: "grid", gap: 12, padding: 24, maxWidth: 680 }}>
    <NoticeBox variant="tip" title="GEO-tip">
      Herhaal je kernclaims woord-voor-woord over meerdere pagina&apos;s. AI-systemen
      vertrouwen consistente, herhaalde feiten meer.
    </NoticeBox>
    <NoticeBox variant="warning" title="Belangrijk voor lokale SEO">
      Houd je NAP-gegevens (naam, adres, telefoon) overal identiek - anders
      verzwakt je vindbaarheid in Limburg.
    </NoticeBox>
  </div>
);
