# In-app e-mailclient (admin)

Volwaardige e-mailclient in het administratorgedeelte: `/admin/email`. Gebouwd
bovenop de bestaande e-mailinfrastructuur (imapflow, mailparser, nodemailer,
AES-GCM-secrets via `APP_ENCRYPTION_KEY`, Firestore, Firebase Storage) met
volledige multi-mailboxondersteuning. De bestaande website-SMTP en de
leadcommunicatie (mail_history, AI-concepten, lead-reply) zijn onaangeroerd.

## Architectuur in het kort

- **Mailboxaccounts** (`email_mailboxes`): volledige accounts met eigen IMAP en
  SMTP, kleur, handtekening, templatevoorkeuren en mapmapping. De bestaande
  configuratie uit `email_settings` wordt bij het eerste gebruik automatisch en
  idempotent gemigreerd naar het account `primary` (versleutelde wachtwoorden
  worden 1-op-1 overgenomen; `email_settings` zelf blijft ongewijzigd de
  website-mails versturen).
- **Sync**: `syncMailboxAccount()` detecteert systeemmappen (SPECIAL-USE +
  naamherkenning, handmatige mapping wint), importeert nieuwe berichten per map
  op basis van een UID-cursor per map (UIDVALIDITY-bewust), en reconcilieert
  gelezen/ster/beantwoord-flags voor een recent UID-venster. Eén kapotte map of
  bericht blokkeert de rest niet. Een syncclaim (max 1 tegelijk, 3 min timeout)
  voorkomt dubbele zware syncs.
- **Berichten** (`email_messages`): alleen metadata + gesanitizede HTML/tekst
  (gecapt), nooit bijlagen. Document-id is een hash van mailbox + Message-ID,
  waardoor de Sent-append en servermoves nooit duplicaten opleveren.
- **Threads** (`email_threads`): per mailbox bepaald via In-Reply-To/References,
  met fallback op genormaliseerd onderwerp + overlappende deelnemers.
  Gesprekken uit verschillende mailboxen worden nooit samengevoegd.
- **Verzenden**: altijd via de outbox (`email_outbox`). Verzenden gebeurt via de
  SMTP van de gekozen mailbox (geen stille fallback naar de website-SMTP), de
  kopie gaat via IMAP APPEND naar de Verzonden-map van de server (zelfde
  Message-ID; volgende sync dedupet), en het bericht verschijnt lokaal in
  Verzonden + de juiste thread. Mislukte verzendingen blijven met fout,
  pogingenteller en tijdstip in de Outbox staan (opnieuw proberen / bewerken /
  annuleren / verwijderen).
