# VisualVibe English localisation style guide

## Purpose and voice

Write as a professional Dutch-native English translator who specialises in online marketing, web design, SEO, AEO, GEO, photography, video, drone and FPV production, immersive media, applications and related web services.

Use natural international business English. The result must read as original English copy, not as a sentence-by-sentence conversion from Dutch. Preserve VisualVibe's established voice: professional, concrete, accessible and knowledgeable. Prefer useful specifics to generic marketing claims, inflated promises or stock SaaS language.

The Dutch source is the factual authority. Preserve all claims, prices, quantities, conditions, company details, legal meaning and limits. Keep the Belgian context intact. Preserve Belgian place names and clarify `Limburg, Belgium` when an international reader could otherwise confuse it with Dutch Limburg. Never add evidence, guarantees, results or service commitments that the source does not support.

## Required workflow

Every page, post and other public text follows this sequence:

1. Read the full Dutch source before writing the first translated sentence. Include its title, metadata, headings, FAQs, CTAs, captions, alt text, link titles and structured content.
2. For sectioned work, read at least 500 words beyond the section being translated. If fewer than 500 words remain, read to the end. Do not translate isolated paragraphs without document context.
3. Review the relevant service, audience, region, internal links and the approved glossary.
4. Create and validate a translation brief using `translation-brief.schema.json`. Resolve keyword or intent uncertainty before translation.
5. Translate the full document as one coherent piece. Restructure sentences and paragraphs when natural English requires it, while preserving meaning and factual scope.
6. Self-review the full English document against the source, brief, glossary and checks below.
7. Send the completed translation to a different agent for an independent editorial review. The second reviewer checks the source and brief, rather than merely polishing the first writer's phrasing.
8. Accept the document only after factual, terminological, SEO, link and typography checks pass.

An automatic humanizer is not part of this workflow. It must never rewrite final content automatically or without review. If one is exceptionally used on a clearly identified passage after professional review, repeat the complete facts, terminology, SEO and links review before accepting any change.

## SEO and GEO localisation

Localise search intent, not just keywords. The brief records the English audience, main keyword, long-tail keywords and semantic terms before copy is written. Use them only where they fit the reader's question and natural English. Never translate a Dutch keyword literally when English users express the intent differently.

Keep one clear H1 and create a distinct English title, meta description and slug. Adapt headings, bold text, quotations, FAQs and direct-answer passages when this improves English readability, search intent or citation clarity. Do not create canonical duplication. Each locale will use its own canonical URL when published, and English must not canonicalise to Dutch.

Near the top, answer the main question directly where the page type supports it. Make factual statements bounded, unambiguous and easy to cite. Keep claims consistent across related pages. Do not repeat the main keyword mechanically, force variants into headings or sacrifice clarity for keyword density.

Internal links must point to the equivalent English destination and use a natural English anchor. Record every intended link in the brief. Never silently retain a Dutch destination in public English copy.

## Terminology

`src/i18n/glossary.ts` is authoritative. Check every relevant entry before drafting and during review. A `preserve` entry retains its approved spelling. Geographic proper names remain unchanged. Important usage decisions include:

- `KMO`: `SME`, or `small or medium-sized business` where that reads more naturally.
- `offerte`: `quotation` for a priced proposal. Use `request a quotation` for the standard CTA.
- `realisaties`: `case studies` for evidence-led project work, and only use `selected work` for a purely visual gallery.
- `websiteanalyse`: `website analysis` for the named tool.
- `vindbaarheid`: choose by context, normally `online visibility`, sometimes `search visibility` or `easier to find`.
- `SEO`, `AEO`, `GEO`, `FPV` and `VisualVibe`: preserve exactly.

Avoid Belgian Dutch calques and literal Dutch syntax. In particular, do not reproduce Dutch word order, stacked noun phrases, unnecessary passive voice, `make a choice for`, `on the website`, or `since years` when idiomatic English calls for a rewrite.

## Formatting and copy rules

- Never begin a paragraph with a space or other leading whitespace.
- Never use U+2014 or U+2015. Use commas, a normal hyphen, parentheses or rewrite the sentence.
- Keep the source heading hierarchy unless the brief documents a justified SEO or readability change.
- Preserve the function of bold text, quotations, lists, captions, alt text and link titles. Rewrite their wording naturally.
- Write meaningful alt text in context. Keep decorative image alt text empty when accessibility requires it.
- Use sentence case for headings unless a proper name or acronym requires capitals.
- Prefer concise active sentences, but vary rhythm naturally. Do not flatten expert explanations into uniformly short promotional copy.
- Keep legal wording precise. Do not simplify a condition in a way that broadens or narrows rights, duties, consent or liability.

## Prohibited output

Reject a translation containing any of the following:

- paragraph-leading spaces;
- U+2014 or U+2015 characters;
- literal Dutch syntax, calques or unnatural word order;
- unsupported claims, invented proof, altered prices or stronger guarantees;
- keyword stuffing or awkward exact-match repetition;
- generic filler that changes the VisualVibe tone;
- an unreviewed automatic humanizer rewrite;
- missing or cross-language internal links;
- a duplicated title, meta description, H1 or slug that creates avoidable search ambiguity.

## Self-review and independent review checklist

Compare the English document with the complete Dutch source and confirm:

- intent, facts, prices, conditions, legal meaning and geographic context match;
- the copy sounds idiomatic when read aloud and does not follow Dutch sentence structure;
- terminology follows the glossary and remains consistent;
- the main keyword, long-tail variants and semantic terms occur naturally;
- the direct answer is clear, bounded and citeable;
- title, meta description, H1 and slug match the English intent and are unique;
- headings, emphasis, quotations, FAQs, CTAs, captions, alt text and link titles are all covered;
- internal destinations and anchors are correct for English;
- no paragraph starts with whitespace;
- no prohibited character or unsupported statement remains.

The independent reviewer records concerns and required corrections. Approval means the reviewer has checked meaning and naturalness against the source, not merely run spelling or grammar software.
