# INDIVYA Flutter mobile migration

## Scope

This first native client pass is added under flutter_app/ and does not replace the web client.

## Implemented

- Material 3 mobile navigation: Discover, Explore, Pilgrims, Planner, Saved and Profile.
- Search and category filtering across the native destination catalog.
- Destination detail pages with season, duration, budget, highlights, live weather and Google Maps handoff.
- Local saved-place and trip persistence.
- A basic multi-destination budget planner.
- Language preference selector for English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali and Marathi.
- Optional Supabase initialization when a public URL and anonymous key are passed as build-time values.
- Deterministic, rule-based Mira travel helper.

## Configure

Pass only a public Supabase anonymous key; never embed a service-role key.

    flutter run --dart-define=SUPABASE_URL=https://YOUR_PROJECT.supabase.co --dart-define=SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY

Confirm Supabase Row Level Security, wishlist schema, authentication redirects and platform deep links before shipping.

## Known gaps / TODOs

- [ ] Complete all 50 destination records and preserve web editorial fields, nearby sights, curated stays and restaurants.
- [ ] Port complete translation dictionaries. The language setting persists but does not translate all screen copy.
- [ ] Finish profile onboarding, auth callbacks, password recovery and secure wishlist conflict handling.
- [ ] Decide whether Mira stays rule-based or connects to a server-side assistant endpoint. No backend assistant API was identified in the source application.
- [ ] Generate Android/iOS projects, configure app IDs/icons/splash screens, review privacy disclosures and validate release builds.
- [ ] Add accessibility checks, widget/integration tests, offline handling and visual regression coverage.
- [ ] Verify with flutter pub get, flutter analyze, flutter test and device smoke tests.

The native catalog currently contains a representative subset rather than full parity with the web catalog. All budget figures are illustrative and are not live travel quotes.
