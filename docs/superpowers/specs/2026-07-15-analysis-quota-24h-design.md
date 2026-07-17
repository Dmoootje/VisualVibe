# Websiteanalysequota per 24 uur

## Context

De huidige websiteanalyse telt succesvolle analyses per e-mailadres en toestel over 90 dagen. Het toestel wordt herkend via de ondertekende first-party cookie `vv_device`. Daardoor delen verschillende e-mailadressen in dezelfde browser hetzelfde toestelquotum en blijft dat quotum nu 90 dagen geblokkeerd.

De huidige limietpagina verbergt bovendien de concrete quotareden en het resetmoment. Zij toont alleen een algemene melding en verwijst naar VisualVibe-contactpagina's. De gewenste regeling is een kort, voorspelbaar gratis tegoed met een duidelijke vervolgstap naar SEO Supercharged.

## Besluit

VisualVibe gebruikt voortschrijdende tijdvensters. Er is geen reset om middernacht. Iedere tellende gebeurtenis vervalt exact 24 uur of 30 dagen na haar eigen tijdstip.

De limieten worden:

- maximaal 3 succesvol afgeronde analyses per geverifieerd e-mailadres per 24 uur;
- maximaal 3 succesvol afgeronde analyses per toestel per 24 uur;
- maximaal 12 analyseaanvragen per IP-adres per 24 uur;
- maximaal 180 analyseaanvragen per IP-adres per 30 dagen.

Iedere toegestane aanvraag start nog steeds een volledig nieuwe analyse. Eerdere rapporten worden niet hergebruikt.

## Betekenis van de tellers

### E-mailadres en toestel

Een e-mailadres en toestel verbruiken een tegoed wanneer de analyse succesvol is afgerond. Een actieve reservering telt tijdelijk mee om gelijktijdige aanvragen niet boven de limiet te laten komen. Een mislukte analyse geeft de reservering vrij en verbruikt geen tegoed.

Toegekende extra credits op een e-mailadres blijven bestaan en blijven bovenop het standaardtegoed werken. Het toestelquotum kan niet met een extra e-mail of extra credit worden omzeild.

### IP-adres

Een IP-aanvraag wordt eenmalig geteld wanneer de geldige startaanvraag wordt geaccepteerd. Dezelfde aanvraag wordt bij verificatie en voltooiing niet opnieuw geteld. Dit voorkomt dat een geslaagde scan onbedoeld twee IP-tegoeden verbruikt.

De IP-controle gebeurt atomisch voor het versturen van de verificatiecode. Een aanvraag boven de limiet start geen lead, verstuurt geen code en start geen betaalde partnerscan.

IP-adressen, e-mailadressen en toestel-ID's worden voor de quota uitsluitend als HMAC-hash opgeslagen. De bestaande privacybescherming blijft behouden.

## Exact resetmoment

Iedere limietuitkomst bevat een ISO-tijdstip `resetsAt` en de specifieke `quotaDecision`.

Het resetmoment is het eerste tijdstip waarop alle blokkerende tellers opnieuw ruimte hebben. Wanneer zowel een dagelijks als een maandelijks IP-quotum blokkeert, wordt dus niet ten onrechte alleen het vroegere dagelijkse resetmoment getoond.

Voor actieve reserveringen wordt een conservatief resetmoment gebruikt alsof de analyse succesvol wordt. Wanneer een reservering mislukt en eerder vrijkomt, kan de bezoeker eerder opnieuw testen.

Een lead die al als `limit_reached` is opgeslagen, bewaart ook `quotaResetAt`. Een herhaald verzoek voor diezelfde lead geeft daardoor dezelfde concrete melding terug in plaats van de oude algemene tekst.

## Publieke melding

De client bewaart bij de limietstatus:

- de gebruikersmelding;
- het resetmoment;
- het type limiet.

Datum en tijd worden in het Nederlands en in de tijdzone `Europe/Brussels` getoond.

Bij een bereikt e-mail- of toestelquotum wordt de kerntekst:

> Je hebt je 3 gratis analyses gebruikt. Je tegoed wordt automatisch vernieuwd op [datum] om [tijd]. Daarna krijg je opnieuw 3 gratis analyses.

Bij een IP-limiet benoemt de tekst de netwerkbeveiliging en het correcte resetmoment. Zij belooft daar niet automatisch drie nieuwe tests wanneer het 30-dagenquotum nog blokkeert.

Het limietblok blijft in VisualVibe-stijl: donkere kaart, subtiele oranje rand, oranje icoon en duidelijke witte tekst. De bestaande groene scorekleuren van rapporten wijzigen niet.

## SEO Supercharged CTA

Onder de resetmelding komt een apart blok met de titel `Meer testpower nodig?`.

Het blok bevat twee acties:

1. `Open de Page Analyzer` naar `https://seowebsites.be/nl/seo-website-analyse` voor een losse pagina-analyse.
2. `Start een complete site-audit` naar `https://seowebsites.be/AIGEOprofiler/` voor de onboarder en volledige website-audit.

Beide gecontroleerde bestemmingen zijn bereikbaar. Externe links openen in een nieuw tabblad met `noopener noreferrer`. Op mobiel staan de knoppen onder elkaar en over de volledige breedte. Op grotere schermen mogen zij naast elkaar staan.

De huidige algemene knoppen `Resultaten bespreken` en `Offerte aanvragen` worden in deze specifieke limietstatus vervangen door de gerichtere SEO Supercharged-acties.

## Configuratie en compatibiliteit

