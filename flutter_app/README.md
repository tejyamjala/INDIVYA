# INDIVYA Flutter mobile app

Native Flutter client migration for INDIVYA India Tourism. This app is deliberately maintained under `flutter_app/` so the existing React/Vite web app remains unchanged.

## Features

Discover editorial picks, search/filter destinations, pilgrimage catalog, destination details, live weather, Maps handoff, saved places, multilingual navigation, optional Supabase authentication/profile/wishlist sync, and a multi-destination travel planner with indicative cost estimates.

## Quick start

Install the stable Flutter SDK, then run:

```sh
flutter pub get
flutter create --project-name indivya_mobile --platforms=android,ios .
flutter analyze
flutter test
flutter run
```

To enable account functions, pass the existing Supabase project's URL and public anonymous key using `--dart-define=SUPABASE_URL=...` and `--dart-define=SUPABASE_ANON_KEY=...`. Do not embed a service-role key in a mobile binary.

See [Mobile migration guide](docs/MOBILE_MIGRATION.md) for configuration, testing, migration limits and TODOs.
