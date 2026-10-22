# INDIVYA Flutter mobile migration

## Scope

This is a native Flutter client foundation for the existing React/Vite INDIVYA tourism experience. It is placed under `flutter_app/` so the current website continues to build and serve independently.

### Implemented in this pass

- Material 3 mobile shell with bottom navigation for Discover, Explore, Pilgrims, Trip planner, Saved and Profile.
- Responsive destination cards and destination detail view with highlights, season, suggested duration, indicative budget, live Open-Meteo weather and Google Maps handoff.
- Search across destination name, state, region, categories and description, plus category filters.
- Saved-place and trip-draft persistence on the device using SharedPreferences.
- Multi-destination trip draft with duration, traveller count, pace, spending tier, illustrative budget allocation and a day-by-day starter itinerary.
- Optional Supabase sign-in, sign-up, password recovery, profile language/name updates, and wishlist synchronization.
- Eight language choices (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali and Marathi) with translated primary navigation/action strings.
- Contextual, deterministic Mira travel helper for common travel-planning intents. It is explicitly not represented as a generative model or remote AI service.

## Repository and runtime configuration

The current web implementation uses Supabase URL `https://ubptathwzyantyczpchw.supabase.co` and a browser-safe public anonymous key in `src/lib/supabase.ts`. The Flutter client deliberately reads these as build-time values rather than duplicating credentials in the new source:

```sh
flutter run \
  --dart-define=SUPABASE_URL=https://ubptathwzyantyczpchw.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Without both values, the app remains browseable, and profile account access is disabled. Never put a Supabase `service_role` key in a mobile app. Supabase Row Level Security policies must restrict `profiles` and `wishlist` records by the authenticated user's ID. Verify mobile deep-link/redirect and password-recovery handling in the Supabase project before public release.

Weather is fetched from the Open-Meteo forecast endpoint. Maps and nearby stay/food searches open the Google Maps web handoff via the user's installed browser/app.

## Generate platform projects and run

Use a current stable Flutter SDK with Android Studio/Android SDK for Android builds and macOS/Xcode for iOS builds.

```sh
cd flutter_app
flutter pub get
flutter create --project-name indivya_mobile --platforms=android,ios .
flutter analyze
flutter test
flutter run
```

When generating native platform folders in this existing directory, inspect the command output and confirm it has not replaced the existing `lib/main.dart` or `pubspec.yaml`. Android APK builds can then be produced with `flutter build apk --release`; iOS release builds require macOS and Xcode. Set unique Android application ID and iOS bundle identifier before publishing.

## Validation

The code in this migration environment was not compiled because the Flutter/Dart SDK is not installed here. Run `flutter analyze` and `flutter test` in a configured Flutter environment before merging or publishing. Also run Android and iOS smoke tests with network access disabled, slow, and available.

## Known gaps and TODOs

- [ ] Port the full source catalog. The web site currently defines 50 destinations; the first native catalog contains 29 representative destination records, including selected pilgrimage sites.
- [ ] Port all destination and travel-guide fields, curated nearby sights, estimated travel times, stay/restaurant tiers and source-attributed guidance from `src/data/travelGuide.ts`.
- [ ] Port complete translations for all user-facing copy and content from `src/locales/*.json`. This pass translates core navigation/actions, not the whole signed-in experience.
- [ ] Validate and harden account/profile/wishlist synchronization against the deployed Supabase schema and Row Level Security policies. Resolve duplicate-insert conflict handling for wishlist rows.
- [ ] Implement platform-specific deep links for email confirmation/password recovery. Test auth redirects on Android and iOS.
- [ ] Migrate profile onboarding, all traveller preferences, richer account-state handling and offline/error states.
- [ ] Bring the original sign-in video experience to a native-friendly optional hero/asset if desired; a web video asset is not bundled by this starter.
- [ ] Decide whether Mira remains rule-based or connects to an authenticated server-side AI endpoint. No assistant API was present in the inspected repository, so no endpoint or credentials have been invented here.
- [ ] Add visual regression screenshots, accessibility checks, integration tests for auth/wishlist/weather, and release build verification.
- [ ] Add Android/iOS icons, splash screens, app identifiers, privacy/data-safety declarations and store metadata.
- [ ] Add a shared destination data-generation step to keep the web and mobile catalogs in sync instead of maintaining duplicate arrays.
