# Independent review: English knowledge-base canonical relations

Date: 2026-07-18

## Scope

Independent review of commit `bd398af` after validating the complete English knowledge base as if English content were enabled. The production locale configuration itself remains unchanged: English is disabled.

## Root cause and correction

The English MDX frontmatter mixed public localized URLs, Dutch source slugs and canonical identity paths in validator-owned relation fields. This produced 673 validation findings when English content was included:

- 225 missing related posts
- 172 missing related services
- 109 missing related regions
- 100 missing related sectors
- 41 cross-locale links
- 26 invalid pillar relations

The correction is source-only. Canonical identity paths are now used for frontmatter relations, while visible links use valid English public routes. No runtime normalization or fallback was introduced.

## Independent checks

- Regression suite: 32 tests passed across knowledge-base translations, glossary and locale audit.
- TypeScript typecheck passed.
- Locale audit passed with 0 issues and 0 blocking findings.
- Production build passed with exit code 0 and generated 199 static pages.
- Build output contains Dutch public pages only; no English pages are published.
- Content inventory is exact: 58 Dutch MDX sources, 58 English MDX translations and 58 translation briefs.
- No legacy `/en/knowledge-base`, `/en/services`, `/en/regions` or `/en/sectors` routes remain in the English knowledge-base content or briefs.
- No misspelled `relatedsectors` fields remain.
- No en dash or em dash characters remain in the reviewed English content and briefs.
- `git diff --check` passed.
- Representative word-level diff inspection confirmed route and relationship corrections without unrelated prose rewriting.

## Verdict

The canonical-relation correction is clean and suitable to retain. The English knowledge base now validates without the previously hidden 673 findings, while English remains safely disabled for production until the planned publication gate is approved.
