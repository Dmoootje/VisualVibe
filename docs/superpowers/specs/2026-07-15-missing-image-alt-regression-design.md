# Missing Image Alt Regression Design

## Doel

Verwijder de 78 nieuwe meldingen uit de VisualVibe-crawl zonder auteursfoto's of realisatiebeelden te verwijderen en zonder layoutwijzigingen.

## Vastgestelde oorzaak

De CSV bevat 78 regels op 75 bronpagina's, maar slechts vijf unieke afbeeldingen:

- 74 meldingen verwijzen naar dezelfde auteursfoto. Drie gedeelde kaartcomponenten renderen die foto met `alt=""`, hoewel de auteursnaam beschikbaar is.
- Vier meldingen op `/be/realisaties/` komen uit `RealisatieContextGrid`. De projectspecifieke beschrijving bestaat al als `item.image.alt`, maar de component vervangt die door `alt=""`.

De live HTML reproduceert beide problemen. De eerder gecorrigeerde kennisbank- en realisatiecomponenten behouden hun relevante altteksten en vallen buiten deze wijziging.

## Ontwerp

De auteursfoto blijft zichtbaar. Elke betrokken auteursfoto krijgt `Profielfoto van ${author}`. De bestaande auteursnaam blijft de databron, zodat er geen hardcoded naam of bestandsnaam nodig is.

De vier contextbeelden gebruiken rechtstreeks `item.image.alt`. Deze waarde komt uit de bestaande realisatiedata en beschrijft het getoonde projectbeeld.

De wijziging raakt uitsluitend:

- `AuthorMeta` in `ServiceRelatedPosts.tsx`
- `BlogCard.tsx`
- `RelatedArticles.tsx`
- `RealisatieContextGrid.tsx`

Er veranderen geen afbeeldingen, routes, teksten, stijlen, afmetingen, laadinstellingen of Firestore-gegevens.

## Toegankelijkheid

De auteursfoto behoudt `aria-hidden="true"`, omdat de zichtbare auteursnaam dezelfde persoon direct naast de foto noemt. Zo voorkomt de toegankelijke naam dubbele voorlezing, terwijl de HTML en crawlers wel een relevante alttekst ontvangen.

De realisatiebeelden zijn inhoudelijke voorbeelden en krijgen daarom hun bestaande beschrijving als alttekst.

## Teststrategie

Voor elke foutcategorie wordt eerst een regressietest toegevoegd en rood uitgevoerd:

- `AuthorMeta` moet de auteursnaam in de alttekst renderen.
- De overige twee auteurskaartvarianten mogen geen lege alt op de auteursfoto renderen.
- `RealisatieContextGrid` moet `item.image.alt` doorgeven.

Daarna worden alleen de minimale productieaanpassingen gedaan. Afrondende verificatie omvat de gerichte tests, alle tests, TypeScript, lint, production build en een scan op verboden Unicode-tekens.

## Acceptatiecriteria

- Geen van de drie gedeelde auteurskaartvarianten rendert nog een lege alt voor een aanwezige auteursfoto.
- Elke auteursfoto gebruikt de vorm `Profielfoto van [auteursnaam]`.
- De vier contextbeelden op `/be/realisaties/` gebruiken hun bestaande projectspecifieke alttekst.
- Alle afbeeldingen en de huidige layout blijven behouden.
- Alle verificaties slagen.
