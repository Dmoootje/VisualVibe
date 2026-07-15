# LocalBusiness country and price range design

Date: 2026-07-15
Status: approved through the requested values
Repository branch: `feat/full-website-analysis-report`

## Goal

Remove the LocalBusiness structured-data warnings for an invalid country code and a missing optional `priceRange` field.

## Root cause

The central business configuration already contains `addressCountry: "BE"`, but `LocalBusinessSettingsJsonLd` gives a free-form Firestore country value precedence. Values such as `be` or `België` therefore reach JSON-LD unchanged. The LocalBusiness object does not currently emit a price range.

## Chosen approach

- Add `priceRange: "$$"` to `businessConfig` as the source of truth.
- Normalize a two-letter country value to uppercase when building JSON-LD.
- Fall back to the configured `BE` value when a stored country value is not a valid two-letter code.
- Leave Firestore data unchanged. The fix belongs at the schema boundary so legacy and future values remain safe.

Updating only Firestore was rejected because a later free-form edit could restore the warning. Hardcoding both values directly in the component was rejected because business facts belong in the central configuration.

## Verification

A component regression test renders the LocalBusiness JSON-LD with a lowercase `be` setting and verifies:

- `address.addressCountry` equals `BE`;
- `priceRange` equals `$$`.

The full VisualVibe test suite, typecheck, lint and production build must remain green before the PR branch is updated.