- **Veiligheid van inhoud**: alle inkomende HTML wordt server-side gesanitized
  (`sanitize-html`: geen scripts, event handlers, formulieren, iframes; alleen
  veilige URL-schema's en een stijl-whitelist) en daarna gerenderd in een
  sandboxed iframe zonder scriptrechten. Externe afbeeldingen zijn standaard
  geblokkeerd met een "Afbeeldingen tonen"-knop; links openen met
  `rel="noopener noreferrer"` in een nieuw tabblad.

## Toegevoegde bestanden

| Bestand | Rol |
| --- | --- |
| `src/types/emailClient.ts` | Alle datamodellen (mailbox, message, thread, label, draft, outbox, notitie) + helpers |
| `src/lib/firestore/emailMailboxes.ts` | CRUD + migratie + syncclaim voor mailboxaccounts |
| `src/lib/firestore/emailClientStore.ts` | Berichten/threads/labels/concepten/outbox/notities + lijstquery's, zoeken, tellers |
| `src/lib/email/mailboxImap.ts` | IMAP-engine: mapdetectie, sync, flags, move, delete, append, bijlagedownload |
| `src/lib/email/mailboxSmtp.ts` | SMTP per mailbox (hergebruikt `sendSmtpMail`) + MIME-opbouw voor Sent-kopie |
| `src/lib/email/sanitizeEmailHtml.ts` | HTML-sanitization + html-naar-tekst + snippets |
| `src/lib/email/composeRender.ts` | Rendering uitgaande mail: header/footer/handtekening/citaat |
| `src/lib/admin/emailClientActions.ts` | Server actions van de client (lijst, thread, flags, labels, verplaatsen, verzenden, outbox, notities, contacten, sync) |
| `src/lib/admin/mailboxAccountActions.ts` | Server actions accountbeheer (opslaan, testen, mappen, verwijderen, standaard, pauzeren) |
| `src/app/api/admin/email/attachment/route.ts` | Beveiligde bijlage-download/preview + .eml-download |
| `src/app/api/admin/email/upload/route.ts` | Upload uitgaande bijlagen naar Storage |
| `src/app/api/cron/email-sync/route.ts` | Optioneel cron-endpoint voor periodieke sync |
| `src/app/admin/(protected)/email/[[...slug]]/page.tsx` | Route van de e-mailclient |
| `src/app/admin/(protected)/email/accounts/page.tsx` | Route mailboxaccountbeheer |
| `src/components/admin/email/EmailClientApp.tsx` | Hoofdcomponent (state, weergaven, dialogen, outbox/concepten) |
| `src/components/admin/email/EmailSidebar.tsx` | Mappen, mailboxen, labels (+ labelbeheer) |
| `src/components/admin/email/EmailList.tsx` | Werkbalk + berichtenlijst + hoveracties + infinite scroll |
| `src/components/admin/email/EmailViewer.tsx` | Thread/detail, sandboxed HTML-frame, bijlagen, contactpaneel, notities |
| `src/components/admin/email/EmailComposer.tsx` | Composevenster (Van, Aan/CC/BCC, bijlagen, autosave) |
| `src/components/admin/email/RichTextEditor.tsx` | TipTap-editor |
| `src/components/admin/email/MailboxAccountsManager.tsx` | Accountbeheer-UI (formulier, tests, mapmapping, verwijderen) |
| `src/components/admin/email/emailClientUi.ts` | Client-side helpers (routes, datums, filters, afbeeldingblokkering) |

## Aangepaste bestanden

- `src/types/email.ts`: `SmtpMailMessage` uitgebreid met optionele `attachments`
  (backwards compatible).
- `src/lib/email/smtp.ts`: `sendSmtpMail` geeft bijlagen door aan nodemailer.
- `src/components/admin/AdminSidebar.tsx`: hoofdonderdeel "E-mail" toegevoegd.
- `src/app/admin/(protected)/settings/email/page.tsx`: duidelijke scheiding
  Website-SMTP vs. Mailboxaccounts + link.
- `firestore.indexes.json`: 9 nieuwe composite-indexen (zie hieronder).
- `package.json`: `@tiptap/react`, `@tiptap/starter-kit`,
  `@tiptap/extension-text-align`, `@tiptap/extension-text-style`,
  `sanitize-html` (+ `@types/sanitize-html`).
- `content/kennisbank/og-afbeelding-maken-veilige-zone-whatsapp-facebook-linkedin.mdx`:
  bestaande contentvalidatiefouten hersteld die de productiebuild al braken
  (ongeldig `searchIntent.type` en een niet-canonieke `relatedRegions`-entry);
  los van de e-mailclient.

## Routes

- `/admin/email` (= Postvak IN), `/admin/email/inbox|starred|sent|drafts|outbox|all|spam|trash|archive`
- `/admin/email/label/:labelId`, `/admin/email/thread/:threadId` (deep-link)
- `/admin/email/accounts` (mailboxaccountbeheer)
- API: `GET /api/admin/email/attachment?messageId=&index=&mode=attachment|inline|eml`,
  `POST /api/admin/email/upload`, `POST /api/cron/email-sync`

## Firestore-collecties

| Collectie | Inhoud |
| --- | --- |
| `email_mailboxes` | Mailboxaccounts (credentials alleen als AES-GCM-envelop) |
| `email_messages` | Gesynchroniseerde en verzonden berichten (zonder bijlage-inhoud) |
| `email_threads` | Threadaggregaten (aantallen, deelnemers, verwerkingsstatus) |
| `email_labels` | Interne labels (naam, kleur, verborgen, volgorde) |
| `email_drafts` | Concepten (editor-HTML, ontvangers, bijlagereferenties) |
| `email_outbox` | Verzendwachtrij met status/pogingen/fouten |
| `email_thread_notes` | Interne notities per gesprek |

### Indexen (BELANGRIJK: deployen!)

`firestore.indexes.json` bevat nieuwe composite-indexen voor `email_messages`
(folder+dateKey, mailboxId+folder+dateKey, isStarred+dateKey,
mailboxId+isStarred+dateKey, labelIds CONTAINS+dateKey, threadId+dateKey asc en
desc, mailboxId+remoteFolderPath+remoteUid) en `email_thread_notes`
(threadId+createdAt). Zonder deploy geven de lijstweergaven 500-fouten:

```
firebase deploy --only firestore:indexes
```

## Hoe de onderdelen werken

- **IMAP-mapmapping**: automatisch via SPECIAL-USE (`\Sent`, `\Junk`, `\Trash`,
  `\Archive`) met fallback op bekende namen (Sent Items, INBOX.Sent, Deleted
  Items, Junk, ...). Handmatig aanpasbaar per mailbox via "Mappen" in het
  accountoverzicht. Mapnamen zijn nergens hardcoded in acties; verplaatsen
  gebruikt de mapping en maakt desnoods een Archive-map aan.
- **Threads**: `resolveThreadId()` zoekt binnen de mailbox eerst op
  Message-ID's uit In-Reply-To/References, daarna op genormaliseerd onderwerp
  (RE:/FW:-prefixen gestript) + deelnemersoverlap. Antwoorden versturen de
  juiste `In-Reply-To`/`References`-headers zodat ze ook bij de ontvanger in
  dezelfde conversatie blijven.
- **Concepten**: automatisch opgeslagen met 3s-debounce (nooit per
  toetsaanslag), handmatig op te slaan, heropenen vanuit Concepten, en na
  verzending automatisch opgeruimd. Sluiten van de composer bewaart het concept.
- **Outbox**: elk bericht wordt eerst als outbox-item aangemaakt en atomair
  geclaimd (queued -> sending -> sent/failed). Mislukt = zichtbaar met
  begrijpelijke fout, "Opnieuw proberen", "Bewerken" (terug naar concept,
  originele editorinhoud blijft bewaard), "Annuleren" en "Verwijderen". Geen
  automatische fallback naar een andere SMTP.
- **Bijlagen**: inkomend worden alleen metadata opgeslagen; downloaden/preview
  haalt de bijlage on demand van de IMAP-server (route dwingt veilige
  content-types af, nosniff + CSP-sandbox). Uitgaand gaan bestanden naar
  Firebase Storage onder `email-client/outgoing/...` (max 15 MB per bestand,
  25 MB totaal, uitvoerbare types geweigerd). Bij doorsturen worden originele
  bijlagen pas bij verzending van de server gehaald.
- **Header/footer**: hergebruikt letterlijk `email_settings.branding`
  (Opmaak-tab, met logo-email.png en `{{currentYear}}`). Keuze per bericht:
  header+footer, alleen footer, of geen template (alleen handtekening).
  Standaard: nieuw bericht = header+footer, antwoord = alleen handtekening
  (instelbaar per mailbox), zodat de header niet midden in een conversatie
  terugkeert.
- **Handtekening**: per mailbox eigen HTML, anders de algemene
  VisualVibe-handtekening uit de bestaande automation-instellingen.
- **Labels**: puur intern (los van IMAP-mappen, visueel gescheiden in de
  zijbalk). Aanmaken/hernoemen/kleur/verbergen/verwijderen + bulk toewijzen.
- **Contactkoppeling**: afzenderadres wordt bij sync gematcht op `leads.email`;
  het contactpaneel toont naam/bedrijf/telefoon/status + link naar de lead en
  eerdere gesprekken. "Contact aanmaken" maakt idempotent een lead aan
  (formType `contact`) zonder duplicaten.
- **Zoeken**: server-side. Eenvoudige weergaven gebruiken directe indexquery's;
  tekstzoeken en extra filters scannen een begrensd recent venster (max ~800
  berichten per pagina-aanvraag) over onderwerp/afzender/deelnemers/snippet/
  bijlagenamen. De UI meldt het expliciet wanneer alleen recente berichten
  doorzocht werden. Volledige bodies gaan nooit naar de browser voor zoeken.
- **Performance**: lijst levert snippets zonder bodies, cursor-paginering (50
  per pagina, infinite scroll), volledige inhoud pas bij openen, optimistische
  updates met herstel bij fouten, verouderde zoekrequests worden genegeerd.
- **Synchronisatie**: handmatige knop in de werkbalk en per account;
  statusregel toont per mailbox laatste sync/fout. Optioneel periodiek:
  `POST /api/cron/email-sync` met header `Authorization: Bearer
  $EMAIL_SYNC_CRON_SECRET` (endpoint is uit zolang het secret niet bestaat).
- **Rechten**: alle acties controleren de adminsessie server-side
  (`getCurrentAdmin`). Per mailbox bestaat het veld `allowedAdminEmails`
  (leeg = alle admins); alle server actions en API-routes dwingen dit af. Er is
  in de app maar één rol (admin), dus er is bewust geen aparte rechten-UI.

## Environmentvariabelen

- Bestaand en vereist: `APP_ENCRYPTION_KEY` (nooit wijzigen; versleutelt ook de
  mailboxwachtwoorden), Firebase Admin-credentials, `ADMIN_EMAILS`.
- Nieuw en optioneel: `EMAIL_SYNC_CRON_SECRET` (activeert het cron-endpoint).

## Wat al volledig werkt vs. externe afhankelijkheden

Volledig werkend zodra een mailboxaccount is geconfigureerd: mappen, sync,
lezen (veilig), zoeken/filteren, labels, ster/gelezen (incl. IMAP-sync van
flags), archiveren/spam/prullenbak/herstellen/definitief verwijderen,
opstellen/antwoorden/allen beantwoorden/doorsturen, concepten, outbox,
bijlagen, contactkoppeling, notities, verwerkingsstatus, multi-mailbox,
gecombineerde inbox, responsive UI.

Afhankelijk van externe configuratie:

1. **Firestore-indexen deployen** (zie boven) - verplicht.
2. Mailboxaccount(s) met werkende IMAP/SMTP-credentials aanmaken via
   `/admin/email/accounts` (of de automatische migratie van de bestaande
   verbinding gebruiken).
3. Optioneel: externe cron op `/api/cron/email-sync` + `EMAIL_SYNC_CRON_SECRET`.

## Tests en kwaliteitscontroles

Het project heeft geen testrunner (geen jest/vitest geconfigureerd; scripts:
dev/build/start/lint). Uitgevoerd en geslaagd:

- `npx tsc --noEmit` (typecheck)
- `npm run lint` (0 errors; alleen bestaande warnings)
- `npm run build` (productiebuild)

De bestaande leadcommunicatie is niet gewijzigd: `leadEmailActions.ts`,
`imap.ts` (lead-sync), `templates.ts` en `mailHistory.ts` zijn intact;
`smtp.ts`/`types/email.ts` kregen alleen een optioneel bijlageveld.
