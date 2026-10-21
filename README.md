# India Tourism

A new web rebuild of the India Tourism experience. The original Bolt-hosted site is left unchanged.

## Included experience

- Email/password sign-in, account creation and password recovery; sign-in, sign-up and reset pages always remain in English.
- New accounts choose a preferred language during signup. After sign-in, the app uses that account's saved language; signing out returns the public authentication screen to English.
- The complete signed-in interface can be used in English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali or Marathi; the account preference persists for later logins.
- Discover home, 40 India destinations, searchable/filtered Explore, 19 sacred pilgrimage places, destination detail and Maps handoff.
- Live weather via Open-Meteo, saved places, traveller profile and preferences, plus Mira’s contextual travel companion.
- A multi-place trip planner with days, traveller count, daily pace, interests and Value/Balanced/Luxury spending comfort; it shows illustrative per-person and group estimates for stays, food, outings/experiences, shopping, travel and incidentals, plus a day-by-day draft.
- A cinematic sign-in video transitioning from cloud-covered mountains to the coast.

## Run locally

```sh
pnpm install
pnpm dev
```

The production static site is built with `pnpm build` into `dist/`.

## Persistence and integrations

Authentication, profiles, preferred language and wishlist entries reuse the existing app’s Supabase project and its browser-safe public client configuration in `src/lib/supabase.ts`. The application only uses the `profiles` and `wishlist` tables. Trip drafts and travel preferences are stored locally in the browser for the signed-in account. Weather is read from Open-Meteo; destination map links hand off to Google Maps.

Planner costs are indicative planning estimates based on destination budget ranges, days, travellers, pace and spending comfort tier; they are not live quotes.

The existing Supabase project must allow the new published host in its Auth redirect URL settings for confirmation and password-reset links to return to this website. If it does not, the application falls back to the project's existing default redirect.
