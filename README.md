# India Tourism

A new web rebuild of the India Tourism experience. The original Bolt-hosted site is left unchanged.

## Included experience

- Email/password sign-in, account creation, password recovery, and language onboarding.
- Discover home, 40 India destinations, searchable/filtered Explore, 19 sacred pilgrimage places, destination detail and Maps handoff.
- Live weather via Open-Meteo, saved places, a multi-place trip planner, budget estimates and a day-by-day draft.
- Traveller profile and preferences, plus Mira’s contextual travel companion.
- A cinematic sign-in video transitioning from cloud-covered mountains to the coast.

## Run locally

```sh
pnpm install
pnpm dev
```

The production static site is built with `pnpm build` into `dist/`.

## Persistence and integrations

Authentication, profiles and wishlist entries reuse the existing app’s Supabase project and its browser-safe public client configuration in `src/lib/supabase.ts`. The application only uses the `profiles` and `wishlist` tables. Trip drafts and travel preferences are stored locally in the browser for the signed-in account. Weather is read from Open-Meteo; destination map links hand off to Google Maps.

The existing Supabase project must allow the new published host in its Auth redirect URL settings for confirmation and password-reset links to return to this website. If it does not, the application falls back to the project's existing default redirect.
