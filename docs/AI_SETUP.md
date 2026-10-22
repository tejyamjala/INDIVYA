# Mira / AI provider setup

## Current behavior

The current web `MiraAssistant.tsx` and Flutter Mira helper use deterministic intent matching, curated destination data and response templates. They do not call OpenAI, Anthropic, Gemini, a local model server, or another generative AI endpoint. Therefore there is no AI API key to configure for the current app.

Weather is fetched from Open-Meteo and Google Maps actions are URL handoffs; neither integration requires a key in the current implementation.

## If a hosted model is added later

Do not call a paid model provider directly from React or Flutter using a private key. Client-side environment variables and Dart defines are compiled into distributed client apps and can be extracted.

Recommended request path:

1. Client sends the user's question plus only the minimum destination/trip context to a server-side endpoint.
2. The endpoint authenticates the user, validates input and applies rate limits/quotas.
3. The endpoint calls the chosen model provider with a server-side secret.
4. The endpoint returns a validated response; do not trust model output as authorization or execute it as code/SQL.
5. Log operational metadata without storing passwords, tokens or unnecessary personal conversation content.

A Supabase Edge Function is one possible backend boundary. After implementing and testing such a function, store the provider key in Supabase's server-side secret store, for example:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set AI_PROVIDER_API_KEY=your_real_key
supabase functions deploy mira
```

These commands alone do not create the function or make the current app use AI. Implement the `mira` function, authenticate requests, add abuse controls, and point the client at it before configuring a provider. Use the provider's actual environment-variable name and never commit its value.

## Local development

If the future function requires a provider secret locally, use Supabase's local Edge Function secret mechanism or an untracked local secrets file supported by the Supabase CLI. Do not add provider keys to `.env.example`, `VITE_*` variables, source code, mobile Dart defines or checked-in JSON.
