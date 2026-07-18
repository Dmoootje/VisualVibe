# Open Graph image guide English localisation review

## Scope and outcome

Reviewed the complete Dutch source, English translation and localisation brief. Approved after editorial and route corrections.

## Parity and editorial quality

- Source: 4,673 words; translation: 4,614 words.
- All 20 H2 sections are preserved.
- Component parity is complete: 1 LeadIntro, 2 QuoteBlocks, 3 FeatureGrids, 2 NoticeBoxes, 2 ComparisonTables, 1 RoadmapBlock, 1 DoDontGrid, 1 FaqAccordion and 1 BlogCTA.
- All 8 FAQ questions retain the source meaning.
- The complete workflow is present: composition, safe zones, logo placement, copy, platform differences, implementation tags, file formats, caching, commercial relevance and final checks.
- Minor wording was made more idiomatic without changing the technical meaning.

## Technical verification

The article correctly presents 1200 x 630 pixels and approximately 1.91:1 as a broadly supported master, not a universal rendering guarantee. Its centred 630 x 630 square begins approximately 285 pixels from each horizontal edge, while the approximately 500 x 500 critical area is explicitly a design strategy rather than a platform specification.

The platform and metadata caveats are retained:

- WhatsApp crops vary by device, app version and available space.
- Meta's documented WhatsApp Business Messaging preview requirements are kept separate from a universal consumer-app promise: at least 300 pixels wide, no more than 4:1 and below 600 KB.
- Facebook and other platforms may cache an older image.
- LinkedIn Post Inspector refreshes previews for new posts; existing posts remain unchanged, as confirmed again in LinkedIn's official help documentation.
- X card tags are supplied alongside Open Graph, while actual cards still require real-world testing.
- Instagram feed posts, Stories and Reel covers are correctly distinguished from website link-preview metadata.
- `og:title`, `og:type`, `og:image`, `og:url`, dimensions, MIME type and `og:image:alt` are demonstrated with absolute HTTPS URLs.

## Route corrections

Public English links now use the real `/en/kennisbank/` and `/en/diensten/` architecture. Frontmatter relationship fields use canonical internal identities. The localisation brief and the example `og:url` now match the production route.
