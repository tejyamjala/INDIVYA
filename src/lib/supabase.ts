import { createClient } from "@supabase/supabase-js";

// These are public client configuration values, not authorization secrets.
// Access control must be enforced by Supabase Auth and Row Level Security (RLS).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Missing Supabase configuration. Copy .env.example to .env.local and set " +
      "VITE_SUPABASE_URL plus VITE_SUPABASE_PUBLISHABLE_KEY (or the legacy " +
      "VITE_SUPABASE_ANON_KEY). Never use a service_role key in client code.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
