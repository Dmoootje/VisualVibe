# Altijd een nieuwe volledige websiteanalyse

## Context

VisualVibe bevat sinds PR #14 de uitgebreide rapportcomponenten en de geheime partner-API-koppeling. Productiegegevens tonen echter dat nieuwe aanvragen voor `visualvibe.media` nog steeds als `reused_recent` worden afgerond. De bronanalyse is een ouder compact rapport zonder `reportId`. Daardoor wordt geen nieuwe partneranalyse gestart, ontstaat geen document in `analysis_reports` en toont de rapportpagina terecht de oude fallback.

## Besluit

VisualVibe hergebruikt nooit een eerdere websiteanalyse. Iedere toegestane en geverifieerde aanvraag start een nieuwe analyse via de geheime partner-API met `resultMode: "extended"`.

De bestaande quota blijven actief:

- maximaal 3 gratis analyses per e-mailadres per 90 dagen;
- maximaal 3 gratis analyses per apparaat per 90 dagen;
- bestaande IP-limieten blijven behouden;
- bescherming tegen een identieke aanvraag duurt 2 minuten.

Na die 2 minuten kan een klant opnieuw testen, zolang het e-mail-, apparaat- en IP-quotum dit toestaat.

## Gedragswijzigingen

### Geen rapporthergebruik

De quotalaag zoekt niet langer naar recente afgeronde leads voor hetzelfde domein. Zij retourneert voor nieuwe aanvragen nooit meer `reused_recent`.

Historische leads met `analysisStatus: "reused"` en historische API-responses blijven leesbaar. Dit is alleen achterwaartse compatibiliteit; nieuwe aanvragen krijgen deze status niet meer.

### Domeincooldown verwijderen

`domainCooldownDays` verdwijnt uit het actieve quotacontract en uit het beheerformulier. Een bestaand veld in Firestore mag blijven staan, maar wordt niet meer gelezen. Er is geen destructieve datamigratie nodig.

### Duplicaatvenster van 2 minuten

De standaardwaarde van `duplicateWindowMinutes` wordt 2. De productie-instelling wordt bij de uitrol eveneens op 2 gezet, omdat een reeds opgeslagen waarde voorrang heeft op de standaardwaarde.

Het duplicaatvenster voorkomt dubbelklikken en gelijktijdige dubbele betalende scans. Het is geen rapportcache en levert nooit een oud rapport terug.

## Nieuwe gegevensstroom

1. De klant dient een URL en contactgegevens in.
2. De klant bevestigt de e-mailcode.
3. VisualVibe controleert IP-, duplicaat-, e-mail- en apparaatquota.
4. Bij toelating reserveert VisualVibe een analysetegoed.
5. VisualVibe start altijd een nieuwe HMAC-ondertekende partneranalyse.
6. SEO Supercharged levert het uitgebreide resultaat.
7. VisualVibe valideert en bewaart een nieuw document in `analysis_reports`.
8. De nieuwe lead krijgt een nieuw `reportId` en een nieuw willekeurig rapporttoken.
9. De rapportpagina rendert alle uitgebreide rapportsecties.

## Fouten en veiligheid

- Een aanvraag binnen 2 minuten krijgt de bestaande duplicaatmelding en start geen scan.
- Een quotaoverschrijding start geen scan en levert geen oud rapport terug.
- Een mislukte partneranalyse geeft de reservering vrij volgens de bestaande logica.
- Private sleutels blijven uitsluitend server-side.
- Widgetmodus en de publieke teaser-API wijzigen niet.
- SEO Supercharged hoeft voor deze correctie niet te worden aangepast.

## Teststrategie

Een regressietest bouwt een quotatransactie met een recente succesvolle domeinentry en een oude afgeronde lead. De verwachte uitkomst is een nieuwe reservering met `decision: "allowed"`, niet `reused_recent`.

Aanvullend worden gecontroleerd:

- het duplicaatvenster gebruikt 2 minuten;
- actieve types en beheerinterface bevatten geen domeincooldown meer;
- de bestaande volledige rapporttests blijven groen;
- TypeScript, lint en productiebuild slagen;
- de volledige route blijft een nieuw `reportId` opslaan.

## Acceptatiecriteria

- Geen nieuwe codepad retourneert `reused_recent`.
- Een recente oude teaser verhindert geen nieuwe uitgebreide analyse.
- Een recente volledige analyse wordt evenmin hergebruikt.
- Twee minuten na een eerdere aanvraag kan een nieuwe scan starten wanneer de overige quota dit toelaten.
- Iedere succesvolle nieuwe scan maakt een nieuw rapportdocument en koppelt dat via `reportId`.
- Historische rapportlinks blijven openen.
- De uitgebreide VisualVibe-layout blijft ongewijzigd en verschijnt zodra het nieuwe rapport is opgeslagen.

## Uitrol

1. Merge en deploy de VisualVibe-wijziging.
2. Zet `duplicateWindowMinutes` in `analysis_settings/default` op 2.
3. Start een nieuwe scan voor `visualvibe.media`.
4. Controleer dat de nieuwe lead geen `reusedFromId` heeft, wel een `reportId` heeft en dat `analysis_reports` een nieuw document bevat.
5. Open het rapport en controleer de volledige secties.

## Rollback

De codewijziging kan zonder datamigratie worden teruggedraaid. Historische velden blijven in Firestore aanwezig. Een rollback herstelt de oude hergebruiklogica alleen wanneer dat bewust gewenst is.
