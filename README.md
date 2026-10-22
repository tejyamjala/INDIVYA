# INDIVYA — Flutter App

INDIVYA is a Flutter tourism app for exploring destinations across India, planning multi-stop trips, saving places, checking weather, and opening map directions.

This README covers **running the Flutter app only**. You do not need Node.js, pnpm, or the React/Vite web app to run it.

## Requirements

- Stable Flutter SDK installed and available on your PATH
- Android Studio with the Android SDK for an Android emulator/device
- A connected Android device or running emulator
- Optional: a Supabase project for sign-in and account sync

For iOS builds, use macOS with Xcode.

## 1. Clone the Flutter branch

From PowerShell:

```powershell
git clone --branch feat/flutter-mobile-app https://github.com/Madhavyamjala/INDIVYA.git
cd INDIVYA
```

If you already cloned the repository and have the branch locally, switch to it instead:

```powershell
git switch feat/flutter-mobile-app
git pull
```

## 2. Enter the Flutter project

```powershell
cd flutter_app
flutter doctor
flutter pub get
```

If the platform folders (such as `android/`) are missing in your checkout, generate them once from the project directory:

```powershell
flutter create --project-name indivya_mobile --platforms=android,ios .
```

Review the command output and make sure it has not changed the existing `lib/main.dart` or `pubspec.yaml`. iOS builds require macOS and Xcode.

## 3. Run the app

To run in guest/local mode:

```powershell
flutter run
```

To enable Supabase authentication and account synchronization, pass your project's URL and **public** anon/publishable key:

```powershell
flutter run --dart-define="SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co" --dart-define="SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY"
```

Replace the placeholders with values from your Supabase project settings. Both values are optional for guest/local browsing. Without them, account access and cloud sync are unavailable.

**Never put a Supabase `service_role` key or another privileged secret in a Flutter app.** Dart defines are compiled into the application and must be treated as public.

## 4. Check the app

Run these from the `flutter_app/` directory:

```powershell
flutter analyze
flutter test
```

To build an Android APK:

```powershell
flutter build apk --release
```

The generated APK is typically placed under `build/app/outputs/flutter-apk/`.

## Included features

- Discover, search and filter destinations
- Destination details, pilgrimage directory and saved places
- Weather from Open-Meteo and Google Maps handoff
- Multi-destination trip planning with indicative budget estimates
- Eight language options
- Local saved-place/trip persistence
- Optional Supabase authentication, profile and wishlist synchronization
- Contextual, rule-based Mira travel helper (not a hosted generative-AI service)

## Notes

The Flutter app is an ongoing native migration and does not yet have complete feature or content parity with the web implementation. See [the mobile migration guide](flutter_app/docs/MOBILE_MIGRATION.md) for known gaps and follow-up work.
