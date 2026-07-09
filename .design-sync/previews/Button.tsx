import { Button } from "nova";

export const Variants = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 24 }}>
    <Button variant="default">Offerte aanvragen</Button>
    <Button variant="secondary">Meer info</Button>
    <Button variant="outline">Bekijk ons werk</Button>
    <Button variant="ghost">Annuleren</Button>
    <Button variant="destructive">Verwijderen</Button>
    <Button variant="link">Lees meer</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24 }}>
    <Button size="sm">Klein</Button>
    <Button size="default">Standaard</Button>
    <Button size="lg">Groot</Button>
  </div>
);

export const Disabled = () => (
  <div style={{ display: "flex", gap: 12, padding: 24 }}>
    <Button disabled>Niet beschikbaar</Button>
    <Button variant="outline" disabled>
      Uitgeschakeld
    </Button>
  </div>
);
