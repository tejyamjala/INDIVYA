# INDIVYA — India Tourism

INDIVYA is a React + TypeScript + Vite tourism web application, with a native Flutter client under development on `feat/flutter-mobile-app` (draft PR [#1](https://github.com/Madhavyamjala/INDIVYA/pull/1)). The web app uses Supabase for authentication and account data, Open-Meteo for weather, and Google Maps links for navigation.

## Features

- Email/password sign-in, sign-up and password recovery.
- Traveller onboarding and saved language preferences: English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali and Marathi.
- Discover and Explore catalog, destination details, pilgrimage directory, saved places and profile.
- Multi-destination itinerary and illustrative budget planner.
- Contextual travel companion Mira.
- Weather from Open-Meteo and map handoff to Google Maps.

## Architecture and service inventory

| Area | Current implementation | Needs a secret/API key? |
| --- | --- | --- |
| Web client | React, TypeScript, Vite | No |
| Auth, profiles, wishlist | Supabase Auth + Postgres | Public Supabase URL and publishable/legacy anon client key |
| Weather | Open-Meteo | No API key in the current implementation |
| Maps | Google Maps URLs opened by the client | No API key for the current link handoff |
| Mira | Local deterministic/rule-based responses and destination data | No model key; **not currently a hosted generative-AI service** |
| Flutter client | `flutter_app/` on `feat/flutter-mobile-app` | Optional public Supabase config via `--dart-define` |

There is currently no separate application server, AI inference endpoint, or hosted model integration in this source tree. Do not add an unused AI provider key to the frontend. See [AI setup and future integration](docs/AI_SETUP.md).

## Requirements

- Node.js 22 or newer is recommended.
- Corepack (included with supported Node.js distributions) and the pnpm version declared in `package.json`.
- A Supabase project for sign-in, profiles and wishlist persistence.

## Run the web app locally

1. Clone the repository and enter the project directory.
2. Enable Corepack and activate the repository's pinned pnpm version:

   ```powershell
   corepack enable
   corepack prepare pnpm@11.25.0 --activate
   ```

3. Install dependencies:

   ```powershell
   pnpm install
   ```

4. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

5. Edit `.env.local` and set the values from **Supabase Dashboard → Project Settings → API**:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
   ```

   If your Supabase project still uses the legacy `anon` key, use `VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY` instead of the publishable-key variable. Do not set both unless you know why.

6. Start the development server:

   ```powershell
   pnpm dev
   ```

   Vite serves the app at [http://localhost:3000](http://localhost:3000).

Useful commands:

```powershell
pnpm check       # TypeScript check
pnpm build       # Type-check and create dist/
pnpm preview     # Preview the production build
```

Vite embeds `VITE_*` values into browser-delivered JavaScript at build time. Treat these as **public configuration**, never as a place for private credentials.

## Configure the Supabase backend

### 1. Create or select a project

In the Supabase Dashboard, note the project URL and public client key. Use a publishable key where available, or the project's legacy `anon` key. Never use a `service_role` key in the web app or Flutter app.

### 2. Create the application tables and policies

Open **SQL Editor** in Supabase and run the repository script at [`supabase/schema.sql`](supabase/schema.sql). It defines the fields used by this app:

- `public.profiles`: one row per authenticated user, with display name, onboarding status and language.
- `public.wishlist`: destination IDs saved by each authenticated user.

The script enables Row Level Security (RLS) and applies policies that restrict profile and wishlist access to the signed-in owner. Review it against your existing database before applying it to a production project. If the tables already exist, `CREATE TABLE IF NOT EXISTS` will not retrofit missing columns; use a reviewed migration for schema changes.

### 3. Configure authentication URLs

In **Authentication → URL Configuration**:

- Set the Site URL to your local or production website URL as appropriate.
- Add local and production redirect URLs, including `http://localhost:3000/**` for local development.
- Add your deployed hostname and the paths needed for email confirmation and password recovery.

Keep email confirmation and password recovery enabled according to your product requirements. Test signup, login, sign-out and password reset with a test account before launch.

### 4. Validate RLS

Use two separate test accounts. Confirm that one account cannot read or alter another account's profile or wishlist. Never rely on frontend filtering as an authorization boundary. RLS is essential because the public client key is visible to browsers.

## AI / Mira setup

Mira currently uses local intent matching, curated destination/travel-guide data and deterministic response templates. **No AI provider credentials are required for the current application**, because it does not call a generative model.

If you later add a model provider, use a server-side endpoint (for example, a Supabase Edge Function) and store the provider key as a server-side secret. Never put it in a `VITE_*` variable, a Dart define shipped in a mobile build, source code, a committed JSON file or a client request. See [`docs/AI_SETUP.md`](docs/AI_SETUP.md) for the recommended boundary.

## Weather and maps

- Weather requests use Open-Meteo from the client and currently require no API key.
- Map actions open Google Maps URLs; the current app does not use a Google Maps SDK key.
- Weather, travel time and budget figures may be unavailable or approximate. Budget figures are estimates, not live quotes.

## Run the Flutter app

The native client is currently on branch `feat/flutter-mobile-app` and draft PR #1; it is not part of `main` until that branch is merged.

```powershell
git switch feat/flutter-mobile-app
cd flutter_app
flutter pub get
flutter analyze
flutter test
flutter run --dart-define="SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co" --dart-define="SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY"
```

For a release build, pass the same public configuration to the relevant `flutter build` command. Dart defines are compiled into the app and are **not secrets**. If Supabase config is omitted, the current Flutter app runs in guest/local mode and Supabase auth/sync features are unavailable.

The Flutter client is an initial migration, not full web parity. See [`flutter_app/docs/MOBILE_MIGRATION.md`](flutter_app/docs/MOBILE_MIGRATION.md) for the known gaps and validation checklist.

## Deployment

For static hosting, configure `VITE_SUPABASE_URL` and either `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY` in the hosting provider's **build-time environment settings**, then run the production build. Rebuild/redeploy after changing a Vite environment value. Also add the production hostname to Supabase Auth redirect URLs.

## Security and leaked credentials

- Never commit `.env.local`, `.env`, private keys, database passwords, service-role keys, OAuth client secrets or AI-provider keys.
- Keep `.env.example` limited to empty placeholders; do not copy real values into it.
- A Supabase publishable/legacy anon key is intentionally public. It does not replace RLS and should never be treated as an authorization secret.
- If a **privileged** credential was exposed, revoke/rotate it in the issuing provider immediately, replace it in server-side configuration, and inspect access logs. Removing text from the latest commit is not sufficient if the secret exists in Git history.
- Before pushing, check `git status`, run a secret scanner, and review GitHub **Security → Secret scanning** alerts if available. Rewriting Git history is only part of remediation; rotate the credential first.

See [`docs/SECURITY.md`](docs/SECURITY.md) for the incident checklist.
