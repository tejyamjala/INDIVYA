import { createClient } from "@supabase/supabase-js";

// Browser-safe anonymous client values reused from the existing public app.
// Row-level security remains the database's responsibility.
const SUPABASE_URL = "https://ubptathwzyantyczpchw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicHRhdGh3enlhbnR5Y3pwY2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzOTA5NjksImV4cCI6MjEwNzk2Njk2OX0.03F7VWVKsW5sT3ee25jVC_8OI3kJ7lYV_P-1UbmlmF0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
