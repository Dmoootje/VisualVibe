# Task 11 Firestore localisation review

Independently reviewed against the implementation plan and approved after adding an array-merge regression test.

- Legacy scalar and structured values remain Dutch-only.
- Localized maps resolve only the requested locale; missing English fails closed without Dutch fallback.
- Dutch admin edits preserve existing English, French and German map entries.
- Ordered array writes preserve localized visitor fields by stable record identity, including nested gallery captions.
- Optional Dutch clearing stores `null` without erasing other locales.
- Existing collection and document paths remain unchanged; no migration is run.
- `webdesignImages` remains locale-neutral URL storage; localized image text belongs to project records.
- Public readers pass locale where Firestore-owned visitor copy is rendered.