Het actieve configuratiecontract gebruikt voortaan de veldnamen:

- `maxPerEmail24h`;
- `maxPerDevice24h`;
- `maxPerIp24h`;
- `maxPerIp30d`.

De standaardwaarden zijn respectievelijk 3, 3, 12 en 180. Het beheerformulier en de validatiefouten noemen dezelfde tijdvensters.

De oude Firestore-velden `maxPerEmail90d` en `maxPerDevice90d` worden niet meer gelezen. Tijdens de productie-uitrol worden de nieuwe velden expliciet opgeslagen en worden de twee verouderde velden verwijderd. Zo kan een oude waarde nooit opnieuw 90-dagengedrag activeren.

## Eenmalige volledige quotareset

Na de uitrol worden alle documenten uit deze twee technische collecties verwijderd:

- `analysis_quota`;
- `analysis_reservations`.

Dit maakt de huidige testmelding voor alle bezoekers leeg, zoals goedgekeurd. De volgende aanvraag begint met nieuwe tellers volgens de nieuwe vensters.

De reset verwijdert of wijzigt geen:

- leads;
- verificatiegeschiedenis;
- analyserapporten;
- rapportlinks;
- integratie-instellingen.

## Gegevensstroom

1. De bezoeker vult URL en contactgegevens in.
2. VisualVibe controleert het voortschrijdende IP-quotum en registreert exact een aanvraag.
3. Bij toelating maakt VisualVibe de lead en verificatiecode aan.
4. De bezoeker bevestigt de code.
5. VisualVibe controleert het e-mail-, toestel- en duplicaatquotum.
6. Bij toelating reserveert VisualVibe een analysetegoed en start een nieuwe partnerscan.
7. Een succes zet de reservering om in een tellende analyse; een fout geeft haar vrij.
8. Een blokkering retourneert reden en resetmoment aan de client.
9. De client toont de resetinformatie en de twee SEO Supercharged-acties.

## Fouten en veiligheid

- Firestore-transacties blijven gelijktijdige overschrijdingen voorkomen.
- Een quotacontrole die technisch niet kan worden uitgevoerd, mag niet stil als onbeperkte toegang worden behandeld.
- Een mislukte partnerscan verbruikt geen e-mail- of toesteltest.
- Het duplicaatvenster van 2 minuten blijft alleen bescherming tegen dubbelklikken.
- Private integratiesleutels blijven uitsluitend server-side.
- De globale quotareset is een eenmalige, expliciete uitrolhandeling en geen publiek endpoint.

## Teststrategie

De wijziging wordt test-first uitgevoerd. Minimaal worden regressietests toegevoegd voor:

- drie successen per e-mailadres binnen 24 uur zijn toegestaan, de volgende aanvraag wordt geblokkeerd;
- drie successen per toestel met verschillende e-mailadressen delen hetzelfde toestelquotum;
- een succes ouder dan exact 24 uur telt niet meer mee;
- een mislukte reservering geeft het tegoed vrij;
- de IP-teller telt een startaanvraag eenmaal en geen tweede keer bij voltooiing;
- aanvraag 12 is toegestaan en aanvraag 13 binnen 24 uur wordt geblokkeerd;
- aanvraag 180 is toegestaan en aanvraag 181 binnen 30 dagen wordt geblokkeerd;
- wanneer meerdere IP-vensters blokkeren, wijst `resetsAt` naar het eerste werkelijk bruikbare moment;
- de API bewaart en retourneert `quotaDecision` en `resetsAt`;
- de client toont het Belgische resetuur en beide exacte externe links;
- het beheerformulier gebruikt de nieuwe veldnamen en standaardwaarden;
- oude 90-dagenvelden hebben geen invloed meer.

Daarnaast moeten de volledige testset, TypeScript, lint en productiebuild slagen.

## Acceptatiecriteria

- Een klant kan na 24 uur opnieuw drie analyses uitvoeren met hetzelfde e-mailadres en toestel.
- Verschillende e-mailadressen omzeilen het toestelquotum niet.
- Een IP-adres kan maximaal 12 aanvragen per 24 uur en 180 per 30 dagen registreren.
- Een IP-aanvraag wordt niet dubbel geteld.
- Iedere limietmelding toont een waarheidsgetrouw resetmoment.
- De e-mail- en toestellimiet vermeldt dat daarna opnieuw drie gratis analyses beschikbaar zijn.
- De limietstatus bevat de Page Analyzer en complete site-audit CTA.
- Bestaande analyses, leads en rapportlinks blijven intact.
- Alle oude quotatellers en open reserveringen zijn na de productie-uitrol leeggemaakt.

## Uitrol

1. Merge en deploy de VisualVibe-code.
2. Schrijf 3, 3, 12 en 180 naar de nieuwe productievelden en verwijder de oude 90-dagenvelden.
3. Verwijder alle documenten uit `analysis_quota` en `analysis_reservations`.
4. Start drie nieuwe tests vanaf hetzelfde toestel en controleer dat zij alle drie slagen.
5. Controleer dat de volgende test wordt geblokkeerd met het juiste Belgische resetuur.
6. Controleer beide SEO Supercharged-links.
7. Controleer in Firestore dat leads en rapporten niet door de reset zijn verwijderd.

## Rollback

De code kan zonder wijziging aan bestaande rapporten worden teruggedraaid. De eenmalig verwijderde quotageschiedenis wordt niet hersteld, wat alleen betekent dat bezoekers tijdelijk opnieuw met lege tellers beginnen. De oude 90-dagenvelden worden niet automatisch teruggezet.
