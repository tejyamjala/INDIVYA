# INDIVYA Flutter mobile app

Native Flutter client for INDIVYA India Tourism. It lives in flutter_app/ so the existing React/Vite website remains intact.

## Current mobile features

- Material 3 mobile navigation for Discover, Explore, Pilgrims, Planner, Saved and Profile.
- Searchable destination cards, category filtering and destination detail pages.
- Local saved-place and trip-draft persistence with SharedPreferences.
- Basic trip length/traveller planner and indicative budget calculation.
- Open-Meteo current weather and Google Maps handoff.
- Language preference selector for eight languages; full translated interface copy is not yet ported.
- Optional Supabase initialization through build-time public URL/key; complete auth redirects and wishlist sync need further verification.
- Deterministic, rule-based Mira helper, not a generative AI service.

## Setup

Install the Flutter stable SDK, then run:

    cd flutter_app
    flutter pub get
    flutter create --project-name indivya_mobile --platforms=android,ios .
    flutter analyze
    flutter test
    flutter run --dart-define=SUPABASE_URL=https://YOUR_PROJECT.supabase.co --dart-define=SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY

Never place a Supabase service-role key in a mobile application. Configure Row Level Security and auth redirects before enabling production account flows. Android release builds need an Android SDK; iOS release builds need macOS/Xcode.

See docs/MOBILE_MIGRATION.md for known gaps. The Flutter SDK was not available in the initial migration environment, so analyzer, tests and native builds must pass before release.
