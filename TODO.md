# TODO — India Tourism rebuild

## 1. Authentication and sign-in background
- [x] The authentication flow supports sign-in, account creation and password recovery.
- [x] The sign-in page uses a lively full-screen video background moving from cloud-covered Himalayan mountains through green coastal hills to an Indian beach.

## 2. Traveller onboarding
- [x] Onboarding lets travellers choose their preferred language before entering the main experience.

## 3. Full-interface localization
- [x] When a traveller selects a preferred language, all user-facing text across the signed-in app changes immediately to that language and remains selected on future logins. Support English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali and Marathi. Include navigation, page copy, forms, actions, filters, empty/error/status messages, Mira guidance, destination descriptions/highlights, weather labels, accessibility labels and page titles; do not translate user-entered personal data.

## 4. Discover home
- [x] The Discover home screen presents editorial destination inspiration and useful entry points into the travel experience.

## 5. Explore destinations
- [x] The Explore catalog provides destination search and practical filters for narrowing places to visit.

## 6. Pilgrimage directory
- [x] The Pilgrims directory is dedicated to sacred sites and pilgrimage destinations across India.

## 7. Destination details
- [x] Destination detail pages show region, highlights, best season, recommended duration, illustrative budget, current weather and a handoff to Maps.

## 8. Saved places
- [x] Travellers can collect destinations in a saved-places/wishlist experience and revisit them later.

## 9. Trip planner
- [x] The multi-destination trip planner supports trip length in days, traveller count, pace and interests.
- [x] The budget estimate recalculates from trip length, traveller count, selected destinations, daily pace (Relaxed, Balanced or Packed) and comfort tier (Value, Balanced or Luxury).
- [x] Show separate illustrative estimates for stays, food, outings/experiences, shopping, travel and an incidental reserve; make clear that these are planning estimates, not live quotes.
- [x] The planner presents a budget breakdown and a draft day-by-day itinerary.

## 10. Traveller profile
- [x] The traveller profile supports editing the traveller's name and travel preferences.

## 11. Mira travel companion
- [x] Mira provides suggested prompts and contextual travel guidance tailored to destinations and trip-planning activity.

## 12. New-site delivery
- [ ] Publish the rebuilt website as a new project and leave the original Bolt-hosted app unchanged.
- [ ] Put the rebuilt source in the selected GitHub repository `tejyamjala/INDIVYA`.

## 13. Existing Supabase Auth redirect configuration
- [ ] Confirm that the final published website hostname is allowed in the existing Supabase Auth redirect URLs so confirmation and password-reset links return to the rebuilt site. If it is not allowed, the app falls back to the existing default redirect.
